import { useEffect, useRef } from 'react'
import { useTheme } from '../context/ThemeContext'

interface Dot {
  baseX: number
  baseY: number
  radius: number
  lead: boolean
  leadRank: number
  phaseX: number
  phaseY: number
  ampX: number
  ampY: number
  speedX: number
  speedY: number
}

const PALETTE = {
  dark: {
    base: '#1c1c22',
    leadMid: '#ffffff',
    leadCore: '#f4f3f0',
  },
  light: {
    base: '#d4d4d8',
    leadMid: '#916DF9',
    leadCore: '#f0ebff',
  },
} as const

type ThemeMode = keyof typeof PALETTE

function hash(n: number) {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453
  return x - Math.floor(x)
}

function buildDots(width: number, height: number): Dot[] {
  const spacing = Math.max(38, Math.min(52, width / 22))
  const regionLeft = -spacing * 0.3
  const regionWidth = width + spacing * 0.6
  const regionTop = height * 0.02
  const regionHeight = height * 0.94

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
      if (x < -spacing || x > width + spacing || y < 0 || y > height) continue

      dots.push({
        baseX: x,
        baseY: y,
        radius: 11.5 + seed2 * 3,
        lead: false,
        leadRank: -1,
        phaseX: seed * Math.PI * 2,
        phaseY: seed2 * Math.PI * 2,
        ampX: 6 + seed3 * 10,
        ampY: 6 + seed * 10,
        speedX: 0.35 + seed2 * 0.45,
        speedY: 0.3 + seed3 * 0.4,
      })
      dotIndex++
    }
  }

  return dots
}

function assignLeads(dots: Dot[], width: number, height: number, glowCount: number) {
  const targets = [
    { x: width * 0.62, y: height * 0.2 },
    { x: width * 0.78, y: height * 0.16 },
    { x: width * 0.48, y: height * 0.42 },
    { x: width * 0.72, y: height * 0.58 },
    { x: width * 0.55, y: height * 0.72 },
    { x: width * 0.82, y: height * 0.78 },
  ]

  for (const dot of dots) {
    dot.lead = false
    dot.leadRank = -1
  }

  const used = new Set<number>()
  let rank = 0

  for (let t = 0; t < Math.min(glowCount, targets.length); t++) {
    const target = targets[t]
    let best = -1
    let bestD = Infinity
    for (let i = 0; i < dots.length; i++) {
      if (used.has(i)) continue
      const d = Math.hypot(dots[i].baseX - target.x, dots[i].baseY - target.y)
      if (d < bestD) {
        bestD = d
        best = i
      }
    }
    if (best >= 0) {
      dots[best].lead = true
      dots[best].leadRank = rank++
      dots[best].ampX *= 0.65
      dots[best].ampY *= 0.65
      used.add(best)
    }
  }
}

function floatPosition(dot: Dot, time: number) {
  const x = dot.baseX + Math.sin(time * dot.speedX + dot.phaseX) * dot.ampX
  const y = dot.baseY + Math.cos(time * dot.speedY + dot.phaseY) * dot.ampY
  const breathe = dot.lead
    ? 1 + 0.08 * Math.sin(time * 1.4 + dot.phaseY)
    : 1 + 0.04 * Math.sin(time * 0.9 + dot.phaseX)
  const alpha = dot.lead
    ? 0.92 + 0.08 * Math.sin(time * 1.1 + dot.phaseX)
    : 0.55 + 0.2 * Math.sin(time * 0.7 + dot.phaseY)

  return { x, y, scale: breathe, alpha }
}

function drawBackground(ctx: CanvasRenderingContext2D, w: number, h: number, theme: ThemeMode) {
  ctx.fillStyle = theme === 'light' ? '#ffffff' : '#08080a'
  ctx.fillRect(0, 0, w, h)
}

function drawFade(ctx: CanvasRenderingContext2D, w: number, h: number, theme: ThemeMode, edgeFade: boolean) {
  if (edgeFade) {
    const base = theme === 'light' ? '255, 255, 255' : '8, 8, 10'

    const left = ctx.createLinearGradient(0, 0, w * 0.35, 0)
    left.addColorStop(0, `rgba(${base}, 0.85)`)
    left.addColorStop(0.5, `rgba(${base}, 0.2)`)
    left.addColorStop(1, `rgba(${base}, 0)`)
    ctx.fillStyle = left
    ctx.fillRect(0, 0, w, h)
  }

  const bottom = ctx.createRadialGradient(w * 0.5, h * 1.1, 0, w * 0.5, h * 0.7, w * 0.55)
  bottom.addColorStop(0, theme === 'light' ? 'rgba(180, 83, 9, 0.08)' : 'rgba(232, 184, 74, 0.1)')
  bottom.addColorStop(1, 'rgba(0, 0, 0, 0)')
  ctx.fillStyle = bottom
  ctx.fillRect(0, 0, w, h)
}

function drawBaseDot(
  ctx: CanvasRenderingContext2D,
  dot: Dot,
  time: number,
  theme: ThemeMode,
) {
  const { x, y, scale, alpha } = floatPosition(dot, time)
  ctx.beginPath()
  ctx.arc(x, y, dot.radius * scale, 0, Math.PI * 2)
  ctx.fillStyle = PALETTE[theme].base
  ctx.globalAlpha = alpha
  ctx.fill()
  ctx.globalAlpha = 1
}

function drawLeadDot(
  ctx: CanvasRenderingContext2D,
  dot: Dot,
  time: number,
  theme: ThemeMode,
  forceVisible: boolean,
) {
  const { x, y, scale, alpha } = floatPosition(dot, time)
  const vis = forceVisible ? Math.max(alpha, 0.9) : alpha * 0.7

  const { leadMid: mid, leadCore: core } = PALETTE[theme]
  const r = dot.radius * scale
  const glowR = r * 3.6

  const gradient = ctx.createRadialGradient(x, y, 0, x, y, glowR)
  gradient.addColorStop(0, core)
  gradient.addColorStop(0.2, mid)
  if (theme === 'light') {
    gradient.addColorStop(0.55, 'rgba(145, 109, 249, 0.18)')
  }
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')

  ctx.save()
  ctx.globalCompositeOperation = theme === 'light' ? 'source-over' : 'lighter'
  ctx.globalAlpha = vis * (theme === 'light' ? 0.75 : 0.9)
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

const DESKTOP_QUESTIONS = [
  { id: 'who', text: 'Who is this?', x: '58%', y: '18%', delay: 0 },
  { id: 'afford', text: 'Can they afford it?', x: '42%', y: '36%', delay: 0.4 },
  { id: 'intent', text: 'Will they book?', x: '68%', y: '44%', delay: 0.8 },
  { id: 'when', text: 'When to call?', x: '50%', y: '62%', delay: 1.2 },
  { id: 'fit', text: 'Right procedure?', x: '72%', y: '70%', delay: 1.6 },
]

const MOBILE_QUESTIONS = [
  { id: 'who', text: 'Who is this?', x: '74%', y: '12%', delay: 0 },
  { id: 'afford', text: 'Can they afford it?', x: '34%', y: '26%', delay: 0.4 },
  { id: 'intent', text: 'Will they book?', x: '70%', y: '42%', delay: 0.8 },
  { id: 'when', text: 'When to call?', x: '30%', y: '58%', delay: 1.2 },
  { id: 'fit', text: 'Right procedure?', x: '72%', y: '74%', delay: 1.6 },
]

interface QuestionDotFieldProps {
  /** 0 = problem (dim), 1 = ranked (glowing) */
  glowPhase: number
  showPills?: boolean
  variant?: 'desktop' | 'mobile'
}

export function QuestionDotField({
  glowPhase,
  showPills = true,
  variant = 'desktop',
}: QuestionDotFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef(0)
  const dotsRef = useRef<Dot[]>([])
  const glowRef = useRef(glowPhase)
  const showPillsRef = useRef(showPills)
  const variantRef = useRef(variant)
  const timeRef = useRef(0)
  const { theme } = useTheme()
  const themeRef = useRef(theme)
  themeRef.current = theme
  glowRef.current = glowPhase
  showPillsRef.current = showPills
  variantRef.current = variant

  const questions = variant === 'mobile' ? MOBILE_QUESTIONS : DESKTOP_QUESTIONS

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { alpha: false })
    if (!ctx) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let lastNow = performance.now()

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
      const dt = Math.min((now - lastNow) / 1000, 0.05)
      lastNow = now
      if (!reducedMotion) timeRef.current += dt

      const rect = canvas.getBoundingClientRect()
      const w = rect.width
      const h = rect.height
      const time = timeRef.current
      const phase = glowRef.current
      const glowCount = phase <= 0 ? 0 : Math.min(5, Math.floor(phase * 5))

      assignLeads(dotsRef.current, w, h, glowCount)

      const leads = dotsRef.current.filter((d) => d.lead)
      const topLeads = new Set(
        [...leads].sort((a, b) => a.leadRank - b.leadRank).slice(0, glowCount),
      )

      const currentTheme = themeRef.current
      drawBackground(ctx, w, h, currentTheme)

      for (const dot of dotsRef.current) {
        if (!dot.lead) drawBaseDot(ctx, dot, time, currentTheme)
      }
      for (const dot of dotsRef.current) {
        if (dot.lead) {
          drawLeadDot(ctx, dot, time, currentTheme, topLeads.has(dot))
        }
      }

      drawFade(ctx, w, h, currentTheme, showPillsRef.current && variantRef.current === 'desktop')
      frameRef.current = requestAnimationFrame(draw)
    }

    frameRef.current = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(frameRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [])

  const litQuestions =
    glowPhase <= 0 ? 0 : Math.min(questions.length, Math.floor(glowPhase * questions.length))

  return (
    <div className="question-field relative h-full w-full overflow-visible">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden />
      {showPills && (
      <div className="pointer-events-none absolute inset-0 overflow-visible" aria-hidden>
        {questions.map((q, i) => {
          const isLit = i < litQuestions
          return (
            <div
              key={q.id}
              className={`question-pill absolute ${isLit ? 'question-pill--lit' : ''}`}
              style={{
                left: q.x,
                top: q.y,
                animationDelay: `${q.delay}s`,
              }}
            >
              <span className="question-pill__dot" />
              <span className="question-pill__text">{q.text}</span>
            </div>
          )
        })}
      </div>
      )}
    </div>
  )
}
