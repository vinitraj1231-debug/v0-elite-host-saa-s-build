'use client'

import { useRef, useEffect, useState, useCallback } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  size: number
  color: string
}

interface Star {
  x: number
  y: number
  size: number
  speed: number
  opacity: number
}

export function RocketScene({ onComplete }: { onComplete: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [progress, setProgress] = useState(0)
  const animationRef = useRef<number | null>(null)
  const startTimeRef = useRef<number>(0)
  
  const createParticles = useCallback((x: number, y: number, particles: Particle[]) => {
    const colors = ['#38bdf8', '#22d3ee', '#a5f3fc', '#ffffff', '#f97316']
    for (let i = 0; i < 3; i++) {
      particles.push({
        x: x + (Math.random() - 0.5) * 20,
        y: y + Math.random() * 10,
        vx: (Math.random() - 0.5) * 2,
        vy: Math.random() * 3 + 1,
        life: 1,
        maxLife: 1,
        size: Math.random() * 4 + 2,
        color: colors[Math.floor(Math.random() * colors.length)]
      })
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    const stars: Star[] = []
    for (let i = 0; i < 200; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        speed: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.8 + 0.2
      })
    }

    const particles: Particle[] = []
    let rocketY = canvas.height + 100
    let rocketX = canvas.width / 2
    const duration = 5000

    startTimeRef.current = performance.now()

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTimeRef.current
      const progressValue = Math.min(elapsed / duration, 1)
      setProgress(progressValue)

      ctx.fillStyle = '#0a0a12'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw stars
      stars.forEach(star => {
        star.y += star.speed * (1 + progressValue * 3)
        if (star.y > canvas.height) {
          star.y = 0
          star.x = Math.random() * canvas.width
        }
        ctx.beginPath()
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
        ctx.fill()
      })

      // Calculate rocket position
      const targetY = canvas.height * 0.35
      const startY = canvas.height + 100
      rocketY = startY - (startY - targetY) * easeOutCubic(progressValue)
      
      // Slight wobble
      const wobble = Math.sin(elapsed * 0.01) * 3
      rocketX = canvas.width / 2 + wobble

      // Create exhaust particles
      if (progressValue < 0.95) {
        createParticles(rocketX, rocketY + 60, particles)
      }

      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy
        p.life -= 0.02
        
        if (p.life <= 0) {
          particles.splice(i, 1)
          continue
        }

        ctx.beginPath()
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.life
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2)
        ctx.fill()
        ctx.globalAlpha = 1
      }

      // Draw rocket glow
      const glowGradient = ctx.createRadialGradient(rocketX, rocketY, 0, rocketX, rocketY, 80)
      glowGradient.addColorStop(0, 'rgba(56, 189, 248, 0.3)')
      glowGradient.addColorStop(1, 'rgba(56, 189, 248, 0)')
      ctx.fillStyle = glowGradient
      ctx.fillRect(rocketX - 100, rocketY - 100, 200, 200)

      // Draw rocket body
      drawRocket(ctx, rocketX, rocketY, progressValue)

      // Draw exhaust flame
      if (progressValue < 0.95) {
        drawExhaust(ctx, rocketX, rocketY + 55, elapsed)
      }

      if (progressValue < 1) {
        animationRef.current = requestAnimationFrame(animate)
      } else {
        setTimeout(onComplete, 500)
      }
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [onComplete, createParticles])

  return (
    <div className="fixed inset-0 z-50 bg-background">
      <canvas ref={canvasRef} className="w-full h-full" />
      
      {/* Loading indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
        <div className="text-sm text-muted-foreground font-mono">
          Initializing EliteHost...
        </div>
        <div className="w-48 h-1 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-100 ease-out"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        <div className="text-xs text-muted-foreground font-mono">
          {Math.round(progress * 100)}%
        </div>
      </div>
    </div>
  )
}

function easeOutCubic(x: number): number {
  return 1 - Math.pow(1 - x, 3)
}

function drawRocket(ctx: CanvasRenderingContext2D, x: number, y: number, progress: number) {
  ctx.save()
  ctx.translate(x, y)
  
  const scale = 0.8 + progress * 0.2
  ctx.scale(scale, scale)

  // Rocket body (main fuselage)
  const bodyGradient = ctx.createLinearGradient(-15, -50, 15, -50)
  bodyGradient.addColorStop(0, '#e2e8f0')
  bodyGradient.addColorStop(0.5, '#ffffff')
  bodyGradient.addColorStop(1, '#94a3b8')
  
  ctx.fillStyle = bodyGradient
  ctx.beginPath()
  ctx.moveTo(0, -60)
  ctx.bezierCurveTo(20, -40, 20, 40, 15, 55)
  ctx.lineTo(-15, 55)
  ctx.bezierCurveTo(-20, 40, -20, -40, 0, -60)
  ctx.fill()

  // Nose cone
  const noseGradient = ctx.createLinearGradient(-10, -80, 10, -80)
  noseGradient.addColorStop(0, '#f97316')
  noseGradient.addColorStop(1, '#ea580c')
  
  ctx.fillStyle = noseGradient
  ctx.beginPath()
  ctx.moveTo(0, -80)
  ctx.bezierCurveTo(12, -70, 12, -60, 0, -60)
  ctx.bezierCurveTo(-12, -60, -12, -70, 0, -80)
  ctx.fill()

  // Window
  ctx.fillStyle = '#0ea5e9'
  ctx.beginPath()
  ctx.arc(0, -30, 8, 0, Math.PI * 2)
  ctx.fill()
  
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)'
  ctx.beginPath()
  ctx.arc(-2, -32, 3, 0, Math.PI * 2)
  ctx.fill()

  // Fins
  ctx.fillStyle = '#f97316'
  
  // Left fin
  ctx.beginPath()
  ctx.moveTo(-15, 40)
  ctx.lineTo(-35, 60)
  ctx.lineTo(-15, 55)
  ctx.closePath()
  ctx.fill()
  
  // Right fin
  ctx.beginPath()
  ctx.moveTo(15, 40)
  ctx.lineTo(35, 60)
  ctx.lineTo(15, 55)
  ctx.closePath()
  ctx.fill()

  // Center fin (back)
  ctx.beginPath()
  ctx.moveTo(0, 45)
  ctx.lineTo(0, 65)
  ctx.lineTo(-5, 55)
  ctx.lineTo(5, 55)
  ctx.closePath()
  ctx.fill()

  ctx.restore()
}

function drawExhaust(ctx: CanvasRenderingContext2D, x: number, y: number, time: number) {
  ctx.save()
  ctx.translate(x, y)

  const flameHeight = 40 + Math.sin(time * 0.02) * 10
  
  // Outer flame (orange)
  const outerGradient = ctx.createLinearGradient(0, 0, 0, flameHeight)
  outerGradient.addColorStop(0, '#f97316')
  outerGradient.addColorStop(0.5, '#fb923c')
  outerGradient.addColorStop(1, 'rgba(251, 146, 60, 0)')
  
  ctx.fillStyle = outerGradient
  ctx.beginPath()
  ctx.moveTo(-12, 0)
  ctx.quadraticCurveTo(-15, flameHeight * 0.5, 0, flameHeight)
  ctx.quadraticCurveTo(15, flameHeight * 0.5, 12, 0)
  ctx.closePath()
  ctx.fill()

  // Inner flame (cyan/white)
  const innerGradient = ctx.createLinearGradient(0, 0, 0, flameHeight * 0.7)
  innerGradient.addColorStop(0, '#ffffff')
  innerGradient.addColorStop(0.3, '#38bdf8')
  innerGradient.addColorStop(1, 'rgba(56, 189, 248, 0)')
  
  ctx.fillStyle = innerGradient
  ctx.beginPath()
  ctx.moveTo(-6, 0)
  ctx.quadraticCurveTo(-8, flameHeight * 0.3, 0, flameHeight * 0.7)
  ctx.quadraticCurveTo(8, flameHeight * 0.3, 6, 0)
  ctx.closePath()
  ctx.fill()

  ctx.restore()
}
