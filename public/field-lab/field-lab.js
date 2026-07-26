/**
 * [INPUT]: 浏览器 Canvas2D，无外部依赖；由 field-lab/index.html 作为 module 加载
 * [OUTPUT]: 七个可切换生成式背景原型（orbital / flow / attractor / hybrid / flake / bloom / shoal）
 * [POS]: public/field-lab 的实验引擎，仅供预览选型，不接入 BrainBytesOSPage
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

const NOTES = {
  orbital: {
    title: 'A · 多引力井轨道',
    body: '2–3 个慢速引力井 + 拖尾粒子。最贴「orbital archive」隐喻，桌面铺屏时层次清楚，也不抢前景书本。',
  },
  flow: {
    title: 'B · 噪声流场',
    body: 'Perlin 风格流场驱动的丝带粒子。横竖屏都稳，抽象、铺满感强；偏「墨水/气流」，宇宙感稍弱。',
  },
  attractor: {
    title: 'C · 有机吸引子',
    body: '借鉴つぶやき Processing 的迭代点云方法，但是我们自己的公式。大屏上用多盆地避免正中一团单调。',
  },
  hybrid: {
    title: 'D · 分层混合',
    body: '底层星尘与偶发流星（右上→左下）+ 中层轨道井 + 表层淡流场。复杂度放在分层，而不是单公式；最接近可进正式 OS 的候选。',
  },
  flake: {
    title: 'E · 六重雪花',
    body: '复现 yuruyurau 推特小品：点云公式 + get/image + rotate(PI/3) 六次叠印。先看主菜形态，再决定是否淡化进 D。',
  },
  bloom: {
    title: 'F · 涌现插花',
    body: '主运动仍是 yuruyurau 式涡旋游动；花瓣轮廓只做轻牵引，让花从流动里长出再散去，而不是拼图对齐。',
  },
  shoal: {
    title: 'G · 雪花七鱼',
    body: '中央六重雪花；七条鱼按原式公式以 t 连贯形变「游动」，锚点几乎不动，避免整团大位移造成飘感。',
  },
}

const canvas = document.getElementById('field')
const noteEl = document.getElementById('note')
const booksEl = document.getElementById('books')
const ctx = canvas.getContext('2d', { alpha: false })

let variant = 'orbital'
let paused = false
let width = 0
let height = 0
let dpr = 1
let t = 0
let frame = 0
let state = null
let raf = 0

const clamp = (v, a, b) => Math.min(b, Math.max(a, v))
const rand = (a = 0, b = 1) => a + Math.random() * (b - a)
const TAU = Math.PI * 2

/** 轻量 2D value-noise（足够做流场，无需外部库） */
function makeNoise2D(seed = 1) {
  const size = 256
  const table = new Float32Array(size * size)
  let s = seed >>> 0 || 1
  const next = () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 0xffffffff
  }
  for (let i = 0; i < table.length; i += 1) table[i] = next()

  const fade = (u) => u * u * (3 - 2 * u)
  const sample = (x, y) => {
    const xi = Math.floor(x) & 255
    const yi = Math.floor(y) & 255
    const xf = x - Math.floor(x)
    const yf = y - Math.floor(y)
    const i00 = table[yi * size + xi]
    const i10 = table[yi * size + ((xi + 1) & 255)]
    const i01 = table[((yi + 1) & 255) * size + xi]
    const i11 = table[((yi + 1) & 255) * size + ((xi + 1) & 255)]
    const u = fade(xf)
    const v = fade(yf)
    return i00 + (i10 - i00) * u + (i01 - i00) * v + (i00 - i10 - i01 + i11) * u * v
  }

  return (x, y) => sample(x, y) * 2 - 1
}

function resize() {
  dpr = Math.min(window.devicePixelRatio || 1, 1.75)
  width = window.innerWidth
  height = window.innerHeight
  canvas.width = Math.floor(width * dpr)
  canvas.height = Math.floor(height * dpr)
  canvas.style.width = `${width}px`
  canvas.style.height = `${height}px`
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  state = createState(variant)
  paintSolidBackground()
}

function paintSolidBackground() {
  ctx.fillStyle = '#050510'
  ctx.fillRect(0, 0, width, height)
}

function fadeTrail(alpha) {
  ctx.fillStyle = `rgba(5, 5, 16, ${alpha})`
  ctx.fillRect(0, 0, width, height)
}

function particleBudget(base) {
  const area = width * height
  const scale = clamp(area / (1280 * 720), 0.55, 1.8)
  return Math.floor(base * scale)
}

function createStars(count) {
  return Array.from({ length: count }, () => ({
    x: rand(0, width),
    y: rand(0, height),
    r: rand(0.4, 1.4),
    a: rand(0.15, 0.7),
  }))
}

function drawStars(stars, pulse = 0) {
  for (const s of stars) {
    ctx.fillStyle = `rgba(220, 230, 255, ${s.a * (0.75 + 0.25 * Math.sin(pulse + s.x))})`
    ctx.beginPath()
    ctx.arc(s.x, s.y, s.r, 0, TAU)
    ctx.fill()
  }
}

/* ---------------- A · Orbital wells ---------------- */

function createOrbital() {
  const wells = [
    { x: width * 0.38, y: height * 0.48, m: 2800, hue: 195 },
    { x: width * 0.62, y: height * 0.42, m: 2200, hue: 42 },
    { x: width * 0.52, y: height * 0.68, m: 1600, hue: 155 },
  ]
  const particles = Array.from({ length: particleBudget(1400) }, () => spawnOrbitalParticle())
  return { wells, particles, stars: createStars(90) }
}

function spawnOrbitalParticle() {
  return {
    x: rand(0, width),
    y: rand(0, height),
    vx: rand(-0.4, 0.4),
    vy: rand(-0.4, 0.4),
    life: rand(40, 220),
    hue: rand(180, 220),
  }
}

function stepOrbital(s) {
  fadeTrail(0.08)
  drawStars(s.stars, t * 0.8)

  for (const well of s.wells) {
    well.x += Math.sin(t * 0.11 + well.hue) * 0.18
    well.y += Math.cos(t * 0.09 + well.m) * 0.14
    ctx.beginPath()
    ctx.fillStyle = `hsla(${well.hue}, 70%, 68%, 0.045)`
    ctx.arc(well.x, well.y, 46, 0, TAU)
    ctx.fill()
  }

  for (let i = 0; i < s.particles.length; i += 1) {
    const p = s.particles[i]
    for (const well of s.wells) {
      const dx = well.x - p.x
      const dy = well.y - p.y
      const dist2 = dx * dx + dy * dy + 80
      const force = well.m / dist2
      p.vx += (dx / Math.sqrt(dist2)) * force * 0.0016
      p.vy += (dy / Math.sqrt(dist2)) * force * 0.0016
    }
    p.vx *= 0.992
    p.vy *= 0.992
    const speed = Math.hypot(p.vx, p.vy)
    if (speed > 3.2) {
      p.vx *= 3.2 / speed
      p.vy *= 3.2 / speed
    }
    const x0 = p.x
    const y0 = p.y
    p.x += p.vx
    p.y += p.vy
    p.life -= 1

    const wrap = 40
    if (p.x < -wrap || p.x > width + wrap || p.y < -wrap || p.y > height + wrap || p.life < 0) {
      s.particles[i] = spawnOrbitalParticle()
      continue
    }

    ctx.strokeStyle = `hsla(${p.hue + speed * 12}, 75%, 72%, ${clamp(0.12 + speed * 0.12, 0.1, 0.42)})`
    ctx.lineWidth = clamp(0.6 + speed * 0.25, 0.5, 1.6)
    ctx.beginPath()
    ctx.moveTo(x0, y0)
    ctx.lineTo(p.x, p.y)
    ctx.stroke()
  }
}

/* ---------------- B · Flow field ---------------- */

function createFlow() {
  const noise = makeNoise2D(42)
  const particles = Array.from({ length: particleBudget(1800) }, () => spawnFlowParticle())
  return { noise, particles, z: rand(0, 100) }
}

function spawnFlowParticle() {
  return {
    x: rand(0, width),
    y: rand(0, height),
    age: rand(0, 180),
    hue: rand(165, 210),
  }
}

function stepFlow(s) {
  fadeTrail(0.07)
  s.z += 0.0022
  const scale = 0.00135

  for (let i = 0; i < s.particles.length; i += 1) {
    const p = s.particles[i]
    const n = s.noise(p.x * scale, p.y * scale + s.z)
    const n2 = s.noise(p.y * scale - s.z, p.x * scale * 0.8)
    const angle = (n * 1.4 + n2 * 0.8) * Math.PI
    const step = 1.15 + Math.abs(n) * 1.4
    const x0 = p.x
    const y0 = p.y
    p.x += Math.cos(angle) * step
    p.y += Math.sin(angle) * step
    p.age += 1

    if (p.x < 0 || p.x > width || p.y < 0 || p.y > height || p.age > 220) {
      s.particles[i] = spawnFlowParticle()
      continue
    }

    ctx.strokeStyle = `hsla(${p.hue + n * 40}, 55%, 70%, 0.22)`
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(x0, y0)
    ctx.lineTo(p.x, p.y)
    ctx.stroke()
  }
}

/* ---------------- C · Organic attractor basins ---------------- */

function createAttractor() {
  const basins = [
    { cx: width * 0.32, cy: height * 0.45, amp: 0.9, phase: 0 },
    { cx: width * 0.68, cy: height * 0.38, amp: 1.05, phase: 1.7 },
    { cx: width * 0.54, cy: height * 0.72, amp: 0.8, phase: 3.1 },
  ]
  return { basins, count: particleBudget(5200) }
}

function attractorPoint(i, time, basin) {
  const y = (i % 900) / 70
  const k = (y < 7 ? 8 + Math.sin((y * 17) % 9) * 5.5 : 4.2 + Math.cos(y)) * Math.cos(i * 0.017 + time * 0.5)
  const e = y * 0.5 - 11
  const d = Math.hypot(k, e)
  const q = y * k * 0.18 * (2 + Math.sin(d * 2 + y - time * 3.2)) + 28
  const c = d * 0.22 - time * 0.45 + (i % 2) * 2.4 + basin.phase
  const localX = q * Math.cos(c) * Math.cos(c * 0.5 + e * 0.08)
  const localY = q * d * 0.1 * Math.sin(c)
  return {
    x: basin.cx + localX * basin.amp,
    y: basin.cy + localY * basin.amp,
  }
}

function stepAttractor(s) {
  // 吸引子更适合「整帧重绘 + 低 alpha 点」，避免拖尾糊成一团
  ctx.fillStyle = 'rgba(5, 5, 16, 0.42)'
  ctx.fillRect(0, 0, width, height)

  const stride = Math.max(1, Math.floor(9000 / s.count))
  for (let b = 0; b < s.basins.length; b += 1) {
    const basin = s.basins[b]
    basin.cx += Math.sin(t * 0.07 + basin.phase) * 0.12
    basin.cy += Math.cos(t * 0.06 + b) * 0.1
    for (let i = 0; i < s.count; i += stride) {
      const idx = i * 3 + b * 997
      const p = attractorPoint(idx, t, basin)
      if (p.x < -20 || p.x > width + 20 || p.y < -20 || p.y > height + 20) continue
      const warm = b === 1
      ctx.fillStyle = warm
        ? `rgba(255, 196, 120, ${0.14 + (i % 7) * 0.02})`
        : `rgba(${160 + (i % 40)}, ${210 - (i % 30)}, 255, ${0.12 + (i % 5) * 0.025})`
      ctx.fillRect(p.x, p.y, 1.1, 1.1)
    }
  }
}

/* ---------------- D · Hybrid layers ---------------- */

function spawnMeteor() {
  // 你的视角：从偏中上/中右区域进入，朝 ↙ 飞（向左 + 向下）
  const originX = width * rand(0.22, 0.78)
  const originY = height * rand(-0.06, 0.42)
  const speed = rand(11, 19)
  const vx = -Math.abs(speed * rand(0.7, 1.05)) // 向左 ←
  const vy = Math.abs(speed * rand(0.55, 0.95)) // 向下 ↓  → 合起来就是 ↙
  return {
    x: originX,
    y: originY,
    vx,
    vy,
    life: rand(30, 56),
    maxLife: 0,
    thickness: rand(1.2, 2),
    trail: rand(64, 120),
  }
}

function createMeteors() {
  return {
    items: [],
    cooldown: rand(30, 70),
  }
}

function stepMeteors(meteors) {
  meteors.cooldown -= 1
  if (meteors.cooldown <= 0) {
    const burst = Math.random() < 0.28 ? 2 : 1
    for (let i = 0; i < burst; i += 1) {
      const m = spawnMeteor()
      m.maxLife = m.life
      // 连发时错开一点起点，避免叠成一条
      m.x += rand(-36, 36)
      m.y += rand(-24, 24)
      meteors.items.push(m)
    }
    // 约 0.5–1.5 秒一波，偶发双星，不刷屏
    meteors.cooldown = rand(30, 90)
  }

  for (let i = meteors.items.length - 1; i >= 0; i -= 1) {
    const m = meteors.items[i]
    const x0 = m.x
    const y0 = m.y
    m.x += m.vx
    m.y += m.vy
    m.life -= 1

    const fade = clamp(m.life / m.maxLife, 0, 1)
    const tx = m.x - (m.vx / Math.hypot(m.vx, m.vy)) * m.trail
    const ty = m.y - (m.vy / Math.hypot(m.vx, m.vy)) * m.trail
    const grad = ctx.createLinearGradient(tx, ty, m.x, m.y)
    grad.addColorStop(0, 'rgba(255, 255, 255, 0)')
    grad.addColorStop(0.55, `rgba(230, 238, 255, ${0.18 * fade})`)
    grad.addColorStop(1, `rgba(255, 255, 255, ${0.85 * fade})`)

    ctx.strokeStyle = grad
    ctx.lineWidth = m.thickness
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.moveTo(tx, ty)
    ctx.lineTo(m.x, m.y)
    ctx.stroke()

    ctx.fillStyle = `rgba(255, 255, 255, ${0.9 * fade})`
    ctx.beginPath()
    ctx.arc(m.x, m.y, m.thickness * 0.7, 0, TAU)
    ctx.fill()

    // 极淡残影，让拖尾在 fadeTrail 下更像流星
    ctx.strokeStyle = `rgba(255, 255, 255, ${0.08 * fade})`
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(x0, y0)
    ctx.lineTo(m.x, m.y)
    ctx.stroke()

    if (
      m.life <= 0
      || m.x < -120
      || m.y > height + 120
    ) {
      meteors.items.splice(i, 1)
    }
  }
}

function createHybrid() {
  return {
    stars: createStars(120),
    meteors: createMeteors(),
    orbital: createOrbital(),
    flow: createFlow(),
  }
}

function stepHybrid(s) {
  fadeTrail(0.09)
  drawStars(s.stars, t)
  // 底层偶发流星：右上 → 左下，白色短划
  stepMeteors(s.meteors)

  // 中层轨道：降密度、更慢
  const wells = s.orbital.wells
  for (const well of wells) {
    well.x += Math.sin(t * 0.08 + well.hue) * 0.1
    well.y += Math.cos(t * 0.07 + well.m) * 0.08
  }
  for (let i = 0; i < s.orbital.particles.length; i += 2) {
    const p = s.orbital.particles[i]
    for (const well of wells) {
      const dx = well.x - p.x
      const dy = well.y - p.y
      const dist2 = dx * dx + dy * dy + 120
      const force = well.m / dist2
      p.vx += (dx / Math.sqrt(dist2)) * force * 0.0011
      p.vy += (dy / Math.sqrt(dist2)) * force * 0.0011
    }
    p.vx *= 0.994
    p.vy *= 0.994
    const x0 = p.x
    const y0 = p.y
    p.x += p.vx
    p.y += p.vy
    p.life -= 1
    if (p.x < -30 || p.x > width + 30 || p.y < -30 || p.y > height + 30 || p.life < 0) {
      s.orbital.particles[i] = spawnOrbitalParticle()
      continue
    }
    const speed = Math.hypot(p.vx, p.vy)
    ctx.strokeStyle = `hsla(${190 + speed * 8}, 70%, 74%, 0.2)`
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(x0, y0)
    ctx.lineTo(p.x, p.y)
    ctx.stroke()
  }

  // 表层淡流场：更稀、更淡
  s.flow.z += 0.0014
  const scale = 0.0011
  for (let i = 0; i < s.flow.particles.length; i += 3) {
    const p = s.flow.particles[i]
    const n = s.flow.noise(p.x * scale + 8, p.y * scale + s.flow.z)
    const angle = n * Math.PI * 1.6
    const x0 = p.x
    const y0 = p.y
    p.x += Math.cos(angle) * 0.9
    p.y += Math.sin(angle) * 0.9
    p.age += 1
    if (p.x < 0 || p.x > width || p.y < 0 || p.y > height || p.age > 160) {
      s.flow.particles[i] = spawnFlowParticle()
      continue
    }
    ctx.strokeStyle = `rgba(180, 220, 255, 0.08)`
    ctx.beginPath()
    ctx.moveTo(x0, y0)
    ctx.lineTo(p.x, p.y)
    ctx.stroke()
  }
}

/* ---------------- E · 六重雪花（复现推特小品） ---------------- */

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

function createFlake() {
  return createFlakeBuffers()
}

/** 把雪花画到当前主 ctx；clearBg=false 时供 G 叠在已有背景上 */
function paintFlake(s, {
  clearBg = true,
  cover = 0.92,
  cx = width * 0.5,
  cy = height * 0.5,
  alpha = 1,
} = {}) {
  s.time += Math.PI / 240
  const m = 200
  const { off, octx, size } = s

  octx.setTransform(1, 0, 0, 1, 0, 0)
  octx.clearRect(0, 0, size, size)
  octx.fillStyle = 'rgba(255, 255, 255, 0.18)'

  for (let i = 20000; --i > 6;) {
    const k = (i % 25) - 12
    const e = i / 800
    const d = 7 * Math.cos(Math.hypot(k, e) / 3 + s.time / 2)
    const x = k * 4 + d * k * Math.sin(d + e / 9 + s.time) + m
    const y = e * 2 - d * 9 - d * 9 * Math.cos(d + s.time) + m
    octx.fillRect(x, y, 1.15, 1.15)
  }

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  if (clearBg) {
    ctx.fillStyle = '#090909'
    ctx.fillRect(0, 0, width, height)
  }

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

function stepFlake(s) {
  paintFlake(s, { clearBg: true, cover: 0.92 })
}

/* ---------------- G · 雪花七鱼（原式鱼公式 + 统一白色） ---------------- */

/**
 * 原作（忠实展开）：
 * a=(y,o=mag(k=cos(y*7)*(y<19?sin(t/8+y*8)*31:9),e=y/8-13)/5)
 *   =>point((q=59+cos(y)/k+k/o*3*(2+sin(o*3-e*9-t)))*sin(c=o/2-e/6-t/8+i%2*8)+200,
 *           200+q*cos(c)-99*sin(c/3))
 * t=0,draw=$=>{t||createCanvas(w=400,w);background(9).stroke(w,96);for(t+=PI/30,i=2e4;i--;)a(i/600)}
 *
 * 要点：整幅 400×400 点云才是「一条/一群」鱼的形态；不可再旋转扭曲。
 * 七条鱼 = 七份原式绘制，仅平移锚点 + 各自的 t，颜色统一 stroke(255,96)。
 */

function createShoalFish() {
  const side = Math.min(width || 800, height || 600)
  const cx = (width || 800) * 0.5
  const cy = (height || 600) * 0.5
  // 七个锚点散开布置，之后几乎固定；「游」交给公式 t
  const a = (createShoalFish._n = (createShoalFish._n || 0) + 1) / 8 * TAU + Math.random() * 0.4
  const r = side * (0.26 + Math.random() * 0.12)
  return {
    x: cx + Math.cos(a) * r,
    y: cy + Math.sin(a) * r,
    // 原作：每帧只推进 t，形体连续变形 = 游
    time: Math.random() * 80,
    timeStep: Math.PI / 30,
    // 极慢漂移（每帧远小于 1px），只为避免七条完全静止叠味
    driftPhase: Math.random() * TAU,
    driftSpeed: 0.004 + Math.random() * 0.003,
    driftRadius: 6 + Math.random() * 10,
    homeX: 0,
    homeY: 0,
  }
}

function createShoal() {
  createShoalFish._n = 0
  const fishCanvas = document.createElement('canvas')
  fishCanvas.width = 400
  fishCanvas.height = 400
  const fishes = Array.from({ length: 7 }, () => createShoalFish())
  for (const fish of fishes) {
    fish.homeX = fish.x
    fish.homeY = fish.y
  }
  return {
    flake: createFlakeBuffers(),
    fishCanvas,
    fishCtx: fishCanvas.getContext('2d', { alpha: true }),
    fishes,
    // 与 OS 一致：裁切主体，避免每份点云看起来像一整群
    fishCrop: { x: 40, y: 30, size: 320 },
  }
}

/** 只取 i 的偶/奇一层，去掉 (i%2)*8 分裂，避免「一对鱼」 */
function rasterizeFish(fishCtx, time, parity = 0) {
  const size = 400
  const img = fishCtx.createImageData(size, size)
  const data = img.data
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

  fishCtx.putImageData(img, 0, 0)
}

function stepShoalFishMotion(fish) {
  // 与原作一样：动作主体是 t 的连续推进，形体一体变形
  fish.time += fish.timeStep
  // 锚点只在 home 附近做极小圆周蠕动（亚像素级观感），避免整鱼「搬位置」
  fish.driftPhase += fish.driftSpeed
  fish.x = fish.homeX + Math.cos(fish.driftPhase) * fish.driftRadius
  fish.y = fish.homeY + Math.sin(fish.driftPhase * 0.87) * fish.driftRadius * 0.65
}

function stepShoal(s) {
  const side = Math.min(width, height)
  const cx = width * 0.5
  const cy = height * 0.5

  // 原作每帧 background(9)；这里铺底后再叠雪花与鱼
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.fillStyle = '#090909'
  ctx.fillRect(0, 0, width, height)

  paintFlake(s.flake, {
    clearBg: false,
    cover: 0.44,
    cx,
    cy,
    alpha: 0.9,
  })

  const crop = s.fishCrop
  const fishScale = (side * 0.22) / crop.size

  for (let f = 0; f < s.fishes.length; f += 1) {
    const fish = s.fishes[f]
    stepShoalFishMotion(fish)

    // 完整原式光栅化后只贴主体裁切，七槽位 ≈ 七条鱼
    rasterizeFish(s.fishCtx, fish.time)
    const drawSize = crop.size * fishScale
    ctx.drawImage(
      s.fishCanvas,
      crop.x,
      crop.y,
      crop.size,
      crop.size,
      fish.x - drawSize / 2,
      fish.y - drawSize / 2,
      drawSize,
      drawSize,
    )
  }
}

/* ---------------- F · 涌现插花（涡旋游动为主 + 花形轻牵引） ---------------- */

/** 插花构图：花心相对位置（规范化）+ 瓣数；牵引弱，粒子仍以场运动为主 */
const BLOOM_ARRANGEMENTS = [
  {
    name: '一枝五瓣',
    field: { swirl: 10, tight: 1.85, spin: 1.1 },
    flowers: [{ x: 0, y: 0, petals: 5, size: 0.9 }],
  },
  {
    name: '瓶花三枝',
    field: { swirl: 9, tight: 2.05, spin: 0.9 },
    flowers: [
      { x: -0.35, y: -0.45, petals: 5, size: 0.7 },
      { x: 0.45, y: -0.05, petals: 6, size: 0.55 },
      { x: -0.1, y: 0.4, petals: 4, size: 0.42 },
    ],
  },
  {
    name: '对生',
    field: { swirl: 11, tight: 1.7, spin: 1.3 },
    flowers: [
      { x: -0.55, y: -0.1, petals: 5, size: 0.65 },
      { x: 0.55, y: 0.1, petals: 5, size: 0.6 },
    ],
  },
  {
    name: '菊',
    field: { swirl: 12, tight: 1.55, spin: 1.45 },
    flowers: [{ x: 0.05, y: -0.05, petals: 12, size: 0.95 }],
  },
  {
    name: '疏影',
    field: { swirl: 8, tight: 2.1, spin: 0.85 },
    flowers: [
      { x: -0.4, y: -0.35, petals: 3, size: 0.55 },
      { x: 0.35, y: 0.25, petals: 5, size: 0.5 },
    ],
  },
]

function randomBloomVec() {
  const u = Math.random()
  const v = Math.random()
  const theta = TAU * u
  const phi = Math.acos(2 * v - 1)
  return {
    x: Math.sin(phi) * Math.cos(theta),
    y: Math.sin(phi) * Math.sin(theta),
    z: Math.cos(phi),
  }
}

/** 玫瑰线势：值越小越靠近花瓣脊线（用于轻牵引，不锁死） */
function flowerPotential(px, py, flower) {
  const dx = px - flower.x
  const dy = py - flower.y
  const mag = Math.hypot(dx, dy) + 1e-4
  const theta = Math.atan2(dy, dx)
  const k = flower.petals
  // 理想花瓣半径
  const ridge = flower.size * Math.abs(Math.cos(k * theta))
  const radial = mag - ridge
  // 花心也略吸一点
  const core = mag * 0.35
  return Math.min(Math.abs(radial), core)
}

function nearestFlowerForce(px, py, flowers, strength) {
  let best = null
  let bestPot = Infinity
  for (let i = 0; i < flowers.length; i += 1) {
    const f = flowers[i]
    const pot = flowerPotential(px, py, f)
    if (pot < bestPot) {
      bestPot = pot
      best = f
    }
  }
  if (!best) return { fx: 0, fy: 0 }

  const dx = px - best.x
  const dy = py - best.y
  const mag = Math.hypot(dx, dy) + 1e-4
  const theta = Math.atan2(dy, dx)
  const ridge = best.size * Math.abs(Math.cos(best.petals * theta))
  // 径向：拉向花瓣脊线；切向：沿瓣游走（动态感）
  const radialErr = mag - ridge
  const pull = -radialErr * 0.045 * strength
  const tang = 0.028 * strength
  const rx = dx / mag
  const ry = dy / mag
  return {
    fx: rx * pull - ry * tang,
    fy: ry * pull + rx * tang,
  }
}

function createBloom() {
  const particles = []
  for (let i = 0; i < 900; i += 1) particles.push(randomBloomVec())
  return {
    particles,
    fc: 0,
    motifIndex: 0,
    cycle: 0,
    cycleFrames: 60 * 16,
    labelAlpha: 0,
  }
}

function bloomPhase(cycle) {
  // 长涌现 / 长游动停驻，消散也留给场自己完成，避免「拼完再拆」
  if (cycle < 0.42) return { name: 'emerge', floral: cycle / 0.42, chaos: 1 - cycle * 0.5 }
  if (cycle < 0.68) return { name: 'hold', floral: 1, chaos: 0.55 }
  if (cycle < 0.9) return { name: 'dissolve', floral: 1 - (cycle - 0.68) / 0.22, chaos: 0.7 + (cycle - 0.68) }
  return { name: 'void', floral: 0, chaos: 1.15 }
}

function stepBloom(s) {
  s.fc += 1
  s.cycle += 1 / s.cycleFrames
  if (s.cycle >= 1) {
    s.cycle = 0
    s.motifIndex = (s.motifIndex + 1) % BLOOM_ARRANGEMENTS.length
    // 只换场，不重置粒子坐标——让旧轨迹拖进新构图
    const inject = Array.from({ length: 220 }, () => randomBloomVec())
    s.particles = s.particles.slice(-2600).concat(inject)
  }

  const arrangement = BLOOM_ARRANGEMENTS[s.motifIndex]
  const phase = bloomPhase(s.cycle)
  const field = arrangement.field

  // 长拖尾：接近原作 background(0,6)
  ctx.fillStyle = 'rgba(0, 0, 0, 0.03)'
  ctx.fillRect(0, 0, width, height)

  if (s.particles.length < 3000) {
    for (let i = 0; i < 14; i += 1) s.particles.push(randomBloomVec())
  } else if (s.particles.length > 2985) {
    s.particles = s.particles.slice(-2985)
  }

  const side = Math.min(width, height)
  const scale = side / 540
  const cx = width * 0.5
  const cy = height * 0.52
  const viewRot = s.fc * 0.0018
  const cosR = Math.cos(viewRot)
  const sinR = Math.sin(viewRot)

  // 花的局部坐标（与投影后的点同尺度，便于牵引）
  const flowers = arrangement.flowers.map((f) => ({
    x: f.x,
    y: f.y,
    petals: f.petals,
    size: f.size,
  }))

  const swirl = field.swirl * (0.85 + 0.35 * phase.chaos)
  const tight = field.tight
  const floral = phase.floral

  for (let i = 0; i < s.particles.length; i += 1) {
    const p = s.particles[i]
    const mag = Math.hypot(p.x, p.y, p.z)
    const denom = Math.cos(mag * tight - s.fc / 99)
    const safe = Math.abs(denom) < 0.12 ? (denom >= 0 ? 0.12 : -0.12) : denom
    let r = 4 + swirl / safe

    // 花瓣调制叠在场上（涌现时加强），不是替换场
    const ang = Math.atan2(p.y, p.x)
    const petalWave = 1 + floral * 0.5 * Math.cos(ang * arrangement.flowers[0].petals + s.fc * 0.008 * field.spin)
    r *= petalWave

    const inv = 9 / (i + 1)
    // —— 原作主运动：始终在游 ——
    p.x += Math.sin(p.y * r) * inv * (0.65 + 0.5 * phase.chaos)
    p.y += Math.cos(r * p.x) * inv * (0.65 + 0.5 * phase.chaos)
    p.z += -p.z / 3

    // —— 花形轻牵引（投影空间），hold 时也保持切向游走 ——
    if (floral > 0.02) {
      const force = nearestFlowerForce(p.x, p.y, flowers, floral)
      p.x += force.fx * 0.55
      p.y += force.fy * 0.55
    }

    if (mag > 3.2) {
      p.x *= 0.97
      p.y *= 0.97
      p.z *= 0.97
    }

    const x3 = p.x * cosR - p.z * sinR
    const z3 = p.x * sinR + p.z * cosR
    const sx = cx + (x3 + 0.12) * 90 * scale
    const sy = cy + (p.y + 0.08) * 90 * scale - z3 * 14 * scale
    if (sx < -40 || sx > width + 40 || sy < -40 || sy > height + 40) continue

    const zFade = clamp(0.4 + 0.6 * (1 - Math.abs(z3) * 0.3), 0.15, 1)
    // 涌现越清楚略亮，但消散时仍靠拖尾发光
    const a = (0.14 + 0.12 * floral) * zFade
    ctx.fillStyle = `rgba(255, 255, 255, ${a})`
    ctx.fillRect(sx, sy, 1.15, 1.15)
  }

  s.labelAlpha += ((phase.name === 'hold' || phase.name === 'emerge' ? 1 : 0.4) - s.labelAlpha) * 0.04
  ctx.fillStyle = `rgba(220, 228, 245, ${0.38 * s.labelAlpha})`
  ctx.font = '600 12px "IBM Plex Mono", ui-monospace, monospace'
  ctx.fillText(`${arrangement.name} · ${phase.name}`, 18, height - 22)
}

function createState(name) {
  if (name === 'orbital') return createOrbital()
  if (name === 'flow') return createFlow()
  if (name === 'attractor') return createAttractor()
  if (name === 'hybrid') return createHybrid()
  if (name === 'flake') return createFlake()
  if (name === 'bloom') return createBloom()
  if (name === 'shoal') return createShoal()
  return createHybrid()
}

function step() {
  if (variant === 'orbital') stepOrbital(state)
  else if (variant === 'flow') stepFlow(state)
  else if (variant === 'attractor') stepAttractor(state)
  else if (variant === 'hybrid') stepHybrid(state)
  else if (variant === 'flake') stepFlake(state)
  else if (variant === 'bloom') stepBloom(state)
  else if (variant === 'shoal') stepShoal(state)
}

function setVariant(next) {
  variant = next
  document.querySelectorAll('.lab-tabs button').forEach((btn) => {
    const active = btn.dataset.variant === next
    btn.classList.toggle('is-active', active)
    btn.setAttribute('aria-selected', active ? 'true' : 'false')
  })
  const meta = NOTES[next]
  noteEl.innerHTML = `<strong>${meta.title}</strong>${meta.body}`
  state = createState(next)
  paintSolidBackground()
}

function tick() {
  raf = window.requestAnimationFrame(tick)
  if (paused) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches && frame > 2) return
  t += Math.PI / 180
  frame += 1
  step()
}

function bindUi() {
  document.querySelectorAll('.lab-tabs button').forEach((btn) => {
    btn.addEventListener('click', () => setVariant(btn.dataset.variant))
  })
  document.getElementById('mock-books').addEventListener('change', (event) => {
    booksEl.hidden = !event.target.checked
  })
  document.getElementById('pause').addEventListener('change', (event) => {
    paused = event.target.checked
  })
}

window.addEventListener('resize', resize)
bindUi()
resize()
setVariant('shoal')
tick()
