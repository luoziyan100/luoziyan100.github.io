# shadcn/ui 设计系统使用指南

## ⚠️ 强制约束

**铁律：一切设计必须来自设计系统的颜色和组件**

### 1. 颜色系统

✅ **正确使用 CSS 变量**：
```jsx
<div className="bg-primary text-primary-foreground">
  主色按钮
</div>

<p className="text-muted-foreground">
  辅助文字
</p>
```

❌ **禁止使用裸 Tailwind 颜色**：
```jsx
<div className="bg-blue-500 text-white">  // ❌ 错误
  不要使用
</div>

<p className="text-gray-400">  // ❌ 错误
  不要使用
</p>
```

### 2. 组件系统

✅ **所有组件从 shadcn/ui 引入**：
```jsx
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

<Button variant="outline">点击</Button>
```

❌ **禁止自定义基础组件**：
```jsx
// ❌ 不要创建自定义按钮
function CustomButton() {
  return <button className="px-4 py-2 bg-blue-500">...</button>
}
```

## 可用组件清单

当前已安装 17 个组件：

**核心交互**:
- Button
- Input
- Label

**布局容器**:
- Card
- Dialog
- Sheet
- Separator

**导航组件**:
- Tabs
- Accordion
- Dropdown Menu
- Navigation Menu

**展示组件**:
- Badge
- Avatar
- Tooltip
- Skeleton

**工具组件**:
- Scroll Area
- Sonner (Toast 通知)

## 主题配置

**当前主题**: Amethyst Haze

**颜色变量**:
- `--primary` - 主色
- `--secondary` - 辅助色
- `--accent` - 强调色
- `--muted` - 弱化色
- `--destructive` - 危险色
- `--background` - 背景色
- `--foreground` - 前景色
- `--border` - 边框色

**使用方式**:
```jsx
// Tailwind 类名会自动映射到 CSS 变量
className="bg-primary text-primary-foreground"
// 等价于：
style={{
  backgroundColor: 'var(--primary)',
  color: 'var(--primary-foreground)'
}}
```

## 设计系统展示

访问 `/design-system` 查看完整组件演示和使用规范。

---

📖 **更多文档**: 查阅 `CLAUDE.md` 了解完整设计系统约束
