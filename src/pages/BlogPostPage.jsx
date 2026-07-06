/**
 * [INPUT]: react-router-dom useParams/Link，从 /posts/index.json 取文章，ReactMarkdown 渲染，引入 blog-post.css
 * [OUTPUT]: BlogPostPage 页面组件（博客文章详情，「数字花园」独立视觉）
 * [POS]: pages/ 的博客详情页，与 blog-list 数字花园统一（暖纸/衬线/苔绿，脱离主站 shadcn/Amethyst）；正文自定义 Markdown 排版，修段间距与标题层级
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'highlight.js/styles/github-dark.css'
import 'katex/dist/katex.min.css'
import './blog-post.css'

const AUTHOR_FIX = { 'Athropic': 'Anthropic' }
function fixAuthor(a) {
  const x = (a || '').trim()
  if (!x || x.toLowerCase() === 'anonymous') return ''
  return AUTHOR_FIX[x] || x
}
const readingTime = (c) => Math.max(1, Math.round((c || '').length / 380))
function fmtDate(d) {
  const x = new Date(d)
  if (isNaN(x)) return ''
  return `${x.getFullYear()}.${String(x.getMonth() + 1).padStart(2, '0')}.${String(x.getDate()).padStart(2, '0')}`
}

function Nav() {
  return (
    <nav className="blp-nav">
      <Link to="/">首页</Link>
      <Link to="/blog" className="here">博客</Link>
      <Link to="/brain-bytes">Brain &amp; Bytes</Link>
    </nav>
  )
}

export function BlogPostPage() {
  const { '*': slug } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const decodedSlug = decodeURIComponent(slug)
    fetch('/posts/index.json')
      .then(res => res.json())
      .then(posts => {
        const found = posts.find(p => p.slug === decodedSlug)
        if (found) setPost(found)
        else setError('文章未找到')
        setLoading(false)
      })
      .catch(err => { console.error('Failed to load posts:', err); setError(err.message); setLoading(false) })
  }, [slug])

  if (loading) {
    return <div className="blp-root"><div className="blp-wrap"><Nav /><p style={{ color: '#77746a' }}>正在翻开这篇…</p></div></div>
  }
  if (!post || error) {
    return (
      <div className="blp-root"><div className="blp-wrap"><Nav />
        <div className="blp-notfound">
          <h1>没找到这篇</h1>
          <p>链接可能不对，或这篇还没写完。</p>
          <Link to="/blog">← 回到博客</Link>
        </div>
      </div></div>
    )
  }

  const author = fixAuthor(post.author)
  const cat = (post.tags && post.tags[0]) || '随笔'

  return (
    <div className="blp-root">
      <div className="blp-wrap">
        <Nav />
        <div className="blp-back"><Link to="/blog">← 返回列表</Link></div>

        <div className="blp-head-meta">
          <span className="blp-cat">{cat}</span>
          <span className="blp-dot"></span>
          <span>{fmtDate(post.date)}</span>
          <span className="blp-dot"></span>
          <span>{readingTime(post.content)} 分钟</span>
        </div>
        <h1 className="blp-title">{post.title}</h1>
        {author && <div className="blp-by">— {author}</div>}

        <svg className="blp-rule" viewBox="0 0 400 14" preserveAspectRatio="none" aria-hidden="true">
          <path d="M2 8 Q 100 2, 200 7 T 398 6" fill="none" stroke="#6E7B4F" stroke-width="1.6" stroke-linecap="round" opacity="0.55" />
        </svg>

        <article className="blp-article">
          <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeHighlight, rehypeKatex]}>
            {post.content}
          </ReactMarkdown>
        </article>
      </div>
    </div>
  )
}
