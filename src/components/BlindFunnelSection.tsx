import { AnimatePresence, motion, useScroll } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { QuestionDotField } from './QuestionDotField'
import { ScrollSectionDots } from './ScrollSectionDots'

const phases = [
  {
    id: 'problem',
    eyebrow: '01 — The blind funnel',
    line1: "Your funnel doesn't leak at the bottom.",
    line2: 'It leaks in the dark.',
    body: "You can't tell who's ready to book. Your team calls blind — and good leads go cold.",
    glow: 0,
  },
  {
    id: 'solution',
    eyebrow: '02 — Ranked and ready',
    line1: 'Unsorted inquiries become a clear call list.',
    line2: null,
    body: 'Every inquiry gets scored on intent, budget, and fit. Your team always knows who to call first.',
    glow: 1,
  },
]

function FunnelCopy({ content }: { content: (typeof phases)[number] }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={content.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="hero-eyebrow mb-6 text-xs font-medium tracking-[0.14em] uppercase">
          {content.eyebrow}
        </p>

        <h2 className="font-display text-ink text-[clamp(2rem,5vw,3.25rem)] leading-[1.05]">
          {content.line1}
        </h2>

        {content.line2 && (
          <p className="font-display text-muted mt-2 text-[clamp(2rem,5vw,3.25rem)] leading-[1.05] tracking-[-0.02em]">
            {content.line2}
          </p>
        )}

        <p className="text-muted mt-8 max-w-md text-sm leading-relaxed md:text-base">
          {content.body}
        </p>
      </motion.div>
    </AnimatePresence>
  )
}

export function BlindFunnelSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [phase, setPhase] = useState(0)
  const [glowPhase, setGlowPhase] = useState(0)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  useEffect(() => {
    return scrollYProgress.on('change', (value) => {
      const nextPhase = value < 0.48 ? 0 : 1
      setPhase(nextPhase)
      setGlowPhase(
        value < 0.48 ? 0 : Math.max(0, Math.min(1, (value - 0.48) / 0.52)),
      )
    })
  }, [scrollYProgress])

  const content = phases[phase]

  return (
    <section
      ref={sectionRef}
      className="blind-funnel-section relative border-t border-border"
      style={{ height: '200vh' }}
    >
      <div className="sticky top-0 h-[100svh] md:min-h-[100svh]">
        {/* Mobile — text top, fixed-height dots below */}
        <div className="flex h-full flex-col md:hidden">
          <div className="relative z-10 mx-auto w-full max-w-5xl min-h-0 flex-1 px-6 pt-32 pb-5">
            <div className="flex items-center">
              <ScrollSectionDots progress={scrollYProgress} className="mr-4 shrink-0" />
              <div className="min-w-0 flex-1">
                <FunnelCopy content={content} />
              </div>
            </div>
          </div>
          <div className="blind-funnel__dots relative h-[54svh] shrink-0 overflow-visible">
            <div className="blind-funnel__top-fade pointer-events-none absolute inset-x-0 top-0 z-10" aria-hidden />
            <QuestionDotField glowPhase={glowPhase} variant="mobile" />
          </div>
        </div>

        {/* Desktop — original side-by-side layout */}
        <div className="relative hidden min-h-[100svh] md:block">
          <div className="relative mx-auto min-h-[100svh] max-w-5xl px-6 md:px-10">
            <div className="relative z-10 flex min-h-[100svh] max-w-xl flex-col justify-center py-20 md:max-w-md md:py-24 lg:max-w-xl">
              <div className="flex items-center">
                <ScrollSectionDots progress={scrollYProgress} className="mr-6 shrink-0 lg:mr-8" />
                <div className="min-w-0 flex-1">
                  <FunnelCopy content={content} />
                </div>
              </div>
            </div>
          </div>

          <div className="pointer-events-none absolute inset-y-0 right-0 left-0 md:left-[38%] lg:left-[42%]">
            <QuestionDotField glowPhase={glowPhase} variant="desktop" />
          </div>
        </div>
      </div>
    </section>
  )
}
