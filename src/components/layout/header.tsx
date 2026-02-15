'use client'

import Link from 'next/link'
import { CartIconWithBadge } from '@/features/cart/components/cart-icon-with-badge'
import { ThemeToggle } from '@/components/theme-toggle'

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Brand/Title */}
          <Link href="/" className="flex flex-col hover:opacity-80 transition-opacity">
            <h1 className="text-xl font-bold tracking-tight">ShopHub</h1>
            <span className="text-xs text-muted-foreground">Your Modern Store</span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-4 sm:gap-6">
            <Link 
              href="/products" 
              className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-2 py-1"
            >
              Products
            </Link>
            <Link 
              href="/categories" 
              className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-2 py-1"
            >
              Categories
            </Link>
            <ThemeToggle />
            <CartIconWithBadge />
          </nav>
        </div>
      </div>
    </header>
  )
}
