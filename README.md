# Vite + React + TailwindCSS v4 + shadcn/ui 技术博客

现代化前端工程模板，采用分型架构设计，整合了个人技术博客内容，**强制使用 shadcn/ui 设计系统**。

## 特性亮点

- ⚡️ **Vite 7.x** - 极速 HMR 构建工具
- ⚛️ **React 19.x** - 声明式 UI 框架
- 🎨 **TailwindCSS v4** - Utilities-first CSS（Vite 插件版）
- 🎨 **shadcn/ui** - 设计系统组件库（Amethyst Haze 主题）
- 📝 **Markdown 博客** - 14 篇技术文章，Frontmatter + GFM + 代码高亮
- 🎭 **Framer Motion** - 生产级动效库
- 🧭 **React Router** - 客户端路由（首页/列表/详情/设计系统）
- 🎯 **Lucide React** - 精美图标库

## 设计系统约束（强制规范）

### ⚠️ 铁律：一切设计必须来自设计系统

**颜色系统**:
```jsx
// ✅ 正确：使用 CSS 变量
<div className="bg-primary text-primary-foreground">主色</div>

// ❌ 错误：裸 Tailwind 颜色
<div className="bg-blue-500 text-white">禁止</div>
```

**组件系统**:
```jsx
// ✅ 正确：shadcn/ui 组件
import { Button } from '@/components/ui/button'
<Button variant="outline">点击</Button>

// ❌ 错误：自定义组件
<button className="px-4 py-2 bg-blue-500">禁止</button>
```

**查看完整设计系统**: 访问 http://localhost:5173/design-system

## 快速启动

```bash
# 安装依赖（已完成）
npm install

# 启动开发服务器
npm run dev

# 生产构建
npm run build

# 预览构建产物
npm run preview
```

## 技术栈

- ⚡️ **Vite 7.x** - 极速 HMR 构建工具
- ⚛️ **React 19.x** - 声明式 UI 框架
- 🎨 **TailwindCSS v4** - Utilities-first CSS（Vite 插件版）
- 🎭 **Framer Motion** - 生产级动效库
- 🎯 **Lucide React** - 精美图标库
- 🎪 **React Icons** - 品牌图标集合

## 分型文档架构

项目采用三层文档结构，层层递进：

- **[L1 - 项目概览](./docs/L1/README.md)** - 顶层架构与技术栈
- **[L2 - 模块设计](./docs/L2/README.md)** - 中层模块划分与关系
- **[L3 - 组件实现](./docs/L3/README.md)** - 底层组件开发细节

## 目录结构

```
/
├── docs/              # 分型文档（L1/L2/L3）
├── myweb/             # 原博客源文件（Hugo 结构）
├── public/
│   └── posts/         # 博客 Markdown 文件（构建时复制）
├── scripts/
│   └── generate-posts-index.js  # 博客索引生成器
├── src/
│   ├── pages/         # 页面组件（首页/列表/详情）
│   ├── components/    # UI 组件（待扩展）
│   ├── hooks/         # 自定义 Hooks（待扩展）
│   ├── utils/         # 工具函数（待扩展）
│   ├── main.jsx       # 应用入口
│   ├── App.jsx        # 路由配置
│   └── index.css      # Tailwind 导入
├── vite.config.js     # Vite + Tailwind 配置
├── jsconfig.json      # 路径别名配置
├── CLAUDE.md          # GEB L1 项目宪法
└── package.json       # 依赖清单
```

## 博客系统

### 页面路由
- `/` - 首页（欢迎页）
- `/blog` - 博客列表（支持标签过滤）
- `/blog/{slug}` - 博客详情（Markdown 渲染）

### 博客内容
共 **14 篇**技术文章，主题涵盖：
- AI 代理与上下文工程
- 代码智能与软件工程
- 多智能体系统设计
- AI 辅助编程实践

### 构建流程
1. **索引生成**: `scripts/generate-posts-index.js` 扫描 `public/posts/`
2. **输出**: `public/posts/index.json`（文章元数据）
3. **渲染**: 客户端通过 `react-markdown` + `gray-matter` 解析

## 开发约定

### 样式系统
- 使用 TailwindCSS v4 原子类（`@import "tailwindcss"`）
- 条件类名使用 `clsx` 合并
- 组件变体使用 `tailwind-variants`

### 动效系统
- 页面过渡：`framer-motion` variants
- 简单动画：Tailwind `transition-*` 工具类
- 手势交互：`whileHover` / `whileTap`

### 图标系统
- **UI 图标**：`lucide-react`（Home, User, Settings...）
- **品牌图标**：`react-icons/si`（SiGithub, SiTwitter...）

## 初始化完成

初始化日期：2026-02-21

### 已安装依赖
```json
{
  "核心框架": {
    "vite": "^7.3.1",
    "react": "^19.2.4",
    "react-dom": "^19.2.4",
    "react-router-dom": "^7.13.0"
  },
  "样式系统": {
    "@tailwindcss/vite": "^4.2.0",
    "tailwindcss": "^4.2.0",
    "clsx": "^2.1.1",
    "tailwind-variants": "^3.2.2"
  },
  "Markdown": {
    "react-markdown": "^10.1.0",
    "gray-matter": "^4.0.3",
    "remark-gfm": "^4.0.1",
    "rehype-highlight": "^7.0.2"
  },
  "动效图标": {
    "framer-motion": "^12.34.3",
    "lucide-react": "^0.575.0",
    "react-icons": "^5.5.0"
  }
}
```

## GEB 分形文档系统

遵循 GEB 协议，维护三层文档结构：

- **L1 (CLAUDE.md)**: 项目宪法 - 技术栈、架构决策、开发规范
- **L2 (模块/CLAUDE.md)**: 模块地图 - 成员清单、接口暴露
- **L3 (文件头部)**: 契约注释 - INPUT/OUTPUT/POS

### 强制规范
- 每次代码变更必须同步更新文档
- 所有业务文件必须包含 L3 头部注释
- 文档与代码同构，否则视为未完成

---

🚀 **博客系统已就绪，访问 http://localhost:5173 查看**

📚 查阅 `CLAUDE.md` 了解完整架构 | 遵循 GEB 分形文档协议

