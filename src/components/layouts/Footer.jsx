/**
 * [INPUT]: 依赖 shadcn/ui Separator
 * [OUTPUT]: 对外提供 Footer 底部组件
 * [POS]: components/layouts 的页脚，包含版权和链接
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import { Separator } from '@/components/ui/separator'
import { Code2 } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-background">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Code2 className="h-6 w-6" />
              <span className="font-bold">Blog</span>
            </div>
            <p className="text-sm text-muted-foreground">
              探索 AI、代码智能与软件工程
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">导航</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <a href="/" className="hover:text-foreground transition-colors">
                  首页
                </a>
              </li>
              <li>
                <a href="/blog" className="hover:text-foreground transition-colors">
                  博客
                </a>
              </li>
              <li>
                <a href="/design-system" className="hover:text-foreground transition-colors">
                  设计系统
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">技术栈</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>React 19</li>
              <li>Vite 7</li>
              <li>TailwindCSS v4</li>
              <li>shadcn/ui</li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">关于</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>使用 GEB 分形文档系统</li>
              <li>遵循设计系统规范</li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Blog. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Built with shadcn/ui · Amethyst Haze Theme
          </p>
        </div>
      </div>
    </footer>
  )
}
