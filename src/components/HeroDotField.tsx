import { useEffect, useRef } from 'react'
import { useTheme } from '../context/ThemeContext'

interface Dot {
  baseX: number
  baseY: number
  z: number
  speed: number
  lead: boolean
  radius: number
}

const PALETTE = {
  dark: {
    base: '#1c1c22',
    leadMid: '#ffffff',
    leadCore: '#f4f3f0',
  },
  light: {
    base: '#d4d4d8',
    leadMid: '#0a0a0a',
    leadCore: '#ffffff',
  },
} as const

type ThemeMode = keyof typeof PALETTE

function hash(n: number) {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453
  return x - Math.floor(x)
}

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)))
  return t * t * (3 - 2 * t)
}

function dotVisibility(nx: number, ny: number) {
  const left =
    nx < 0.36 ? 0 : nx < 0.52 ? smoothstep(0.36, 0.52, nx) : 1

  const bottom =
    ny > 0.97 ? 0 : ny > 0.9 ? 1 - smoothstep(0.9, 0.97, ny) : 1

  return left * bottom
}

function depthFactor(z: number) {
  return smoothstep(0, 1, z)
}

function depthOpacity(z: number, motion: number, isLead = false) {
  if (isLead) {
    if (motion < 0.16) return smoothstep(0.16, 0.3, motion)
    if (z > 0.96) return Math.max(0.4, (1 - z) / 0.04)
    return 1
  }

  if (motion < 0.3) return 0
  if (motion < 0.45) return smoothstep(0.3, 0.45, motion)
  if (z > 0.94) return (1 - z) / 0.06
  return 1
}

function vanishPoint(w: number, h: number) {
  return { x: w * 1.14, y: h * -0.22 }
}

function project(dot: Dot, w: number, h: number) {
  const { x: originX, y: originY } = vanishPoint(w, h)
  const motion = depthFactor(dot.z) ** 1.45

  return {
    x: originX + (dot.baseX - originX) * motion,
    y: originY + (dot.baseY - originY) * motion,
    scale: 0.14 + motion * 0.86,
    alpha: depthOpacity(dot.z, motion, dot.lead),
    motion,
  }
}

function buildDots(width: number, height: number): Dot[] {
  const spacing = Math.max(38, Math.min(52, width / 22))
  const regionLeft = width * 0.48
  const regionWidth = width - regionLeft + spacing
  const regionTop = height * 0.05
  const regionHeight = height * 0.88

  const cols = Math.ceil(regionWidth / spacing) + 1
  const rows = Math.ceil(regionHeight / (spacing * 0.92)) + 1
  const dots: Dot[] = []
  let dotIndex = 0

  for (let row = 0; row < rows; row++) {
    const stagger = (row % 2) * spacing * 0.42
    for (let col = 0; col < cols; col++) {
      const seed = hash(row * 131.7 + col * 71.3)
      const seed2 = hash(seed * 19.2 + col)
      const seed3 = hash(seed2 * 7.1 + row)

      if (seed > 0.58) continue

      const jitterX = (seed2 - 0.5) * spacing * 0.55
      const jitterY = (seed3 - 0.5) * spacing * 0.55

      const x = regionLeft + col * spacing + stagger + jitterX
      const y = regionTop + row * spacing * 0.92 + jitterY

      if (x < regionLeft || y > height * 0.92) continue

      const nx = x / width
      const ny = y / height
      if (dotVisibility(nx, ny) <= 0.02) continue

      dots.push({
        baseX: x,
        baseY: y,
        z: ((dotIndex * 0.618033988) % 1) * 0.94 + hash(seed) * 0.06,
        speed: 0.035 + hash(seed2 + 1) * 0.03,
        lead: false,
        radius: 11.5 + seed2 * 3,
      })
      dotIndex++
    }
  }

  const leadTargets = [
    { x: width * 0.74, y: height * 0.18 },
    { x: width * 0.82, y: height * 0.14 },
    { x: width * 0.86, y: height * 0.68 },
    { x: width * 0.78, y: height * 0.8 },
  ]

  const used = new Set<number>()
  const leadIndices: number[] = []

  for (const target of leadTargets) {
    let best = -1
    let bestD = spacing * 2
    for (let i = 0; i < dots.length; i++) {
      if (used.has(i)) continue
      const dx = dots[i].baseX - target.x
      const dy = dots[i].baseY - target.y
      const d = Math.hypot(dx, dy)
      if (d < bestD) {
        bestD = d
        best = i
      }
    }
    if (best >= 0) {
      dots[best].lead = true
      used.add(best)
      leadIndices.push(best)
    }
  }

  const leadPhases = [0.18, 0.42, 0.66, 0.84]
  leadIndices.forEach((idx, i) => {
    dots[idx].z = leadPhases[i] ?? 0.5
    dots[idx].speed = 0.036
  })

  return dots
}

function advanceDots(dots: Dot[], dt: number, reducedMotion: boolean) {
  if (reducedMotion) return

  for (const dot of dots) {
    dot.z += dot.speed * dt
    if (dot.z > 1) dot.z -= 1
  }
}

function drawBackground(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  theme: ThemeMode,
) {
  if (theme === 'light') {
    const bg = ctx.createLinearGradient(0, 0, w, h)
    bg.addColorStop(0, '#ffffff')
    bg.addColorStop(0.5, '#fafafa')
    bg.addColorStop(1, '#f5f5f5')
    ctx.fillStyle = bg
  } else {
    ctx.fillStyle = '#000000'
  }
  ctx.fillRect(0, 0, w, h)
}

function drawFade(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  theme: ThemeMode,
) {
  if (theme === 'light') {
    const textShade = ctx.createRadialGradient(
      w * 0.22,
      h * 0.88,
      0,
      w * 0.22,
      h * 0.88,
      w * 0.62,
    )
    textShade.addColorStop(0, 'rgba(255, 255, 255, 0.95)')
    textShade.addColorStop(0.45, 'rgba(255, 255, 255, 0.45)')
    textShade.addColorStop(1, 'rgba(255, 255, 255, 0)')
    ctx.fillStyle = textShade
    ctx.fillRect(0, 0, w, h)

    const left = ctx.createLinearGradient(0, 0, w * 0.58, 0)
    left.addColorStop(0, 'rgba(255, 255, 255, 0.98)')
    left.addColorStop(0.22, 'rgba(255, 255, 255, 0.72)')
    left.addColorStop(0.42, 'rgba(255, 255, 255, 0.15)')
    left.addColorStop(0.58, 'rgba(255, 255, 255, 0)')
    ctx.fillStyle = left
    ctx.fillRect(0, 0, w, h)

    const vignette = ctx.createRadialGradient(
      w * 0.82,
      h * 0.5,
      w * 0.08,
      w * 0.82,
      h * 0.5,
      w * 0.65,
    )
    vignette.addColorStop(0, 'rgba(255, 255, 255, 0)')
    vignette.addColorStop(1, 'rgba(0, 0, 0, 0.04)')
    ctx.fillStyle = vignette
    ctx.fillRect(0, 0, w, h)
    return
  }

  const textShade = ctx.createRadialGradient(w * 0.22, h * 0.88, 0, w * 0.22, h * 0.88, w * 0.62)
  textShade.addColorStop(0, 'rgba(0, 0, 0, 0.92)')
  textShade.addColorStop(0.45, 'rgba(0, 0, 0, 0.45)')
  textShade.addColorStop(1, 'rgba(0, 0, 0, 0)')
  ctx.fillStyle = textShade
  ctx.fillRect(0, 0, w, h)

  const left = ctx.createLinearGradient(0, 0, w * 0.58, 0)
  left.addColorStop(0, '#000000')
  left.addColorStop(0.22, 'rgba(0, 0, 0, 0.7)')
  left.addColorStop(0.42, 'rgba(0, 0, 0, 0.12)')
  left.addColorStop(0.58, 'rgba(0, 0, 0, 0)')
  ctx.fillStyle = left
  ctx.fillRect(0, 0, w, h)

  const vignette = ctx.createRadialGradient(w * 0.82, h * 0.5, w * 0.08, w * 0.82, h * 0.5, w * 0.65)
  vignette.addColorStop(0, 'rgba(0, 0, 0, 0)')
  vignette.addColorStop(1, 'rgba(0, 0, 0, 0.18)')
  ctx.fillStyle = vignette
  ctx.fillRect(0, 0, w, h)
}

function drawBaseDot(
  ctx: CanvasRenderingContext2D,
  dot: Dot,
  w: number,
  h: number,
  theme: ThemeMode,
) {
  const { x, y, scale, alpha } = project(dot, w, h)
  const nx = x / w
  const ny = y / h
  const vis = dotVisibility(nx, ny) * alpha
  if (vis <= 0.02) return

  ctx.beginPath()
  ctx.arc(x, y, dot.radius * scale, 0, Math.PI * 2)
  ctx.fillStyle = PALETTE[theme].base
  ctx.globalAlpha = vis
  ctx.fill()
  ctx.globalAlpha = 1
}

function drawLeadDot(
  ctx: CanvasRenderingContext2D,
  dot: Dot,
  w: number,
  h: number,
  theme: ThemeMode,
  forceVisible = false,
) {
  const { x, y, scale, alpha } = project(dot, w, h)
  const nx = x / w
  const ny = y / h
  let vis = dotVisibility(nx, ny) * alpha
  if (vis <= 0.02 && !forceVisible) return
  if (forceVisible) vis = Math.max(vis, 0.82)

  const { leadMid: mid, leadCore: core } = PALETTE[theme]
  const r = dot.radius * scale
  const glowR = r * 3.6
  const glowAlpha = theme === 'light' ? 0.75 : 0.9

  const gradient = ctx.createRadialGradient(x, y, 0, x, y, glowR)
  gradient.addColorStop(0, core)
  gradient.addColorStop(0.18, mid)
  gradient.addColorStop(
    0.5,
    theme === 'light' ? 'rgba(0, 0, 0, 0)' : 'rgba(255, 255, 255, 0)',
  )
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')

  ctx.save()
  ctx.globalCompositeOperation = theme === 'light' ? 'source-over' : 'lighter'
  ctx.globalAlpha = vis * glowAlpha
  ctx.fillStyle = gradient
  ctx.beginPath()
  ctx.arc(x, y, glowR, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()

  ctx.beginPath()
  ctx.arc(x, y, r + 0.5, 0, Math.PI * 2)
  ctx.globalAlpha = vis
  ctx.fillStyle = mid
  ctx.fill()
  ctx.globalAlpha = 1
}

function leadVisibility(dot: Dot, w: number, h: number) {
  const { x, y, alpha } = project(dot, w, h)
  return dotVisibility(x / w, y / h) * alpha
}

export function HeroDotField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef(0)
  const dotsRef = useRef<Dot[]>([])
  const lastTimeRef = useRef(performance.now())
  const { theme } = useTheme()
  const themeRef = useRef(theme)
  themeRef.current = theme

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { alpha: false })
    if (!ctx) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2)
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      dotsRef.current = buildDots(rect.width, rect.height)
    }

    resize()
    window.addEventListener('resize', resize)

    const draw = (now: number) => {
      const dt = Math.min((now - lastTimeRef.current) / 1000, 0.05)
      lastTimeRef.current = now

      const rect = canvas.getBoundingClientRect()
      const w = rect.width
      const h = rect.height

      advanceDots(dotsRef.current, dt, reducedMotion)

      const sorted = [...dotsRef.current].sort((a, b) => a.z - b.z)
      const leads = dotsRef.current.filter((d) => d.lead)
      const rankedLeads = leads
        .map((dot) => ({ dot, vis: leadVisibility(dot, w, h) }))
        .sort((a, b) => b.vis - a.vis)
      const guaranteed = new Set(
        rankedLeads.slice(0, 2).map((entry) => entry.dot),
      )

      const currentTheme = themeRef.current

      drawBackground(ctx, w, h, currentTheme)

      for (const dot of sorted) {
        if (!dot.lead) drawBaseDot(ctx, dot, w, h, currentTheme)
      }
      for (const dot of sorted) {
        if (dot.lead) {
          drawLeadDot(ctx, dot, w, h, currentTheme, guaranteed.has(dot))
        }
      }

      drawFade(ctx, w, h, currentTheme)

      frameRef.current = requestAnimationFrame(draw)
    }

    frameRef.current = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(frameRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      aria-hidden
    />
  )
}
