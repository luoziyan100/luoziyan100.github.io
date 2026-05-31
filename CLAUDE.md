# myweb - Vite + React 技术博客系统
Vite 7.x + React 19.x + TailwindCSS v4 + React Router + Markdown + **shadcn/ui 设计系统**

<directory>
src/ - 源代码 (5子目录: components, pages, data, lib)
  components/ui/ - shadcn/ui 组件库（17个组件）
  components/layouts/ - 布局组件（Header/Hero/Footer）
  components/landing/ - Landing Page Section 组件（Hero/Features/HowItWorks/Testimonials/FAQ/FinalCTA/Footer）
  pages/ - 页面组件（LandingPage/博客/设计系统）
  data/ - 内容数据（landing-content.js）
  lib/ - 工具库（utils/motion）
public/ - 静态资源 (2子目录: posts, brain-bytes)
docs/ - 分型文档 (3子目录: L1, L2, L3)
scripts/ - 构建工具 (博客索引 + Brain&Bytes 索引生成)
</directory>

<config>
vite.config.js - Vite + TailwindCSS 插件配置
jsconfig.json - 路径别名 @/* 映射
components.json - shadcn/ui 配置
package.json - 依赖清单与脚本
</config>

## 技术栈

**核心框架**:
- vite@7.3.1 - 极速 HMR 构建工具
- react@19.2.4 - 声明式 UI 框架
- react-dom@19.2.4 - React DOM 渲染
- react-router-dom@7.13.0 - 客户端路由

**设计系统（强制约束）**:
- **shadcn/ui@3.8.5** - 组件库（Amethyst Haze 主题 + 微拟物光影质感）
- **tailwindcss@4.2.0** - CSS 变量驱动
- **class-variance-authority** - 变体组件系统
- **tailwind-merge** - 类名合并工具

**微拟物设计语言（2026-02-21 升级）**:
- 禁止：backdrop-blur / 发光阴影 / 硬编码颜色
- 必须：CSS 变量 + color-mix / 三层阴影 / 大圆角 (20px+) / 微交互
- 已升级：Button/Card/Input/Badge（渐变 + 立体阴影）
**Markdown 渲染**:
- react-markdown@10.1.0 - React Markdown 渲染器
- gray-matter@4.0.3 - Frontmatter 解析
- remark-gfm@4.0.1 - GitHub 风格 Markdown
- rehype-highlight@7.0.2 - 代码语法高亮

**动效与图标**:
- framer-motion@12.34.3 - 生产级动效库（Apple 级 Spring 物理引擎）
- lucide-react@0.575.0 - 精美图标库

### Apple 动效系统（2026-02-21 升级）
- **核心哲学**: Spring 弹簧 + 阻尼落定 + 物理惯性（禁止线性动画）
- **Spring 配置**: snappy（400/30）、gentle（300/35）、bouncy（500/25）、smooth（200/40）、inertia（150/20）
- **13 种动画变体**: fadeInUp、scaleIn、slideIn、hoverLift、tapScale、modal、pageTransition 等
- **可访问性**: MotionConfig reducedMotion="user" 支持减少动画偏好
- **页面过渡**: AnimatePresence + pageTransition（所有页面）
- **交互动效**: Card hover lift、Button tap scale、列表 stagger 进场

## 设计系统约束（强制规范）

### ⚠️ 铁律：一切设计必须来自设计系统 + 微拟物光影质感

**颜色系统**:
- ✅ 使用设计系统变量：`bg-primary`, `text-muted-foreground`, `border-border`
- ❌ 禁止裸 Tailwind 颜色：`bg-blue-500`, `text-gray-400`
- ❌ 禁止 RGB/HEX 硬编码：`bg-[#3b82f6]`

**组件系统**:
- ✅ 所有组件引用自 `@/components/ui`
- ❌ 禁止自定义按钮/卡片/输入框等基础组件
- ❌ 禁止重复造轮子

### 🎨 微拟物设计语言（2026-02-21 升级）

**禁止事项**:
- ❌ backdrop-blur 毛玻璃
- ❌ 0 0 Npx 发光扩散阴影
- ❌ 硬编码颜色值（#xxx, rgb(), 裸 Tailwind 颜色）

**强制要求**:
- ✅ 全部使用 CSS 变量 + color-mix 派生
- ✅ 三层阴影结构：外投影 + 顶部高光 + 底部暗边
- ✅ 大圆角 (20px+)：rounded-2xl / rounded-3xl
- ✅ 统一微交互：hover: scale(1.02), active: scale(0.97), transition: 0.2s

**设计公式**:
```jsx
// 1. 渐变背景（三段式：亮 → 中 → 暗）
background: 'linear-gradient(135deg,
  var(--primary) 0%,
  color-mix(in srgb, var(--primary) 85%, black) 50%,
  color-mix(in srgb, var(--primary) 70%, black) 100%
)'

// 2. 立体阴影（凸起元素）
boxShadow: '0 4px 12px color-mix(in srgb, var(--primary) 35%, transparent),
  inset 0 1px 0 rgba(255,255,255,0.2),
  inset 0 -1px 0 rgba(0,0,0,0.1)'

// 3. 内凹阴影（输入框等）
boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.12),
  inset 0 1px 0 rgba(0,0,0,0.08),
  0 1px 0 rgba(255,255,255,0.05)'

// 4. Hover 增强
boxShadow: '0 6px 20px color-mix(in srgb, var(--primary) 45%, transparent),
  inset 0 1px 0 rgba(255,255,255,0.25),
  inset 0 -1px 0 rgba(0,0,0,0.15)'
```

**已升级组件**:
- Button（8 variants：default/primary/destructive/accent/secondary/outline/ghost/link）
- Card（3 variants：raised 凸起 / inset 内凹 / flat 扁平）
- Input（内凹效果 + 聚焦环）
- Badge（渐变背景 + 微阴影）

**已安装组件清单**:
```
Button, Input, Label, Card, Dialog, Sheet,
Tabs, Accordion, Dropdown Menu, Navigation Menu,
Badge, Separator, Avatar, Tooltip, Scroll Area,
Sonner, Skeleton
```

**示例代码**:
```jsx
// ✅ 正确：使用设计系统 + 微拟物
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

<Button variant="primary" size="lg">提交</Button>
<Card variant="raised">...</Card>

// ❌ 错误：自定义样式
<button className="bg-blue-500 text-white shadow-lg">提交</button>
```

## 架构决策

### 1. 设计系统优先
- **主题**: Amethyst Haze（亮色/暗色自适应）
- **颜色**: 通过 CSS 变量 `--primary`, `--background` 等定义
- **约束**: L1/L2/L3 文档强调设计系统约束

### 2. 博客内容管理
- 源内容：`myweb/content/posts/` (Hugo 风格)
- 构建时复制至：`public/posts/` (Vite 静态资源)
- 索引生成：`scripts/generate-posts-index.js` → `public/posts/index.json`
- Markdown 解析：客户端运行时通过 `react-markdown`

### 2.5 Brain & Bytes 站中站（论文精读）
- **定位**：独立品牌「Brain & Bytes / 知觉档案」，住在同一仓库/域名下的站中站，红色学术风（脱离 shadcn 设计系统的授权豁免）
- **内容**：自包含 HTML 文章，放 `public/brain-bytes/<slug>/index.html`（保留各自内联排版）
- **新增流程**：丢一篇 HTML 进 `public/brain-bytes/<slug>/index.html` → `npm run build`（或 `npm run bytes:index`）→ 自动抽取元数据 + 注入返回栏（幂等）+ 重建索引，列表页自动出现
- **索引生成**：`scripts/generate-bytes-index.js` → `public/brain-bytes/index.json`（标题/论文/作者/机构/来源）
- **列表页**：`src/pages/BrainBytesPage.jsx` 用原生 `<a>` 整页跳转到静态文章（不可用 React Link）

### 3. 路由设计
- `/` - Landing Page（首页落地页，组合 Hero/Features/HowItWorks/Testimonials/FAQ/FinalCTA 六个 Section）
- `/blog` - 博客列表（BlogListPage + Header + Footer）
- `/blog/*` - 博客详情（BlogPostPage + Header + Footer）
- `/brain-bytes` - Brain & Bytes（知觉档案）站中站列表首页（BrainBytesPage，红色学术风，独立视觉）
- `/brain-bytes/<slug>/` - 论文精读文章（自包含静态 HTML，位于 public/brain-bytes/，整页跳转）
- `/design-system` - 设计系统展示（DesignSystemPage）

### 4. Landing Page 架构
- **内容数据**: `src/data/landing-content.js`（包含 hero、features、howItWorks、testimonials、faq、finalCTA、footer 数据）
- **动效预设**: `src/lib/motion.js`（Framer Motion 变体：fadeInUp、staggerContainer、scaleIn、slideInLeft/Right、float）
- **Section 组件**: `src/components/landing/`（7个Section组件）
- **技术要求**:
  - 所有颜色使用 CSS 变量
  - 所有组件使用 shadcn/ui
  - Framer Motion whileInView 动效（viewport: once=true, margin=-100px）
  - 响应式布局（mobile-first + md/lg 断点）

### 5. L3 头部契约强制
所有业务文件（pages, components）必须包含 INPUT/OUTPUT/POS 头部注释，否则视为未完成。

### 6. 构建流程
```bash
npm run dev → posts:index (生成索引) → vite (启动开发服务器)
npm run build → posts:index → vite build (生产构建)
```

## 开发规范

### 设计系统规范（最高优先级）
1. **所有颜色使用 CSS 变量**
   ```css
   /* ✅ 正确 */
   className="bg-primary text-foreground border-border"

   /* ❌ 错误 */
   className="bg-blue-500 text-white border-gray-300"
   ```

2. **所有组件从 shadcn/ui 引入**
   ```jsx
   // ✅ 正确
   import { Card } from '@/components/ui/card'

   // ❌ 错误：自定义卡片
   function CustomCard() { ... }
   ```

3. **禁止绕过设计系统**
   - 不得使用 inline styles
   - 不得使用任意值 Tailwind 类（如 `bg-[#xxx]`）
   - 不得创建重复组件

### 文件命名
- 组件：PascalCase (`HomePage.jsx`)
- 工具：camelCase (`generate-posts-index.js`)
- 配置：kebab-case (`vite.config.js`)

### 代码风格
- 注释：中文 + ASCII 分块风格
- 函数：单一职责，不超过 20 行优先
- 组件：Hooks 优先，避免类组件

### 分形文档更新时机
- **L1 (CLAUDE.md)**: 技术栈变更、顶级模块增删、设计系统规范变更
- **L2 (模块/CLAUDE.md)**: 文件增删、接口变更
- **L3 (文件头部)**: 依赖变更、导出变更

---

法则: 极简·稳定·导航·版本精确·设计系统驱动
[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
