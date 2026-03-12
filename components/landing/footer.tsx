'use client'

import Link from 'next/link'
import { Rocket, Github, Twitter } from 'lucide-react'

const footerLinks = {
  Product: [
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Docs', href: '/docs' },
    { label: 'Changelog', href: '/changelog' },
  ],
  Company: [
    { label: 'About', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Careers', href: '/careers' },
    { label: 'Contact', href: '/contact' },
  ],
  Resources: [
    { label: 'Documentation', href: '/docs' },
    { label: 'API Reference', href: '/docs/api' },
    { label: 'Status', href: '/status' },
    { label: 'Support', href: '/support' },
  ],
  Legal: [
    { label: 'Privacy', href: '/privacy' },
    { label: 'Terms', href: '/terms' },
    { label: 'Security', href: '/security' },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-muted/20">
      <div className="container px-4 md:px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="p-1.5 rounded-lg bg-primary/10">
                <Rocket className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xl font-bold">EliteHost</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-6">
              AI-powered code deployment platform. VPS-first, domain-ready, production-grade.
            </p>
            <div className="flex gap-4">
              <Link
                href="https://github.com/elitehost"
                className="text-muted-foreground hover:text-foreground transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="w-5 h-5" />
              </Link>
              <Link
                href="https://twitter.com/elitehost"
                className="text-muted-foreground hover:text-foreground transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-semibold mb-4">{title}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            {new Date().getFullYear()} EliteHost. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Made with precision for developers worldwide.
          </p>
        </div>
      </div>
    </footer>
  )
}
