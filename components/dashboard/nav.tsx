'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Box, Plus, Sparkles, Settings, Rocket } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', icon: Home, label: 'Home' },
  { href: '/dashboard/deploys', icon: Box, label: 'Deploys' },
  { href: '/dashboard/new', icon: Plus, label: 'New', highlight: true },
  { href: '/dashboard/ai', icon: Sparkles, label: 'AI' },
  { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
]

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 flex-col border-r border-border/50 bg-card/50 backdrop-blur-sm">
        {/* Logo */}
        <div className="p-6 border-b border-border/50">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Rocket className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xl font-bold">EliteHost</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== '/dashboard' && pathname.startsWith(item.href))
              
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50',
                      item.highlight && !isActive && 'bg-primary/5'
                    )}
                  >
                    <item.icon className={cn(
                      'w-5 h-5',
                      item.highlight && 'text-primary'
                    )} />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border/50">
          <div className="p-4 rounded-lg bg-muted/30">
            <div className="text-sm font-medium mb-1">Credits Available</div>
            <div className="text-2xl font-bold text-primary">2.0</div>
            <div className="text-xs text-muted-foreground mt-1">Expires in 30 days</div>
          </div>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-border/50 bg-card/95 backdrop-blur-lg safe-area-bottom">
        <ul className="flex items-center justify-around px-2 py-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/dashboard' && pathname.startsWith(item.href))
            
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors',
                    isActive ? 'text-primary' : 'text-muted-foreground',
                    item.highlight && 'relative'
                  )}
                >
                  {item.highlight ? (
                    <div className="p-3 -mt-6 rounded-full bg-primary text-primary-foreground shadow-lg">
                      <item.icon className="w-5 h-5" />
                    </div>
                  ) : (
                    <item.icon className="w-5 h-5" />
                  )}
                  <span className={cn(
                    'text-xs',
                    item.highlight && '-mt-1'
                  )}>
                    {item.label}
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </>
  )
}
