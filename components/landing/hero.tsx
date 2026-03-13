'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight, Play, Rocket, Zap, Shield, Globe, Sparkles } from 'lucide-react'
import Link from 'next/link'

export function Hero() {
  const heroRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const hero = heroRef.current
    if (!hero) return

    const { width, height, left, top } = hero.getBoundingClientRect()
    const x = (e.clientX - left) / width - 0.5
    const y = (e.clientY - top) / height - 0.5

    setMousePosition({ x: x * 20, y: y * 20 })
  }, [])

  useEffect(() => {
    const hero = heroRef.current
    if (!hero) return

    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 100)

    hero.addEventListener('mousemove', handleMouseMove)
    return () => {
      hero.removeEventListener('mousemove', handleMouseMove)
      clearTimeout(timer)
    }
  }, [handleMouseMove])

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
        
        {/* Gradient orbs with smooth parallax */}
        <div 
          className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full opacity-30 blur-[120px] transition-transform duration-300 ease-out"
          style={{ 
            background: 'radial-gradient(circle, var(--primary) 0%, transparent 70%)',
            transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`
          }}
        />
        <div 
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full opacity-20 blur-[100px] transition-transform duration-300 ease-out"
          style={{ 
            background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)',
            transform: `translate(${-mousePosition.x}px, ${-mousePosition.y}px)`
          }}
        />
        {/* Additional floating particles effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-primary/40 rounded-full animate-pulse"
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + (i % 3) * 20}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${2 + i * 0.5}s`
              }}
            />
          ))}
        </div>
      </div>

      <div className="container relative z-10 px-4 md:px-6">
        <div className="flex flex-col items-center text-center gap-8 max-w-4xl mx-auto">
          {/* Badge */}
          <div 
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span>AI-Powered Deployment Platform</span>
            <span className="flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
          </div>

          {/* Main heading */}
          <h1 
            className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-balance transition-all duration-700 delay-150 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Deploy Code to
            <span className="block mt-2 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-[length:200%_100%] animate-[gradient_4s_ease_infinite]">
              Production in Seconds
            </span>
          </h1>

          {/* Subheading */}
          <p 
            className={`text-lg md:text-xl text-muted-foreground max-w-2xl text-pretty transition-all duration-700 delay-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            VPS-first, domain-ready hosting with AI-powered Dockerfile generation, 
            real-time logs, and automated SSL. From code to live in one command.
          </p>

          {/* CTA Buttons */}
          <div 
            className={`flex flex-col sm:flex-row gap-4 transition-all duration-700 delay-500 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <Button size="lg" className="group text-base px-8 relative overflow-hidden" asChild>
              <Link href="/auth/signup">
                <span className="relative z-10 flex items-center">
                  Start Deploying Free
                  <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-base px-8 group" asChild>
              <Link href="#demo">
                <Play className="mr-2 w-4 h-4 transition-transform group-hover:scale-110" />
                Watch Demo
              </Link>
            </Button>
          </div>

          {/* Trust indicators */}
          <div 
            className={`flex flex-wrap items-center justify-center gap-6 pt-8 text-sm text-muted-foreground transition-all duration-700 delay-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <div className="flex items-center gap-2 hover:text-primary transition-colors cursor-default">
              <Rocket className="w-4 h-4 text-primary" />
              <span>2 Free Credits</span>
            </div>
            <div className="flex items-center gap-2 hover:text-accent transition-colors cursor-default">
              <Shield className="w-4 h-4 text-accent" />
              <span>Secure Containers</span>
            </div>
            <div className="flex items-center gap-2 hover:text-primary transition-colors cursor-default">
              <Globe className="w-4 h-4 text-primary" />
              <span>Custom Domains</span>
            </div>
          </div>
        </div>

        {/* Code preview mockup */}
        <div 
          className={`mt-16 max-w-3xl mx-auto transition-all duration-1000 delay-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="relative rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden shadow-2xl group hover:border-primary/30 transition-colors duration-300">
            {/* Terminal header */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50 bg-muted/30">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-destructive/70 group-hover:bg-destructive transition-colors" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/70 group-hover:bg-yellow-500 transition-colors" />
                <div className="w-3 h-3 rounded-full bg-green-500/70 group-hover:bg-green-500 transition-colors" />
              </div>
              <span className="text-xs text-muted-foreground font-mono ml-2">terminal</span>
              <span className="ml-auto text-xs text-muted-foreground font-mono opacity-0 group-hover:opacity-100 transition-opacity">bash</span>
            </div>
            
            {/* Terminal content */}
            <div className="p-4 font-mono text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="text-accent">$</span>
                <span className="text-foreground typing-effect">elitehost deploy --repo github.com/user/app</span>
                <span className="animate-pulse">|</span>
              </div>
              <div className="mt-3 space-y-1.5 text-muted-foreground">
                <div className="flex items-center gap-2 animate-[fadeIn_0.3s_ease-out_0.5s_both]">
                  <span className="text-primary">{'>'}</span>
                  <span>Cloning repository...</span>
                  <span className="text-green-400">done</span>
                </div>
                <div className="flex items-center gap-2 animate-[fadeIn_0.3s_ease-out_0.8s_both]">
                  <span className="text-primary">{'>'}</span>
                  <span>AI generating Dockerfile...</span>
                  <span className="text-green-400">done</span>
                </div>
                <div className="flex items-center gap-2 animate-[fadeIn_0.3s_ease-out_1.1s_both]">
                  <span className="text-primary">{'>'}</span>
                  <span>Building container...</span>
                  <span className="text-green-400">done</span>
                </div>
                <div className="flex items-center gap-2 animate-[fadeIn_0.3s_ease-out_1.4s_both]">
                  <span className="text-primary">{'>'}</span>
                  <span>Provisioning SSL certificate...</span>
                  <span className="text-green-400">done</span>
                </div>
                <div className="mt-3 pt-3 border-t border-border/50 animate-[fadeIn_0.3s_ease-out_1.7s_both]">
                  <span className="text-green-400">{'✓'}</span>
                  <span className="ml-2">Deployed to</span>
                  <Link href="#" className="ml-1 text-primary underline hover:text-accent transition-colors">
                    app.user.elitehost.example
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Shine effect on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transform transition-transform duration-1000" />
          </div>
          
          {/* Glow effect under card */}
          <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-3/4 h-40 bg-primary/20 blur-[100px] -z-10" />
        </div>
      </div>
    </section>
  )
}

// Add keyframes via a style tag in the component
const styles = `
@keyframes gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateX(-10px); }
  to { opacity: 1; transform: translateX(0); }
}
`

// Add styles to document
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style')
  styleSheet.textContent = styles
  document.head.appendChild(styleSheet)
}
  )
}
