/**
 * [INPUT]: 扫描 public/posts 目录的 Markdown 文件
 * [OUTPUT]: 生成 public/posts/index.json 博客索引（包含文章完整内容）
 * [POS]: 构建时工具，将 MD 文件元数据和内容提取为 JSON
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const POSTS_DIR = path.join(__dirname, '../public/posts')
const OUTPUT_FILE = path.join(POSTS_DIR, 'index.json')

// ============================
//  扫描博客文章并提取元数据 + 内容
// ============================
function scanPosts(dir, baseDir = dir) {
  const posts = []
  const items = fs.readdirSync(dir)

  for (const item of items) {
    const fullPath = path.join(dir, item)
    const stat = fs.statSync(fullPath)

    if (stat.isDirectory()) {
      posts.push(...scanPosts(fullPath, baseDir))
    } else if (item.endsWith('.md') && item !== 'search.md') {
      const content = fs.readFileSync(fullPath, 'utf-8')
      const { data, content: markdown, excerpt } = matter(content, { excerpt: true })

      // 排除材料素材文件夹
      if (fullPath.includes('材料素材')) continue

      const relativePath = path.relative(baseDir, fullPath)
      const slug = relativePath.replace(/\.md$/, '').replace(/\\/g, '/')

      posts.push({
        slug,
        title: data.title || item.replace('.md', ''),
        date: data.date || new Date().toISOString(),
        author: data.author || 'Anonymous',
        tags: data.tags || [],
        excerpt: data.excerpt || excerpt || '',
        content: markdown, // 存储完整 Markdown 内容
        path: `/posts/${relativePath.replace(/\\/g, '/')}`
      })
    }
  }

  return posts
}

// ============================
//  主程序
// ============================
try {
  const posts = scanPosts(POSTS_DIR)
    .filter(p => p.title) // 仅保留有标题的文章
    .sort((a, b) => new Date(b.date) - new Date(a.date)) // 按日期降序

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(posts, null, 2))

  console.log(`✅ Generated ${posts.length} posts index (with content)`)
  console.log(`📁 Output: ${OUTPUT_FILE}`)
} catch (error) {
  console.error('❌ Failed to generate posts index:', error)
  process.exit(1)
}
