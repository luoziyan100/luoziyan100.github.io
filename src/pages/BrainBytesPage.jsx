/**
 * [INPUT]: fetch /brain-bytes/index.json（含 year/topic 字段），引入 brain-bytes.css，react-router-dom Link 回主站
 * [OUTPUT]: BrainBytesPage 页面组件（/brain-bytes 站中站列表首页），提供「时间线 / 主题」双视图
 * [POS]: pages/ 的 Brain & Bytes（知觉档案）专栏首页，红色学术风；文章为自包含静态 HTML（原生 <a> 整页跳转）
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import './brain-bytes.css'

// 7 主题展示元数据（与 scripts/brain-bytes-curation.js 同源；站中站独立视觉，前端自带一份）
const TOPICS = {
  electrophysiology: { name: '电生理 · 离子通道', color: '#c0392b', order: 1 },
  perception:        { name: '感知 · 视觉',       color: '#b9770e', order: 2 },
  computation:       { name: '计算 · 网络 · 学习', color: '#8a6d3b', order: 3 },
  memory:            { name: '记忆 · 海马',       color: '#1f6f54', order: 4 },
  decision:          { name: '决策 · 前额叶 · 意志', color: '#a0522d', order: 5 },
  prediction:        { name: '预测 · 贝叶斯脑',   color: '#2c6e9c', order: 6 },
  consciousness:     { name: '意识 · 主观经验',   color: '#5b4b8a', order: 7 },
  unclassified:      { name: '未分类',           color: '#888888', order: 99 },
}
const topicMeta = (k) => TOPICS[k] || TOPICS.unclassified

// 把 "English Concept × 中文一句话" 的标题拆成 概念 / 直觉 两段（无 × 则整段为概念）
function splitTitle(title) {
  const i = title.indexOf('×')
  if (i === -1) return { concept: title, gist: '' }
  return { concept: title.slice(0, i).trim(), gist: title.slice(i + 1).trim() }
}

// 单张文章卡片（两视图共享）。原生 <a> 整页跳转到自包含静态 HTML。
function Card({ a }) {
  const { concept, gist } = splitTitle(a.title)
  const m = topicMeta(a.topic)
  return (
    <a className="bb-card" href={a.path} style={{ borderLeftColor: m.color }}>
      <div className="bb-card-top">
        {a.year && <span className="bb-year">{a.year}</span>}
        <span className="bb-dot" style={{ background: m.color }} title={m.name} />
      </div>
      <div className="bb-concept">{concept}</div>
      {gist && <div className="bb-gist">{gist}</div>}
      {a.paper && <div className="bb-paper">{a.paper}</div>}
      <div className="bb-foot">
        {a.authors && <span className="bb-authors">{a.authors}</span>}
        {a.source && <span className="bb-source">{a.source}</span>}
      </div>
    </a>
  )
}

export function BrainBytesPage() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState('timeline') // 'timeline' | 'topic'

  useEffect(() => {
    fetch('/brain-bytes/index.json')
      .then(res => res.json())
      .then(data => { setArticles(data); setLoading(false) })
      .catch(err => { console.error('Failed to load Brain & Bytes index:', err); setLoading(false) })
  }, [])

  // 时间线：按年份升序（从 1943 思想源头往下读），跨十年时插一个年代标记
  const timeline = useMemo(() => {
    const rows = []
    const sorted = [...articles].filter(a => a.year).sort((a, b) => a.year - b.year)
    let lastDecade = null
    for (const a of sorted) {
      const decade = Math.floor(a.year / 10) * 10
      if (decade !== lastDecade) { rows.push({ marker: decade }); lastDecade = decade }
      rows.push({ article: a })
    }
    return rows
  }, [articles])

  // 主题：按 TOPICS.order 分区，区内按年份升序
  const byTopic = useMemo(() =>
    Object.keys(TOPICS)
      .filter(k => k !== 'unclassified')
      .sort((a, b) => TOPICS[a].order - TOPICS[b].order)
      .map(key => ({
        key,
        meta: TOPICS[key],
        items: articles.filter(a => a.topic === key).sort((a, b) => (a.year || 0) - (b.year || 0)),
      }))
      .filter(g => g.items.length)
  , [articles])

  const span = useMemo(() => {
    const ys = articles.filter(a => a.year).map(a => a.year)
    return ys.length ? `${Math.min(...ys)}–${Math.max(...ys)}` : ''
  }, [articles])

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
          <p className="bb-tag">A deep-reading archive on AI, cognition, and neuroscience.</p>
        </header>

        {/* 概览 + 视图切换 */}
        <div className="bb-meta-row">
          <span className="bb-count">
            {loading ? '加载中…' : `${articles.length} 篇精读${span ? ` · ${span}` : ''} · ${byTopic.length} 主题`}
          </span>
          {!loading && (
            <div className="bb-viewswitch" role="tablist" aria-label="视图切换">
              <button type="button" role="tab" aria-selected={view === 'timeline'}
                className={view === 'timeline' ? 'active' : ''} onClick={() => setView('timeline')}>
                时间线
              </button>
              <button type="button" role="tab" aria-selected={view === 'topic'}
                className={view === 'topic' ? 'active' : ''} onClick={() => setView('topic')}>
                主题
              </button>
            </div>
          )}
        </div>

        {/* 时间线视图：一条年代轴串起 1943→今 的思想脉络 */}
        {!loading && view === 'timeline' && (
          <div className="bb-timeline">
            {timeline.map((row) =>
              row.marker != null ? (
                <div className="bb-decade" key={`d${row.marker}`}>
                  <div className="bb-rail"><span className="bb-decade-dot" /></div>
                  <div className="bb-decade-label">{row.marker}s</div>
                </div>
              ) : (
                <div className="bb-tl-item" key={row.article.slug}>
                  <div className="bb-rail">
                    <span className="bb-node" style={{ borderColor: topicMeta(row.article.topic).color }} />
                  </div>
                  <div className="bb-tl-card"><Card a={row.article} /></div>
                </div>
              )
            )}
          </div>
        )}

        {/* 主题视图：7 个子领域分区 */}
        {!loading && view === 'topic' && (
          <div className="bb-topics">
            {byTopic.map(g => (
              <section className="bb-topic-section" key={g.key}>
                <div className="bb-topic-head" style={{ borderColor: g.meta.color }}>
                  <span className="bb-topic-band" style={{ background: g.meta.color }} />
                  <span className="bb-topic-name">{g.meta.name}</span>
                  <span className="bb-topic-count">{g.items.length} 篇</span>
                </div>
                <div className="bb-topic-grid">
                  {g.items.map(a => <Card a={a} key={a.slug} />)}
                </div>
              </section>
            ))}
          </div>
        )}

        <footer className="bb-footer">
          Brain &amp; Bytes · 知觉档案 — 一篇一篇地，把论文读厚再读薄
        </footer>
      </div>
    </div>
  )
}
