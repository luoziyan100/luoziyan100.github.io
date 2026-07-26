/**
 * [INPUT]: 目标 canvas 元素；无外部依赖
 * [OUTPUT]: createShoalField(canvas) → { start, stop, resize }，在画布上渲染六重雪花 + 七鱼（原式公式）
 * [POS]: pages/brain-bytes-os 的生成式世界背景引擎，被 BrainBytesField.jsx 消费；Field Lab 的 G 方案同源逻辑
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

const TAU = Math.PI * 2
/** 七条鱼：每份原式点云只裁切主体，避免一整幅「鱼群」叠成十几条 */
const FISH_COUNT = 7
/** 单层鱼形态占幅更大，裁切略放宽 */
const FISH_CROP = { x: 40, y: 30, size: 320 }

function createFlakeBuffers() {
  const size = 400
  const off = document.createElement('canvas')
  off.width = size
  off.height = size
  return {
    off,
    octx: off.getContext('2d', { alpha: true }),
    size,
    time: 0,
  }
}

/**
 * 原作 c 里有 (i%2)*8，会画出交错的「一对」鱼。
 * parity: 0 或 1，只取其中一层 → 每槽位一条，也减半算力。
 */
function rasterizeFish(fishCtx, time, imageData, parity = 0) {
  const size = 400
  const data = imageData.data
  data.fill(0)
  const bump = 96

  for (let i = 20000; i--;) {
    if ((i & 1) !== parity) continue
    const y = i / 600
    let k = Math.cos(y * 7) * (y < 19 ? Math.sin(time / 8 + y * 8) * 31 : 9)
    if (k === 0) k = 1e-9
    const e = y / 8 - 13
    let o = Math.hypot(k, e) / 5
    if (o === 0) o = 1e-9
    const q = 59 + Math.cos(y) / k + (k / o) * 3 * (2 + Math.sin(o * 3 - e * 9 - time))
    // 单层时不再加 (i%2)*8，避免又分裂出第二条
    const c = o / 2 - e / 6 - time / 8
    const px = (q * Math.sin(c) + 200 + 0.5) | 0
    const py = (200 + q * Math.cos(c) - 99 * Math.sin(c / 3) + 0.5) | 0
    if (px < 0 || py < 0 || px >= size || py >= size) continue
    const idx = (py * size + px) * 4
    data[idx] = 255
    data[idx + 1] = 255
    data[idx + 2] = 255
    data[idx + 3] = data[idx + 3] + bump > 255 ? 255 : data[idx + 3] + bump
  }

  fishCtx.putImageData(imageData, 0, 0)
}

function paintFlake(ctx, flake, width, height, dpr, {
  cover = 0.44,
  cx = width * 0.5,
  cy = height * 0.5,
  alpha = 0.9,
} = {}) {
  flake.time += Math.PI / 240
  const m = 200
  const { off, octx, size } = flake

  octx.setTransform(1, 0, 0, 1, 0, 0)
  octx.clearRect(0, 0, size, size)
  octx.fillStyle = 'rgba(255, 255, 255, 0.18)'

  for (let i = 20000; --i > 6;) {
    const k = (i % 25) - 12
    const e = i / 800
    const d = 7 * Math.cos(Math.hypot(k, e) / 3 + flake.time / 2)
    const x = k * 4 + d * k * Math.sin(d + e / 9 + flake.time) + m
    const y = e * 2 - d * 9 - d * 9 * Math.cos(d + flake.time) + m
    octx.fillRect(x, y, 1.15, 1.15)
  }

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  const scale = (Math.min(width, height) * cover) / size
  ctx.save()
  ctx.globalAlpha = alpha
  for (let r = 0; r < 6; r += 1) {
    ctx.save()
    ctx.translate(cx, cy)
    ctx.rotate((r * Math.PI) / 3)
    ctx.scale(scale, scale)
    ctx.drawImage(off, -m, -m)
    ctx.restore()
  }
  ctx.restore()
}

function createFish(index, width, height) {
  const side = Math.min(width, height)
  const cx = width * 0.5
  const cy = height * 0.5
  const a = ((index + 1) / 8) * TAU + Math.random() * 0.35
  const r = side * (0.26 + Math.random() * 0.12)
  const canvas = document.createElement('canvas')
  canvas.width = 400
  canvas.height = 400
  const homeX = cx + Math.cos(a) * r
  const homeY = cy + Math.sin(a) * r
  return {
    canvas,
    ctx: canvas.getContext('2d', { alpha: true }),
    imageData: null,
    // 七条都用同一 parity 层，形态一致；靠 t / 位置区分
    parity: 0,
    x: homeX,
    y: homeY,
    homeX,
    homeY,
    time: Math.random() * 80,
    timeStep: Math.PI / 30,
    driftPhase: Math.random() * TAU,
    driftSpeed: 0.004 + Math.random() * 0.003,
    driftRadius: 6 + Math.random() * 10,
    ready: false,
  }
}

function ensureFishImageData(fish) {
  if (!fish.imageData) {
    fish.imageData = fish.ctx.createImageData(400, 400)
  }
}

/**
 * 挂到目标 canvas，返回控制句柄。
 * 性能：每帧只完整重绘 1 条鱼（轮询），其余用缓存帧；雪花每帧更新。
 */
export function createShoalField(canvas) {
  const ctx = canvas.getContext('2d', { alpha: false })
  let width = 0
  let height = 0
  let dpr = 1
  let raf = 0
  let running = false
  let frame = 0
  let flake = createFlakeBuffers()
  let fishes = []

  function layoutFishHomes() {
    const side = Math.min(width, height)
    const cx = width * 0.5
    const cy = height * 0.5
    for (let i = 0; i < fishes.length; i += 1) {
      const fish = fishes[i]
      const a = ((i + 1) / 8) * TAU + i * 0.11
      const r = side * (0.26 + (i % 3) * 0.04)
      fish.homeX = cx + Math.cos(a) * r
      fish.homeY = cy + Math.sin(a) * r
      fish.x = fish.homeX
      fish.y = fish.homeY
    }
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    width = canvas.clientWidth || window.innerWidth
    height = canvas.clientHeight || window.innerHeight
    canvas.width = Math.max(1, Math.floor(width * dpr))
    canvas.height = Math.max(1, Math.floor(height * dpr))
    if (!fishes.length) {
      fishes = Array.from({ length: FISH_COUNT }, (_, i) => createFish(i, width, height))
    }
    layoutFishHomes()
  }

  function stepFishMotion(fish) {
    fish.time += fish.timeStep
    fish.driftPhase += fish.driftSpeed
    fish.x = fish.homeX + Math.cos(fish.driftPhase) * fish.driftRadius
    fish.y = fish.homeY + Math.sin(fish.driftPhase * 0.87) * fish.driftRadius * 0.65
  }

  function draw(frozen = false) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.fillStyle = '#090909'
    ctx.fillRect(0, 0, width, height)

    paintFlake(ctx, flake, width, height, dpr, {
      cover: 0.44,
      cx: width * 0.5,
      cy: height * 0.5,
      alpha: 0.9,
    })

    const side = Math.min(width, height)
    // 按裁切窗口映射到屏幕，使每槽位读成「一条」而非一整群
    const fishScale = (side * 0.22) / FISH_CROP.size

    // 轮询刷新一条鱼的光栅，控制主线程成本
    if (!frozen && fishes.length) {
      const idx = frame % fishes.length
      const dirty = fishes[idx]
      ensureFishImageData(dirty)
      rasterizeFish(dirty.ctx, dirty.time, dirty.imageData, dirty.parity)
      dirty.ready = true
    }

    for (let i = 0; i < fishes.length; i += 1) {
      const fish = fishes[i]
      if (!frozen) stepFishMotion(fish)
      if (!fish.ready) {
        ensureFishImageData(fish)
        rasterizeFish(fish.ctx, fish.time, fish.imageData, fish.parity)
        fish.ready = true
      }
      const drawSize = FISH_CROP.size * fishScale
      ctx.drawImage(
        fish.canvas,
        FISH_CROP.x,
        FISH_CROP.y,
        FISH_CROP.size,
        FISH_CROP.size,
        fish.x - drawSize / 2,
        fish.y - drawSize / 2,
        drawSize,
        drawSize,
      )
    }
  }

  function tick() {
    if (!running) return
    const reduced = typeof window.matchMedia === 'function'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced && frame > 1) {
      raf = window.requestAnimationFrame(tick)
      return
    }
    frame += 1
    draw(false)
    raf = window.requestAnimationFrame(tick)
  }

  function start() {
    if (running) return
    running = true
    resize()
    // 首帧把七条鱼都烤一遍，避免空白
    for (const fish of fishes) {
      ensureFishImageData(fish)
      rasterizeFish(fish.ctx, fish.time, fish.imageData, fish.parity)
      fish.ready = true
    }
    draw(false)
    raf = window.requestAnimationFrame(tick)
  }

  function stop() {
    running = false
    if (raf) window.cancelAnimationFrame(raf)
    raf = 0
  }

  return { start, stop, resize }
}
