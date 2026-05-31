/**
 * [INPUT]: type, placeholder, disabled, className
 * [OUTPUT]: 输入框组件（微拟物内凹效果）
 * [POS]: UI基础层 - 表单输入，inset 阴影 + 渐变背景
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import * as React from "react"
import { cn } from "@/lib/utils"

/* ========================================
   输入框样式配置 - 微拟物内凹效果
   ======================================== */

const INPUT_STYLES = {
  default: {
    background: 'linear-gradient(135deg, color-mix(in srgb, var(--background) 97%, black) 0%, var(--background) 100%)',
    boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.12), inset 0 1px 0 rgba(0,0,0,0.08), 0 1px 0 rgba(255,255,255,0.05)',
  },
  focused: {
    boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.15), inset 0 1px 0 rgba(0,0,0,0.1), 0 0 0 2px color-mix(in srgb, var(--ring) 20%, transparent)',
  },
}

const Input = React.forwardRef(({ className, type, style, ...props }, ref) => {
  const [isFocused, setIsFocused] = React.useState(false)

  const combinedStyle = {
    background: INPUT_STYLES.default.background,
    boxShadow: isFocused ? INPUT_STYLES.focused.boxShadow : INPUT_STYLES.default.boxShadow,
    ...style,
  }

  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-2xl border border-input px-4 py-2 text-base",
        "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
        "placeholder:text-muted-foreground",
        "focus-visible:outline-none",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "transition-all duration-200",
        "md:text-sm",
        className
      )}
      ref={ref}
      style={combinedStyle}
      onFocus={(e) => { setIsFocused(true); props.onFocus?.(e) }}
      onBlur={(e) => { setIsFocused(false); props.onBlur?.(e) }}
      {...props}
    />
  )
})
Input.displayName = "Input"

export { Input }
