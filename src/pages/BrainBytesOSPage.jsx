/**
 * [INPUT]: 懒加载 BrainBytesField.jsx 雪花鱼群背景（默认）与 BrainBytesGlobe.jsx 可回退行星，依赖 brain-bytes-terminal.js、/brain-bytes/index.json、brain-bytes-os.css、brain-bytes-os-windows.css、光束转场视频与像素书素材；视频世界保留可回退
 * [OUTPUT]: BrainBytesOSPage 页面组件（/brain-bytes-os），提供逐字打出的终端启动、光束载入、生成式雪花鱼群世界（可回退视频/行星）、会话内可拖拽主题书、主题/文章窗口与左下角 Connect 联系窗
 * [POS]: pages/ 的 Brain & Bytes 主体叙事入口，用 typewriter terminal -> booting -> world 的状态机承载生成式档案世界，视频与 Three 行星保留为 WORLD_VARIANT 回退
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ExternalLink } from 'lucide-react'
import {
  TERMINAL_LINE_STEP_MS,
  getTerminalLineTotal,
  getVisibleTerminalRows,
} from './brain-bytes-terminal.js'
import './brain-bytes-os.css'
import './brain-bytes-os-windows.css'

const BOOK_ROOT = '/brain-bytes-os/assets/books'
const ARTICLE_INDEX_PATH = '/brain-bytes/index.json'
/** field=雪花七鱼（默认）| video=旧地球视频 | planet=Three 行星 */
const WORLD_VARIANT = 'field'
const WORLD_VIDEO_SRC = '/brain-bytes-os/assets/worlds/orbital-archive-wide-cover.mp4'
const WORLD_VIDEO_POSTER = '/brain-bytes-os/assets/worlds/orbital-archive-wide-cover-poster.jpg'
const LAUNCH_VIDEO_SRC = '/brain-bytes-os/assets/transitions/orbital-light-burst.mp4'
const LAUNCH_VIDEO_POSTER = '/brain-bytes-os/assets/transitions/orbital-light-burst-poster.jpg'
const LAUNCH_DURATION_MS = 2400
const InteractiveGlobe = lazy(() => import('./BrainBytesGlobe'))
const GenerativeField = lazy(() => import('./BrainBytesField'))

const CONNECT_LINKS = [
  {
    id: 'github',
    label: 'GitHub',
    detail: 'luoziyan100',
    href: 'https://github.com/luoziyan100',
  },
  {
    id: 'woshipm',
    label: '人人都是产品经理',
    detail: 'woshipm.com/u/1615096',
    href: 'https://www.woshipm.com/u/1615096',
  },
  {
    id: 'email',
    label: 'Email',
    detail: 'zluo5820@gmail.com',
    href: 'mailto:zluo5820@gmail.com',
  },
]

const TOPICS = [
  {
    id: 'computation',
    name: 'Computation',
    book: `${BOOK_ROOT}/computation.png`,
    color: '#f5cf65',
    position: { x: 72, y: 14, scale: .88 },
  },
  {
    id: 'perception',
    name: 'Perception',
    book: `${BOOK_ROOT}/perception.png`,
    color: '#4fd6ff',
    position: { x: 84, y: 14, scale: .9 },
  },
  {
    id: 'prediction',
    name: 'Prediction',
    book: `${BOOK_ROOT}/prediction.png`,
    color: '#a7eb7c',
    position: { x: 94, y: 14, scale: .88 },
  },
  {
    id: 'memory',
    name: 'Memory',
    book: `${BOOK_ROOT}/memory.png`,
    color: '#ef8a60',
    position: { x: 72, y: 32, scale: .88 },
  },
  {
    id: 'decision',
    name: 'Decision',
    book: `${BOOK_ROOT}/decision.png`,
    color: '#42d17a',
    position: { x: 84, y: 32, scale: .94 },
  },
  {
    id: 'consciousness',
    name: 'Consciousness',
    book: `${BOOK_ROOT}/consciousness.png`,
    color: '#74e8ff',
    position: { x: 94, y: 32, scale: .86 },
  },
  {
    id: 'electrophysiology',
    name: 'Electrophysiology',
    book: `${BOOK_ROOT}/electrophysiology.png`,
    color: '#ff9f7e',
    position: { x: 84, y: 50, scale: .86 },
  },
]

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

const createDragOffsets = () => Object.fromEntries(
  TOPICS.map((topic) => [topic.id, { x: 0, y: 0 }]),
)

const sortArticles = (articles) => [...articles].sort((left, right) => {
  const yearDelta = (right.year || 0) - (left.year || 0)
  if (yearDelta !== 0) return yearDelta
  return left.title.localeCompare(right.title)
})

const groupArticlesByTopic = (articles) => TOPICS.reduce((groups, topic) => {
  groups[topic.id] = sortArticles(articles.filter((article) => article.topic === topic.id))
  return groups
}, {})

const getArticleHtmlPath = (article) => {
  const path = article.path || `/brain-bytes/${article.slug}/`
  if (path.endsWith('.html')) return path
  return `${path.replace(/\/?$/, '/')}index.html`
}

function nextDragOffset(event, drag) {
  const rawX = event.clientX - drag.startX
  const rawY = event.clientY - drag.startY
  return {
    x: drag.originX + clamp(rawX, drag.minDeltaX, drag.maxDeltaX),
    y: drag.originY + clamp(rawY, drag.minDeltaY, drag.maxDeltaY),
  }
}

function getDragBounds(event, origin) {
  const bookRect = event.currentTarget.getBoundingClientRect()
  const space = event.currentTarget.closest('.bbos-space')
  const frameRect = space.getBoundingClientRect()
  const margin = 10
  return {
    minDeltaX: frameRect.left + margin - bookRect.left,
    maxDeltaX: frameRect.right - margin - bookRect.right,
    minDeltaY: frameRect.top + margin - bookRect.top,
    maxDeltaY: frameRect.bottom - margin - bookRect.bottom,
    originX: origin.x,
    originY: origin.y,
  }
}

function useTerminalTyping(enabled) {
  const lineTotal = useMemo(() => getTerminalLineTotal(), [])
  const [visibleLines, setVisibleLines] = useState(0)
  const rows = useMemo(() => getVisibleTerminalRows(visibleLines), [visibleLines])
  const finish = useCallback(() => setVisibleLines(lineTotal), [lineTotal])

  useEffect(() => {
    if (!enabled || visibleLines >= lineTotal) return undefined
    const timer = window.setTimeout(() => {
      setVisibleLines((current) => Math.min(current + 1, lineTotal))
    }, TERMINAL_LINE_STEP_MS)
    return () => window.clearTimeout(timer)
  }, [enabled, lineTotal, visibleLines])

  return {
    complete: visibleLines >= lineTotal,
    finish,
    rows,
  }
}

function TerminalLine({ row }) {
  const isCommand = row.kind === 'command'
  return (
    <p className={`bbos-terminal-line ${isCommand ? '' : 'out'} ${row.text ? 'has-text' : 'is-empty'}`}>
      {isCommand && (row.text || row.cursor) ? (
        <>
          <b>$</b>{row.text.slice(1)}
        </>
      ) : row.text}
      {row.cursor ? <span className="terminal-cursor" /> : null}
    </p>
  )
}

function BootTerminal({ onLaunch, launching, terminalRows }) {
  return (
    <section
      className={`bbos-terminal-gate ${launching ? 'is-launching' : ''}`}
      aria-label="Brain & Bytes terminal launcher"
      aria-busy={launching}
    >
      {/* 转场阶段直接卸掉终端，不做淡出，避免光束里透出残影 */}
      {launching ? (
        <div className="bbos-launch-field" aria-hidden="true">
          <video
            src={LAUNCH_VIDEO_SRC}
            poster={LAUNCH_VIDEO_POSTER}
            autoPlay
            muted
            playsInline
            preload="auto"
          />
        </div>
      ) : (
        <button
          className="bbos-laptop"
          type="button"
          onClick={onLaunch}
          aria-label="进入 Brain & Bytes OS"
        >
          <div className="bbos-laptop-screen">
            <div className="bbos-termbar">
              <i /><i /><i />
              <span>brain@bytes - zsh</span>
            </div>
            <div className="bbos-terminal-lines">
              {terminalRows.map((row, index) => (
                <TerminalLine row={row} key={`${row.kind}-${index}`} />
              ))}
            </div>
          </div>
          <div className="bbos-laptop-base" />
        </button>
      )}
    </section>
  )
}

function BookNode({ topic, active, dragging, dragOffset, onPointerDown, onSelect }) {
  return (
    <button
      className={`bbos-book ${active ? 'is-selected' : ''} ${dragging ? 'is-dragging' : ''}`}
      type="button"
      onClick={(event) => onSelect(topic.id, event)}
      onPointerDown={(event) => onPointerDown(event, topic.id)}
      style={{
        '--x': `${topic.position.x}%`,
        '--y': `${topic.position.y}%`,
        '--scale': topic.position.scale,
        '--topic': topic.color,
        '--drag-x': `${dragOffset.x}px`,
        '--drag-y': `${dragOffset.y}px`,
      }}
      aria-label={`Move or select ${topic.name} book`}
    >
      <span className="bbos-book-aura" aria-hidden="true" />
      <img src={topic.book} alt="" draggable="false" />
      <span className="bbos-book-label">{topic.name}</span>
    </button>
  )
}

function WindowDots({ onClose, closeLabel }) {
  return (
    <span className="bbos-window-dots" aria-hidden={!onClose}>
      {onClose ? (
        <button
          className="bbos-window-dot is-close"
          type="button"
          onClick={onClose}
          aria-label={closeLabel}
        />
      ) : (
        <i className="bbos-window-dot" />
      )}
      <i className="bbos-window-dot" />
      <i className="bbos-window-dot" />
    </span>
  )
}

function HtmlFileIcon() {
  return (
    <span className="bbos-html-file" aria-hidden="true">
      <span>.html</span>
    </span>
  )
}

function TopicArchiveWindow({ topic, articles, status, error, onClose, onOpenArticle }) {
  if (!topic) return null

  const isLoading = status === 'loading'
  const hasArticles = articles.length > 0

  return (
    <aside className="bbos-window bbos-topic-window" aria-label={`${topic.name} article list`}>
      <div className="bbos-window-bar">
        <WindowDots onClose={onClose} closeLabel="关闭主题列表" />
        <strong>{topic.name}.archive</strong>
      </div>
      <div className="bbos-topic-window-body">
        <div className="bbos-topic-window-head">
          <img src={topic.book} alt="" draggable="false" />
          <div>
            <p>{topic.name}</p>
            <span>{isLoading ? 'loading html files' : `${articles.length} html files`}</span>
          </div>
        </div>
        {isLoading ? (
          <p className="bbos-window-state">scanning /brain-bytes/index.json</p>
        ) : error ? (
          <p className="bbos-window-state is-error">{error}</p>
        ) : hasArticles ? (
          <div className="bbos-article-list" role="list">
            {articles.map((article) => (
              <button
                className="bbos-article-row"
                type="button"
                role="listitem"
                key={article.slug}
                onClick={() => onOpenArticle(article)}
              >
                <HtmlFileIcon />
                <span className="bbos-article-row-copy">
                  <strong>{article.title}</strong>
                  <span>{article.year || '----'} · {article.slug}.html</span>
                </span>
              </button>
            ))}
          </div>
        ) : (
          <p className="bbos-window-state">No html files in this archive yet.</p>
        )}
      </div>
    </aside>
  )
}

function ArticleReaderWindow({ article, onClose }) {
  if (!article) return null
  const articlePath = getArticleHtmlPath(article)

  return (
    <aside className="bbos-window bbos-reader-window" aria-label={`${article.title} reader`}>
      <div className="bbos-window-bar">
        <WindowDots onClose={onClose} closeLabel="关闭文章窗口" />
        <strong>{article.slug}.html</strong>
        <span className="bbos-window-spacer" />
        <a
          className="bbos-window-icon-button"
          href={articlePath}
          target="_blank"
          rel="noreferrer"
          aria-label="在新页面打开文章"
        >
          <ExternalLink size={15} strokeWidth={2.4} />
        </a>
      </div>
      <iframe className="bbos-reader-frame" src={articlePath} title={article.title} />
    </aside>
  )
}

function ConnectWindow({ open, onClose }) {
  if (!open) return null

  return (
    <aside id="bbos-connect-window" className="bbos-window bbos-connect-window" aria-label="Connect">
      <div className="bbos-window-bar">
        <WindowDots onClose={onClose} closeLabel="关闭 Connect" />
        <strong>connect.txt</strong>
      </div>
      <div className="bbos-connect-window-body">
        <p className="bbos-connect-window-lead">找到我</p>
        <div className="bbos-connect-list" role="list">
          {CONNECT_LINKS.map((link) => (
            <a
              className="bbos-connect-row"
              key={link.id}
              role="listitem"
              href={link.href}
              target={link.href.startsWith('mailto:') ? undefined : '_blank'}
              rel={link.href.startsWith('mailto:') ? undefined : 'noreferrer'}
            >
              <span className="bbos-connect-row-copy">
                <strong>{link.label}</strong>
                <span>{link.detail}</span>
              </span>
              <ExternalLink size={14} strokeWidth={2.2} aria-hidden="true" />
            </a>
          ))}
        </div>
      </div>
    </aside>
  )
}

function ThoughtSpace({
  activeTopic,
  openedTopic,
  articleIndexStatus,
  articleIndexError,
  selectedArticle,
  topicArticles,
  dragging,
  dragOffsets,
  connectOpen,
  onToggleConnect,
  onCloseConnect,
  onBookPointerDown,
  onOpenTopic,
  onCloseTopic,
  onOpenArticle,
  onCloseArticle,
}) {
  const isFullBleedWorld = WORLD_VARIANT === 'field' || WORLD_VARIANT === 'video'

  return (
    <section className="bbos-space" aria-label="Brain & Bytes OS 档案空间">
      {WORLD_VARIANT === 'video' ? (
        <video
          className="bbos-world-video"
          src={WORLD_VIDEO_SRC}
          poster={WORLD_VIDEO_POSTER}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
        />
      ) : null}
      {WORLD_VARIANT === 'field' ? (
        <Suspense fallback={<div className="bbos-world-field is-fallback" aria-hidden="true" />}>
          <GenerativeField />
        </Suspense>
      ) : null}
      <div className="bbos-space-top">
        <span>Brain &amp; Bytes OS</span>
        <span>orbital archive</span>
      </div>
      <div className="bbos-cosmos" aria-hidden="true" />
      <div className={`bbos-globe-frame ${isFullBleedWorld ? 'is-video-layout' : 'is-planet-layout'}`}>
        {WORLD_VARIANT === 'planet' ? (
          <Suspense fallback={<div className="bbos-globe-stage" aria-hidden="true" />}>
            <InteractiveGlobe />
          </Suspense>
        ) : null}
        <div className="bbos-books" aria-label="主题书">
          {TOPICS.map((item) => (
            <BookNode
              key={item.id}
              topic={item}
              active={item.id === activeTopic || item.id === openedTopic}
              dragging={dragging?.topicId === item.id}
              dragOffset={dragOffsets[item.id]}
              onPointerDown={onBookPointerDown}
              onSelect={onOpenTopic}
            />
          ))}
        </div>
      </div>
      <button
        className={`bbos-connect-trigger ${connectOpen ? 'is-open' : ''}`}
        type="button"
        onClick={onToggleConnect}
        aria-expanded={connectOpen}
        aria-controls="bbos-connect-window"
      >
        Connect
      </button>
      <ConnectWindow open={connectOpen} onClose={onCloseConnect} />
      <TopicArchiveWindow
        topic={TOPICS.find((topic) => topic.id === openedTopic)}
        articles={topicArticles[openedTopic] || []}
        status={articleIndexStatus}
        error={articleIndexError}
        onClose={onCloseTopic}
        onOpenArticle={onOpenArticle}
      />
      <ArticleReaderWindow article={selectedArticle} onClose={onCloseArticle} />
    </section>
  )
}

export function BrainBytesOSPage() {
  const [activeTopic, setActiveTopic] = useState('decision')
  const [openedTopic, setOpenedTopic] = useState(null)
  const [selectedArticle, setSelectedArticle] = useState(null)
  const [articles, setArticles] = useState([])
  const [articleIndexStatus, setArticleIndexStatus] = useState('idle')
  const [articleIndexError, setArticleIndexError] = useState('')
  const [phase, setPhase] = useState('terminal')
  const [connectOpen, setConnectOpen] = useState(false)
  const [dragging, setDragging] = useState(null)
  const [dragOffsets, setDragOffsets] = useState(createDragOffsets)
  const dragMovedRef = useRef(false)
  const launchTimerRef = useRef(null)
  const topicArticles = useMemo(() => groupArticlesByTopic(articles), [articles])
  const {
    complete: terminalTypingComplete,
    finish: finishTerminalTyping,
    rows: terminalRows,
  } = useTerminalTyping(phase === 'terminal')

  const startLaunch = useCallback(() => {
    if (phase !== 'terminal' || launchTimerRef.current) return
    setPhase('booting')
    const reducedMotion = typeof window.matchMedia === 'function'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    launchTimerRef.current = window.setTimeout(() => {
      launchTimerRef.current = null
      setPhase('world')
    }, reducedMotion ? 180 : LAUNCH_DURATION_MS)
  }, [phase])

  const activateTerminal = useCallback(() => {
    if (!terminalTypingComplete) {
      finishTerminalTyping()
      return
    }
    startLaunch()
  }, [finishTerminalTyping, startLaunch, terminalTypingComplete])

  useEffect(() => {
    document.title = 'Brain & Bytes OS'
  }, [])

  useEffect(() => () => {
    if (launchTimerRef.current) window.clearTimeout(launchTimerRef.current)
  }, [])

  useEffect(() => {
    let cancelled = false
    setArticleIndexStatus('loading')
    setArticleIndexError('')

    fetch(ARTICLE_INDEX_PATH)
      .then((response) => {
        if (!response.ok) throw new Error(`index ${response.status}`)
        return response.json()
      })
      .then((nextArticles) => {
        if (cancelled) return
        setArticles(Array.isArray(nextArticles) ? nextArticles : [])
        setArticleIndexStatus('ready')
      })
      .catch((error) => {
        if (cancelled) return
        setArticleIndexError(error.message || 'Failed to load archive index.')
        setArticleIndexStatus('error')
      })

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (phase !== 'terminal') return undefined
    const onKey = (event) => {
      if (event.key === 'Enter') activateTerminal()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [activateTerminal, phase])

  useEffect(() => {
    if (!dragging) return undefined
    const onMove = (event) => {
      const rawX = event.clientX - dragging.startX
      const rawY = event.clientY - dragging.startY
      if (Math.hypot(rawX, rawY) > 5) dragMovedRef.current = true
      const next = nextDragOffset(event, dragging)
      setDragOffsets((current) => ({
        ...current,
        [dragging.topicId]: next,
      }))
    }
    const onUp = () => setDragging(null)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp, { once: true })
    window.addEventListener('pointercancel', onUp, { once: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
    }
  }, [dragging])

  useEffect(() => {
    if (phase !== 'world') return undefined
    const onKey = (event) => {
      if (event.key !== 'Escape') return
      if (selectedArticle) {
        setSelectedArticle(null)
        return
      }
      if (openedTopic) {
        setOpenedTopic(null)
        return
      }
      if (connectOpen) setConnectOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [connectOpen, openedTopic, phase, selectedArticle])

  const startBookDrag = (event, topicId) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    const origin = dragOffsets[topicId]
    dragMovedRef.current = false
    setActiveTopic(topicId)
    setDragging({
      topicId,
      startX: event.clientX,
      startY: event.clientY,
      ...getDragBounds(event, origin),
    })
  }

  const openTopic = (topicId) => {
    if (dragMovedRef.current) {
      dragMovedRef.current = false
      return
    }
    setActiveTopic(topicId)
    setOpenedTopic(topicId)
    setSelectedArticle(null)
  }

  const openArticle = (article) => {
    setSelectedArticle(article)
  }

  return (
    <main className={`bbos-root phase-${phase}`}>
      {phase === 'world' ? (
        <ThoughtSpace
          activeTopic={activeTopic}
          openedTopic={openedTopic}
          articleIndexStatus={articleIndexStatus}
          articleIndexError={articleIndexError}
          selectedArticle={selectedArticle}
          topicArticles={topicArticles}
          dragging={dragging}
          dragOffsets={dragOffsets}
          connectOpen={connectOpen}
          onToggleConnect={() => setConnectOpen((open) => !open)}
          onCloseConnect={() => setConnectOpen(false)}
          onBookPointerDown={startBookDrag}
          onOpenTopic={openTopic}
          onCloseTopic={() => setOpenedTopic(null)}
          onOpenArticle={openArticle}
          onCloseArticle={() => setSelectedArticle(null)}
        />
      ) : (
        <BootTerminal
          onLaunch={activateTerminal}
          launching={phase === 'booting'}
          terminalRows={terminalRows}
        />
      )}
    </main>
  )
}
