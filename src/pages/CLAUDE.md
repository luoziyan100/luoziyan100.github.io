# src/pages/
> L2 | 父级: /CLAUDE.md

## 成员清单

**LandingPage.jsx**: 首页落地页，组合 landing/* 所有 Section 组件（Hero/Features/HowItWorks/Testimonials/FAQ/FinalCTA），提供完整的产品介绍和用户引导流程

**HomePage.jsx**: 原博客首页（已废弃），组合 Header/Hero/Footer 布局组件，使用设计系统样式

**BlogListPage.jsx**: 博客列表页，使用 shadcn/ui Card/Button/Skeleton 展示文章卡片，依赖 useState/useEffect、Header/Footer

**BlogPostPage.jsx**: 博客详情页，使用 shadcn/ui Button/Separator 包裹 Markdown 内容，react-markdown 渲染，设计系统 prose 样式

**BrainBytesPage.jsx**: Brain & Bytes（知觉档案）站中站列表首页，路由 /brain-bytes，fetch /brain-bytes/index.json，文章为自包含静态 HTML（原生 `<a>` 整页跳转）。视觉为红色学术风，样式见同目录 brain-bytes.css

**brain-bytes.css**: BrainBytesPage 专属样式，全部 scoped 于 .bb-root，刻意脱离 shadcn 设计系统（站中站独立品牌视觉，经用户授权的豁免）

**DesignSystemPage.jsx**: 设计系统展示页，演示所有 shadcn/ui 组件（17个）、配色系统、排版规范、使用约束，Tabs 组织内容

---

⚠️ **设计系统约束**:
- 所有颜色使用 CSS 变量（bg-primary, text-muted-foreground）
- 所有组件从 @/components/ui 引入
- 禁止使用裸 Tailwind 颜色（bg-blue-500 等）

法则: 成员完整·一行一文件·父级链接·技术词前置

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
