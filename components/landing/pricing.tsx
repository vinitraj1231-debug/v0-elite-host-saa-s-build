'use client'

import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Check, Zap, Sparkles, Crown } from 'lucide-react'
import Link from 'next/link'

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
          observer.disconnect()
        }
      },
      { threshold }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [threshold])

  return { ref, isInView }
}

const plans = [
  {
    name: 'Starter',
    price: 'Free',
    description: 'Perfect for trying out EliteHost',
    icon: Zap,
    features: [
      '2 free credits (30-day expiry)',
      '1 active deployment',
      'Subdomain hosting',
      'Basic SSL certificate',
      'Community support',
      '512MB RAM per container'
    ],
    cta: 'Start Free',
    href: '/auth/signup',
    popular: false,
    gradient: 'from-muted/50 to-transparent'
  },
  {
    name: 'Developer',
    price: '$12',
    period: '/month',
    description: 'For serious developers and small teams',
    icon: Sparkles,
    features: [
      '20 credits per month',
      '5 active deployments',
      'Custom domain support',
      'Wildcard SSL certificates',
      'Priority AI assistance',
      '2GB RAM per container',
      'Real-time metrics dashboard',
      'Email support'
    ],
    cta: 'Start Building',
    href: '/auth/signup?plan=developer',
    popular: true,
    gradient: 'from-primary/20 to-accent/10'
  },
  {
    name: 'Pro',
    price: '$49',
    period: '/month',
    description: 'For growing businesses and agencies',
    icon: Crown,
    features: [
      '100 credits per month',
      'Unlimited deployments',
      'Multiple custom domains',
      'Auto-scaling containers',
      'Dedicated AI quota',
      '8GB RAM per container',
      'Advanced analytics',
      'Priority support',
      'Team collaboration',
      'Webhook integrations'
    ],
    cta: 'Go Pro',
    href: '/auth/signup?plan=pro',
    popular: false,
    gradient: 'from-accent/20 to-transparent'
  }
]

export function Pricing() {
  const headerInView = useInView(0.2)
  const cardsInView = useInView(0.1)

  return (
    <section id="pricing" className="py-24 md:py-32 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/10 to-transparent pointer-events-none" />
      
      <div className="container px-4 md:px-6 relative">
        {/* Section header */}
        <div 
          ref={headerInView.ref}
          className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700 ${
            headerInView.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-6">
            <Zap className="w-4 h-4 animate-pulse" />
            Simple Pricing
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Pay Only for What You Use
          </h2>
          <p className="text-muted-foreground text-lg">
            Start free, scale as you grow. No hidden fees, no surprises.
          </p>
        </div>

        {/* Pricing cards */}
        <div 
          ref={cardsInView.ref}
          className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
        >
          {plans.map((plan, index) => {
            const Icon = plan.icon
            return (
              <div
                key={plan.name}
                className={`relative p-8 rounded-2xl border transition-all duration-500 group ${
                  plan.popular
                    ? 'bg-card border-primary shadow-lg shadow-primary/10 md:scale-105 z-10'
                    : 'bg-card/50 border-border/50 hover:border-primary/30 hover:bg-card/70'
                } ${cardsInView.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                {/* Gradient background */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${plan.gradient} opacity-50 group-hover:opacity-100 transition-opacity pointer-events-none`} />
                
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-sm font-medium rounded-full shadow-lg animate-pulse">
                    Most Popular
                  </div>
                )}

                <div className="relative mb-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 rounded-lg ${plan.popular ? 'bg-primary/20' : 'bg-muted'} group-hover:scale-110 transition-transform`}>
                      <Icon className={`w-5 h-5 ${plan.popular ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'} transition-colors`} />
                    </div>
                    <h3 className="text-xl font-bold">{plan.name}</h3>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.period && (
                      <span className="text-muted-foreground">{plan.period}</span>
                    )}
                  </div>
                  <p className="text-muted-foreground mt-2">{plan.description}</p>
                </div>

                <ul className="relative space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li 
                      key={feature} 
                      className="flex items-start gap-3 group/item"
                      style={{ transitionDelay: `${featureIndex * 50}ms` }}
                    >
                      <Check className="w-5 h-5 text-primary shrink-0 mt-0.5 group-hover/item:scale-110 transition-transform" />
                      <span className="text-muted-foreground group-hover/item:text-foreground transition-colors">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`relative w-full overflow-hidden ${plan.popular ? 'shadow-lg shadow-primary/20' : ''}`}
                  variant={plan.popular ? 'default' : 'outline'}
                  size="lg"
                  asChild
                >
                  <Link href={plan.href}>
                    <span className="relative z-10">{plan.cta}</span>
                    {plan.popular && (
                      <span className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </Link>
                </Button>
              </div>
            )
          })}
        </div>

        {/* Enterprise CTA */}
        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-4">
            Need more? Contact us for custom enterprise pricing.
          </p>
          <Button variant="outline" size="lg" asChild>
            <Link href="/contact">Contact Sales</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
