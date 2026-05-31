/**
 * [INPUT]: 依赖 pageContent.testimonials，framer-motion，shadcn/ui Card/Avatar
 * [OUTPUT]: 对外提供 TestimonialsSection 组件
 * [POS]: components/landing/ 的用户评价展示区，Grid 布局
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Quote } from 'lucide-react'
import { fadeInUp, staggerContainer, scaleIn } from '@/lib/motion'
import { pageContent } from '@/data/landing-content'

export function TestimonialsSection() {
  const { testimonials } = pageContent

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
          <motion.h2
            variants={fadeInUp}
            className="text-4xl md:text-5xl font-bold tracking-tight text-center"
          >
            {testimonials.headline}
          </motion.h2>

          {/* Testimonials Grid */}
          <motion.div
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {testimonials.items.map((testimonial, index) => (
              <motion.div key={index} variants={scaleIn}>
                <Card variant="inset" className="h-full">
                  <CardContent className="pt-6 space-y-6">
                    {/* Quote Icon */}
                    <Quote className="w-10 h-10 text-primary opacity-40" />

                    {/* Quote Text */}
                    <p className="text-base leading-relaxed">
                      "{testimonial.quote}"
                    </p>

                    {/* Author Info */}
                    <div className="flex items-center gap-4 pt-4 border-t border-border">
                      <Avatar size="default">
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                          {testimonial.author[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold">{testimonial.author}</div>
                        <div className="text-sm text-muted-foreground">
                          {testimonial.role} · {testimonial.company}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
