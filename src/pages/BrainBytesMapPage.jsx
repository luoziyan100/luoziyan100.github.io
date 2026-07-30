/**
 * [INPUT]: 依赖 react hooks、fetch /brain-bytes/cognitive-map.json、brain-bytes-cognitive-map.js Three 场景
 * [OUTPUT]: BrainBytesMapPage 页面组件（/brain-bytes-map），3D 认知地图 + 时间轴 + 点选卡片
 * [POS]: pages/ 的 Flomo 风格认知地图实验页；数据由 scripts/generate-cognitive-map.js 预计算
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import { useEffect, useRef, useState } from 'react'
import { createCognitiveMapScene } from './brain-bytes-cognitive-map.js'
import './brain-bytes-map.css'

const MAP_PATH = '/brain-bytes/cognitive-map.json'

export function BrainBytesMapPage() {
  const canvasRef = useRef(null)
  const sceneRef = useRef(null)
  const playTimerRef = useRef(null)
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')
  const [mapData, setMapData] = useState(null)
  const [year, setYear] = useState(null)
  const [playing, setPlaying] = useState(false)
  const [selected, setSelected] = useState(null)
  const [peakLabels, setPeakLabels] = useState([])

  useEffect(() => {
    document.title = 'Brain & Bytes · Cognitive Map'
  }, [])

  useEffect(() => {
    let cancelled = false
    setStatus('loading')
    fetch(MAP_PATH)
      .then((response) => {
        if (!response.ok) throw new Error(`map ${response.status}`)
        return response.json()
      })
      .then((data) => {
        if (cancelled) return
        setMapData(data)
        setYear(data.yearRange?.max ?? null)
        setStatus('ready')
      })
      .catch((err) => {
        if (cancelled) return
        setError(err.message || 'Failed to load cognitive map')
        setStatus('error')
      })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (status !== 'ready' || !mapData || !canvasRef.current) return undefined
    const scene = createCognitiveMapScene(canvasRef.current, mapData, {
      onSelect: setSelected,
      onPeakLabels: setPeakLabels,
    })
    sceneRef.current = scene
    const onResize = () => scene.resize()
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      scene.dispose()
      sceneRef.current = null
    }
  }, [mapData, status])

  useEffect(() => {
    if (year == null || !sceneRef.current) return
    sceneRef.current.setYear(year)
  }, [year])

  useEffect(() => {
    if (!playing || !mapData?.yearRange) return undefined
    const { min, max } = mapData.yearRange
    playTimerRef.current = window.setInterval(() => {
      setYear((current) => {
        const next = (current ?? min) + 1
        if (next > max) {
          setPlaying(false)
          return max
        }
        return next
      })
    }, 700)
    return () => {
      window.clearInterval(playTimerRef.current)
      playTimerRef.current = null
    }
  }, [playing, mapData])

  const minYear = mapData?.yearRange?.min ?? 0
  const maxYear = mapData?.yearRange?.max ?? 0
  const visibleCount = mapData?.nodes?.filter((node) => !node.year || node.year <= year)?.length ?? 0

  return (
    <main className="bbmap-root">
      <header className="bbmap-top">
        <div>
          <p className="bbmap-kicker">Brain &amp; Bytes</p>
          <h1>Cognitive Map</h1>
        </div>
        <p className="bbmap-meta">
          {status === 'ready'
            ? `${visibleCount} / ${mapData.nodes.length} papers · ${year}`
            : status === 'error'
              ? error
              : 'loading map…'}
        </p>
      </header>

      <div className="bbmap-stage">
        <canvas ref={canvasRef} className="bbmap-canvas" />
        <div className="bbmap-peak-layer" aria-hidden="true">
          {peakLabels.filter((peak) => peak.visible).map((peak) => (
            <span
              key={peak.id}
              className="bbmap-peak-label"
              style={{ left: peak.sx, top: peak.sy }}
            >
              {peak.label}
            </span>
          ))}
        </div>

        {selected ? (
          <aside className="bbmap-card" aria-label="selected paper">
            <button
              className="bbmap-card-close"
              type="button"
              onClick={() => {
                setSelected(null)
                sceneRef.current?.setSelectedId(null)
              }}
              aria-label="关闭"
            >
              ×
            </button>
            <p className="bbmap-card-year">{selected.year} · {selected.topic}</p>
            <h2>{selected.title}</h2>
            <p className="bbmap-card-paper">{selected.paper}</p>
            <a className="bbmap-card-link" href={selected.path} target="_blank" rel="noreferrer">
              打开精读 →
            </a>
          </aside>
        ) : null}
      </div>

      <footer className="bbmap-controls">
        <button
          className="bbmap-play"
          type="button"
          disabled={status !== 'ready'}
          onClick={() => {
            if (!mapData?.yearRange) return
            if (playing) {
              setPlaying(false)
              return
            }
            if (year >= mapData.yearRange.max) setYear(mapData.yearRange.min)
            setPlaying(true)
          }}
        >
          {playing ? '暂停足迹' : '播放足迹'}
        </button>
        <label className="bbmap-year">
          <span>{year ?? '----'}</span>
          <input
            type="range"
            min={minYear}
            max={maxYear}
            value={year ?? maxYear}
            disabled={status !== 'ready'}
            onChange={(event) => {
              setPlaying(false)
              setYear(Number(event.target.value))
            }}
          />
        </label>
        <p className="bbmap-hint">拖拽旋转 · 滚轮缩放 · 点击山峰上的点</p>
      </footer>
    </main>
  )
}
