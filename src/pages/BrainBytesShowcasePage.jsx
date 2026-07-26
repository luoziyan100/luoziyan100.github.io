/**
 * [INPUT]: fetch /brain-bytes/index.json，依赖 brain-bytes-showcase.css/brain-bytes-showcase-scenes.css，复用 Brain & Bytes 文章元数据
 * [OUTPUT]: BrainBytesShowcasePage 页面组件（/brain-bytes-showcase），提供 7 个论文谱系展示 Demo 的横向比较
 * [POS]: pages/ 的设计方案实验室，用真实 56 篇论文数据验证不同信息架构隐喻
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import './brain-bytes-showcase.css'
import './brain-bytes-showcase-scenes.css'

const TOPICS = {
  electrophysiology: { name: '电生理', en: 'Electrophysiology', mark: '电', color: '#c0392b', order: 1 },
  perception: { name: '感知', en: 'Perception', mark: '感', color: '#b9770e', order: 2 },
  computation: { name: '计算', en: 'Computation', mark: '算', color: '#8a6d3b', order: 3 },
  memory: { name: '记忆', en: 'Memory', mark: '忆', color: '#1f6f54', order: 4 },
  decision: { name: '决策', en: 'Decision', mark: '决', color: '#a0522d', order: 5 },
  prediction: { name: '预测', en: 'Prediction', mark: '预', color: '#2c6e9c', order: 6 },
  consciousness: { name: '意识', en: 'Consciousness', mark: '识', color: '#5b4b8a', order: 7 },
}

const DEMOS = [
  { id: 'river', name: '七条问题之河', tag: '谱系地图' },
  { id: 'museum', name: '心智博物馆', tag: '展馆导览' },
  { id: 'quest', name: '问题任务树', tag: '学习路径' },
  { id: 'star', name: '思想星图', tag: '关系宇宙' },
  { id: 'book', name: '会动的思想书', tag: '章节长卷' },
  { id: 'arena', name: '辩论场', tag: '观点冲突' },
  { id: 'lab', name: '实验台', tag: '机制拆解' },
]

const QUESTS = [
  { q: '机器能不能像脑一样计算？', topic: 'computation', slugs: ['mcculloch-pitts-neuron', 'hopfield-associative-memory', 'backpropagation-learning'] },
  { q: '记忆存在大脑哪里？', topic: 'memory', slugs: ['patient-hm-hippocampus', 'hippocampal-place-cells', 'engram-deconstruction'] },
  { q: '意识是否能被测量？', topic: 'consciousness', slugs: ['what-is-it-like-to-be-a-bat', 'hard-problem-of-consciousness', 'integrated-information-theory'] },
  { q: '大脑是不是一台预测机器？', topic: 'prediction', slugs: ['predictive-coding-visual-cortex', 'free-energy-principle', 'predictive-processing-clark'] },
]

const CHAPTERS = [
  { title: '神经元成为逻辑', years: '1943-1952', topic: 'computation' },
  { title: '电流成为机制', years: '1952', topic: 'electrophysiology' },
  { title: '记忆失去位置', years: '1957-1973', topic: 'memory' },
  { title: '视觉成为层级', years: '1962-2014', topic: 'perception' },
  { title: '决策失去自由', years: '1981-2024', topic: 'decision' },
  { title: '大脑成为预测机器', years: '1997-2013', topic: 'prediction' },
  { title: '意识成为硬问题', years: '1974-2015', topic: 'consciousness' },
]

function splitTitle(title) {
  const i = title.indexOf('×')
  if (i === -1) return { concept: title, gist: '' }
  return { concept: title.slice(0, i).trim(), gist: title.slice(i + 1).trim() }
}

function meta(topic) {
  return TOPICS[topic] || { name: '未分类', en: 'Unclassified', mark: '文', color: '#777', order: 99 }
}

function useArticles() {
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

function useModel(articles) {
  return useMemo(() => {
    const sorted = [...articles].filter((a) => a.year).sort((a, b) => a.year - b.year)
    const byTopic = Object.entries(TOPICS)
      .sort(([, a], [, b]) => a.order - b.order)
      .map(([key, item]) => {
        const items = sorted.filter((article) => article.topic === key)
        return { key, meta: item, items }
      })
      .filter((group) => group.items.length)
    const bySlug = new Map(articles.map((article) => [article.slug, article]))
    const years = sorted.map((article) => article.year)
    return {
      sorted,
      byTopic,
      bySlug,
      minYear: years.length ? Math.min(...years) : 1943,
      maxYear: years.length ? Math.max(...years) : 2026,
    }
  }, [articles])
}

function MiniPaper({ article, dense = false }) {
  if (!article) return null
  const { concept, gist } = splitTitle(article.title)
  return (
    <a className={`bbs-paper ${dense ? 'dense' : ''}`} href={article.path} style={{ '--topic': meta(article.topic).color }}>
      <span>{article.year}</span>
      <strong>{concept}</strong>
      {!dense && gist && <em>{gist}</em>}
    </a>
  )
}

function RiverDemo({ model }) {
  const decades = [1940, 1950, 1960, 1970, 1980, 1990, 2000, 2010, 2020]
  return (
    <section className="bbs-demo river-demo">
      <DemoHead eyebrow="01 / Genealogy Map" title="七条问题之河" text="年份不是主角，问题才是主角。七条河流从 1943 流到 2026，节点越密，说明那个问题越被时代反复追问。" />
      <div className="river-scene">
        <div className="river-sky"><span>1943</span><span>2026</span></div>
        <div className="river-delta" aria-hidden="true">
          <i /><i /><i />
        </div>
        <div className="river-years" aria-hidden="true">
          {decades.map((year) => <span key={year}>{year}</span>)}
        </div>
        {model.byTopic.map((group) => (
          <div className="river-stream" key={group.key} style={{ '--topic': group.meta.color, '--count': group.items.length }}>
            <div className="river-label"><span>{group.meta.mark}</span>{group.meta.name}</div>
            <div className="river-water">
              <b className="river-current" />
              <b className="river-bank top" />
              <b className="river-bank bottom" />
              {group.items.map((article) => {
                const left = ((article.year - model.minYear) / Math.max(1, model.maxYear - model.minYear)) * 100
                return (
                  <a key={article.slug} className="river-node" href={article.path} style={{ left: `${left}%` }} title={splitTitle(article.title).concept}>
                    <span>{article.year}</span>
                  </a>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function MuseumDemo({ model }) {
  return (
    <section className="bbs-demo museum-demo">
      <DemoHead eyebrow="02 / Exhibition" title="心智博物馆" text="每个主题是一个展厅。用户先理解这个展厅在追问什么，再进入代表论文。" />
      <div className="museum-scene">
        <div className="museum-ceiling" aria-hidden="true"><i /><i /><i /></div>
        <div className="museum-floor" aria-hidden="true" />
        <div className="museum-corridor">
          {model.byTopic.map((group, index) => (
            <article className="museum-gallery" key={group.key} style={{ '--topic': group.meta.color, '--slot': index }}>
              <div className="gallery-door">
                <span className="room-mark">{group.meta.mark}</span>
                <h3>{group.meta.en}</h3>
              </div>
              <div className="gallery-plinth">
                <p>{group.meta.name}展厅 · {group.items.length} 件展品</p>
                <MiniPaper article={group.items[Math.floor(group.items.length / 2)]} dense />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function QuestDemo({ model }) {
  return (
    <section className="bbs-demo quest-demo">
      <DemoHead eyebrow="03 / Learning Quests" title="问题任务树" text="不问用户想看哪篇论文，先问他想解决哪个问题。论文成为路径上的证据。" />
      <div className="quest-tree">
        <div className="quest-trunk">
          <span>Mind</span>
          <strong>核心问题</strong>
        </div>
        {QUESTS.map((quest, index) => (
          <article className="quest-branch" key={quest.q} style={{ '--topic': meta(quest.topic).color, '--side': index % 2 === 0 ? -1 : 1 }}>
            <span className="quest-num">Quest 0{index + 1}</span>
            <h3>{quest.q}</h3>
            <div className="quest-steps">
              {quest.slugs.map((slug) => <MiniPaper key={slug} article={model.bySlug.get(slug)} dense />)}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function StarDemo({ model }) {
  const featured = model.sorted.filter((_, index) => index % 3 === 0).slice(0, 18)
  return (
    <section className="bbs-demo star-demo">
      <DemoHead eyebrow="04 / Constellation" title="思想星图" text="论文是星体，主题是星座。适合强调跨学科连接与关键节点的影响力。" />
      <div className="star-field">
        <div className="star-nebula" aria-hidden="true" />
        <div className="star-horizon" aria-hidden="true" />
        {model.byTopic.map((group, index) => (
          <div key={group.key} className="star-cluster" style={{ '--topic': group.meta.color, '--x': `${16 + (index % 4) * 22}%`, '--y': `${18 + Math.floor(index / 4) * 38}%` }}>
            <span>{group.meta.name}</span>
            <i /><i /><i />
          </div>
        ))}
        {featured.map((article, index) => (
          <a key={article.slug} className="star" href={article.path} title={splitTitle(article.title).concept} style={{ '--topic': meta(article.topic).color, '--x': `${8 + (index * 19) % 84}%`, '--y': `${14 + (index * 29) % 72}%`, '--s': `${8 + (index % 4) * 3}px` }} />
        ))}
      </div>
    </section>
  )
}

function BookDemo({ model }) {
  return (
    <section className="bbs-demo book-demo">
      <DemoHead eyebrow="05 / Moving Book" title="一本会动的思想书" text="把网站变成目录清晰的长书。适合建立作者感和阅读秩序。" />
      <div className="book-scene">
        <div className="book-shadow" aria-hidden="true" />
        <aside className="book-cover">
          <span>Contents</span>
          <strong>Mind as a Problem</strong>
          <em>Brain & Bytes</em>
        </aside>
        <div className="book-spread">
          <div className="book-spine" aria-hidden="true" />
          <div className="book-page left">
            <h3>目录</h3>
            {CHAPTERS.slice(0, 4).map((chapter, index) => (
              <a key={chapter.title} href="#book-demo">
                <span>0{index + 1}</span>
                {chapter.title}
              </a>
            ))}
          </div>
          <div className="book-page right">
          {CHAPTERS.map((chapter, index) => {
            const sample = model.byTopic.find((group) => group.key === chapter.topic)?.items[index % 3]
            return (
              <article key={chapter.title} style={{ '--topic': meta(chapter.topic).color }}>
                <span>Chapter {index + 1} · {chapter.years}</span>
                <h3>{chapter.title}</h3>
                <MiniPaper article={sample} dense />
              </article>
            )
          })}
          </div>
        </div>
      </div>
    </section>
  )
}

function ArenaDemo({ model }) {
  const pairs = [
    ['what-is-it-like-to-be-a-bat', 'integrated-information-theory', '主观体验 vs 可计算度量'],
    ['libet-readiness-potential', 'neuroscience-of-volition', '自由意志 vs 神经预备'],
    ['predictive-coding-visual-cortex', 'deep-nets-visual-cortex', '脑的理论 vs 模型的表现'],
  ]
  return (
    <section className="bbs-demo arena-demo">
      <DemoHead eyebrow="06 / Argument Arena" title="辩论场" text="把论文排成观点冲突，而不是按年份排。适合意识、自由意志、预测脑这些天然有争议的主题。" />
      <div className="arena-scene">
        <div className="arena-stands" aria-hidden="true">
          <i /><i /><i />
        </div>
        {pairs.map(([a, b, title]) => (
          <article className="arena-pair" key={title}>
            <div className="arena-podium left">
            <MiniPaper article={model.bySlug.get(a)} dense />
            </div>
            <strong>{title}</strong>
            <div className="arena-podium right">
            <MiniPaper article={model.bySlug.get(b)} dense />
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function LabDemo({ model }) {
  const labTopics = ['electrophysiology', 'perception', 'memory', 'decision']
  return (
    <section className="bbs-demo lab-demo">
      <DemoHead eyebrow="07 / Mechanism Lab" title="实验台" text="从实验机制进入：电压钳、视觉皮层、海马、决策变量。适合把论文读成可操作的科学装置。" />
      <div className="lab-room">
        <div className="lab-shelf" aria-hidden="true"><i /><i /><i /><i /></div>
        <div className="lab-bench">
        {labTopics.map((topic) => {
          const group = model.byTopic.find((item) => item.key === topic)
          if (!group) return null
          return (
            <article className="lab-station" key={topic} style={{ '--topic': group.meta.color }}>
              <div className="lab-scope"><i /><i /><i /><b /></div>
              <h3>{group.meta.name}实验台</h3>
              <MiniPaper article={group.items[0]} dense />
            </article>
          )
        })}
        </div>
      </div>
    </section>
  )
}

function DemoHead({ eyebrow, title, text }) {
  return (
    <header className="bbs-demo-head">
      <span>{eyebrow}</span>
      <h2>{title}</h2>
      <p>{text}</p>
    </header>
  )
}

const RENDERERS = {
  river: RiverDemo,
  museum: MuseumDemo,
  quest: QuestDemo,
  star: StarDemo,
  book: BookDemo,
  arena: ArenaDemo,
  lab: LabDemo,
}

export function BrainBytesShowcasePage() {
  const { articles, loading } = useArticles()
  const model = useModel(articles)
  const [active, setActive] = useState('river')
  const ActiveDemo = RENDERERS[active]

  return (
    <main className="bbs-root">
      <nav className="bbs-top">
        <Link to="/brain-bytes-showcase" className="bbs-wordmark">知觉方案室</Link>
        <div>
          <Link to="/brain-bytes-demo">当前 Demo</Link>
          <Link to="/brain-bytes">旧版列表</Link>
          <Link to="/">主站</Link>
        </div>
      </nav>

      <aside className="bbs-sidebar">
        <p>7 个 Demo</p>
        {DEMOS.map((demo) => (
          <button
            key={demo.id}
            className={active === demo.id ? 'active' : ''}
            data-demo={demo.id}
            aria-pressed={active === demo.id}
            onClick={() => setActive(demo.id)}
          >
            <span>{demo.tag}</span>
            {demo.name}
          </button>
        ))}
      </aside>

      <section className="bbs-stage">
        <header className="bbs-hero">
          <span>Brain & Bytes · 56 papers · 1943-2026</span>
          <h1>同一批论文，七种网站骨架。</h1>
          <p>这里不是最终设计，而是信息架构原型：看哪一种最能让“心智科学谱系”从文章陈列里长出来。</p>
        </header>

        {loading ? <div className="bbs-loading">正在读取论文档案...</div> : <ActiveDemo model={model} />}
      </section>
    </main>
  )
}
