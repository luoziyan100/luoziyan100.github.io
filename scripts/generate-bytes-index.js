/**
 * [INPUT]: 扫描 public/brain-bytes/<slug>/index.html 的自包含 HTML 文章 + scripts/brain-bytes-curation.js 策展表
 * [OUTPUT]: 生成 public/brain-bytes/index.json（标题/论文/作者/机构/来源 + year 年份 + topic 主题），并向每篇注入「返回 Brain & Bytes」导航条
 * [POS]: 构建时工具，Brain & Bytes 站中站的内容索引器，与 generate-posts-index.js 并列
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { SLUG_TOPICS } from './brain-bytes-curation.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const BYTES_DIR = path.join(__dirname, '../public/brain-bytes')
const OUTPUT_FILE = path.join(BYTES_DIR, 'index.json')

// 注入的返回导航条（含幂等标记，避免重复构建时重复注入）
const NAV_MARKER = '<!--bb-nav-->'
const NAV_HTML = `${NAV_MARKER}
<div style="margin-bottom:28px;font-size:13px;">
  <a href="/brain-bytes/" style="color:#c0392b;text-decoration:none;font-weight:600;">← Brain &amp; Bytes · 知觉档案</a>
</div>`

// ============================
//  从 HTML 文本中提取单个字段
// ============================
function stripTags(s) {
  return s.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
}

// 抽取 .meta 区块内某个 emoji 标记开头的行
function pickMeta(metaText, emoji) {
  const line = metaText
    .split('\n')
    .map(l => stripTags(l))
    .find(l => l.startsWith(emoji))
  return line ? line.slice(emoji.length).trim() : ''
}

// 从「来源」文本中解析出四位年份（1900–2099）。来源形如
// "The Journal of Physiology · 1952 · 116卷…" 或 "Neuron, Vol. 36 · 2002 年 12 月"。
// 取第一个落在合理年份区间的匹配，避开卷号/页码（它们不是 19xx/20xx 形态）。
function parseYear(sourceText) {
  const matches = sourceText.match(/\b(19\d{2}|20\d{2})\b/g)
  if (!matches) return null
  for (const m of matches) {
    const y = parseInt(m, 10)
    if (y >= 1900 && y <= 2099) return y
  }
  return null
}

// ============================
//  解析单篇文章
// ============================
function parseArticle(slug, html) {
  const titleMatch = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)
  const title = titleMatch ? stripTags(titleMatch[1]) : slug

  const metaMatch = html.match(/class="meta"[^>]*>([\s\S]*?)<\/div>/i)
  const metaText = metaMatch ? metaMatch[1] : ''
  const source = pickMeta(metaText, '📅')

  return {
    slug,
    title,
    paper: pickMeta(metaText, '📄'),
    authors: pickMeta(metaText, '✍️'),
    institutions: pickMeta(metaText, '🏛️'),
    source,
    year: parseYear(source),                 // 结构化年份（时间线视图用）
    topic: SLUG_TOPICS[slug] || 'unclassified', // 策展主题（主题视图用）
    path: `/brain-bytes/${slug}/`,
  }
}

// ============================
//  幂等注入返回导航条
// ============================
function ensureNav(filePath, html) {
  if (html.includes(NAV_MARKER)) return html
  const injected = html.replace(/<body[^>]*>/i, match => `${match}\n${NAV_HTML}`)
  fs.writeFileSync(filePath, injected)
  return injected
}

// ============================
//  主程序
// ============================
try {
  if (!fs.existsSync(BYTES_DIR)) {
    fs.mkdirSync(BYTES_DIR, { recursive: true })
  }

  const entries = fs.readdirSync(BYTES_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory())

  const articles = []
  const missingYear = []
  const missingTopic = []
  for (const dir of entries) {
    const filePath = path.join(BYTES_DIR, dir.name, 'index.html')
    if (!fs.existsSync(filePath)) continue

    let html = fs.readFileSync(filePath, 'utf-8')
    html = ensureNav(filePath, html)

    const stat = fs.statSync(filePath)
    const article = parseArticle(dir.name, html)
    article.date = stat.mtime.toISOString()
    if (article.year === null) missingYear.push(dir.name)
    if (article.topic === 'unclassified') missingTopic.push(dir.name)
    articles.push(article)
  }

  articles.sort((a, b) => new Date(b.date) - new Date(a.date))

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(articles, null, 2))

  console.log(`✅ Generated ${articles.length} Brain & Bytes articles index`)
  console.log(`📁 Output: ${OUTPUT_FILE}`)
  // 策展缺口警告：不阻断构建，但明确提示需要补的条目（新增文章时最常见）
  if (missingYear.length) console.warn(`⚠️  ${missingYear.length} 篇未解析出年份: ${missingYear.join(', ')}`)
  if (missingTopic.length) console.warn(`⚠️  ${missingTopic.length} 篇未在策展表中分类: ${missingTopic.join(', ')}`)
} catch (error) {
  console.error('❌ Failed to generate Brain & Bytes index:', error)
  process.exit(1)
}
