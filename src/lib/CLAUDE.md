# src/lib/
> L2 | 父级: /CLAUDE.md

## 成员清单

**utils.js**: 工具函数模块，提供 cn 函数（clsx + tailwind-merge），用于条件化合并 className

**motion.js**: Framer Motion 动效预设模块（Apple 级 Spring 物理引擎），提供 13 种动画变体 + 5 种 Spring 配置 + 3 种缓动曲线，统一动画体验

---

⚠️ **Apple 动效哲学**:
- 所有动画使用 Spring 物理引擎（type: "spring"）
- stiffness: 200-500，damping: 25-40，控制弹性和阻尼
- 进场用 Spring，退场用短 duration（0.15-0.2s）
- 支持 prefers-reduced-motion（通过 MotionConfig）

**Spring 配置**:
- snappy（400/30）: 标准交互（按钮、卡片 hover）
- gentle（300/35）: 柔和过渡（面板展开、模态框）
- bouncy（500/25/0.8）: 弹性强调（成功反馈）
- smooth（200/40/1.2）: 优雅落定（页面过渡）
- inertia（150/20/0.5）: 惯性滑动（列表、轮播）

**动画变体**:
- fadeInUp, scaleIn, slideInLeft/Right: 元素进场
- staggerContainer, staggerItem: 序列进场（0.06s 间隔）
- hoverLift, tapScale: 交互反馈
- modalOverlay, modalContent: 模态框
- pageTransition: 页面路由过渡
- float: 持续循环浮动
- scrollTrigger: 滚动触发配置

法则: 成员完整·一行一文件·父级链接·技术词前置·Apple 动效标准

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
