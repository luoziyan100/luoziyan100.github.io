/**
 * [INPUT]: 依赖 react-router-dom Link，shadcn/ui Button/NavigationMenu
 * [OUTPUT]: 对外提供 Header 布局组件
 * [POS]: components/layouts 的顶部导航栏，包含 Logo 和导航链接
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import { Code2, Home, BookOpen, Palette, Brain } from 'lucide-react'

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <div className="container flex h-16 items-center">
        {/* Logo */}
        <Link to="/" className="mr-6 flex items-center space-x-2">
          <Code2 className="h-6 w-6" />
          <span className="hidden font-bold sm:inline-block">
            Blog
          </span>
        </Link>

        {/* Navigation */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                <Link to="/">
                  <Home className="mr-2 h-4 w-4" />
                  首页
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                <Link to="/blog">
                  <BookOpen className="mr-2 h-4 w-4" />
                  博客
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                <Link to="/brain-bytes">
                  <Brain className="mr-2 h-4 w-4" />
                  Brain & Bytes
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                <Link to="/design-system">
                  <Palette className="mr-2 h-4 w-4" />
                  设计系统
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Mobile Menu Placeholder */}
        <div className="flex flex-1 items-center justify-end space-x-2 md:hidden">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/design-system">
              <Palette className="h-5 w-5" />
              <span className="sr-only">设计系统</span>
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
