/**
 * [INPUT]: 依赖 pageContent.footer，react-router-dom Link，shadcn/ui Separator，lucide-react 图标
 * [OUTPUT]: 对外提供 LandingFooter 组件
 * [POS]: components/landing/ 的页脚区，四列导航 + 社交链接
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import { Link } from 'react-router-dom'
import { Separator } from '@/components/ui/separator'
import { Code2, Github, Mail, Twitter } from 'lucide-react'
import { pageContent } from '@/data/landing-content'

const socialIcons = {
  github: Github,
  email: Mail,
  twitter: Twitter,
}

export function LandingFooter() {
  const { footer, siteName } = pageContent
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {footer.columns.map((column, index) => (
            <div key={index} className="space-y-4">
              <h3 className="font-semibold text-sm uppercase tracking-wider">
                {column.title}
              </h3>
              <ul className="space-y-3">
                {column.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    {link.href.startsWith('http') ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        to={link.href}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="mb-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <Code2 className="h-5 w-5 text-primary" />
            <span className="font-semibold">{siteName}</span>
          </div>

          {/* Copyright & Legal */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>© {currentYear} {siteName}</span>
            {footer.legal.map((item, index) => (
              <Link
                key={index}
                to={item.href}
                className="hover:text-foreground transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-4">
            {footer.social.map((social, index) => {
              const Icon = socialIcons[social.name] || Code2
              return (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={social.name}
                >
                  <Icon className="h-5 w-5" />
                </a>
              )
            })}
          </div>
        </div>
      </div>
    </footer>
  )
}
