/**
 * [INPUT]: fetch /brain-bytes/index.json，引入 brain-bytes.css，react-router-dom Link
 * [OUTPUT]: 对外提供 BrainBytesPage 页面组件（/brain-bytes 站中站列表首页）
 * [POS]: pages/ 的 Brain & Bytes（知觉档案）专栏首页，红色学术风，文章为自包含静态 HTML（原生 <a> 整页跳转）
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './brain-bytes.css'

export function BrainBytesPage() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/brain-bytes/index.json')
      .then(res => res.json())
      .then(data => {
        setArticles(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to load Brain & Bytes index:', err)
        setLoading(false)
      })
  }, [])

  return (
    <div className="bb-root">
      <div className="bb-container">
        {/* 回主站导航 */}
        <nav className="bb-topnav">
          <Link to="/">← 主站首页</Link>
          <Link to="/blog">技术博客</Link>
        </nav>

        {/* 品牌头 */}
        <header className="bb-brand">
          <h1>Brain <span>&amp;</span> Bytes</h1>
          <div className="bb-cn">知觉档案</div>
          <p className="bb-tag">
            A deep-reading archive on AI, cognition, and neuroscience.
          </p>
        </header>

        <div className="bb-count">
          {loading ? '加载中…' : `${articles.length} 篇精读`}
        </div>

        {/* 文章列表（自包含静态 HTML，用原生 <a> 整页跳转） */}
        <div className="bb-list">
          {articles.map((a) => (
            <a key={a.slug} className="bb-card" href={a.path}>
              <div className="bb-title">{a.title}</div>
              {a.paper && <div className="bb-paper">{a.paper}</div>}
              {a.authors && <div className="bb-authors">{a.authors}</div>}
              <div className="bb-foot">
                {a.institutions && <span>🏛️ {a.institutions}</span>}
                {a.source && <span className="bb-source">{a.source}</span>}
              </div>
            </a>
          ))}
        </div>

        <footer className="bb-footer">
          Brain &amp; Bytes · 知觉档案 — 一篇一篇地，把论文读厚再读薄
        </footer>
      </div>
    </div>
  )
}
