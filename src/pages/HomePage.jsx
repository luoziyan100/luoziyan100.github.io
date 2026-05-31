/**
 * [INPUT]: 依赖 layouts/Header/Hero/Footer 组件
 * [OUTPUT]: 对外提供 HomePage 页面组件
 * [POS]: pages/ 的首页入口，使用设计系统布局
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import { Header } from '@/components/layouts/Header'
import { Hero } from '@/components/layouts/Hero'
import { Footer } from '@/components/layouts/Footer'

export function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
      </main>
      <Footer />
    </div>
  )
}
