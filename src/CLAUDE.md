# src/
> L2 | 父级: /CLAUDE.md

## 成员清单

**App.jsx**: React 应用根组件，组合 BrowserRouter、AnimatePresence、MotionConfig，并通过 React.lazy/Suspense 对所有页面做路由级代码分割；`VITE_BRAIN_BYTES_OS_STANDALONE=1` 时根路径直接渲染 BrainBytesOSPage，普通构建仍显示 LandingPage

**main.jsx**: React DOM 挂载入口，把 App 渲染到 `#root` 并加载全局样式

**index.css**: TailwindCSS v4 与 shadcn/ui 主题变量入口，定义全站设计系统基础 token

**components/**: 可复用 UI 与布局模块，包含 shadcn/ui 基础组件、旧 layout 组件和 landing section 组件

**data/**: 静态内容数据模块，当前主要承载 landing 页面文案结构

**lib/**: 工具函数与动效预设模块，提供 utils、Framer Motion variants 等跨页面能力

**pages/**: 路由页面模块，包含博客、Brain & Bytes、OS、Demo、Showcase 与设计系统页面，局部地图见 pages/CLAUDE.md

---

法则: 入口轻量·页面按需·依赖随路由流动

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
