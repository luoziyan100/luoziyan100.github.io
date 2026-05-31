/**
 * [INPUT]: 依赖 react-router-dom 的 useParams，从 index.json 加载文章，shadcn/ui 组件，framer-motion 动效
 * [OUTPUT]: 对外提供 BlogPostPage 页面组件（Apple 级页面过渡）
 * [POS]: pages/ 的博客详情页，使用设计系统组件渲染 Markdown + Spring 动画
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import { Calendar, User, ArrowLeft } from 'lucide-react'
import { Header } from '@/components/layouts/Header'
import { Footer } from '@/components/layouts/Footer'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { pageTransition, fadeInUp } from '@/lib/motion'
import 'highlight.js/styles/github-dark.css'

export function BlogPostPage() {
  const { '*': slug } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const decodedSlug = decodeURIComponent(slug)

    fetch('/posts/index.json')
      .then(res => res.json())
      .then(posts => {
        const found = posts.find(p => p.slug === decodedSlug)
        if (found) {
          setPost(found)
        } else {
          setError('文章未找到')
        }
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to load posts:', err)
        setError(err.message)
        setLoading(false)
      })
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-lg">加载中...</div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!post || error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">文章未找到</h1>
            <p className="text-muted-foreground">请检查文章链接是否正确</p>
            <Button asChild>
              <Link to="/blog">返回博客列表</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen flex flex-col"
    >
      <Header />
      <main className="flex-1">
        <article className="container max-w-4xl py-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <Button variant="ghost" asChild className="mb-8">
              <Link to="/blog">
                <ArrowLeft className="mr-2 h-4 w-4" />
                返回列表
              </Link>
            </Button>
          </motion.div>

          <motion.header
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="space-y-4 mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              {post.title}
            </h1>

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {new Date(post.date).toLocaleDateString('zh-CN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                {post.author}
              </div>
            </div>

            <Separator />
          </motion.header>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 35, delay: 0.1 }}
            className="prose prose-neutral dark:prose-invert max-w-none
              prose-headings:scroll-mt-20
              prose-p:text-muted-foreground
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline
              prose-strong:text-foreground
              prose-code:text-foreground prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded
              prose-pre:bg-muted prose-pre:border
              prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground
              prose-li:text-muted-foreground
              prose-hr:border-border
              prose-img:rounded-lg prose-img:shadow-md"
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
            >
              {post.content}
            </ReactMarkdown>
          </motion.div>
        </article>
      </main>
      <Footer />
    </motion.div>
  )
}
