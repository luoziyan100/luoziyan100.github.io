/**
 * [INPUT]: 依赖 three 与 three/addons OrbitControls；消费 cognitive-map.json 的 nodes/contours/peaks
 * [OUTPUT]: createCognitiveMapScene(canvas, data, handlers) → { setYear, setSelectedId, resize, dispose }
 * [POS]: pages/ 的认知地图 WebGL 引擎，被 BrainBytesMapPage 挂载；离线 JSON 驱动山峰/等高线/点选
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import {
  AmbientLight,
  BufferAttribute,
  BufferGeometry,
  Color,
  DirectionalLight,
  Group,
  LineBasicMaterial,
  LineLoop,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Raycaster,
  Scene,
  SphereGeometry,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

const WORLD_SCALE = 4.2
const HEIGHT_SCALE = 2.4

function toWorld(x, y, z = 0) {
  return new Vector3(x * WORLD_SCALE, z * HEIGHT_SCALE, y * WORLD_SCALE)
}

function createGrid() {
  const positions = []
  const half = 9
  const step = 0.55
  for (let x = -half; x <= half; x += step) {
    for (let z = -half; z <= half; z += step) {
      const s = 0.07
      positions.push(x - s, 0.001, z, x + s, 0.001, z)
      positions.push(x, 0.001, z - s, x, 0.001, z + s)
    }
  }
  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new BufferAttribute(new Float32Array(positions), 3))
  const material = new LineBasicMaterial({
    color: 0x454b57,
    transparent: true,
    opacity: 0.48,
    depthWrite: false,
  })
  return new LineSegments(geometry, material)
}

function createContours(contours) {
  const group = new Group()
  for (const contour of contours) {
    if (!contour.points?.length) continue
    const points = contour.points.map((point) => toWorld(point.x, point.y, point.z))
    const geometry = new BufferGeometry().setFromPoints(points)
    const material = new LineBasicMaterial({
      color: 0xd8dce6,
      transparent: true,
      opacity: 0.72,
      depthWrite: false,
    })
    const line = new LineLoop(geometry, material)
    line.userData.level = contour.level
    group.add(line)
  }
  return group
}

function createNodes(nodes) {
  const count = nodes.length
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const baseColor = new Color(0xf2f4f8)
  for (let i = 0; i < count; i += 1) {
    const node = nodes[i]
    const world = toWorld(node.x, node.y, node.z)
    positions[i * 3] = world.x
    positions[(i * 3) + 1] = world.y
    positions[(i * 3) + 2] = world.z
    colors[i * 3] = baseColor.r
    colors[(i * 3) + 1] = baseColor.g
    colors[(i * 3) + 2] = baseColor.b
  }
  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new BufferAttribute(positions, 3))
  geometry.setAttribute('color', new BufferAttribute(colors, 3))
  const material = new PointsMaterial({
    size: 0.085,
    vertexColors: true,
    transparent: true,
    opacity: 0.92,
    depthWrite: false,
    sizeAttenuation: true,
  })
  const points = new Points(geometry, material)
  points.userData.nodes = nodes
  return points
}

function fillPeakGroup(group, peaks) {
  while (group.children.length) {
    const child = group.children.pop()
    child.geometry?.dispose?.()
    child.material?.dispose?.()
  }
  for (const peak of peaks) {
    const glow = new Mesh(
      new SphereGeometry(0.12, 16, 16),
      new MeshBasicMaterial({
        color: new Color(peak.color || '#f0c35a'),
        transparent: true,
        opacity: 0.9,
      }),
    )
    const world = toWorld(peak.x, peak.y, peak.z)
    glow.position.copy(world)
    glow.position.y += 0.08
    glow.userData.peak = peak
    group.add(glow)

    const halo = new Mesh(
      new SphereGeometry(0.22, 16, 16),
      new MeshBasicMaterial({
        color: new Color('#f5d27a'),
        transparent: true,
        opacity: 0.22,
        depthWrite: false,
      }),
    )
    halo.position.copy(glow.position)
    group.add(halo)
  }
}

function rebuildPeaks(sourcePeaks, nodes) {
  const byTopic = new Map()
  for (const node of nodes) {
    if (!byTopic.has(node.topic)) byTopic.set(node.topic, [])
    byTopic.get(node.topic).push(node)
  }
  const peaks = []
  for (const source of sourcePeaks || []) {
    const group = byTopic.get(source.topic)
    if (!group?.length) continue
    const x = group.reduce((sum, node) => sum + node.x, 0) / group.length
    const y = group.reduce((sum, node) => sum + node.y, 0) / group.length
    const z = Math.max(...group.map((node) => node.z))
    peaks.push({
      ...source,
      count: group.length,
      x,
      y,
      z: Math.min(1, z + 0.08),
    })
  }
  return peaks
}

/**
 * @param {HTMLCanvasElement} canvas
 * @param {object} data cognitive-map.json
 * @param {{ onSelect?: Function, onPeakLabels?: Function }} handlers
 */
export function createCognitiveMapScene(canvas, data, handlers = {}) {
  const scene = new Scene()
  scene.background = new Color(0x101218)

  const camera = new PerspectiveCamera(48, 1, 0.1, 80)
  camera.position.set(5.8, 5.2, 7.4)

  const renderer = new WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
    powerPreference: 'high-performance',
  })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75))

  const controls = new OrbitControls(camera, canvas)
  controls.enableDamping = true
  controls.dampingFactor = 0.06
  controls.minDistance = 2.2
  controls.maxDistance = 18
  controls.maxPolarAngle = Math.PI * 0.48
  controls.target.set(0, 0.8, 0)

  scene.add(new AmbientLight(0xb8c0d0, 0.7))
  const key = new DirectionalLight(0xfff2d0, 0.85)
  key.position.set(4, 8, 2)
  scene.add(key)

  const root = new Group()
  scene.add(root)
  root.add(createGrid())

  const allNodes = data.nodes || []
  const contourGroup = createContours(data.contours || [])
  const peakGroup = new Group()
  let points = createNodes(allNodes)
  root.add(contourGroup)
  root.add(peakGroup)
  root.add(points)

  const raycaster = new Raycaster()
  raycaster.params.Points.threshold = 0.12
  const pointer = new Vector2()
  let selectedId = null
  let raf = 0
  let disposed = false

  function visibleNodes(maxYear) {
    return allNodes.filter((node) => !node.year || node.year <= maxYear)
  }

  function paintSelection() {
    const colorAttr = points.geometry.getAttribute('color')
    if (!colorAttr) return
    const nodes = points.userData.nodes || []
    for (let i = 0; i < nodes.length; i += 1) {
      const selected = nodes[i].id === selectedId
      const color = selected ? new Color(0xffd27a) : new Color(0xf2f4f8)
      colorAttr.setXYZ(i, color.r, color.g, color.b)
    }
    colorAttr.needsUpdate = true
  }

  function projectPeakLabels() {
    const peaks = []
    peakGroup.children.forEach((child) => {
      if (!child.userData.peak) return
      const vector = child.position.clone().project(camera)
      peaks.push({
        ...child.userData.peak,
        sx: (vector.x * 0.5 + 0.5) * canvas.clientWidth,
        sy: (-vector.y * 0.5 + 0.5) * canvas.clientHeight,
        visible: vector.z < 1,
      })
    })
    handlers.onPeakLabels?.(peaks)
  }

  function applyYear(maxYear) {
    const nodes = visibleNodes(maxYear)
    root.remove(points)
    points.geometry.dispose()
    points.material.dispose()
    points = createNodes(nodes)
    root.add(points)

    const t = data.yearRange
      ? (maxYear - data.yearRange.min) / Math.max(1, data.yearRange.max - data.yearRange.min)
      : 1
    contourGroup.children.forEach((line) => {
      line.material.opacity = 0.25 + (0.5 * Math.max(0, Math.min(1, t)))
    })

    const nextPeaks = rebuildPeaks(data.peaks, nodes)
    fillPeakGroup(peakGroup, nextPeaks)
    handlers.onPeakLabels?.(nextPeaks.map((peak) => ({
      ...peak,
      sx: 0,
      sy: 0,
      visible: false,
    })))
    paintSelection()
  }

  function resize() {
    const width = canvas.clientWidth || canvas.parentElement?.clientWidth || 1
    const height = canvas.clientHeight || canvas.parentElement?.clientHeight || 1
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    renderer.setSize(width, height, false)
  }

  function onPointerDown(event) {
    const rect = canvas.getBoundingClientRect()
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
    raycaster.setFromCamera(pointer, camera)
    const hits = raycaster.intersectObject(points, false)
    if (!hits.length) {
      selectedId = null
      paintSelection()
      handlers.onSelect?.(null)
      return
    }
    const index = hits[0].index
    const node = points.userData.nodes?.[index]
    if (!node) return
    selectedId = node.id
    paintSelection()
    handlers.onSelect?.(node)
  }

  function tick() {
    if (disposed) return
    controls.update()
    renderer.render(scene, camera)
    projectPeakLabels()
    raf = window.requestAnimationFrame(tick)
  }

  function dispose() {
    disposed = true
    window.cancelAnimationFrame(raf)
    canvas.removeEventListener('pointerdown', onPointerDown)
    controls.dispose()
    renderer.dispose()
    scene.traverse((object) => {
      object.geometry?.dispose?.()
      if (object.material) {
        if (Array.isArray(object.material)) object.material.forEach((item) => item.dispose())
        else object.material.dispose()
      }
    })
  }

  canvas.addEventListener('pointerdown', onPointerDown)
  resize()
  applyYear(data.yearRange?.max ?? 9999)
  raf = window.requestAnimationFrame(tick)

  return {
    setYear: applyYear,
    setSelectedId: (id) => {
      selectedId = id
      paintSelection()
    },
    resize,
    dispose,
  }
}
