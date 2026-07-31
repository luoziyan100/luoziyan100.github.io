# src/pages/
> L2 | 父级: /CLAUDE.md

## 成员清单

**LandingPage.jsx**: 首页落地页，组合 landing/* 所有 Section 组件（Hero/Features/HowItWorks/Testimonials/FAQ/FinalCTA），提供完整的产品介绍和用户引导流程

**HomePage.jsx**: 原博客首页（已废弃），组合 Header/Hero/Footer 布局组件，使用设计系统样式

**BlogListPage.jsx**: 博客列表页，使用 shadcn/ui Card/Button/Skeleton 展示文章卡片，依赖 useState/useEffect、Header/Footer

**BlogPostPage.jsx**: 博客详情页，使用 shadcn/ui Button/Separator 包裹 Markdown 内容，react-markdown 渲染，设计系统 prose 样式

**BrainBytesPage.jsx**: Brain & Bytes 站中站列表首页，路由 /brain-bytes，fetch /brain-bytes/index.json，文章为自包含静态 HTML（原生 `<a>` 整页跳转）。视觉为红色学术风，样式见同目录 brain-bytes.css

**BrainBytesOSPage.jsx**: Brain & Bytes 主体叙事入口，路由 /brain-bytes-os；terminal -> booting -> world；默认 WORLD_VARIANT='field' 雪花鱼群背景，video/planet 可回退；主题书可拖拽，fetch index 打开列表与文章 iframe；世界页左下角 Connect 打开联系窗（GitHub / 人人都是产品经理 / Email）

**brain-bytes-terminal.js**: BrainBytesOSPage 的终端逐行启动纯逻辑，提供终端文案序列、行步进速度、总行数与按进度显隐行的函数，供页面组件与 Node 回归测试共享

**BrainBytesField.jsx**: 默认生成式背景组件，全屏 canvas 挂载雪花七鱼引擎

**brain-bytes-shoal-field.js**: 雪花鱼群 Canvas2D 引擎（六重雪花 + 原式十鱼），每帧轮询重绘一条鱼

**BrainBytesGlobe.jsx**: 可回退 Three.js 行星场景，仅 WORLD_VARIANT='planet' 时进入 chunk

**brain-bytes-planet.js**: BrainBytesGlobe 的可回退程序行星材质引擎，Canvas2D 生成 4K colorMap、bumpMap、roughnessMap、cloudMap 四层 Three.js 纹理，把旧行星版本的贴图复杂度隔离在场景组件之外

**brain-bytes.css**: BrainBytesPage 专属样式，全部 scoped 于 .bb-root，刻意脱离 shadcn 设计系统（站中站独立品牌视觉，经用户授权的豁免）

**brain-bytes-os.css**: BrainBytesOSPage 专属空间样式，全部 scoped 于 .bbos-root，提供终端入口、光束载入、field/video 世界底、书本阵列与拖拽反馈

**brain-bytes-os-windows.css**: BrainBytesOSPage 专属窗口样式，全部 scoped 于 .bbos-root/.bbos-*，提供 OS 风格主题 HTML 列表窗口、真实文章 iframe 阅读窗口、Connect 联系窗、窗口按钮与移动端窗口约束

**BrainBytesDemoPage.jsx**: Brain & Bytes 新叙事首页 Demo，路由 /brain-bytes-demo，fetch /brain-bytes/index.json，把论文组织为「时间长卷 + 七条谱系 + 精选路径」，验证从文章陈列到知识地图的改造方向

**BrainBytesShowcasePage.jsx**: Brain & Bytes 七方案实验室，路由 /brain-bytes-showcase，fetch /brain-bytes/index.json，用同一批 56 篇论文横向比较「问题之河 / 心智博物馆 / 问题任务树 / 思想星图 / 思想书 / 辩论场 / 实验台」七种信息架构，DOM 提供场景级隐喻元素

**brain-bytes-demo.css**: BrainBytesDemoPage 专属样式，全部 scoped 于 .bbd-root，融合冷纸底、水墨长卷、朱印章和主题色节点，保持 Demo 与旧版页面并行

**brain-bytes-showcase.css**: BrainBytesShowcasePage 专属样式，全部 scoped 于 .bbs-root，提供侧边方案切换和七种差异化原型视觉

**brain-bytes-showcase-scenes.css**: BrainBytesShowcasePage 场景增强样式，全部 scoped 于各 Demo class，把七个方案升级为河流、博物馆、树、星空、书、辩论场和实验台的可感知 Demo

**DesignSystemPage.jsx**: 设计系统展示页，演示所有 shadcn/ui 组件（17个）、配色系统、排版规范、使用约束，Tabs 组织内容

---

⚠️ **设计系统约束**:
- 所有颜色使用 CSS 变量（bg-primary, text-muted-foreground）
- 所有组件从 @/components/ui 引入
- 禁止使用裸 Tailwind 颜色（bg-blue-500 等）

法则: 成员完整·一行一文件·父级链接·技术词前置

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
