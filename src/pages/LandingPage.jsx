/**
 * [INPUT]: react-router-dom Link，从 /posts/index.json 取最新文章，引入 landing.css
 * [OUTPUT]: LandingPage 首页组件（「数字花园」博客门户：主张 + 最新文章 + 两个专栏入口）
 * [POS]: pages/ 的首页，与 blog 数字花园统一（暖纸/衬线/苔绿，脱离主站 shadcn/Amethyst 落地页模板）；原 landing/* Section 组件保留但不再使用
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './landing.css'

const readingTime = (c) => Math.max(1, Math.round((c || '').length / 380))
function fmtDate(d) {
  const x = new Date(d)
  if (isNaN(x)) return ''
  return `${x.getFullYear()}.${String(x.getMonth() + 1).padStart(2, '0')}.${String(x.getDate()).padStart(2, '0')}`
}

export function LandingPage() {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    fetch('/posts/index.json')
      .then(res => res.json())
      .then(setPosts)
      .catch(err => console.error('Failed to load posts:', err))
  }, [])

  const latest = posts.slice(0, 4)

  return (
    <div className="lp-root">
      <div className="lp-wrap">
        <nav className="lp-nav">
          <Link to="/" className="here">首页</Link>
          <Link to="/blog">博客</Link>
          <Link to="/brain-bytes">Brain &amp; Bytes</Link>
        </nav>

        <section className="lp-hero">
          <div className="lp-hello">你好，我在这里慢慢写 · <b>zihao</b></div>
          <h1>心智与机器</h1>
          <p className="intro">
            一个独立研究者的思考现场：把 AI 论文读厚再读薄，把工程里踩过的坑记下来。
            这里有两条线——AI 工程与认知的随笔，和一篇篇神经科学经典的深度精读。不追热点，只记真正想明白的东西。
          </p>
          <svg className="lp-rule" viewBox="0 0 400 14" preserveAspectRatio="none" aria-hidden="true">
            <path d="M2 8 Q 100 2, 200 7 T 398 6" fill="none" stroke="#6E7B4F" stroke-width="1.6" stroke-linecap="round" opacity="0.55" />
          </svg>
        </section>

        <section>
          <div className="lp-label">最近在写</div>
          <div className="lp-latest">
            {latest.map(post => {
              const cat = (post.tags && post.tags[0]) || '随笔'
              return (
                <Link className="lp-post" key={post.slug} to={`/blog/${encodeURIComponent(post.slug)}`}>
                  <div className="lp-post-top">
                    <span className="lp-cat">{cat}</span>
                    <span className="lp-dot"></span>
                    <span>{fmtDate(post.date)}</span>
                    <span className="lp-dot"></span>
                    <span>{readingTime(post.content)} 分钟</span>
                  </div>
                  <h3>{post.title}</h3>
                </Link>
              )
            })}
          </div>
          {posts.length > 0 && (
            <Link className="lp-more" to="/blog">看全部 {posts.length} 篇 →</Link>
          )}
        </section>

        <section>
          <div className="lp-label">两条线</div>
          <div className="lp-columns">
            <Link className="lp-col" to="/blog">
              <div className="lp-col-name">心智与机器 · 随笔</div>
              <p>AI 工程、Agent、认知科学的思考与踩坑记录。</p>
              <span className="go">读博客 →</span>
            </Link>
            <Link className="lp-col" to="/brain-bytes">
              <div className="lp-col-name">Brain &amp; Bytes</div>
              <p>56 篇神经科学经典论文的深度精读，按时间与主题可查。</p>
              <span className="go">进档案 →</span>
            </Link>
          </div>
        </section>

        <footer className="lp-footer">心智与机器 · 一个人的写作现场 —— 一篇一篇地，把论文读厚再读薄。</footer>
      </div>
    </div>
  )
}
