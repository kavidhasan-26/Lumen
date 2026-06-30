import { useEffect, useRef } from 'react'
import { useTheme } from '../context/ThemeContext'

const PALETTE = {
  dark: {
    bg: '#08080a',
    line: 'rgba(167, 139, 250, 0.82)',
    glow: 'rgba(139, 92, 246, 0.9)',
    grain: 0.065,
  },
  light: {
    bg: '#f7f3ee',
    line: 'rgba(124, 58, 237, 0.62)',
    glow: 'rgba(109, 40, 217, 0.75)',
    grain: 0.04,
  },
} as const

type ThemeMode = keyof typeof PALETTE

function drawGrain(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  amount: number,
) {
  const density = Math.floor((w * h) / 650)
  ctx.fillStyle = '#ffffff'

  for (let i = 0; i < density; i++) {
    ctx.globalAlpha = Math.random() * amount
    ctx.fillRect(Math.random() * w, Math.random() * h, 1, 1)
  }

  ctx.globalAlpha = 1
}

function strokeMeshLine(
  ctx: CanvasRenderingContext2D,
  line: string,
  glow: string,
) {
  ctx.strokeStyle = line
  ctx.lineWidth = 0.8
  ctx.shadowBlur = 10
  ctx.shadowColor = glow
  ctx.stroke()
}

function drawFunnel(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  theme: ThemeMode,
) {
  const { line, glow } = PALETTE[theme]
  const vpX = w * 0.5
  const vpY = h * 1.14
  const rayCount = 52
  const ringCount = 34

  for (let i = 0; i <= rayCount; i++) {
    const t = i / rayCount
    const angle = -Math.PI + t * Math.PI * 0.9
    const len = Math.hypot(w, h) * 1.45
    const x2 = vpX + Math.cos(angle) * len
    const y2 = vpY + Math.sin(angle) * len

    ctx.beginPath()
    ctx.moveTo(vpX, vpY)
    ctx.lineTo(x2, y2)
    strokeMeshLine(ctx, line, glow)
  }

  ctx.shadowBlur = 0

  for (let i = 1; i <= ringCount; i++) {
    const t = i / ringCount
    const y = vpY - t * h * 1.02
    const rx = w * (0.03 + t * 0.68)
    const ry = Math.max(2, rx * 0.15)

    ctx.beginPath()
    ctx.ellipse(vpX, y, rx, ry, 0, 0, Math.PI * 2)
    strokeMeshLine(ctx, line, glow)
  }

  ctx.shadowBlur = 0
}

function drawBackground(ctx: CanvasRenderingContext2D, w: number, h: number, theme: ThemeMode) {
  const { bg, grain } = PALETTE[theme]

  ctx.fillStyle = bg
  ctx.fillRect(0, 0, w, h)

  const vignette = ctx.createRadialGradient(w * 0.5, h * 0.5, 0, w * 0.5, h * 0.5, w * 0.85)
  if (theme === 'light') {
    vignette.addColorStop(0, 'rgba(247, 243, 238, 0.04)')
    vignette.addColorStop(1, 'rgba(247, 243, 238, 0.55)')
  } else {
    vignette.addColorStop(0, 'rgba(8, 8, 10, 0.02)')
    vignette.addColorStop(1, 'rgba(8, 8, 10, 0.55)')
  }
  ctx.fillStyle = vignette
  ctx.fillRect(0, 0, w, h)

  drawGrain(ctx, w, h, grain)
}

export function FunnelLineBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()
  const themeRef = useRef(theme)
  themeRef.current = theme

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { alpha: false })
    if (!ctx) return

    const paint = () => {
      const dpr = Math.min(window.devicePixelRatio, 2)
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      drawBackground(ctx, rect.width, rect.height, themeRef.current)
      drawFunnel(ctx, rect.width, rect.height, themeRef.current)
    }

    paint()
    window.addEventListener('resize', paint)
    return () => window.removeEventListener('resize', paint)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: false })
    if (!ctx) return
    const rect = canvas.getBoundingClientRect()
    drawBackground(ctx, rect.width, rect.height, theme)
    drawFunnel(ctx, rect.width, rect.height, theme)
  }, [theme])

  return (
    <canvas
      ref={canvasRef}
      className="funnel-line-canvas absolute inset-0 h-full w-full"
      aria-hidden
    />
  )
}
