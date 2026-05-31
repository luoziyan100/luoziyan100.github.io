# L2 - 模块设计（中层架构）

## 🧩 模块划分

### 1. 核心模块（Core）
**职责**: 应用生命周期、路由、状态管理

**文件清单**:
- `src/main.jsx` - React 渲染入口
- `src/App.jsx` - 根组件（路由容器）

**依赖**:
- react 19.x（StrictMode、Hooks）
- react-dom/client（createRoot）

---

### 2. 样式模块（Styles）
**职责**: TailwindCSS v4 配置与全局样式

**文件清单**:
- `src/index.css` - Tailwind 导入（`@import "tailwindcss"`）
- `vite.config.js` - Tailwind Vite 插件配置

**关键变更（v4）**:
- ✅ 使用 `@import "tailwindcss"`
- ❌ 废弃 `@tailwind base/components/utilities`

---

### 3. 动效模块（Animations）
**职责**: 统一动效抽象

**推荐工具**:
- **framer-motion**: 组件级动效
  ```jsx
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} />
  ```
- **Tailwind 动画**: 简单过渡（`transition-all`, `hover:scale-105`）

**使用场景**:
- 页面切换：`motion` 包裹路由
- 列表渲染：`AnimatePresence` + `layout`
- 手势交互：`whileHover`/`whileTap`

---

### 4. 图标模块（Icons）
**职责**: 统一图标系统

**策略**:
- **系统图标**: `lucide-react`
  ```jsx
  import { Home, User, Settings } from 'lucide-react'
  ```
- **品牌图标**: `react-icons/si`
  ```jsx
  import { SiGithub, SiTwitter } from 'react-icons/si'
  ```

**尺寸规范**:
- 16px：内联文本图标
- 20px：按钮/导航图标
- 24px：标题/卡片图标

---

### 5. 工具模块（Utils）
**职责**: 通用函数库

**核心库**:
- **clsx**: 条件类名合并
  ```js
  clsx('base', { 'active': isActive })
  ```
- **tailwind-variants**: 变体组件
  ```js
  const button = tv({
    base: 'px-4 py-2',
    variants: { color: { primary: 'bg-blue-500' } }
  })
  ```

---

## 📐 模块关系图
```
┌─────────────┐
│   Core      │ ──┐
│  (main.jsx) │   │
└─────────────┘   │
                  ▼
┌─────────────┐ ┌──────────────┐
│   Styles    │ │  Components  │
│ (Tailwind)  │ │  (L3 层)     │
└─────────────┘ └──────────────┘
                  │
        ┌─────────┼─────────┐
        ▼         ▼         ▼
  ┌─────────┐ ┌──────┐ ┌───────┐
  │Animation│ │Icons │ │ Utils │
  └─────────┘ └──────┘ └───────┘
```

---
📝 下一步：查阅 L3 文档了解组件实现细节
