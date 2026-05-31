/**
 * [INPUT]: 无依赖
 * [OUTPUT]: 对外提供 pageContent 对象（Landing Page 所有内容数据）
 * [POS]: data/ 的内容配置模块，被 Landing Page 各 Section 组件消费
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

export const pageContent = {
  // Meta
  siteName: 'yan的AI时代之旅',
  tagline: '专注于AI研究与开发，分享从Zero to Hero的AI学习路径和技术见解',

  // Hero Section
  hero: {
    headline: '与AI共同成长，探索智能时代',
    subheadline: '记录AI时代的点滴，分享大语言模型、vibe coding的实践经验，探索如何与AI建立更好的协作关系',
    primaryCTA: '开始探索',
    secondaryCTA: '阅读博客',
    socialProof: '已分享 14+ 篇深度文章',
    visual: 'hero',
  },

  // Features Section
  features: {
    headline: '全方位AI学习路径',
    subheadline: '从理论到实践，从工具到思维，构建完整的AI认知体系',
    items: [
      {
        icon: 'Brain',
        title: '大语言模型研究',
        description: '深入探索Transformer架构、提示工程、模型微调等核心技术，理解AI的工作原理'
      },
      {
        icon: 'Code2',
        title: 'Vibe Coding实践',
        description: '体验AI驱动的编程新范式，用Claude、GPT等工具提升开发效率10倍以上'
      },
      {
        icon: 'Lightbulb',
        title: 'AI时代思维',
        description: '探讨AI对社会、工作、学习的深远影响，建立与AI协作的正确心智模型'
      },
      {
        icon: 'BookOpen',
        title: 'Zero to Hero路径',
        description: '提供从入门到精通的完整学习路线图，记录真实的成长轨迹和踩坑经验'
      },
      {
        icon: 'Users',
        title: 'AI的朋友',
        description: '不把AI当工具，而是当作学习伙伴，探索人机协作的新可能性'
      },
      {
        icon: 'Sparkles',
        title: '前沿技术跟踪',
        description: '持续关注机器学习、深度学习领域的最新进展，保持技术敏锐度'
      },
    ],
    layout: 'grid',
  },

  // How It Works Section
  howItWorks: {
    headline: '学习路径三步走',
    steps: [
      {
        step: 1,
        title: '建立认知框架',
        description: '理解AI的基础原理、核心概念，建立正确的认知体系',
        visual: 'book'
      },
      {
        step: 2,
        title: '实践动手操作',
        description: '通过真实项目和案例，掌握AI工具的实战应用技巧',
        visual: 'code'
      },
      {
        step: 3,
        title: '持续迭代进化',
        description: '跟踪前沿动态，不断更新知识库，与AI共同成长',
        visual: 'rocket'
      },
    ],
  },

  // Testimonials Section
  testimonials: {
    headline: '读者反馈',
    items: [
      {
        quote: '非常实用的AI学习资源，从理论到实践都有深入讲解，特别是vibe coding的部分让我大开眼界',
        author: '李明',
        role: '前端工程师',
        company: '互联网公司',
        avatar: ''
      },
      {
        quote: '文章质量很高，不仅教技术，更重要的是传递了与AI协作的思维方式',
        author: '张伟',
        role: '产品经理',
        company: '科技创业公司',
        avatar: ''
      },
      {
        quote: '作为AI初学者，这里的内容帮我快速建立了系统的认知框架',
        author: '王芳',
        role: '学生',
        company: '计算机专业',
        avatar: ''
      },
    ],
    layout: 'grid',
  },

  // FAQ Section
  faq: {
    headline: '常见问题',
    items: [
      {
        question: '这个博客适合谁？',
        answer: '适合对AI感兴趣的所有人，无论你是技术从业者、学生还是其他领域的专业人士。内容涵盖从入门到进阶的各个层次。'
      },
      {
        question: '什么是Vibe Coding？',
        answer: 'Vibe Coding是一种AI辅助编程的新范式，强调与AI工具（如Claude、GPT）的深度协作，通过自然语言对话来编写和优化代码，极大提升开发效率。'
      },
      {
        question: '需要什么技术背景？',
        answer: '不需要特定的技术背景。文章会从基础概念讲起，逐步深入。如果你有编程基础会更容易理解某些技术细节，但不是必须的。'
      },
      {
        question: '更新频率如何？',
        answer: '会持续更新，分享最新的AI学习心得和实践经验。建议关注GitHub或社交媒体账号以获取更新通知。'
      },
      {
        question: '如何与作者联系？',
        answer: '可以通过邮件 zluo5820@gmail.com 或社交媒体（GitHub、X、小红书）联系我，欢迎交流讨论。'
      },
    ],
  },

  // Final CTA Section
  finalCTA: {
    headline: '开始你的AI学习之旅',
    subheadline: '加入我们，一起探索AI时代的无限可能',
    primaryCTA: '阅读最新文章',
    secondaryCTA: '查看归档',
  },

  // Footer
  footer: {
    columns: [
      {
        title: '内容',
        links: [
          { label: '博客', href: '/blog' },
          { label: '归档', href: '/archives' },
          { label: '标签', href: '/tags' },
          { label: '关于', href: '/about' },
        ]
      },
      {
        title: '关注领域',
        links: [
          { label: '大语言模型', href: '/tags' },
          { label: 'Vibe Coding', href: '/tags' },
          { label: '社会发展', href: '/tags' },
          { label: '机器学习', href: '/tags' },
        ]
      },
      {
        title: '资源',
        links: [
          { label: '设计系统', href: '/design-system' },
          { label: '搜索', href: '/search' },
        ]
      },
      {
        title: '联系方式',
        links: [
          { label: 'GitHub', href: 'https://github.com/luoziyan100' },
          { label: 'Email', href: 'mailto:zluo5820@gmail.com' },
          { label: 'X (Twitter)', href: 'https://x.com/Ziyan00001' },
          { label: '小红书', href: 'https://www.xiaohongshu.com/user/profile/66ab7e91000000001d0221ce' },
        ]
      },
    ],
    legal: [
      { label: '隐私政策', href: '/privacy' },
      { label: '使用条款', href: '/terms' },
    ],
    social: [
      { name: 'github', url: 'https://github.com/luoziyan100' },
      { name: 'email', url: 'mailto:zluo5820@gmail.com' },
      { name: 'twitter', url: 'https://x.com/Ziyan00001' },
    ],
  },
}
