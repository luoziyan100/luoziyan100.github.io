/**
 * [INPUT]: variant (raised/inset), className, children
 * [OUTPUT]: 卡片容器组件（微拟物凸起/内凹效果）
 * [POS]: UI基础层 - 内容容器，三层阴影 + 渐变背景
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

/* ========================================
   卡片样式配置 - 微拟物凸起/内凹效果
   ======================================== */

const CARD_STYLES = {
  raised: {
    background: 'linear-gradient(135deg, var(--card) 0%, color-mix(in srgb, var(--card) 95%, black) 100%)',
    boxShadow: '0 8px 24px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.05)',
    hoverBoxShadow: '0 12px 32px rgba(0,0,0,0.16), inset 0 1px 0 rgba(255,255,255,0.15), inset 0 -1px 0 rgba(0,0,0,0.08)',
  },
  inset: {
    background: 'linear-gradient(135deg, color-mix(in srgb, var(--card) 95%, black) 0%, var(--card) 100%)',
    boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.15), inset 0 1px 0 rgba(0,0,0,0.1), 0 1px 0 rgba(255,255,255,0.05)',
    hoverBoxShadow: 'inset 0 3px 12px rgba(0,0,0,0.2), inset 0 1px 0 rgba(0,0,0,0.15), 0 1px 0 rgba(255,255,255,0.08)',
  },
  flat: {
    background: 'var(--card)',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    hoverBoxShadow: '0 4px 12px rgba(0,0,0,0.12)',
  },
}

const cardVariants = cva(
  "rounded-3xl border border-border text-card-foreground transition-all duration-200",
  {
    variants: {
      variant: {
        raised: "hover:scale-[1.01]",
        inset: "",
        flat: "hover:scale-[1.005]",
      },
    },
    defaultVariants: {
      variant: "raised",
    },
  }
)

const Card = React.forwardRef(({ className, variant = "raised", style, ...props }, ref) => {
  const [isHovered, setIsHovered] = React.useState(false)
  const styleConfig = CARD_STYLES[variant] || CARD_STYLES.raised

  const combinedStyle = {
    background: styleConfig.background,
    boxShadow: isHovered ? styleConfig.hoverBoxShadow : styleConfig.boxShadow,
    ...style,
  }

  return (
    <div
      ref={ref}
      className={cn(cardVariants({ variant }), className)}
      style={combinedStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    />
  )
})
Card.displayName = "Card"

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("font-semibold leading-none tracking-tight", className)}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
