/**
 * [INPUT]: 依赖 pageContent.faq，framer-motion，shadcn/ui Accordion
 * [OUTPUT]: 对外提供 FAQSection 组件
 * [POS]: components/landing/ 的常见问题区，Accordion 交互
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import { motion } from 'framer-motion'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { fadeInUp, staggerContainer } from '@/lib/motion'
import { pageContent } from '@/data/landing-content'

export function FAQSection() {
  const { faq } = pageContent

  return (
    <section className="py-20 md:py-28 lg:py-32 bg-muted/30">
      <div className="container max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer}
          className="space-y-12"
        >
          {/* Section Header */}
          <motion.h2
            variants={fadeInUp}
            className="text-4xl md:text-5xl font-bold tracking-tight text-center"
          >
            {faq.headline}
          </motion.h2>

          {/* FAQ Accordion */}
          <motion.div variants={fadeInUp}>
            <Accordion type="single" collapsible className="space-y-4">
              {faq.items.map((item, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border border-border rounded-2xl px-6 bg-card"
                >
                  <AccordionTrigger className="text-left text-lg font-semibold hover:no-underline">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-base text-muted-foreground leading-relaxed">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
