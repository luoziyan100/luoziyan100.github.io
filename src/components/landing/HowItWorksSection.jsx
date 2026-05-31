/**
 * [INPUT]: 依赖 pageContent.howItWorks，framer-motion，shadcn/ui Badge，lucide-react 图标
 * [OUTPUT]: 对外提供 HowItWorksSection 组件
 * [POS]: components/landing/ 的使用流程展示区，步骤式引导
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Book, Code2, Rocket, ArrowRight } from 'lucide-react'
import { fadeInUp, staggerContainer, slideInLeft, slideInRight } from '@/lib/motion'
import { pageContent } from '@/data/landing-content'

const iconMap = {
  book: Book,
  code: Code2,
  rocket: Rocket,
}

export function HowItWorksSection() {
  const { howItWorks } = pageContent

  return (
    <section className="py-20 md:py-28 lg:py-32 bg-muted/30">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer}
          className="space-y-16"
        >
          {/* Section Header */}
          <motion.h2
            variants={fadeInUp}
            className="text-4xl md:text-5xl font-bold tracking-tight text-center"
          >
            {howItWorks.headline}
          </motion.h2>

          {/* Steps */}
          <div className="space-y-12 md:space-y-20">
            {howItWorks.steps.map((step, index) => {
              const Icon = iconMap[step.visual] || Book
              const isEven = index % 2 === 0

              return (
                <motion.div
                  key={step.step}
                  variants={isEven ? slideInLeft : slideInRight}
                  className="flex flex-col md:flex-row items-center gap-8"
                >
                  {/* Step Number & Icon */}
                  <div className="flex-shrink-0 relative">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                      <Icon className="w-16 h-16 text-primary-foreground" />
                    </div>
                    <Badge
                      variant="default"
                      className="absolute -top-2 -right-2 w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold"
                    >
                      {step.step}
                    </Badge>
                  </div>

                  {/* Connector Arrow (except last step) */}
                  {index < howItWorks.steps.length - 1 && (
                    <div className="hidden lg:block flex-shrink-0">
                      <ArrowRight className="w-12 h-12 text-muted-foreground/40" />
                    </div>
                  )}

                  {/* Step Content */}
                  <div className="flex-1 text-center md:text-left space-y-3">
                    <h3 className="text-2xl md:text-3xl font-bold">
                      {step.title}
                    </h3>
                    <p className="text-lg text-muted-foreground max-w-2xl">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
