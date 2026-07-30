/**
 * [INPUT]: 依赖 public/brain-bytes/index.json、文章 HTML、brain-bytes-curation.js 的 TOPICS；可选 @xenova/transformers 与 umap-js
 * [OUTPUT]: 写出 public/brain-bytes/cognitive-map.json（节点坐标/高度、等高线、主题峰、年份范围）
 * [POS]: scripts/ 的认知地图离线管线；嵌入→降维→KDE→等高线，供 BrainBytesMapPage 静态度渲染
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import { createRequire } from 'node:module'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { TOPICS } from './brain-bytes-curation.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const INDEX_PATH = join(ROOT, 'public/brain-bytes/index.json')
const OUT_PATH = join(ROOT, 'public/brain-bytes/cognitive-map.json')
const require = createRequire(import.meta.url)

const GRID = 64
const CONTOUR_LEVELS = 8
const EMBED_MODEL = 'Xenova/all-MiniLM-L6-v2'

function stripHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim()
}

function loadArticles() {
  const index = JSON.parse(readFileSync(INDEX_PATH, 'utf8'))
  return index.map((item) => {
    const htmlPath = join(ROOT, 'public/brain-bytes', item.slug, 'index.html')
    let body = ''
    if (existsSync(htmlPath)) {
      body = stripHtml(readFileSync(htmlPath, 'utf8')).slice(0, 800)
    }
    const text = [item.title, item.paper, item.topic, body].filter(Boolean).join('\n')
    return {
      id: item.slug,
      slug: item.slug,
      title: item.title,
      paper: item.paper,
      topic: item.topic || 'unclassified',
      year: Number(item.year) || 0,
      path: item.path || `/brain-bytes/${item.slug}/`,
      text,
    }
  })
}

function l2Normalize(vector) {
  let sum = 0
  for (let i = 0; i < vector.length; i += 1) sum += vector[i] * vector[i]
  const norm = Math.sqrt(sum) || 1
  return vector.map((value) => value / norm)
}

function hashEmbed(text, topic = '', dim = 96) {
  const vector = new Array(dim).fill(0)
  const topicKeys = Object.keys(TOPICS)
  const topicIndex = topicKeys.indexOf(topic)
  if (topicIndex >= 0) {
    // 主题 one-hot 偏置，让同 topic 更容易聚成峰
    for (let i = 0; i < 8; i += 1) vector[(topicIndex * 8 + i) % dim] += 2.5
  }
  const tokens = text.toLowerCase().split(/[^a-z0-9\u4e00-\u9fff]+/).filter(Boolean)
  for (const token of tokens) {
    let hash = 2166136261
    for (let i = 0; i < token.length; i += 1) {
      hash ^= token.charCodeAt(i)
      hash = Math.imul(hash, 16777619)
    }
    const idx = Math.abs(hash) % dim
    vector[idx] += 1
    vector[(idx + 7) % dim] += 0.35
  }
  return l2Normalize(vector)
}

async function embedArticles(articles) {
  try {
    const { pipeline } = await import('@xenova/transformers')
    console.log(`[cognitive-map] loading embedding model ${EMBED_MODEL}`)
    const extractor = await pipeline('feature-extraction', EMBED_MODEL, { quantized: true })
    const vectors = []
    for (let i = 0; i < articles.length; i += 1) {
      const output = await extractor(articles[i].text.slice(0, 1500), {
        pooling: 'mean',
        normalize: true,
      })
      vectors.push(Array.from(output.data))
      if ((i + 1) % 8 === 0 || i === articles.length - 1) {
        console.log(`[cognitive-map] embedded ${i + 1}/${articles.length}`)
      }
    }
    return { vectors, method: 'xenova-minilm' }
  } catch (error) {
    console.warn('[cognitive-map] xenova unavailable, fallback hash embed:', error.message)
    return {
      vectors: articles.map((article) => hashEmbed(article.text, article.topic)),
      method: 'hash-fallback',
    }
  }
}

function classicalMds(vectors, dim = 2) {
  const n = vectors.length
  const dist = Array.from({ length: n }, () => new Array(n).fill(0))
  for (let i = 0; i < n; i += 1) {
    for (let j = i + 1; j < n; j += 1) {
      let sum = 0
      const a = vectors[i]
      const b = vectors[j]
      const len = Math.min(a.length, b.length)
      for (let k = 0; k < len; k += 1) {
        const d = a[k] - b[k]
        sum += d * d
      }
      const value = Math.sqrt(sum)
      dist[i][j] = value
      dist[j][i] = value
    }
  }

  const sq = dist.map((row) => row.map((value) => value * value))
  const rowMean = sq.map((row) => row.reduce((a, b) => a + b, 0) / n)
  const colMean = new Array(n).fill(0)
  for (let j = 0; j < n; j += 1) {
    for (let i = 0; i < n; i += 1) colMean[j] += sq[i][j]
    colMean[j] /= n
  }
  const totalMean = rowMean.reduce((a, b) => a + b, 0) / n
  const B = Array.from({ length: n }, (_, i) => (
    Array.from({ length: n }, (_, j) => -0.5 * (sq[i][j] - rowMean[i] - colMean[j] + totalMean))
  ))

  // Power iteration for top-2 eigenvectors (small n)
  const coords = Array.from({ length: n }, () => [0, 0])
  let matrix = B
  for (let axis = 0; axis < dim; axis += 1) {
    let vector = Array.from({ length: n }, () => Math.random())
    for (let iter = 0; iter < 80; iter += 1) {
      const next = new Array(n).fill(0)
      for (let i = 0; i < n; i += 1) {
        for (let j = 0; j < n; j += 1) next[i] += matrix[i][j] * vector[j]
      }
      const norm = Math.sqrt(next.reduce((s, v) => s + v * v, 0)) || 1
      vector = next.map((v) => v / norm)
    }
    let eigenvalue = 0
    for (let i = 0; i < n; i += 1) {
      let av = 0
      for (let j = 0; j < n; j += 1) av += matrix[i][j] * vector[j]
      eigenvalue += vector[i] * av
    }
    const scale = Math.sqrt(Math.max(eigenvalue, 0))
    for (let i = 0; i < n; i += 1) coords[i][axis] = vector[i] * scale

    // Deflate
    matrix = matrix.map((row, i) => row.map((value, j) => value - eigenvalue * vector[i] * vector[j]))
  }
  return coords
}

function mulberry32(seed) {
  let t = seed >>> 0
  return () => {
    t += 0x6D2B79F5
    let r = Math.imul(t ^ (t >>> 15), 1 | t)
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r)
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

async function project2d(vectors) {
  try {
    const { UMAP } = await import('umap-js')
    const nNeighbors = Math.max(3, Math.min(8, Math.floor(vectors.length / 4)))
    const umap = new UMAP({
      nComponents: 2,
      nNeighbors,
      minDist: 0.15,
      spread: 1.0,
      nEpochs: 200,
      random: mulberry32(42),
    })
    const embedding = umap.fit(vectors)
    return { coords: embedding, method: 'umap-js' }
  } catch (error) {
    console.warn('[cognitive-map] umap unavailable, fallback MDS:', error.message)
    return { coords: classicalMds(vectors, 2), method: 'classical-mds' }
  }
}

function normalizeCoords(coords) {
  let minX = Infinity
  let maxX = -Infinity
  let minY = Infinity
  let maxY = -Infinity
  for (const [x, y] of coords) {
    minX = Math.min(minX, x)
    maxX = Math.max(maxX, x)
    minY = Math.min(minY, y)
    maxY = Math.max(maxY, y)
  }
  const spanX = (maxX - minX) || 1
  const spanY = (maxY - minY) || 1
  const span = Math.max(spanX, spanY)
  const cx = (minX + maxX) / 2
  const cy = (minY + maxY) / 2
  return coords.map(([x, y]) => ([
    ((x - cx) / span) * 1.8,
    ((y - cy) / span) * 1.8,
  ]))
}

function kdeGrid(points, size = GRID) {
  const bandwidth = 0.22
  const grid = Array.from({ length: size }, () => new Array(size).fill(0))
  let max = 0
  for (let gy = 0; gy < size; gy += 1) {
    for (let gx = 0; gx < size; gx += 1) {
      const x = (gx / (size - 1)) * 2 - 1
      const y = (gy / (size - 1)) * 2 - 1
      let density = 0
      for (const point of points) {
        const dx = (x - point.x) / bandwidth
        const dy = (y - point.y) / bandwidth
        density += Math.exp(-0.5 * (dx * dx + dy * dy))
      }
      grid[gy][gx] = density
      max = Math.max(max, density)
    }
  }
  if (max > 0) {
    for (let gy = 0; gy < size; gy += 1) {
      for (let gx = 0; gx < size; gx += 1) grid[gy][gx] /= max
    }
  }
  return grid
}

function sampleHeight(grid, x, y) {
  const size = grid.length
  const fx = ((x + 1) / 2) * (size - 1)
  const fy = ((y + 1) / 2) * (size - 1)
  const x0 = Math.max(0, Math.min(size - 2, Math.floor(fx)))
  const y0 = Math.max(0, Math.min(size - 2, Math.floor(fy)))
  const tx = fx - x0
  const ty = fy - y0
  const v00 = grid[y0][x0]
  const v10 = grid[y0][x0 + 1]
  const v01 = grid[y0 + 1][x0]
  const v11 = grid[y0 + 1][x0 + 1]
  return (v00 * (1 - tx) * (1 - ty))
    + (v10 * tx * (1 - ty))
    + (v01 * (1 - tx) * ty)
    + (v11 * tx * ty)
}

function lerp(a, b, t) {
  return a + (b - a) * t
}

function marchingSquares(grid, level) {
  const size = grid.length
  const segments = []
  for (let gy = 0; gy < size - 1; gy += 1) {
    for (let gx = 0; gx < size - 1; gx += 1) {
      const v0 = grid[gy][gx] - level
      const v1 = grid[gy][gx + 1] - level
      const v2 = grid[gy + 1][gx + 1] - level
      const v3 = grid[gy + 1][gx] - level
      const idx = ((v0 >= 0) << 0) | ((v1 >= 0) << 1) | ((v2 >= 0) << 2) | ((v3 >= 0) << 3)
      const edge = (e, a, b) => {
        const [x, y] = (() => {
          const x0 = (gx / (size - 1)) * 2 - 1
          const y0 = (gy / (size - 1)) * 2 - 1
          const x1 = ((gx + 1) / (size - 1)) * 2 - 1
          const y1 = ((gy + 1) / (size - 1)) * 2 - 1
          const t = Math.abs(b - a) < 1e-9 ? 0.5 : (-a) / (b - a)
          if (e === 0) return [lerp(x0, x1, t), y0]
          if (e === 1) return [x1, lerp(y0, y1, t)]
          if (e === 2) return [lerp(x0, x1, t), y1]
          return [x0, lerp(y0, y1, t)]
        })()
        return { x, y, z: level }
      }

      const cases = {
        1: [[3, v3, v0], [0, v0, v1]],
        2: [[0, v0, v1], [1, v1, v2]],
        3: [[3, v3, v0], [1, v1, v2]],
        4: [[1, v1, v2], [2, v2, v3]],
        5: [[0, v0, v1], [1, v1, v2], [2, v2, v3], [3, v3, v0]],
        6: [[0, v0, v1], [2, v2, v3]],
        7: [[3, v3, v0], [2, v2, v3]],
        8: [[2, v2, v3], [3, v3, v0]],
        9: [[0, v0, v1], [2, v2, v3]],
        10: [[0, v0, v1], [3, v3, v0], [1, v1, v2], [2, v2, v3]],
        11: [[1, v1, v2], [2, v2, v3]],
        12: [[1, v1, v2], [3, v3, v0]],
        13: [[0, v0, v1], [1, v1, v2]],
        14: [[0, v0, v1], [3, v3, v0]],
      }
      const edges = cases[idx]
      if (!edges) continue
      for (let i = 0; i < edges.length; i += 2) {
        const a = edge(...edges[i])
        const b = edge(...edges[i + 1])
        segments.push([a, b])
      }
    }
  }
  return stitchSegments(segments)
}

function stitchSegments(segments) {
  const polylines = []
  const unused = segments.map((segment) => segment.slice())
  const same = (a, b) => Math.hypot(a.x - b.x, a.y - b.y) < 0.02

  while (unused.length) {
    let poly = unused.pop()
    let grew = true
    while (grew) {
      grew = false
      for (let i = unused.length - 1; i >= 0; i -= 1) {
        const [a, b] = unused[i]
        const head = poly[0]
        const tail = poly[poly.length - 1]
        if (same(tail, a)) {
          poly.push(b)
          unused.splice(i, 1)
          grew = true
        } else if (same(tail, b)) {
          poly.push(a)
          unused.splice(i, 1)
          grew = true
        } else if (same(head, a)) {
          poly.unshift(b)
          unused.splice(i, 1)
          grew = true
        } else if (same(head, b)) {
          poly.unshift(a)
          unused.splice(i, 1)
          grew = true
        }
      }
    }
    if (poly.length >= 2) polylines.push(poly)
  }
  return polylines
}

function buildPeaks(nodes) {
  const byTopic = new Map()
  for (const node of nodes) {
    if (!byTopic.has(node.topic)) byTopic.set(node.topic, [])
    byTopic.get(node.topic).push(node)
  }

  const peaks = []
  for (const [topic, group] of byTopic) {
    const meta = TOPICS[topic] || { short: topic, name: topic, color: '#888888', order: 99 }
    const x = group.reduce((s, n) => s + n.x, 0) / group.length
    const y = group.reduce((s, n) => s + n.y, 0) / group.length
    const z = Math.max(...group.map((n) => n.z))
    peaks.push({
      id: topic,
      topic,
      label: meta.short || meta.name,
      name: meta.name,
      color: meta.color,
      order: meta.order || 99,
      count: group.length,
      x,
      y,
      z: Math.min(1, z + 0.08),
    })
  }
  return peaks.sort((a, b) => a.order - b.order)
}

async function main() {
  const articles = loadArticles()
  console.log(`[cognitive-map] articles=${articles.length}`)

  const { vectors, method: embedMethod } = await embedArticles(articles)
  const { coords: rawCoords, method: projectMethod } = await project2d(vectors)
  const coords = normalizeCoords(rawCoords)

  const draftNodes = articles.map((article, index) => ({
    ...article,
    x: coords[index][0],
    y: coords[index][1],
  }))
  const grid = kdeGrid(draftNodes)
  const nodes = draftNodes.map((node) => {
    const density = sampleHeight(grid, node.x, node.y)
    return {
      id: node.id,
      slug: node.slug,
      title: node.title,
      paper: node.paper,
      topic: node.topic,
      year: node.year,
      path: node.path,
      x: Number(node.x.toFixed(5)),
      y: Number(node.y.toFixed(5)),
      z: Number(Math.max(0.05, density).toFixed(5)),
    }
  })

  const contours = []
  for (let i = 1; i <= CONTOUR_LEVELS; i += 1) {
    const level = i / (CONTOUR_LEVELS + 1)
    const rings = marchingSquares(grid, level)
      .filter((ring) => ring.length >= 10)
      .sort((a, b) => b.length - a.length)
      .slice(0, 12)
    for (const ring of rings) {
      contours.push({
        level: Number(level.toFixed(4)),
        points: ring.map((point) => ({
          x: Number(point.x.toFixed(5)),
          y: Number(point.y.toFixed(5)),
          z: Number(level.toFixed(4)),
        })),
      })
    }
  }

  const years = nodes.map((node) => node.year).filter((year) => year > 0)
  const payload = {
    generatedAt: new Date().toISOString(),
    method: { embed: embedMethod, project: projectMethod },
    yearRange: {
      min: Math.min(...years),
      max: Math.max(...years),
    },
    nodes,
    contours,
    peaks: buildPeaks(nodes),
  }

  mkdirSync(dirname(OUT_PATH), { recursive: true })
  writeFileSync(OUT_PATH, `${JSON.stringify(payload, null, 2)}\n`)
  console.log(`[cognitive-map] wrote ${OUT_PATH}`)
  console.log(`[cognitive-map] nodes=${nodes.length} contours=${contours.length} peaks=${payload.peaks.length}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
