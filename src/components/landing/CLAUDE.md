# src/components/landing/
> L2 | 父级: /CLAUDE.md

## 成员清单（Landing Page Section 组件）

**LandingHero.jsx**: 首屏英雄区组件，包含标题、副标题、CTA按钮、社交证明徽章、浮动动画视觉元素，使用 framer-motion 入场动效，最小高度 min-h-screen

**FeaturesSection.jsx**: 特性展示区组件，Grid 布局（3列响应式），展示 6 个核心功能特性，每个特性卡片包含图标、标题、描述，使用 Card raised variant + scale hover 交互

**HowItWorksSection.jsx**: 使用流程展示区组件，步骤式引导（3步），每步包含圆形图标背景、步骤数字徽章、标题、描述，步骤间箭头连接，交替左右入场动效

**TestimonialsSection.jsx**: 用户评价展示区组件，Grid 布局（3列响应式），展示 3 条用户评价，每条评价包含引号图标、评价文本、头像、姓名、职位，使用 Card inset variant

**FAQSection.jsx**: 常见问题区组件，使用 shadcn/ui Accordion 实现折叠交互，单列居中布局（max-w-3xl），展示 5 个常见问题，每个问题独立折叠

**FinalCTASection.jsx**: 最终行动号召区组件，强渐变背景（primary + accent + secondary），居中布局，包含标题、副标题、双 CTA 按钮，浮动背景动效

**LandingFooter.jsx**: 页脚组件，四列导航布局（响应式折叠），包含品牌Logo、版权信息、法律链接、社交媒体图标，使用 Separator 分隔

---

⚠️ **设计系统约束**:
- 所有颜色使用 CSS 变量（--primary、--accent、--secondary、--muted）
- 所有组件从 @/components/ui 引入（Card、Button、Badge、Accordion、Avatar、Separator）
- 所有动效使用 @/lib/motion.js 预设变体
- 所有内容数据从 @/data/landing-content.js 导入

**技术要求**:
- Framer Motion: whileInView + viewport 触发，once: true 避免重复
- 响应式: mobile-first，使用 md: lg: 断点
- 无障碍: 语义化 HTML (section, h2, p)，focus-visible 样式
- 性能: 动效使用 GPU 加速属性（opacity, transform）

法则: 成员完整·一行一文件·父级链接·技术词前置

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
