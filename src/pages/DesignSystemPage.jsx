/**
 * [INPUT]: 依赖 shadcn/ui 所有已安装组件
 * [OUTPUT]: 对外提供 DesignSystemPage 页面组件（含微拟物展示）
 * [POS]: pages/ 的设计系统展示页，演示所有 UI 组件 + 微拟物光影质感
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { pageTransition } from '@/lib/motion'
import { ArrowLeft, Check, Copy } from 'lucide-react'

// =============================
//  shadcn/ui 组件导入
// =============================
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Skeleton } from '@/components/ui/skeleton'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

export function DesignSystemPage() {
  const [copied, setCopied] = useState(false)

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <TooltipProvider>
      <motion.div
        variants={pageTransition}
        initial="initial"
        animate="animate"
        exit="exit"
        className="min-h-screen bg-background">
        <div className="container py-12">
          <Link to="/">
            <Button variant="ghost" className="mb-8">
              <ArrowLeft className="mr-2 h-4 w-4" />
              返回首页
            </Button>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2 mb-12"
          >
            <h1 className="text-4xl font-bold tracking-tight">设计系统</h1>
            <p className="text-lg text-muted-foreground">
              基于 shadcn/ui · Amethyst Haze 主题 · 微拟物光影质感 · 所有组件必须来自此系统
            </p>
          </motion.div>

          <Tabs defaultValue="neomorphic" className="space-y-8">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="neomorphic">微拟物</TabsTrigger>
              <TabsTrigger value="colors">配色系统</TabsTrigger>
              <TabsTrigger value="typography">排版</TabsTrigger>
              <TabsTrigger value="components">组件</TabsTrigger>
              <TabsTrigger value="usage">使用规范</TabsTrigger>
            </TabsList>

            {/* 微拟物光影质感 */}
            <TabsContent value="neomorphic" className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>微拟物光影质感</CardTitle>
                  <CardDescription>
                    渐变背景 + 立体阴影 + 微交互 = 现代微拟物设计语言
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* Button */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Button - 三层阴影 + 渐变背景</h3>
                    <div className="flex flex-wrap gap-4 p-8 bg-muted/30 rounded-2xl mb-4">
                      <Button>Default</Button>
                      <Button variant="primary">Primary</Button>
                      <Button variant="destructive">Destructive</Button>
                      <Button variant="accent">Accent</Button>
                      <Button variant="secondary">Secondary</Button>
                      <Button size="lg">Large</Button>
                      <Button size="sm">Small</Button>
                    </div>
                    <Accordion type="single" collapsible>
                      <AccordionItem value="button-code">
                        <AccordionTrigger>查看代码</AccordionTrigger>
                        <AccordionContent>
                          <code className="block bg-muted p-4 rounded-lg text-xs">
{`// 渐变背景
background: linear-gradient(135deg,
  var(--primary) 0%,
  color-mix(in srgb, var(--primary) 85%, black) 50%,
  color-mix(in srgb, var(--primary) 70%, black) 100%
);

// 三层阴影：外投影 + 顶部高光 + 底部暗边
boxShadow: '0 4px 12px color-mix(in srgb, var(--primary) 35%, transparent),
  inset 0 1px 0 rgba(255,255,255,0.2),
  inset 0 -1px 0 rgba(0,0,0,0.1)';

// Hover 增强
hoverBoxShadow: '0 6px 20px color-mix(in srgb, var(--primary) 45%, transparent),
  inset 0 1px 0 rgba(255,255,255,0.25),
  inset 0 -1px 0 rgba(0,0,0,0.15)';`}
                          </code>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>

                  <Separator />

                  {/* Card */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Card - 凸起/内凹/扁平变体</h3>
                    <div className="grid gap-6 md:grid-cols-3 mb-4">
                      <Card variant="raised">
                        <CardHeader>
                          <CardTitle>Raised 凸起</CardTitle>
                          <CardDescription>外投影 + 顶部高光</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm">立体凸起效果，适合主要内容容器</p>
                        </CardContent>
                      </Card>

                      <Card variant="inset">
                        <CardHeader>
                          <CardTitle>Inset 内凹</CardTitle>
                          <CardDescription>内阴影 + 反向渐变</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm">内凹效果，适合输入区域</p>
                        </CardContent>
                      </Card>

                      <Card variant="flat">
                        <CardHeader>
                          <CardTitle>Flat 扁平</CardTitle>
                          <CardDescription>简单阴影</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm">扁平效果，适合次要信息</p>
                        </CardContent>
                      </Card>
                    </div>
                    <Accordion type="single" collapsible>
                      <AccordionItem value="card-code">
                        <AccordionTrigger>查看代码</AccordionTrigger>
                        <AccordionContent>
                          <code className="block bg-muted p-4 rounded-lg text-xs">
{`// Raised 凸起：外投影 + 高光
boxShadow: '0 8px 24px rgba(0,0,0,0.12),
  inset 0 1px 0 rgba(255,255,255,0.1),
  inset 0 -1px 0 rgba(0,0,0,0.05)'

// Inset 内凹：inset 阴影
boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.15),
  inset 0 1px 0 rgba(0,0,0,0.1),
  0 1px 0 rgba(255,255,255,0.05)'`}
                          </code>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>

                  <Separator />

                  {/* Input */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Input - 内凹效果 + 聚焦环</h3>
                    <div className="grid gap-4 max-w-md mb-4 p-6 bg-muted/30 rounded-2xl">
                      <Input placeholder="默认状态（内凹阴影）" />
                      <Input placeholder="聚焦时试试（加深 + 聚焦环）" />
                      <Input placeholder="禁用状态" disabled />
                    </div>
                    <Accordion type="single" collapsible>
                      <AccordionItem value="input-code">
                        <AccordionTrigger>查看代码</AccordionTrigger>
                        <AccordionContent>
                          <code className="block bg-muted p-4 rounded-lg text-xs">
{`// 默认内凹效果
boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.12),
  inset 0 1px 0 rgba(0,0,0,0.08),
  0 1px 0 rgba(255,255,255,0.05)'

// 聚焦加深 + 聚焦环
boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.15),
  inset 0 1px 0 rgba(0,0,0,0.1),
  0 0 0 2px color-mix(in srgb, var(--ring) 20%, transparent)'`}
                          </code>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>

                  <Separator />

                  {/* Badge */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Badge - 渐变背景 + 微阴影</h3>
                    <div className="flex flex-wrap gap-4 p-6 bg-muted/30 rounded-2xl mb-4">
                      <Badge>Default</Badge>
                      <Badge variant="secondary">Secondary</Badge>
                      <Badge variant="destructive">Destructive</Badge>
                      <Badge variant="accent">Accent</Badge>
                      <Badge variant="outline">Outline</Badge>
                    </div>
                    <Accordion type="single" collapsible>
                      <AccordionItem value="badge-code">
                        <AccordionTrigger>查看代码</AccordionTrigger>
                        <AccordionContent>
                          <code className="block bg-muted p-4 rounded-lg text-xs">
{`// 渐变背景 + 顶部高光
background: 'linear-gradient(135deg,
  var(--primary) 0%,
  color-mix(in srgb, var(--primary) 85%, black) 100%
)',
boxShadow: '0 2px 6px color-mix(in srgb, var(--primary) 30%, transparent),
  inset 0 1px 0 rgba(255,255,255,0.15)'`}
                          </code>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>

                  <Separator />

                  {/* 设计原则 */}
                  <div className="bg-muted/50 p-6 rounded-2xl">
                    <h3 className="text-lg font-semibold mb-4">微拟物设计原则</h3>
                    <div className="grid gap-4">
                      <div className="flex gap-3">
                        <Check className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold">禁止 backdrop-blur 毛玻璃</p>
                          <p className="text-sm text-muted-foreground">使用渐变背景替代</p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Check className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold">禁止 0 0 Npx 发光扩散阴影</p>
                          <p className="text-sm text-muted-foreground">使用 color-mix 派生半透明阴影</p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Check className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold">禁止硬编码颜色值</p>
                          <p className="text-sm text-muted-foreground">全部使用 CSS 变量 + color-mix</p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Check className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold">三层阴影结构</p>
                          <p className="text-sm text-muted-foreground">外投影 + 顶部高光 + 底部暗边</p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Check className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold">大圆角 (20px+)</p>
                          <p className="text-sm text-muted-foreground">
                            rounded-2xl (20px) · rounded-3xl (32px)
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Check className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold">统一微交互</p>
                          <p className="text-sm text-muted-foreground">
                            hover: scale(1.02) · active: scale(0.97) · transition: 0.2s
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 配色系统 */}
            <TabsContent value="colors" className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>主题色板</CardTitle>
                  <CardDescription>Amethyst Haze - 所有颜色必须使用设计系统变量</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <ColorSwatch name="primary" label="主色" />
                    <ColorSwatch name="secondary" label="辅助色" />
                    <ColorSwatch name="accent" label="强调色" />
                    <ColorSwatch name="muted" label="弱化色" />
                    <ColorSwatch name="destructive" label="危险色" />
                    <ColorSwatch name="border" label="边框" />
                    <ColorSwatch name="input" label="输入框" />
                    <ColorSwatch name="ring" label="聚焦环" />
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-sm font-semibold mb-4">使用示例</h3>
                    <code className="block bg-muted p-4 rounded-lg text-sm">
                      {`// ✅ 正确：使用设计系统颜色
<div className="bg-primary text-primary-foreground">
  主色按钮
</div>

// ❌ 错误：自定义颜色
<div className="bg-blue-500 text-white">
  不要使用
</div>`}
                    </code>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 排版 */}
            <TabsContent value="typography" className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>排版规范</CardTitle>
                  <CardDescription>标题、正文、代码字体层级</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h1 className="text-4xl font-bold">Heading 1 - 4xl</h1>
                    <h2 className="text-3xl font-bold">Heading 2 - 3xl</h2>
                    <h3 className="text-2xl font-semibold">Heading 3 - 2xl</h3>
                    <h4 className="text-xl font-semibold">Heading 4 - xl</h4>
                    <p className="text-base">Body - base / 正文段落</p>
                    <p className="text-sm text-muted-foreground">Small - sm / 辅助文字</p>
                    <code className="text-sm bg-muted px-2 py-1 rounded">代码片段 - monospace</code>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 组件 */}
            <TabsContent value="components" className="space-y-8">
              {/* Buttons */}
              <Card>
                <CardHeader>
                  <CardTitle>按钮 Button</CardTitle>
                  <CardDescription>所有按钮必须使用 shadcn/ui Button 组件</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-4">
                  <Button>Default</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="destructive">Destructive</Button>
                  <Button size="sm">Small</Button>
                  <Button size="lg">Large</Button>
                  <Button disabled>Disabled</Button>
                </CardContent>
              </Card>

              {/* Badges */}
              <Card>
                <CardHeader>
                  <CardTitle>徽章 Badge</CardTitle>
                  <CardDescription>标签、状态标识</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-4">
                  <Badge>Default</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="outline">Outline</Badge>
                  <Badge variant="destructive">Destructive</Badge>
                </CardContent>
              </Card>

              {/* Input */}
              <Card>
                <CardHeader>
                  <CardTitle>输入框 Input</CardTitle>
                  <CardDescription>表单输入组件</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="email">邮箱</Label>
                    <Input type="email" id="email" placeholder="example@email.com" />
                  </div>
                  <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="disabled">禁用状态</Label>
                    <Input id="disabled" placeholder="Disabled" disabled />
                  </div>
                </CardContent>
              </Card>

              {/* Avatar */}
              <Card>
                <CardHeader>
                  <CardTitle>头像 Avatar</CardTitle>
                  <CardDescription>用户头像组件</CardDescription>
                </CardHeader>
                <CardContent className="flex gap-4">
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" alt="Avatar" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <Avatar>
                    <AvatarFallback>AB</AvatarFallback>
                  </Avatar>
                </CardContent>
              </Card>

              {/* Accordion */}
              <Card>
                <CardHeader>
                  <CardTitle>折叠面板 Accordion</CardTitle>
                  <CardDescription>可折叠内容区域</CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger>设计原则</AccordionTrigger>
                      <AccordionContent>
                        一切设计必须来自设计系统的颜色和组件，禁止使用自定义样式。
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                      <AccordionTrigger>主题配置</AccordionTrigger>
                      <AccordionContent>
                        使用 Amethyst Haze 主题，通过 CSS 变量实现亮色/暗色模式。
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                      <AccordionTrigger>开发规范</AccordionTrigger>
                      <AccordionContent>
                        所有组件必须引用自 @/components/ui，禁止重复造轮子。
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>

              {/* Skeleton */}
              <Card>
                <CardHeader>
                  <CardTitle>骨架屏 Skeleton</CardTitle>
                  <CardDescription>加载占位符</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[250px]" />
                      <Skeleton className="h-4 w-[200px]" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 使用规范 */}
            <TabsContent value="usage" className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>设计系统约束</CardTitle>
                  <CardDescription>强制规范，不可违背</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <Check className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-semibold">所有颜色使用设计系统变量</p>
                        <code className="text-sm text-muted-foreground">
                          bg-primary, text-muted-foreground, border-border
                        </code>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Check className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-semibold">所有组件引用自 @/components/ui</p>
                        <code className="text-sm text-muted-foreground">
                          import {`{ Button }`} from '@/components/ui/button'
                        </code>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Check className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-semibold">禁止使用裸 Tailwind 颜色</p>
                        <code className="text-sm text-muted-foreground">
                          ❌ bg-blue-500 → ✅ bg-primary
                        </code>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Check className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-semibold">遵循 GEB 分形文档协议</p>
                        <code className="text-sm text-muted-foreground">
                          L1/L2/L3 文档必须同步更新
                        </code>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-sm font-semibold mb-4">快速复制</h3>
                    <div className="relative">
                      <Button
                        variant="outline"
                        size="sm"
                        className="absolute right-2 top-2"
                        onClick={() => handleCopy(`import { Button } from '@/components/ui/button'`)}
                      >
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                      <code className="block bg-muted p-4 rounded-lg text-sm pr-16">
                        {`import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'`}
                      </code>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>已安装组件清单</CardTitle>
                  <CardDescription>当前可用的 shadcn/ui 组件</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[
                      'Button', 'Input', 'Label', 'Card', 'Dialog', 'Sheet',
                      'Tabs', 'Accordion', 'Dropdown Menu', 'Navigation Menu',
                      'Badge', 'Separator', 'Avatar', 'Tooltip', 'Scroll Area',
                      'Sonner', 'Skeleton'
                    ].map(comp => (
                      <Badge key={comp} variant="secondary" className="justify-center">
                        {comp}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </motion.div>
    </TooltipProvider>
  )
}

// =============================
//  辅助组件：ColorSwatch
// =============================
function ColorSwatch({ name, label }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="space-y-2">
          <div className={`h-20 w-full rounded-lg bg-${name} border border-border`} />
          <div className="text-sm">
            <p className="font-medium">{label}</p>
            <code className="text-xs text-muted-foreground">--{name}</code>
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p>CSS 变量: var(--{name})</p>
      </TooltipContent>
    </Tooltip>
  )
}
