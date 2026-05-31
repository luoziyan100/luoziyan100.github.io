# L3 - 组件实现（底层细节）

## 🔩 组件规范

### 组件文件结构
```
src/
├── components/
│   ├── ui/              # 基础 UI 组件（按钮、输入框）
│   ├── features/        # 业务功能组件
│   └── layouts/         # 布局组件（Header、Footer）
├── hooks/               # 自定义 Hooks
├── utils/               # 工具函数
└── constants/           # 常量配置
```

---

## 🎨 组件开发模板

### 1. 基础组件示例（Button）
```jsx
// src/components/ui/Button.jsx
import { motion } from 'framer-motion'
import { tv } from 'tailwind-variants'

const button = tv({
  base: 'px-4 py-2 rounded-lg font-semibold transition-colors',
  variants: {
    variant: {
      primary: 'bg-blue-500 text-white hover:bg-blue-600',
      secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    },
    size: {
      sm: 'text-sm px-3 py-1',
      md: 'text-base px-4 py-2',
      lg: 'text-lg px-6 py-3',
    }
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  }
})

export function Button({
  children,
  variant,
  size,
  className,
  ...props
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={button({ variant, size, className })}
      {...props}
    >
      {children}
    </motion.button>
  )
}
```

---

### 2. 自定义 Hook 示例
```jsx
// src/hooks/useToggle.js
import { useState, useCallback } from 'react'

export function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue)

  const toggle = useCallback(() => {
    setValue(v => !v)
  }, [])

  return [value, toggle]
}
```

---

### 3. 动效预设（Motion Variants）
```jsx
// src/utils/motionVariants.js
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
}

export const slideUp = {
  initial: { y: 20, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: -20, opacity: 0 }
}

export const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

// 使用示例
<motion.div variants={fadeIn} initial="initial" animate="animate">
  内容
</motion.div>
```

---

### 4. 图标组件封装
```jsx
// src/components/ui/Icon.jsx
import * as LucideIcons from 'lucide-react'

export function Icon({ name, size = 20, className, ...props }) {
  const LucideIcon = LucideIcons[name]

  if (!LucideIcon) {
    console.warn(`Icon "${name}" not found`)
    return null
  }

  return (
    <LucideIcon
      size={size}
      className={className}
      {...props}
    />
  )
}

// 使用
<Icon name="Home" size={24} className="text-blue-500" />
```

---

### 5. 布局组件示例
```jsx
// src/components/layouts/Container.jsx
import clsx from 'clsx'

export function Container({ children, className, ...props }) {
  return (
    <div
      className={clsx(
        'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
```

---

## 🎯 开发准则

### Tailwind 类名约定
- **布局**: `flex`, `grid`, `container`
- **间距**: `p-4`（padding）, `m-2`（margin）
- **颜色**: `bg-blue-500`, `text-white`
- **响应式**: `sm:text-lg`, `md:grid-cols-2`

### Framer Motion 最佳实践
- ✅ 使用 `variants` 管理复杂动画
- ✅ `AnimatePresence` 处理列表/条件渲染
- ✅ `layout` prop 自动布局动画
- ❌ 避免内联复杂动画配置

### 性能优化
- 使用 `React.memo` 避免重渲染
- `useCallback`/`useMemo` 缓存函数/值
- 动态导入（`React.lazy`）代码分割

---

## 📋 组件清单（待扩展）

### UI 组件
- [ ] Button（按钮）
- [ ] Input（输入框）
- [ ] Card（卡片）
- [ ] Modal（模态框）
- [ ] Toast（通知）

### 布局组件
- [ ] Header（顶栏）
- [ ] Footer（底栏）
- [ ] Sidebar（侧边栏）
- [ ] Container（容器）

### 功能组件
- [ ] ThemeToggle（主题切换）
- [ ] Navigation（导航）

---
📝 组件开发时参考此文档保持一致性
