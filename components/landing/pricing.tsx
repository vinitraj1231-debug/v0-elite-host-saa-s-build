'use client'

import { Button } from '@/components/ui/button'
import { Check, Zap } from 'lucide-react'
import Link from 'next/link'

const plans = [
  {
    name: 'Starter',
    price: 'Free',
    description: 'Perfect for trying out EliteHost',
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
    popular: false
  },
  {
    name: 'Developer',
    price: '$12',
    period: '/month',
    description: 'For serious developers and small teams',
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
    popular: true
  },
  {
    name: 'Pro',
    price: '$49',
    period: '/month',
    description: 'For growing businesses and agencies',
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
    popular: false
  }
]

export function Pricing() {
  return (
    <section id="pricing" className="py-24 md:py-32 relative">
      <div className="container px-4 md:px-6">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
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
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative p-8 rounded-2xl border transition-all duration-300 ${
                plan.popular
                  ? 'bg-card border-primary shadow-lg shadow-primary/10 scale-105'
                  : 'bg-card/50 border-border/50 hover:border-primary/30'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-sm font-medium rounded-full">
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.period && (
                    <span className="text-muted-foreground">{plan.period}</span>
                  )}
                </div>
                <p className="text-muted-foreground mt-2">{plan.description}</p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full ${plan.popular ? '' : 'variant-outline'}`}
                variant={plan.popular ? 'default' : 'outline'}
                size="lg"
                asChild
              >
                <Link href={plan.href}>{plan.cta}</Link>
              </Button>
            </div>
          ))}
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
