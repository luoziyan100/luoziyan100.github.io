/**
 * [INPUT]: 依赖 import.meta.env 的 VITE_BRAIN_BYTES_OS_STANDALONE，依赖 react 的 lazy/Suspense，react-router-dom 的 BrowserRouter/Routes/Route，framer-motion 的 MotionConfig/AnimatePresence
 * [OUTPUT]: 对外提供 App 根组件（支持路由级代码分割、页面路由过渡、可访问性动画控制、Brain & Bytes Demo/Showcase/OS 路由与 OS 独立展示模式）
 * [POS]: src/ 的应用入口组件，定义路由结构，让页面依赖随路由按需加载；standalone 构建时根路径直达 BrainBytesOSPage，普通构建保持 LandingPage 首页
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { MotionConfig, AnimatePresence } from 'framer-motion'

const lazyPage = (loader, exportName) => lazy(() =>
  loader().then((module) => ({ default: module[exportName] })),
)

const LandingPage = lazyPage(() => import('./pages/LandingPage'), 'LandingPage')
const BlogListPage = lazyPage(() => import('./pages/BlogListPage'), 'BlogListPage')
const BlogPostPage = lazyPage(() => import('./pages/BlogPostPage'), 'BlogPostPage')
const BrainBytesPage = lazyPage(() => import('./pages/BrainBytesPage'), 'BrainBytesPage')
const BrainBytesOSPage = lazyPage(() => import('./pages/BrainBytesOSPage'), 'BrainBytesOSPage')
const BrainBytesDemoPage = lazyPage(() => import('./pages/BrainBytesDemoPage'), 'BrainBytesDemoPage')
const BrainBytesShowcasePage = lazyPage(() => import('./pages/BrainBytesShowcasePage'), 'BrainBytesShowcasePage')
const DesignSystemPage = lazyPage(() => import('./pages/DesignSystemPage'), 'DesignSystemPage')
const isBrainBytesOSStandalone = import.meta.env.VITE_BRAIN_BYTES_OS_STANDALONE === '1'

function RouteFallback() {
  return <div aria-hidden="true" />
}

function AnimatedRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<RouteFallback />}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={isBrainBytesOSStandalone ? <BrainBytesOSPage /> : <LandingPage />} />
          <Route path="/blog" element={<BlogListPage />} />
          <Route path="/blog/*" element={<BlogPostPage />} />
          <Route path="/brain-bytes" element={<BrainBytesPage />} />
          <Route path="/brain-bytes-os" element={<BrainBytesOSPage />} />
          <Route path="/brain-bytes-demo" element={<BrainBytesDemoPage />} />
          <Route path="/brain-bytes-showcase" element={<BrainBytesShowcasePage />} />
          <Route path="/design-system" element={<DesignSystemPage />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  )
}

function App() {
  return (
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>
    </MotionConfig>
  )
}

export default App
