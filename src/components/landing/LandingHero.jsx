/**
 * [INPUT]: 依赖 pageContent.hero，framer-motion，react-router-dom Link，shadcn/ui Button/Badge，lucide-react 图标
 * [OUTPUT]: 对外提供 LandingHero 组件
 * [POS]: components/landing/ 的首屏英雄区，Landing Page 第一视觉焦点
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Sparkles, Brain } from 'lucide-react'
import { fadeInUp, staggerContainer, float } from '@/lib/motion'
import { pageContent } from '@/data/landing-content'

export function LandingHero() {
  const { hero } = pageContent

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-background -z-10" />

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center text-center gap-8"
        >
          {/* Badge */}
          <motion.div variants={fadeInUp}>
            <Badge variant="secondary" className="px-4 py-2">
              <Sparkles className="mr-2 h-4 w-4" />
              {hero.socialProof}
            </Badge>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeInUp}
            className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight max-w-4xl"
          >
            {hero.headline}
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={fadeInUp}
            className="text-lg md:text-xl text-muted-foreground max-w-3xl"
          >
            {hero.subheadline}
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Button asChild size="lg" className="gap-2">
              <Link to="/blog">
                {hero.primaryCTA}
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>

            <Button asChild variant="outline" size="lg">
              <Link to="/blog">
                {hero.secondaryCTA}
              </Link>
            </Button>
          </motion.div>

          {/* Visual */}
          <motion.div
            variants={float}
            initial="initial"
            animate="animate"
            className="mt-16 relative"
          >
            <div className="w-64 h-64 md:w-80 md:h-80 rounded-full bg-gradient-to-br from-primary via-accent to-secondary opacity-20 blur-3xl" />
            <Brain className="absolute inset-0 m-auto w-32 h-32 md:w-40 md:h-40 text-primary opacity-80" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
