'use client'

import { useEffect, useRef, useState } from 'react'
import { 
  Brain, 
  Shield, 
  Globe, 
  Terminal, 
  Gauge,
  GitBranch,
  Lock,
  Coins,
  type LucideIcon
} from 'lucide-react'

interface Feature {
  icon: LucideIcon
  title: string
  description: string
  color: string
}

const features: Feature[] = [
  {
    icon: Brain,
    title: 'AI-Powered Deployment',
    description: 'Auto-generates Dockerfiles, detects frameworks, and suggests optimizations using OpenRouter & Gemini.',
    color: 'text-primary'
  },
  {
    icon: Terminal,
    title: 'Real-Time Logs',
    description: 'Stream build and runtime logs directly to your dashboard via WebSocket. Debug issues instantly.',
    color: 'text-accent'
  },
  {
    icon: Globe,
    title: 'Custom Domains & SSL',
    description: 'Automatic Let\'s Encrypt certificates for wildcard subdomains and custom domains.',
    color: 'text-primary'
  },
  {
    icon: Shield,
    title: 'Isolated Containers',
    description: 'Every deployment runs in its own secure, resource-limited Docker container with network isolation.',
    color: 'text-accent'
  },
  {
    icon: GitBranch,
    title: 'Git Integration',
    description: 'Deploy from GitHub repos, ZIP uploads, or single files. Auto-redeploy on push with webhooks.',
    color: 'text-primary'
  },
  {
    icon: Gauge,
    title: 'Performance Metrics',
    description: 'Monitor CPU, memory, and network usage per container with Prometheus & Grafana dashboards.',
    color: 'text-accent'
  }
]

const stats = [
  { value: '< 30s', label: 'Average Deploy Time' },
  { value: '99.9%', label: 'Uptime SLA' },
  { value: '50+', label: 'Framework Support' },
  { value: '24/7', label: 'AI Assistance' }
]

// Custom hook for intersection observer
function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect() // Only trigger once
        }
      },
      { threshold }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [threshold])

  return { ref, isInView }
}

export function Features() {
  const headerInView = useInView(0.2)
  const statsInView = useInView(0.1)
  const featuresInView = useInView(0.1)
  const capabilitiesInView = useInView(0.1)

  return (
    <section id="features" className="py-24 md:py-32 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />
      
      <div className="container relative px-4 md:px-6">
        {/* Section header */}
        <div 
          ref={headerInView.ref}
          className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700 ${
            headerInView.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Everything You Need to
            <span className="block text-primary mt-1 animate-gradient bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-[length:200%_100%]">
              Ship Faster
            </span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Production-grade infrastructure with developer-first tooling. 
            No DevOps experience required.
          </p>
        </div>

        {/* Stats bar */}
        <div 
          ref={statsInView.ref}
          className={`grid grid-cols-2 md:grid-cols-4 gap-6 mb-20 transition-all duration-700 ${
            statsInView.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {stats.map((stat, index) => (
            <div 
              key={stat.label}
              className="text-center p-6 rounded-xl bg-card/50 border border-border/50 backdrop-blur-sm hover:border-primary/30 hover:bg-card/70 transition-all duration-300 group"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="text-3xl md:text-4xl font-bold text-primary mb-1 group-hover:scale-110 transition-transform duration-300">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Features grid */}
        <div 
          ref={featuresInView.ref}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={`group p-6 rounded-xl bg-card/30 border border-border/50 hover:border-primary/30 hover:bg-card/50 transition-all duration-500 hover:shadow-lg hover:shadow-primary/5 ${
                featuresInView.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className={`inline-flex p-3 rounded-lg bg-primary/10 ${feature.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Additional capabilities */}
        <div 
          ref={capabilitiesInView.ref}
          className="mt-20 grid md:grid-cols-2 gap-8"
        >
          <div 
            className={`p-8 rounded-xl bg-gradient-to-br from-primary/10 via-transparent to-transparent border border-primary/20 hover:border-primary/40 transition-all duration-500 group ${
              capabilitiesInView.isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
            }`}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-lg bg-primary/20 group-hover:bg-primary/30 transition-colors">
                <Coins className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold">Credit System</h3>
            </div>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-center gap-2 hover:text-foreground transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                2 free credits for new users (30-day expiry)
              </li>
              <li className="flex items-center gap-2 hover:text-foreground transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                1 credit per active deploy per week
              </li>
              <li className="flex items-center gap-2 hover:text-foreground transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                AI calls metered with cost preview
              </li>
              <li className="flex items-center gap-2 hover:text-foreground transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                Referral rewards: 0.5 credit per signup
              </li>
            </ul>
          </div>

          <div 
            className={`p-8 rounded-xl bg-gradient-to-br from-accent/10 via-transparent to-transparent border border-accent/20 hover:border-accent/40 transition-all duration-500 group ${
              capabilitiesInView.isInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
            }`}
            style={{ transitionDelay: '150ms' }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-lg bg-accent/20 group-hover:bg-accent/30 transition-colors">
                <Lock className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-2xl font-bold">Enterprise Security</h3>
            </div>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-center gap-2 hover:text-foreground transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                Network-isolated build containers
              </li>
              <li className="flex items-center gap-2 hover:text-foreground transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                cgroups resource limits & abuse detection
              </li>
              <li className="flex items-center gap-2 hover:text-foreground transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                JWT + refresh token rotation
              </li>
              <li className="flex items-center gap-2 hover:text-foreground transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                Optional TOTP 2FA authentication
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
