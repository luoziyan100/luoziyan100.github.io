/**
 * [INPUT]: fetch /brain-bytes/index.json，依赖 brain-bytes-demo.css，react-router-dom Link 回主站与旧版列表
 * [OUTPUT]: BrainBytesDemoPage 页面组件（/brain-bytes-demo），提供「时间长卷 + 七条谱系 + 精选路径」Demo
 * [POS]: pages/ 的 Brain & Bytes 新叙事首页实验入口，与 BrainBytesPage 并行，验证从文章陈列到知识地图的改造方向
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import './brain-bytes-demo.css'

const TOPICS = {
  electrophysiology: { name: '电生理', en: 'Electrophysiology', mark: '电', color: '#c0392b', order: 1 },
  perception: { name: '感知', en: 'Perception', mark: '感', color: '#b9770e', order: 2 },
  computation: { name: '计算', en: 'Computation', mark: '算', color: '#8a6d3b', order: 3 },
  memory: { name: '记忆', en: 'Memory', mark: '忆', color: '#1f6f54', order: 4 },
  decision: { name: '决策', en: 'Decision', mark: '决', color: '#a0522d', order: 5 },
  prediction: { name: '预测', en: 'Prediction', mark: '预', color: '#2c6e9c', order: 6 },
  consciousness: { name: '意识', en: 'Consciousness', mark: '识', color: '#5b4b8a', order: 7 },
}

const PATHS = [
  {
    title: '机器如何学会像脑一样计算',
    theme: '计算谱系',
    slugs: ['mcculloch-pitts-neuron', 'hopfield-associative-memory', 'backpropagation-learning', 'backpropagation-and-the-brain'],
  },
  {
    title: '意识从哪里开始变成问题',
    theme: '意识谱系',
    slugs: ['what-is-it-like-to-be-a-bat', 'hard-problem-of-consciousness', 'integrated-information-theory', 'conscious-preconscious-subliminal'],
  },
  {
    title: '记忆不是仓库，是会重写的痕迹',
    theme: '记忆谱系',
    slugs: ['patient-hm-hippocampus', 'hippocampal-place-cells', 'long-term-potentiation', 'engram-deconstruction'],
  },
]

function splitTitle(title) {
  const i = title.indexOf('×')
  if (i === -1) return { concept: title, gist: '' }
  return { concept: title.slice(0, i).trim(), gist: title.slice(i + 1).trim() }
}

function topicMeta(topic) {
  return TOPICS[topic] || { name: '未分类', en: 'Unclassified', mark: '文', color: '#888', order: 99 }
}

function useBrainBytes() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true
    fetch('/brain-bytes/index.json')
      .then((res) => res.json())
      .then((data) => {
        if (!alive) return
        setArticles(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => {
        if (!alive) return
        setLoading(false)
      })
    return () => { alive = false }
  }, [])

  return { articles, loading }
}

function useScrollProgress(ref) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const node = ref.current
    if (!node) return undefined

    let raf = 0
    const update = () => {
      if (raf) return
      raf = window.requestAnimationFrame(() => {
        raf = 0
        const rect = node.getBoundingClientRect()
        const total = Math.max(1, node.offsetHeight - window.innerHeight)
        const next = Math.max(0, Math.min(1, -rect.top / total))
        setProgress(next)
      })
    }

    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    update()
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
      window.cancelAnimationFrame(raf)
    }
  }, [ref])

  return progress
}

function TimelineScroll({ articles }) {
  const zoneRef = useRef(null)
  const progress = useScrollProgress(zoneRef)

  const sorted = useMemo(
    () => [...articles].filter((a) => a.year).sort((a, b) => a.year - b.year),
    [articles],
  )
  const minYear = sorted[0]?.year || 1943
  const maxYear = sorted[sorted.length - 1]?.year || 2026
  const trackWidth = Math.max(3400, sorted.length * 60)
  const shift = progress * Math.max(0, trackWidth - window.innerWidth * 0.55)
  const currentYear = Math.round(minYear + progress * (maxYear - minYear))

  return (
    <section className="bbd-scrollzone" ref={zoneRef} aria-label="Brain & Bytes 思想时间长卷">
      <div className="bbd-pin">
        <div className="bbd-year-ghost">{currentYear}</div>
        <header className="bbd-hero-copy">
          <div className="bbd-kicker">B R A I N · B Y T E S</div>
          <h1>Brain & Bytes</h1>
          <p>从 1943 到 2026，把神经科学、计算、意识与 AI 的论文串成一张可以行走的地图。</p>
        </header>
        <div className="bbd-track-wrap">
          <div className="bbd-track" style={{ width: trackWidth, transform: `translate3d(${-shift}px, 0, 0)` }}>
            {sorted.map((article, index) => {
              const meta = topicMeta(article.topic)
              const { concept } = splitTitle(article.title)
              const left = ((article.year - minYear) / Math.max(1, maxYear - minYear)) * (trackWidth - 180) + 90
              const stack = sorted.filter((item) => item.year === article.year).findIndex((item) => item.slug === article.slug)
              return (
                <a
                  key={article.slug}
                  className="bbd-node"
                  href={article.path}
                  style={{ '--node-color': meta.color, left, top: `calc(50% + ${(stack % 5) * 24 - 48}px)` }}
                >
                  <span className="bbd-node-dot" />
                  <span className="bbd-node-card">
                    <strong>{article.year} · {concept}</strong>
                    <small>{meta.en}</small>
                  </span>
                </a>
              )
            })}
          </div>
        </div>
        <div className="bbd-scroll-cue">
          <span>Scroll</span>
          <i />
        </div>
      </div>
    </section>
  )
}

function LineageGrid({ groups }) {
  return (
    <section className="bbd-section" id="lineages">
      <span className="bbd-section-mark">Seven Lineages</span>
      <h2>七条思想的支流</h2>
      <div className="bbd-lineage-grid">
        {groups.map((group) => (
          <a key={group.key} className="bbd-lineage-card" href={group.first?.path || '#lineages'} style={{ '--lineage-color': group.meta.color }}>
            <span className="bbd-seal">{group.meta.mark}</span>
            <strong>{group.meta.en}</strong>
            <em>{group.meta.name}</em>
            <span>{group.items.length} 篇</span>
          </a>
        ))}
      </div>
    </section>
  )
}

function PathSection({ articles }) {
  const bySlug = useMemo(() => new Map(articles.map((article) => [article.slug, article])), [articles])

  return (
    <section className="bbd-section bbd-paths">
      <span className="bbd-section-mark">Reading Paths</span>
      <h2>不从列表开始，从一条问题开始</h2>
      <div className="bbd-path-grid">
        {PATHS.map((path) => (
          <article className="bbd-path" key={path.title}>
            <div className="bbd-path-top">
              <span>{path.theme}</span>
              <strong>{path.title}</strong>
            </div>
            <ol>
              {path.slugs.map((slug) => {
                const article = bySlug.get(slug)
                if (!article) return null
                const { concept } = splitTitle(article.title)
                return (
                  <li key={slug}>
                    <a href={article.path}>
                      <span>{article.year}</span>
                      {concept}
                    </a>
                  </li>
                )
              })}
            </ol>
          </article>
        ))}
      </div>
    </section>
  )
}

export function BrainBytesDemoPage() {
  const { articles, loading } = useBrainBytes()

  const groups = useMemo(() => (
    Object.entries(TOPICS)
      .sort(([, a], [, b]) => a.order - b.order)
      .map(([key, meta]) => {
        const items = articles.filter((article) => article.topic === key).sort((a, b) => (a.year || 0) - (b.year || 0))
        return { key, meta, items, first: items[0] }
      })
      .filter((group) => group.items.length)
  ), [articles])

  return (
    <main className="bbd-root">
      <div className="bbd-grain" aria-hidden="true" />
      <nav className="bbd-nav">
        <Link className="bbd-brand" to="/brain-bytes-demo">Brain <span>& Bytes</span></Link>
        <div>
          <a href="#lineages">谱系</a>
          <Link to="/brain-bytes">旧版列表</Link>
          <Link to="/">主站</Link>
        </div>
      </nav>

      {loading ? (
        <section className="bbd-loading">正在展开档案...</section>
      ) : (
        <>
          <TimelineScroll articles={articles} />
          <LineageGrid groups={groups} />
          <PathSection articles={articles} />
          <footer className="bbd-footer">
            <span className="bbd-seal">知</span>
            <h2>一篇一篇地，把论文读厚再读薄</h2>
            <p>Brain & Bytes · {articles.length} 篇神经科学经典</p>
          </footer>
        </>
      )}
    </main>
  )
}
