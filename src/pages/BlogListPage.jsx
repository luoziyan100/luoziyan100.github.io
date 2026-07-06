/**
 * [INPUT]: fetch /posts/index.json（真实文章数据），react-router-dom Link，引入 blog-list.css
 * [OUTPUT]: BlogListPage 页面组件（博客列表，「数字花园」独立视觉）
 * [POS]: pages/ 的博客列表页，经用户选定采用数字花园风（暖纸/衬线/苔绿，脱离主站 shadcn/Amethyst，与 Brain & Bytes 同属专栏豁免）；摘要前端清洗、阅读时长按正文字数估算
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './blog-list.css'

// 已知作者数据的轻量修正（拼写 / 匿名）
const AUTHOR_FIX = { 'Athropic': 'Anthropic' }
function fixAuthor(a) {
  const x = (a || '').trim()
  if (!x || x.toLowerCase() === 'anonymous') return ''
  return AUTHOR_FIX[x] || x
}
// 摘要清洗：个别文章 frontmatter 没写 excerpt 时会 fallback 到正文、带出 Markdown 标题行与符号
function cleanExcerpt(raw) {
  return (raw || '')
    .trim()
    .replace(/^#{1,6}[^\n]*\n+/, '')       // 去掉开头的标题行（避免与 title 重复）
    .replace(/!?\[[^\]]*\]\([^)]*\)/g, '') // 去掉图片/链接
    .replace(/[#*`>[\]]/g, '')             // 去残余 Markdown 记号
    .replace(/\s+/g, ' ')
    .trim()
}
const readingTime = (content) => Math.max(1, Math.round((content || '').length / 380))
function fmtDate(d) {
  const x = new Date(d)
  if (isNaN(x)) return ''
  return `${x.getFullYear()}.${String(x.getMonth() + 1).padStart(2, '0')}.${String(x.getDate()).padStart(2, '0')}`
}

export function BlogListPage() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/posts/index.json')
      .then(res => res.json())
      .then(data => { setPosts(data); setLoading(false) })
      .catch(err => { console.error('Failed to load posts:', err); setLoading(false) })
  }, [])

  return (
    <div className="bl-root">
      <div className="bl-wrap">
        <nav className="bl-nav">
          <Link to="/">首页</Link>
          <Link to="/blog" className="here">博客</Link>
          <Link to="/brain-bytes">Brain &amp; Bytes</Link>
        </nav>

        <div className="bl-hello">你好，我在这里慢慢写 · <b>zihao</b></div>
        <div className="bl-mast"><h1>心智与机器</h1></div>
        <p className="bl-intro">一个独立研究者的思考现场：把 AI 论文读厚再读薄，把工程里踩过的坑记下来。不追热点，只记真正想明白的东西。</p>
        <svg className="bl-rule" viewBox="0 0 400 14" preserveAspectRatio="none" aria-hidden="true">
          <path d="M2 8 Q 100 2, 200 7 T 398 6" fill="none" stroke="#6E7B4F" stroke-width="1.6" stroke-linecap="round" opacity="0.55" />
        </svg>
        <p className="bl-count">{loading ? '正在翻开笔记…' : `共 ${posts.length} 篇 · 慢慢更新`}</p>

        <div className="bl-list">
          {posts.map(post => {
            const author = fixAuthor(post.author)
            const cat = (post.tags && post.tags[0]) || '随笔'
            return (
              <Link className="bl-note" key={post.slug} to={`/blog/${encodeURIComponent(post.slug)}`}>
                <div className="bl-top">
                  <span className="bl-cat">{cat}</span>
                  <span className="bl-dot"></span>
                  <span>{fmtDate(post.date)}</span>
                  <span className="bl-dot"></span>
                  <span className="bl-rt">{readingTime(post.content)} 分钟</span>
                </div>
                <h2>{post.title}</h2>
                <p>{cleanExcerpt(post.excerpt)}</p>
                {author && <div className="bl-by">— {author}</div>}
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
