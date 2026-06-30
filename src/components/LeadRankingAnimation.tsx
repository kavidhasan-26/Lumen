import { useEffect, useRef } from 'react'
import { useTheme } from '../context/ThemeContext'

type Tier = 'diamond' | 'gold' | 'silver' | 'bronze' | 'unverified'

interface LeadParticle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  tier: Tier | null
  phase: 'incoming' | 'filtering' | 'ranked'
  rankSlot: number
  targetX: number
  targetY: number
  opacity: number
  glow: number
  settled: number
}

const TIER_COLOR: Record<Tier, [number, number, number]> = {
  diamond: [185, 242, 255],
  gold: [232, 184, 74],
  silver: [192, 196, 204],
  bronze: [205, 140, 80],
  unverified: [110, 110, 118],
}

const TIER_LABEL: Record<Tier, string> = {
  diamond: 'Diamond',
  gold: 'Gold',
  silver: 'Silver',
  bronze: 'Bronze',
  unverified: 'Unverified',
}

const SLOT_BASE: Record<Tier, number> = {
  diamond: 0,
  gold: 1,
  silver: 3,
  bronze: 5,
  unverified: 7,
}

function pickTier(): Tier {
  const r = Math.random()
  if (r < 0.08) return 'diamond'
  if (r < 0.22) return 'gold'
  if (r < 0.42) return 'silver'
  if (r < 0.68) return 'bronze'
  return 'unverified'
}

export function LeadRankingAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<LeadParticle[]>([])
  const frameRef = useRef(0)
  const timeRef = useRef(0)
  const { theme } = useTheme()
  const themeRef = useRef(theme)
  themeRef.current = theme

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const spawn = (h: number): LeadParticle => ({
      x: -20,
      y: h * 0.12 + Math.random() * h * 0.76,
      vx: 0.9 + Math.random() * 0.5,
      vy: (Math.random() - 0.5) * 0.25,
      radius: 4 + Math.random() * 2.5,
      tier: null,
      phase: 'incoming',
      rankSlot: 0,
      targetX: 0,
      targetY: 0,
      opacity: 0.35 + Math.random() * 0.2,
      glow: 0,
      settled: 0,
    })

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2)
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    resize()
    window.addEventListener('resize', resize)

    const drawPortal = (h: number, portalX: number, pulse: number) => {
      const top = h * 0.08
      const bottom = h * 0.92

      ctx.save()
      ctx.globalCompositeOperation = 'lighter'

      const glowWidth = 48
      const glow = ctx.createLinearGradient(portalX - glowWidth, 0, portalX + glowWidth, 0)
      glow.addColorStop(0, 'transparent')
      glow.addColorStop(0.35, `rgba(62, 232, 214, ${0.06 * pulse})`)
      glow.addColorStop(0.5, `rgba(185, 242, 255, ${0.22 * pulse})`)
      glow.addColorStop(0.65, `rgba(62, 232, 214, ${0.06 * pulse})`)
      glow.addColorStop(1, 'transparent')
      ctx.fillStyle = glow
      ctx.fillRect(portalX - glowWidth, top, glowWidth * 2, bottom - top)

      ctx.strokeStyle = `rgba(185, 242, 255, ${0.25 * pulse})`
      ctx.lineWidth = 6
      ctx.shadowColor = 'rgba(62, 232, 214, 0.9)'
      ctx.shadowBlur = 28 * pulse
      ctx.beginPath()
      ctx.moveTo(portalX, top)
      ctx.lineTo(portalX, bottom)
      ctx.stroke()

      ctx.strokeStyle = `rgba(255, 255, 255, ${0.75 * pulse})`
      ctx.lineWidth = 1.5
      ctx.shadowBlur = 12 * pulse
      ctx.beginPath()
      ctx.moveTo(portalX, top)
      ctx.lineTo(portalX, bottom)
      ctx.stroke()

      ctx.shadowBlur = 0
      ctx.restore()
    }

    const draw = () => {
      const rect = canvas.getBoundingClientRect()
      const w = rect.width
      const h = rect.height
      timeRef.current += 1
      const pulse = 0.75 + Math.sin(timeRef.current * 0.045) * 0.25

      if (particlesRef.current.length < 26 && timeRef.current % 48 === 0) {
        particlesRef.current.push(spawn(h))
      }

      ctx.clearRect(0, 0, w, h)

      const portalX = w * 0.48
      const isLight = themeRef.current === 'light'

      drawPortal(h, portalX, pulse)

      ctx.fillStyle = isLight ? 'rgba(26, 26, 26, 0.42)' : 'rgba(255,255,255,0.35)'
      ctx.font = '11px sans-serif'
      ctx.fillText('Incoming', w * 0.06, h * 0.1)
      ctx.fillText('Ranked', w * 0.72, h * 0.1)

      for (let i = 0; i < 10; i++) {
        const y = h * 0.16 + i * (h * 0.078)
        ctx.strokeStyle = isLight ? 'rgba(26, 26, 26, 0.08)' : 'rgba(255,255,255,0.05)'
        ctx.beginPath()
        ctx.moveTo(w * 0.66, y)
        ctx.lineTo(w * 0.94, y)
        ctx.stroke()
      }

      const rankedCount: Record<Tier, number> = {
        diamond: 0,
        gold: 0,
        silver: 0,
        bronze: 0,
        unverified: 0,
      }
      const next: LeadParticle[] = []

      for (const p of particlesRef.current) {
        if (p.phase === 'incoming') {
          p.x += p.vx
          p.y += p.vy + Math.sin(timeRef.current * 0.02 + p.y) * 0.12
          const [r, g, b] = TIER_COLOR.unverified
          drawParticle(ctx, p, r, g, b, p.opacity * 0.55, 0)
        } else if (p.phase === 'filtering') {
          if (!p.tier) p.tier = pickTier()
          p.x += 0.55
          p.glow = Math.min(1, p.glow + 0.06)
          p.opacity = Math.min(1, p.opacity + 0.05)
          const [r, g, b] = TIER_COLOR[p.tier]
          drawParticle(ctx, p, r, g, b, p.opacity * (0.5 + p.glow * 0.5), p.glow)

          if (p.x > portalX + 28) {
            p.phase = 'ranked'
            p.rankSlot = SLOT_BASE[p.tier] + rankedCount[p.tier]
            rankedCount[p.tier]++
            p.targetX = w * 0.78
            p.targetY = h * 0.16 + p.rankSlot * (h * 0.078)
          }
        } else if (p.tier) {
          p.x += (p.targetX - p.x) * 0.07
          p.y += (p.targetY - p.y) * 0.07
          p.glow = 0.8
          const [r, g, b] = TIER_COLOR[p.tier]
          drawParticle(ctx, p, r, g, b, p.opacity, p.glow)

          if (Math.hypot(p.x - p.targetX, p.y - p.targetY) < 6) {
            p.settled += 1
          }

          if (p.settled > 20) {
            ctx.fillStyle = `rgba(${TIER_COLOR[p.tier].join(',')},0.85)`
            ctx.font = '10px sans-serif'
            ctx.fillText(TIER_LABEL[p.tier], p.targetX + 14, p.targetY + 4)
          }
        }

        if (p.settled > 220) continue
        next.push(p)

        if (p.phase === 'incoming' && p.x > portalX - 22) {
          p.phase = 'filtering'
        }
      }

      particlesRef.current = next
      frameRef.current = requestAnimationFrame(draw)
    }

    const drawParticle = (
      ctx: CanvasRenderingContext2D,
      p: LeadParticle,
      r: number,
      g: number,
      b: number,
      alpha: number,
      glow: number,
    ) => {
      if (glow > 0.1) {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius * 2.8, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${r},${g},${b},${glow * 0.16})`
        ctx.fill()
      }
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`
      ctx.fill()
    }

    draw()

    return () => {
      cancelAnimationFrame(frameRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="h-[min(420px,55vw)] w-full"
      aria-label="Animation showing leads passing through a portal and ranked as Diamond, Gold, Silver, Bronze, or Unverified"
    />
  )
}
