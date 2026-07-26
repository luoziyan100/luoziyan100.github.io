/**
 * [INPUT]: 依赖 Vite、@vitejs/plugin-react、@tailwindcss/vite 与 Node path
 * [OUTPUT]: 对外提供 Vite 构建配置（React/Tailwind 插件、@ 别名、路由级懒加载后的 vendor 分包策略与 chunk 体积阈值）
 * [POS]: 项目根构建入口，控制开发服务器与生产包结构，把重依赖留在按需 chunk，避免重新挤进主包
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

const markdownPackages = [
  'react-markdown',
  'remark-',
  'rehype-',
  'unified',
  'vfile',
  'micromark',
  'mdast-',
  'hast-',
  'unist-',
]

function manualChunks(id) {
  if (!id.includes('/node_modules/')) return undefined
  if (id.includes('/node_modules/three/')) return 'vendor-three'
  if (id.includes('/node_modules/katex/')) return 'vendor-katex'
  if (id.includes('/node_modules/highlight.js/')) return 'vendor-highlight'
  if (markdownPackages.some((name) => id.includes(`/node_modules/${name}`))) return 'vendor-markdown'
  if (id.includes('/node_modules/framer-motion/')) return 'vendor-motion'
  return undefined
}

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    chunkSizeWarningLimit: 560,
    rollupOptions: {
      output: { manualChunks },
    },
  },
})
