/**
 * [INPUT]: 依赖 three 的 CanvasTexture、滤镜常量与 SRGBColorSpace，依赖浏览器 Canvas2D 生成程序行星贴图
 * [OUTPUT]: 对外提供 makePlanetTextures(maxAnisotropy)，返回 colorMap、bumpMap、roughnessMap、cloudMap 四层 Three.js 纹理
 * [POS]: pages/brain-bytes-os 的程序材质引擎，把行星纹理生成从 BrainBytesOSPage 场景组件中分离出来
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import {
  CanvasTexture,
  LinearFilter,
  LinearMipmapLinearFilter,
  SRGBColorSpace,
} from 'three'

const COLOR_SIZE = { width: 4096, height: 2048 }
const DETAIL_SIZE = { width: 2048, height: 1024 }

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

function makeRandom(seed) {
  return () => {
    seed += 0x6D2B79F5
    let value = Math.imul(seed ^ (seed >>> 15), seed | 1)
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61)
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296
  }
}

function smoothstep(edge0, edge1, value) {
  const t = clamp((value - edge0) / (edge1 - edge0), 0, 1)
  return t * t * (3 - (2 * t))
}

function mixColor(a, b, amount) {
  const t = clamp(amount, 0, 1)
  return [
    a[0] + ((b[0] - a[0]) * t),
    a[1] + ((b[1] - a[1]) * t),
    a[2] + ((b[2] - a[2]) * t),
  ]
}

function gridHash(x, y, seed) {
  let value = Math.imul(x + (seed * 101), 374761393) + Math.imul(y - (seed * 17), 668265263)
  value = (value ^ (value >>> 13)) >>> 0
  value = Math.imul(value, 1274126177) >>> 0
  return ((value ^ (value >>> 16)) >>> 0) / 4294967295
}

function periodicNoise(x, y, periodX, seed) {
  const x0 = Math.floor(x)
  const y0 = Math.floor(y)
  const tx = x - x0
  const ty = y - y0
  const xa = ((x0 % periodX) + periodX) % periodX
  const xb = (xa + 1) % periodX
  const ya = y0
  const yb = y0 + 1
  const sx = smoothstep(0, 1, tx)
  const sy = smoothstep(0, 1, ty)
  const top = gridHash(xa, ya, seed) * (1 - sx) + gridHash(xb, ya, seed) * sx
  const bottom = gridHash(xa, yb, seed) * (1 - sx) + gridHash(xb, yb, seed) * sx
  return top * (1 - sy) + bottom * sy
}

function fbm(u, v, basePeriod, seed, octaves = 5) {
  let amplitude = .5
  let frequency = 1
  let total = 0
  let norm = 0
  for (let i = 0; i < octaves; i += 1) {
    const period = basePeriod * frequency
    total += periodicNoise(u * period, v * period * .72, period, seed + i * 19) * amplitude
    norm += amplitude
    amplitude *= .52
    frequency *= 2
  }
  return total / norm
}

function createCanvas(width, height) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  return canvas
}

function writeRgb(data, index, color) {
  data[index] = clamp(Math.round(color[0]), 0, 255)
  data[index + 1] = clamp(Math.round(color[1]), 0, 255)
  data[index + 2] = clamp(Math.round(color[2]), 0, 255)
  data[index + 3] = 255
}

function writeGray(data, index, value) {
  const next = clamp(Math.round(value), 0, 255)
  data[index] = next
  data[index + 1] = next
  data[index + 2] = next
  data[index + 3] = 255
}

function samplePlanet(u, v) {
  const current = fbm(u + Math.sin(v * 7) * .018, v, 5, 11)
  const mineral = fbm(u + .18, v + .07, 9, 23)
  const clouds = fbm(u + Math.sin(v * 9) * .06, v + Math.sin(u * 11) * .025, 16, 47, 4)
  const foam = fbm(u + .42, v - .08, 28, 61, 3)
  const vein = fbm(u + Math.sin(v * 13) * .025, v + Math.cos(u * 9) * .018, 40, 131, 4)
  const grain = fbm(u + .77, v + .31, 96, 173, 3)
  const ridge = smoothstep(.72, .94, 1 - Math.abs((vein * 2) - 1))
  const fleck = smoothstep(.78, .96, grain)
  const latLight = .82 + (.18 * Math.cos((v - .46) * Math.PI))

  let color = mixColor([0, 66, 184], [45, 220, 224], smoothstep(.18, .86, current))
  color = mixColor(color, [128, 250, 226], smoothstep(.42, .78, mineral) * .42)
  color = mixColor(color, [235, 255, 246], smoothstep(.57, .82, clouds) * .3)
  color = mixColor(color, [255, 248, 225], smoothstep(.68, .9, foam) * .22)
  color = mixColor(color, [72, 150, 76], smoothstep(.6, .82, mineral) * smoothstep(.2, .54, v) * .58)
  color = mixColor(color, [255, 154, 132], smoothstep(.61, .84, fbm(u + .3, v + .22, 7, 83, 4)) * (1 - smoothstep(.46, .82, v)) * .36)
  color = mixColor(color, [226, 154, 222], smoothstep(.66, .88, fbm(u + .64, v + .14, 8, 97, 3)) * smoothstep(.05, .36, v) * .26)
  color = mixColor(color, [255, 255, 247], ridge * .32)
  color = mixColor(color, [18, 76, 160], smoothstep(.74, .95, 1 - vein) * .18)
  color = mixColor(color, [255, 255, 238], fleck * .18)
  color = color.map((channel) => channel * latLight)

  const bump = 86 + (clouds * 64) + (mineral * 42) + (ridge * 74) + (fleck * 28) + (foam * 26)
  const roughness = 120 + (clouds * 74) + (foam * 36) + (mineral * 28) - (current * 52)
  return { bump, color, roughness }
}

function paintBaseMaps() {
  const colorCanvas = createCanvas(DETAIL_SIZE.width, DETAIL_SIZE.height)
  const bumpCanvas = createCanvas(DETAIL_SIZE.width, DETAIL_SIZE.height)
  const roughnessCanvas = createCanvas(DETAIL_SIZE.width, DETAIL_SIZE.height)
  const colorCtx = colorCanvas.getContext('2d')
  const bumpCtx = bumpCanvas.getContext('2d')
  const roughnessCtx = roughnessCanvas.getContext('2d')
  const colorImage = colorCtx.createImageData(DETAIL_SIZE.width, DETAIL_SIZE.height)
  const bumpImage = bumpCtx.createImageData(DETAIL_SIZE.width, DETAIL_SIZE.height)
  const roughnessImage = roughnessCtx.createImageData(DETAIL_SIZE.width, DETAIL_SIZE.height)

  for (let y = 0; y < DETAIL_SIZE.height; y += 1) {
    const v = y / DETAIL_SIZE.height
    for (let x = 0; x < DETAIL_SIZE.width; x += 1) {
      const u = x / DETAIL_SIZE.width
      const pixel = (y * DETAIL_SIZE.width + x) * 4
      const sample = samplePlanet(u, v)
      writeRgb(colorImage.data, pixel, sample.color)
      writeGray(bumpImage.data, pixel, sample.bump)
      writeGray(roughnessImage.data, pixel, sample.roughness)
    }
  }

  colorCtx.putImageData(colorImage, 0, 0)
  bumpCtx.putImageData(bumpImage, 0, 0)
  roughnessCtx.putImageData(roughnessImage, 0, 0)
  return { bumpCanvas, colorCanvas, roughnessCanvas }
}

function addSurfaceDetail(ctx, width, height) {
  const random = makeRandom(107)
  ctx.save()
  ctx.globalCompositeOperation = 'screen'
  ctx.lineCap = 'round'
  for (let i = 0; i < 260; i += 1) {
    const y = 90 + random() * (height - 180)
    const start = random() * width
    const length = 140 + random() * 420
    ctx.strokeStyle = `rgba(255, 255, 238, ${.045 + random() * .18})`
    ctx.lineWidth = .7 + random() * 3.2
    ctx.beginPath()
    ctx.moveTo(start, y)
    ctx.bezierCurveTo(
      start + length * .24,
      y - 70 + random() * 140,
      start + length * .68,
      y - 62 + random() * 124,
      start + length,
      y - 58 + random() * 116,
    )
    ctx.stroke()
  }
  ctx.restore()

  ctx.save()
  ctx.globalCompositeOperation = 'overlay'
  for (let i = 0; i < 5200; i += 1) {
    const x = random() * width
    const y = random() * height
    const radius = .35 + random() * 1.9
    const hue = random()
    const fill = hue > .78
      ? `rgba(122, 164, 74, ${.04 + random() * .18})`
      : `rgba(255, 255, 245, ${.03 + random() * .12})`
    ctx.fillStyle = fill
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.restore()
}

function makeColorCanvas(baseColorCanvas) {
  const canvas = createCanvas(COLOR_SIZE.width, COLOR_SIZE.height)
  const ctx = canvas.getContext('2d')
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(baseColorCanvas, 0, 0, COLOR_SIZE.width, COLOR_SIZE.height)
  addSurfaceDetail(ctx, COLOR_SIZE.width, COLOR_SIZE.height)
  return canvas
}

function makeCloudCanvas() {
  const canvas = createCanvas(COLOR_SIZE.width, COLOR_SIZE.height)
  const ctx = canvas.getContext('2d')
  const random = makeRandom(211)
  ctx.clearRect(0, 0, COLOR_SIZE.width, COLOR_SIZE.height)

  ctx.save()
  ctx.globalCompositeOperation = 'source-over'
  ctx.lineCap = 'round'
  for (let i = 0; i < 420; i += 1) {
    const y = 90 + random() * (COLOR_SIZE.height - 180)
    const start = random() * COLOR_SIZE.width
    const length = 90 + random() * 520
    ctx.strokeStyle = `rgba(255, 255, 248, ${.035 + random() * .13})`
    ctx.lineWidth = 1 + random() * 7
    ctx.beginPath()
    ctx.moveTo(start, y)
    ctx.bezierCurveTo(
      start + length * .28,
      y - 44 + random() * 88,
      start + length * .68,
      y - 50 + random() * 100,
      start + length,
      y - 38 + random() * 76,
    )
    ctx.stroke()
  }
  ctx.restore()

  ctx.save()
  ctx.filter = 'blur(1px)'
  for (let i = 0; i < 680; i += 1) {
    const x = random() * COLOR_SIZE.width
    const y = random() * COLOR_SIZE.height
    const rx = 8 + random() * 42
    const ry = 2 + random() * 11
    ctx.fillStyle = `rgba(255, 255, 250, ${.025 + random() * .095})`
    ctx.beginPath()
    ctx.ellipse(x, y, rx, ry, (random() - .5) * 1.2, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.restore()
  return canvas
}

function makeTexture(canvas, maxAnisotropy, isColor = false) {
  const texture = new CanvasTexture(canvas)
  texture.anisotropy = Math.max(1, maxAnisotropy)
  texture.magFilter = LinearFilter
  texture.minFilter = LinearMipmapLinearFilter
  if (isColor) texture.colorSpace = SRGBColorSpace
  return texture
}

export function makePlanetTextures(maxAnisotropy = 8) {
  const anisotropy = Math.min(maxAnisotropy, 16)
  const baseMaps = paintBaseMaps()
  return {
    bumpMap: makeTexture(baseMaps.bumpCanvas, anisotropy),
    cloudMap: makeTexture(makeCloudCanvas(), anisotropy),
    colorMap: makeTexture(makeColorCanvas(baseMaps.colorCanvas), anisotropy, true),
    roughnessMap: makeTexture(baseMaps.roughnessCanvas, anisotropy),
  }
}
