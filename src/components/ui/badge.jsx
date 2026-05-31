/**
 * [INPUT]: variant, className, children
 * [OUTPUT]: 徽章组件（微拟物渐变效果）
 * [POS]: UI基础层 - 状态标识，渐变背景 + 立体阴影
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

/* ========================================
   徽章样式配置 - 微拟物渐变效果
   ======================================== */

const BADGE_STYLES = {
  default: {
    background: 'linear-gradient(135deg, var(--primary) 0%, color-mix(in srgb, var(--primary) 85%, black) 100%)',
    boxShadow: '0 2px 6px color-mix(in srgb, var(--primary) 30%, transparent), inset 0 1px 0 rgba(255,255,255,0.15)',
  },
  secondary: {
    background: 'linear-gradient(135deg, var(--secondary) 0%, color-mix(in srgb, var(--secondary) 90%, black) 100%)',
    boxShadow: '0 1px 4px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.1)',
  },
  destructive: {
    background: 'linear-gradient(135deg, var(--destructive) 0%, color-mix(in srgb, var(--destructive) 85%, black) 100%)',
    boxShadow: '0 2px 6px color-mix(in srgb, var(--destructive) 30%, transparent), inset 0 1px 0 rgba(255,255,255,0.15)',
  },
  accent: {
    background: 'linear-gradient(135deg, var(--accent) 0%, color-mix(in srgb, var(--accent) 85%, black) 100%)',
    boxShadow: '0 2px 6px color-mix(in srgb, var(--accent) 30%, transparent), inset 0 1px 0 rgba(255,255,255,0.15)',
  },
  outline: {
    background: 'transparent',
    boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
  },
}

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold transition-all duration-200",
  {
    variants: {
      variant: {
        default: "border-transparent text-primary-foreground",
        secondary: "border-transparent text-secondary-foreground",
        destructive: "border-transparent text-destructive-foreground",
        accent: "border-transparent text-accent-foreground",
        outline: "border border-input text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({ className, variant = "default", style, ...props }) {
  const styleConfig = BADGE_STYLES[variant] || BADGE_STYLES.default

  const combinedStyle = {
    background: styleConfig.background,
    boxShadow: styleConfig.boxShadow,
    ...style,
  }

  return (
    <div
      className={cn(badgeVariants({ variant }), className)}
      style={combinedStyle}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
