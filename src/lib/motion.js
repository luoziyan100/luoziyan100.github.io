/**
 * [INPUT]: 无依赖
 * [OUTPUT]: 对外提供 Framer Motion 动效预设变体（Apple 级 Spring 物理引擎）
 * [POS]: lib/ 的动效配置模块，被所有组件消费
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

/* ========================================
   Apple 风格 Spring 配置
   每个动画都有：自然起势 + 优雅落定 + 物理重量感
   ======================================== */

// 标准交互 - 按钮、卡片 hover
export const snappy = { type: "spring", stiffness: 400, damping: 30 }

// 柔和过渡 - 面板展开、模态框
export const gentle = { type: "spring", stiffness: 300, damping: 35 }

// 弹性强调 - 成功反馈、关键元素
export const bouncy = { type: "spring", stiffness: 500, damping: 25, mass: 0.8 }

// 优雅落定 - 页面过渡、大元素移动
export const smooth = { type: "spring", stiffness: 200, damping: 40, mass: 1.2 }

// 惯性滑动 - 列表、轮播
export const inertia = { type: "spring", stiffness: 150, damping: 20, mass: 0.5 }

/* ========================================
   Apple 缓动曲线（非 Spring 场景）
   ======================================== */

export const appleEase = [0.25, 0.1, 0.25, 1.0]
export const appleEaseOut = [0.22, 1, 0.36, 1]
export const appleDecelerate = [0, 0, 0.2, 1]

/* ========================================
   动画预设变体库
   ======================================== */

// 1. 淡入上移（Spring 版）
export const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  }
}

// 2. 弹性缩放
export const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25
    }
  }
}

// 3. 序列进场容器
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1
    }
  }
}

// 4. 序列进场子项
export const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 350,
      damping: 30
    }
  }
}

// 5. 悬浮提升（Apple Card 效果）
export const hoverLift = {
  rest: {
    scale: 1,
    y: 0
  },
  hover: {
    scale: 1.02,
    y: -4,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25
    }
  }
}

// 6. 点击反馈（弹性回弹）
export const tapScale = {
  rest: { scale: 1 },
  pressed: {
    scale: 0.96,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 30
    }
  }
}

// 7. 左滑入
export const slideInLeft = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  }
}

// 8. 右滑入
export const slideInRight = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  }
}

// 9. 浮动动画（持续循环）
export const float = {
  initial: { y: 0 },
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
}

// 10. 模态框背景
export const modalOverlay = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.2 }
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.15 }
  }
}

// 11. 模态框内容（优雅落定）
export const modalContent = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 35
    }
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.15 }
  }
}

// 12. 页面路由过渡
export const pageTransition = {
  initial: { opacity: 0, x: 20 },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 40
    }
  },
  exit: {
    opacity: 0,
    x: -20,
    transition: { duration: 0.2 }
  }
}

// 13. 滚动触发配置
export const scrollTrigger = {
  viewport: { once: true, margin: "-100px" }
}
