# src/components/ui/
> L2 | 父级: /CLAUDE.md

## 成员清单（微拟物光影质感升级）

**button.jsx**: 按钮组件，微拟物立体渐变效果，三层阴影（外投影 + 顶部高光 + 底部暗边），8 种 variant（default/primary/destructive/accent/secondary/outline/ghost/link），6 种 size，hover 微交互，支持 isLoading/leftIcon/rightIcon

**card.jsx**: 卡片容器组件，微拟物凸起/内凹效果，3 种 variant（raised 凸起/inset 内凹/flat 扁平），渐变背景 + 三层阴影，hover 微交互，包含 CardHeader/CardTitle/CardDescription/CardContent/CardFooter

**input.jsx**: 输入框组件，微拟物内凹效果，inset 阴影 + 渐变背景，聚焦时加深阴影 + 聚焦环（color-mix 派生），圆角 rounded-2xl，支持所有原生 input 属性

**badge.jsx**: 徽章组件，微拟物渐变效果，5 种 variant（default/secondary/destructive/accent/outline），渐变背景 + 微阴影 + 顶部高光，color-mix 派生颜色

**label.jsx**: 标签组件，表单标签，文本样式

**dialog.jsx**: 对话框组件，模态弹窗，包含 DialogTrigger/DialogContent/DialogHeader/DialogTitle/DialogDescription/DialogFooter

**sheet.jsx**: 侧边栏组件，滑入式面板，包含 SheetTrigger/SheetContent/SheetHeader/SheetTitle/SheetDescription/SheetFooter

**tabs.jsx**: 选项卡组件，内容切换，包含 TabsList/TabsTrigger/TabsContent

**accordion.jsx**: 折叠面板组件，可折叠内容，包含 AccordionItem/AccordionTrigger/AccordionContent

**dropdown-menu.jsx**: 下拉菜单组件，包含 DropdownMenuTrigger/DropdownMenuContent/DropdownMenuItem

**navigation-menu.jsx**: 导航菜单组件，包含 NavigationMenuList/NavigationMenuItem/NavigationMenuLink

**separator.jsx**: 分隔线组件，水平/垂直分隔

**avatar.jsx**: 头像组件，包含 AvatarImage/AvatarFallback

**tooltip.jsx**: 提示框组件，包含 TooltipProvider/TooltipTrigger/TooltipContent

**scroll-area.jsx**: 滚动区域组件，自定义滚动条

**sonner.jsx**: Toast 通知组件，消息提示

**skeleton.jsx**: 骨架屏组件，加载占位符

---

⚠️ **微拟物设计语言（强制约束）**:

**禁止**:
- backdrop-blur 毛玻璃
- 0 0 Npx 发光扩散阴影
- 硬编码颜色值（#xxx, rgb(), 裸 Tailwind 颜色）

**必须**:
- 全部使用 CSS 变量 + color-mix 派生
- 三层阴影结构（外投影 + 顶部高光 + 底部暗边）
- 大圆角 (20px+)：rounded-2xl / rounded-3xl
- 统一微交互：hover: scale(1.02), active: scale(0.97), transition: 0.2s

**设计公式**:
```js
// 渐变背景
background: linear-gradient(135deg,
  var(--primary) 0%,
  color-mix(in srgb, var(--primary) 85%, black) 50%,
  color-mix(in srgb, var(--primary) 70%, black) 100%
)

// 立体阴影（凸起元素）
boxShadow: '0 4px 12px color-mix(in srgb, var(--primary) 35%, transparent),
  inset 0 1px 0 rgba(255,255,255,0.2),
  inset 0 -1px 0 rgba(0,0,0,0.1)'

// 内凹阴影（输入框等）
boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.12),
  inset 0 1px 0 rgba(0,0,0,0.08),
  0 1px 0 rgba(255,255,255,0.05)'
```

---

法则: 成员完整·一行一文件·父级链接·技术词前置·微拟物设计约束

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
