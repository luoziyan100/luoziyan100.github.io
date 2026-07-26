/**
 * [INPUT]: 依赖 brain-bytes-shoal-field.js 的 createShoalField
 * [OUTPUT]: BrainBytesField 默认导出组件，全屏 canvas 渲染雪花七鱼世界背景
 * [POS]: pages/brain-bytes-os 的生成式背景层，被 BrainBytesOSPage 在 WORLD_VARIANT='field' 时挂载，替代地球视频
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import { useEffect, useRef } from 'react'
import { createShoalField } from './brain-bytes-shoal-field.js'

export default function BrainBytesField() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined

    const field = createShoalField(canvas)
    field.start()

    const onResize = () => field.resize()
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
      field.stop()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="bbos-world-field"
      aria-hidden="true"
    />
  )
}
