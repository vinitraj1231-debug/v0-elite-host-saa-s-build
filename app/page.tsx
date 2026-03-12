'use client'

import { useState, useEffect } from 'react'
import { RocketScene } from '@/components/three/rocket-scene'
import { Header } from '@/components/landing/header'
import { Hero } from '@/components/landing/hero'
import { Features } from '@/components/landing/features'
import { Pricing } from '@/components/landing/pricing'
import { Footer } from '@/components/landing/footer'

export default function HomePage() {
  const [showIntro, setShowIntro] = useState(true)
  const [hasSeenIntro, setHasSeenIntro] = useState(false)

  useEffect(() => {
    // Check if user has already seen the intro in this session
    const seen = sessionStorage.getItem('elitehost-intro-seen')
    if (seen) {
      setShowIntro(false)
      setHasSeenIntro(true)
    }
  }, [])

  const handleIntroComplete = () => {
    setShowIntro(false)
    setHasSeenIntro(true)
    sessionStorage.setItem('elitehost-intro-seen', 'true')
  }

  return (
    <>
      {showIntro && !hasSeenIntro && (
        <RocketScene onComplete={handleIntroComplete} />
      )}
      
      <div 
        className={`min-h-screen transition-opacity duration-500 ${
          showIntro && !hasSeenIntro ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <Header />
        <main>
          <Hero />
          <Features />
          <Pricing />
        </main>
        <Footer />
      </div>
    </>
  )
}
