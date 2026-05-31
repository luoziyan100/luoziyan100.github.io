/**
 * [INPUT]: 依赖 pageContent.features，framer-motion，shadcn/ui Card，lucide-react 图标
 * [OUTPUT]: 对外提供 FeaturesSection 组件
 * [POS]: components/landing/ 的特性展示区，Grid 布局展示核心功能
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import * as Icons from 'lucide-react'
import { fadeInUp, staggerContainer, scaleIn } from '@/lib/motion'
import { pageContent } from '@/data/landing-content'

export function FeaturesSection() {
  const { features } = pageContent

  return (
    <section className="py-20 md:py-28 lg:py-32">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer}
          className="space-y-16"
        >
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <motion.h2
              variants={fadeInUp}
              className="text-4xl md:text-5xl font-bold tracking-tight"
            >
              {features.headline}
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-lg md:text-xl text-muted-foreground"
            >
              {features.subheadline}
            </motion.p>
          </div>

          {/* Features Grid */}
          <motion.div
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.items.map((feature, index) => {
              const Icon = Icons[feature.icon] || Icons.Sparkles
              return (
                <motion.div key={index} variants={scaleIn}>
                  <Card variant="raised" className="h-full hover:shadow-xl transition-all duration-300">
                    <CardHeader>
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <CardTitle className="text-2xl">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
