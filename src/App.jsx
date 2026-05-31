/**
 * [INPUT]: 依赖 react-router-dom 的 BrowserRouter/Routes/Route，framer-motion 的 MotionConfig/AnimatePresence
 * [OUTPUT]: 对外提供 App 根组件（支持页面路由过渡 + 可访问性动画控制）
 * [POS]: src/ 的应用入口组件，定义路由结构，包含 Apple 级页面切换动效
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { MotionConfig, AnimatePresence } from 'framer-motion'
import { LandingPage } from './pages/LandingPage'
import { BlogListPage } from './pages/BlogListPage'
import { BlogPostPage } from './pages/BlogPostPage'
import { BrainBytesPage } from './pages/BrainBytesPage'
import { DesignSystemPage } from './pages/DesignSystemPage'

function AnimatedRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/blog" element={<BlogListPage />} />
        <Route path="/blog/*" element={<BlogPostPage />} />
        <Route path="/brain-bytes" element={<BrainBytesPage />} />
        <Route path="/design-system" element={<DesignSystemPage />} />
      </Routes>
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
