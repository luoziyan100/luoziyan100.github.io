/**
 * [INPUT]: 依赖 three 的 WebGL 场景基础类，依赖 brain-bytes-planet.js 生成程序材质
 * [OUTPUT]: 默认导出 InteractiveGlobe 组件，按需渲染可交互 Three 行星、轨道环、小卫星与星点
 * [POS]: pages/brain-bytes-os 的懒加载行星场景，被 BrainBytesOSPage 在 WORLD_VARIANT='planet' 时动态加载，避免 Three 进入默认视频版本首包
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import { useEffect, useRef } from 'react'
import {
  ACESFilmicToneMapping,
  AmbientLight,
  BackSide,
  BufferAttribute,
  BufferGeometry,
  Color,
  DirectionalLight,
  Euler,
  Group,
  HemisphereLight,
  LineBasicMaterial,
  LineLoop,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Scene,
  SphereGeometry,
  SRGBColorSpace,
  Vector3,
  WebGLRenderer,
} from 'three'
import { makePlanetTextures } from './brain-bytes-planet'

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

function createOrbitLine(rx, ry, rotation, color, opacity) {
  const points = []
  for (let i = 0; i < 240; i += 1) {
    const angle = (i / 240) * Math.PI * 2
    points.push(new Vector3(Math.cos(angle) * rx, Math.sin(angle) * ry, 0))
  }

  const geometry = new BufferGeometry().setFromPoints(points)
  const material = new LineBasicMaterial({
    color,
    transparent: true,
    opacity,
    depthWrite: false,
  })
  const line = new LineLoop(geometry, material)
  line.rotation.copy(rotation)
  return line
}

function getOrbitPosition(rx, ry, angle, rotation) {
  return new Vector3(Math.cos(angle) * rx, Math.sin(angle) * ry, 0).applyEuler(rotation)
}

function createStars() {
  const count = 520
  const positions = new Float32Array(count * 3)
  for (let i = 0; i < count; i += 1) {
    const radius = 7 + Math.random() * 5
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos((Math.random() * 2) - 1)
    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
    positions[(i * 3) + 1] = radius * Math.sin(phi) * Math.sin(theta)
    positions[(i * 3) + 2] = radius * Math.cos(phi) - 2
  }

  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new BufferAttribute(positions, 3))
  const material = new PointsMaterial({
    color: 0xfff8dd,
    size: .028,
    transparent: true,
    opacity: .7,
  })

  return new Points(geometry, material)
}

export default function InteractiveGlobe() {
  const mountRef = useRef(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return undefined

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const scene = new Scene()
    const camera = new PerspectiveCamera(38, 1, .1, 100)
    camera.position.set(0, 0, 7.25)

    const renderer = new WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    })
    renderer.setClearColor(0x000000, 0)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.outputColorSpace = SRGBColorSpace
    renderer.toneMapping = ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.02
    renderer.domElement.className = 'bbos-globe-canvas'
    renderer.domElement.setAttribute('data-bbos-globe', 'true')
    mount.appendChild(renderer.domElement)

    scene.add(new AmbientLight(0xe8ffff, 2.8))
    scene.add(new HemisphereLight(0xffffff, 0x8bc7da, 1.7))
    const sun = new DirectionalLight(0xffffff, 4.2)
    sun.position.set(-4.2, 3.8, 5.6)
    const rim = new DirectionalLight(0xa9f3ff, 1.7)
    rim.position.set(4, -1, -5)
    const warmFill = new DirectionalLight(0xfff0c8, 1.1)
    warmFill.position.set(-3, -2, 4)
    scene.add(sun, rim, warmFill)

    const globe = new Group()
    scene.add(globe)

    const maxAnisotropy = renderer.capabilities.getMaxAnisotropy?.() ?? 8
    const planetTextures = makePlanetTextures(maxAnisotropy)
    const earthGeometry = new SphereGeometry(2.16, 192, 128)
    const earthMaterial = new MeshStandardMaterial({
      map: planetTextures.colorMap,
      bumpMap: planetTextures.bumpMap,
      bumpScale: .075,
      roughnessMap: planetTextures.roughnessMap,
      roughness: .58,
      metalness: .03,
      emissive: new Color(0x56cbe8),
      emissiveMap: planetTextures.colorMap,
      emissiveIntensity: .22,
    })
    const earth = new Mesh(earthGeometry, earthMaterial)
    earth.rotation.set(.03, -.62, 0)
    globe.add(earth)

    const cloudGeometry = new SphereGeometry(2.195, 192, 128)
    const cloudMaterial = new MeshStandardMaterial({
      color: 0xf8ffff,
      alphaMap: planetTextures.cloudMap,
      transparent: true,
      opacity: .18,
      depthWrite: false,
      roughness: 1,
      metalness: 0,
      emissive: new Color(0xeafff8),
      emissiveIntensity: .08,
    })
    const cloudShell = new Mesh(cloudGeometry, cloudMaterial)
    cloudShell.rotation.set(.04, -.72, .015)
    globe.add(cloudShell)

    const atmosphereGeometry = new SphereGeometry(2.3, 96, 64)
    const atmosphereMaterial = new MeshBasicMaterial({
      color: 0xb8fff2,
      side: BackSide,
      transparent: true,
      opacity: .25,
    })
    const atmosphere = new Mesh(atmosphereGeometry, atmosphereMaterial)
    scene.add(atmosphere)

    const orbitRotations = [
      new Euler(.32, .1, -.28),
      new Euler(1.08, .04, .34),
      new Euler(.72, -.28, 1.08),
      new Euler(1.34, 0, 0),
    ]
    const orbitLines = [
      createOrbitLine(2.95, 1.08, orbitRotations[0], 0x7891bb, .42),
      createOrbitLine(3.25, 1.62, orbitRotations[1], 0x8fb4cd, .32),
      createOrbitLine(3.72, 1.22, orbitRotations[2], 0x8c9ec0, .26),
      createOrbitLine(2.35, .34, orbitRotations[3], 0xf3c76a, .5),
    ]
    orbitLines[3].position.y = -1.72
    orbitLines.forEach((line) => scene.add(line))

    const moonGeometry = new SphereGeometry(.15, 32, 16)
    const moonMaterial = new MeshStandardMaterial({
      color: 0xf7f1d5,
      roughness: .9,
      metalness: 0,
      emissive: new Color(0x6d5f38),
      emissiveIntensity: .08,
    })
    const coralMoonMaterial = new MeshStandardMaterial({
      color: 0xd6a671,
      roughness: .86,
      metalness: 0,
    })
    const moons = [
      { mesh: new Mesh(moonGeometry, moonMaterial), rx: 2.95, ry: 1.08, rotation: orbitRotations[0], phase: .4, speed: .18 },
      { mesh: new Mesh(moonGeometry, moonMaterial), rx: 3.25, ry: 1.62, rotation: orbitRotations[1], phase: 2.7, speed: .11 },
      { mesh: new Mesh(moonGeometry, coralMoonMaterial), rx: 3.72, ry: 1.22, rotation: orbitRotations[2], phase: 4.1, speed: .14 },
    ]
    moons[1].mesh.scale.setScalar(.82)
    moons[2].mesh.scale.setScalar(.72)
    moons.forEach((moon) => {
      moon.mesh.position.copy(getOrbitPosition(moon.rx, moon.ry, moon.phase, moon.rotation))
      scene.add(moon.mesh)
    })

    const stars = createStars()
    scene.add(stars)

    const pointer = { active: false, x: 0, y: 0 }
    const resize = () => {
      const width = Math.max(1, mount.clientWidth)
      const height = Math.max(1, mount.clientHeight)
      renderer.setSize(width, height, false)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
    }

    const onPointerDown = (event) => {
      pointer.active = true
      pointer.x = event.clientX
      pointer.y = event.clientY
      renderer.domElement.setPointerCapture?.(event.pointerId)
      mount.classList.add('is-grabbing')
    }

    const onPointerMove = (event) => {
      if (!pointer.active) return
      const dx = event.clientX - pointer.x
      const dy = event.clientY - pointer.y
      pointer.x = event.clientX
      pointer.y = event.clientY
      globe.rotation.y += dx / 170
      globe.rotation.x = clamp(globe.rotation.x + dy / 260, -.62, .62)
    }

    const onPointerUp = (event) => {
      pointer.active = false
      renderer.domElement.releasePointerCapture?.(event.pointerId)
      mount.classList.remove('is-grabbing')
    }

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(mount)
    renderer.domElement.addEventListener('pointerdown', onPointerDown)
    renderer.domElement.addEventListener('pointermove', onPointerMove)
    renderer.domElement.addEventListener('pointerup', onPointerUp)
    renderer.domElement.addEventListener('pointercancel', onPointerUp)
    resize()

    let previousFrameTime = 0
    renderer.setAnimationLoop((time = 0) => {
      const delta = previousFrameTime === 0 ? 0 : Math.min((time - previousFrameTime) / 1000, .05)
      previousFrameTime = time
      if (!reducedMotion && !pointer.active) globe.rotation.y += delta * .075
      cloudShell.rotation.y += delta * .04
      cloudShell.rotation.x = .04 + Math.sin(time * .00024) * .006
      atmosphere.rotation.y -= delta * .03
      moons.forEach((moon) => {
        moon.phase += delta * moon.speed
        moon.mesh.position.copy(getOrbitPosition(moon.rx, moon.ry, moon.phase, moon.rotation))
      })
      stars.rotation.y += delta * .006
      renderer.render(scene, camera)
    })

    return () => {
      renderer.setAnimationLoop(null)
      resizeObserver.disconnect()
      renderer.domElement.removeEventListener('pointerdown', onPointerDown)
      renderer.domElement.removeEventListener('pointermove', onPointerMove)
      renderer.domElement.removeEventListener('pointerup', onPointerUp)
      renderer.domElement.removeEventListener('pointercancel', onPointerUp)
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement)
      Object.values(planetTextures).forEach((texture) => texture.dispose())
      earthGeometry.dispose()
      earthMaterial.dispose()
      cloudGeometry.dispose()
      cloudMaterial.dispose()
      atmosphereGeometry.dispose()
      atmosphereMaterial.dispose()
      orbitLines.forEach((line) => {
        line.geometry.dispose()
        line.material.dispose()
      })
      moonGeometry.dispose()
      moonMaterial.dispose()
      coralMoonMaterial.dispose()
      stars.geometry.dispose()
      stars.material.dispose()
      renderer.dispose()
    }
  }, [])

  return <div className="bbos-globe-stage" ref={mountRef} aria-hidden="true" />
}
