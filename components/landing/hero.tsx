'use client'

import { useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight, Play, Rocket, Zap, Shield, Globe } from 'lucide-react'
import Link from 'next/link'

export function Hero() {
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const hero = heroRef.current
    if (!hero) return

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e
      const { width, height, left, top } = hero.getBoundingClientRect()
      const x = (clientX - left) / width - 0.5
      const y = (clientY - top) / height - 0.5

      hero.style.setProperty('--mouse-x', `${x * 20}px`)
      hero.style.setProperty('--mouse-y', `${y * 20}px`)
    }

    hero.addEventListener('mousemove', handleMouseMove)
    return () => hero.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Effects */}
      <div className="absolute inset-0">
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}
        />
        
        {/* Gradient orbs */}
        <div 
          className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full opacity-30 blur-[120px]"
          style={{ 
            background: 'radial-gradient(circle, var(--primary) 0%, transparent 70%)',
            transform: 'translate(var(--mouse-x, 0), var(--mouse-y, 0))'
          }}
        />
        <div 
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full opacity-20 blur-[100px]"
          style={{ 
            background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)',
            transform: 'translate(calc(var(--mouse-x, 0) * -1), calc(var(--mouse-y, 0) * -1))'
          }}
        />
      </div>

      <div className="container relative z-10 px-4 md:px-6">
        <div className="flex flex-col items-center text-center gap-8 max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Zap className="w-4 h-4" />
            <span>AI-Powered Deployment Platform</span>
          </div>

          {/* Main heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-balance animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
            Deploy Code to
            <span className="block mt-2 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-[length:200%_100%] animate-gradient">
              Production in Seconds
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl text-pretty animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            VPS-first, domain-ready hosting with AI-powered Dockerfile generation, 
            real-time logs, and automated SSL. From code to live in one command.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
            <Button size="lg" className="group text-base px-8" asChild>
              <Link href="/auth/signup">
                Start Deploying Free
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-base px-8" asChild>
              <Link href="#demo">
                <Play className="mr-2 w-4 h-4" />
                Watch Demo
              </Link>
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-8 text-sm text-muted-foreground animate-in fade-in slide-in-from-bottom-4 duration-700 delay-700">
            <div className="flex items-center gap-2">
              <Rocket className="w-4 h-4 text-primary" />
              <span>2 Free Credits</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-accent" />
              <span>Secure Containers</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-primary" />
              <span>Custom Domains</span>
            </div>
          </div>
        </div>

        {/* Code preview mockup */}
        <div className="mt-16 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-700">
          <div className="relative rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden shadow-2xl">
            {/* Terminal header */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50 bg-muted/30">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-destructive/70" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <div className="w-3 h-3 rounded-full bg-green-500/70" />
              </div>
              <span className="text-xs text-muted-foreground font-mono ml-2">terminal</span>
            </div>
            
            {/* Terminal content */}
            <div className="p-4 font-mono text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="text-accent">$</span>
                <span className="text-foreground">elitehost deploy --repo github.com/user/app</span>
              </div>
              <div className="mt-3 space-y-1.5 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span className="text-primary">{'>'}</span>
                  <span>Cloning repository...</span>
                  <span className="text-green-400">done</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-primary">{'>'}</span>
                  <span>AI generating Dockerfile...</span>
                  <span className="text-green-400">done</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-primary">{'>'}</span>
                  <span>Building container...</span>
                  <span className="text-green-400">done</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-primary">{'>'}</span>
                  <span>Provisioning SSL certificate...</span>
                  <span className="text-green-400">done</span>
                </div>
                <div className="mt-3 pt-3 border-t border-border/50">
                  <span className="text-green-400">{'✓'}</span>
                  <span className="ml-2">Deployed to</span>
                  <span className="ml-1 text-primary underline">app.user.elitehost.example</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Glow effect under card */}
          <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-3/4 h-40 bg-primary/20 blur-[100px] -z-10" />
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          animation: gradient 4s ease infinite;
        }
      `}</style>
    </section>
  )
}
