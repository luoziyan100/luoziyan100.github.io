/**
 * [INPUT]: 依赖 landing/* 所有 Section 组件，layouts/Header，framer-motion 页面过渡
 * [OUTPUT]: 对外提供 LandingPage 页面组件（Apple 级页面过渡）
 * [POS]: pages/ 的首页落地页，组合 Hero/Features/HowItWorks/Testimonials/FAQ/FinalCTA/Footer + Spring 动画
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import { motion } from 'framer-motion'
import { Header } from '@/components/layouts/Header'
import { LandingHero } from '@/components/landing/LandingHero'
import { FeaturesSection } from '@/components/landing/FeaturesSection'
import { HowItWorksSection } from '@/components/landing/HowItWorksSection'
import { TestimonialsSection } from '@/components/landing/TestimonialsSection'
import { FAQSection } from '@/components/landing/FAQSection'
import { FinalCTASection } from '@/components/landing/FinalCTASection'
import { LandingFooter } from '@/components/landing/LandingFooter'
import { pageTransition } from '@/lib/motion'

export function LandingPage() {
  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen flex flex-col"
    >
      <Header />
      <main className="flex-1">
        <LandingHero />
        <FeaturesSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <FAQSection />
        <FinalCTASection />
      </main>
      <LandingFooter />
    </motion.div>
  )
}
