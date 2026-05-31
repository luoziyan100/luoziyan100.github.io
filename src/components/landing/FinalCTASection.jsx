/**
 * [INPUT]: 依赖 pageContent.finalCTA，framer-motion，react-router-dom Link，shadcn/ui Button
 * [OUTPUT]: 对外提供 FinalCTASection 组件
 * [POS]: components/landing/ 的最终行动号召区，强渐变背景
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ArrowRight, BookOpen } from 'lucide-react'
import { fadeInUp, staggerContainer, float } from '@/lib/motion'
import { pageContent } from '@/data/landing-content'

export function FinalCTASection() {
  const { finalCTA } = pageContent

  return (
    <section className="py-20 md:py-28 lg:py-32 relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-accent to-secondary opacity-10 -z-10" />
      <motion.div
        variants={float}
        initial="initial"
        animate="animate"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/20 rounded-full blur-3xl -z-10"
      />

      <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer}
          className="text-center space-y-8"
        >
          {/* Headline */}
          <motion.h2
            variants={fadeInUp}
            className="text-4xl md:text-5xl font-bold tracking-tight"
          >
            {finalCTA.headline}
          </motion.h2>

          {/* Subheadline */}
          <motion.p
            variants={fadeInUp}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            {finalCTA.subheadline}
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button asChild size="lg" className="gap-2">
              <Link to="/blog">
                <BookOpen className="h-5 w-5" />
                {finalCTA.primaryCTA}
              </Link>
            </Button>

            <Button asChild variant="outline" size="lg" className="gap-2">
              <Link to="/archives">
                {finalCTA.secondaryCTA}
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
