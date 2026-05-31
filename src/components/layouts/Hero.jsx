/**
 * [INPUT]: 依赖 shadcn/ui Button，framer-motion
 * [OUTPUT]: 对外提供 Hero 英雄区组件
 * [POS]: components/layouts 的主视觉区域，用于首页展示
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Sparkles } from 'lucide-react'

export function Hero() {
  return (
    <section className="container flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-8 py-12 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center gap-4 text-center"
      >
        <Badge variant="secondary" className="mb-2">
          <Sparkles className="mr-1 h-3 w-3" />
          设计系统驱动开发
        </Badge>

        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
          探索 AI 与代码智能
        </h1>

        <p className="max-w-[700px] text-lg text-muted-foreground sm:text-xl">
          技术博客 · 设计系统 · React + shadcn/ui
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-col gap-4 sm:flex-row"
      >
        <Button asChild size="lg" className="gap-2">
          <Link to="/blog">
            阅读博客
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>

        <Button asChild variant="outline" size="lg">
          <Link to="/design-system">
            设计系统
          </Link>
        </Button>
      </motion.div>
    </section>
  )
}
