# L1 - 项目概览（顶层架构）

## 🎯 项目定位
Vite + React + TailwindCSS v4 技术博客系统，整合 14 篇个人博客文章

## 📦 技术栈
- **构建工具**: Vite 7.x（极速 HMR）
- **框架**: React 19.x + React Router 7.x
- **样式**: TailwindCSS v4（Vite 插件版）
- **Markdown**: react-markdown + gray-matter + remark-gfm
- **代码高亮**: rehype-highlight（GitHub Dark 主题）
- **动效**: Framer Motion 12.x
- **图标**: Lucide React + React Icons

## 🏗️ 架构理念
- **分型设计**: L1（概览）→ L2（模块）→ L3（组件）
- **GEB 协议**: 代码与文档同构，变更必须同步
- **原子化 CSS**: Tailwind utilities-first
- **声明式动效**: Motion components
- **客户端路由**: React Router BrowserRouter

## 📝 博客系统
### 内容来源
- 原始文件：`myweb/content/posts/`（Hugo 格式）
- 构建复制至：`public/posts/`（Vite 静态资源）
- 索引生成：`scripts/generate-posts-index.js`
- 输出索引：`public/posts/index.json`（14 篇文章）

### 页面路由
- `/` - 首页（HomePage）：欢迎页 + 导航入口
- `/blog` - 列表页（BlogListPage）：文章卡片 + 标签过滤
- `/blog/{slug}` - 详情页（BlogPostPage）：Markdown 渲染 + 代码高亮

### Markdown 特性
- ✅ Frontmatter 解析（title/date/author/tags/excerpt）
- ✅ GitHub 风格 Markdown（GFM）
- ✅ 代码语法高亮（GitHub Dark 主题）
- ✅ 响应式排版（Tailwind prose）

## 🚀 快速启动
```bash
npm run dev    # 启动开发服务器（自动生成博客索引）
npm run build  # 生产构建（索引 + 优化）
npm run preview # 预览构建产物
npm run posts:index # 手动生成博客索引
```

## 📂 目录结构
```
/
├── docs/          # 分型文档（L1/L2/L3）
├── myweb/         # 原博客源文件（Hugo 结构）
├── public/
│   └── posts/     # 博客 Markdown（构建时复制）
├── scripts/
│   └── generate-posts-index.js # 博客索引生成器
├── src/
│   ├── pages/     # 页面组件（HomePage/BlogListPage/BlogPostPage）
│   ├── components/ # UI 组件（待扩展）
│   ├── main.jsx   # 应用入口
│   ├── App.jsx    # 路由配置
│   └── index.css  # Tailwind 导入
├── vite.config.js # Vite + Tailwind 配置
├── CLAUDE.md      # GEB L1 项目宪法
└── package.json   # 依赖清单
```

## 🎨 设计约定
- **图标系统**: lucide-react（UI 图标）+ react-icons/si（品牌图标）
- **动效系统**: framer-motion（滑入/过渡/手势）
- **工具函数**: clsx（条件类名）+ tailwind-variants（变体组件）

## 🎨 设计系统（强制约束）

### shadcn/ui + Amethyst Haze 主题

**铁律：一切设计必须来自设计系统的颜色和组件**

**颜色系统**:
- ✅ 使用 CSS 变量：`bg-primary`, `text-muted-foreground`, `border-border`
- ❌ 禁止裸 Tailwind 颜色：`bg-blue-500`, `text-gray-400`
- ❌ 禁止 RGB/HEX 硬编码：`bg-[#3b82f6]`

**组件系统**:
- ✅ 所有组件引用自 `@/components/ui`
- ❌ 禁止自定义按钮/卡片/输入框等基础组件
- ❌ 禁止重复造轮子

**已安装组件**:
```
Button, Input, Label, Card, Dialog, Sheet,
Tabs, Accordion, Dropdown Menu, Navigation Menu,
Badge, Separator, Avatar, Tooltip, Scroll Area,
Sonner, Skeleton
```

**设计系统展示**: 访问 `/design-system` 查看完整组件演示

---
📅 初始化完成：2026-02-21
📝 博客集成完成：2026-02-21（14 篇文章）
🎯 下一步：访问 http://localhost:5173 查看博客系统
📚 架构文档：查阅 `/CLAUDE.md` 了解 GEB 分形系统
