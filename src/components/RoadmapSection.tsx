import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const phases = [
  {
    title: 'Lumen Copilot',
    status: 'Live now',
    tone: 'cyan' as const,
    body: 'Scoring, profiles & pitch for your human agents. Every enquiry read on arrival, every call started with the full picture.',
    dimmed: false,
  },
  {
    title: 'Asha Chat',
    status: 'Next',
    tone: 'purple' as const,
    body: "Autopilot on WhatsApp — reaches every enquiry in seconds, qualifies in the patient's language, and books the consult.",
    dimmed: false,
  },
  {
    title: 'Asha Voice',
    status: 'On the horizon',
    tone: 'muted' as const,
    body: 'Autopilot on the phone — a warm, natural voice that handles questions, calms anxiety, and carries the affordability conversation to a decision.',
    dimmed: true,
  },
]

const badgeStyles = {
  cyan: 'roadmap-badge roadmap-badge--cyan',
  purple: 'roadmap-badge roadmap-badge--purple',
  muted: 'roadmap-badge roadmap-badge--muted',
}

export function RoadmapSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-12%' })

  return (
    <section
      id="roadmap"
      ref={ref}
      className="border-t border-border px-6 py-24 md:px-10 md:py-32"
    >
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="mb-14 max-w-2xl md:mb-16"
        >
          <p className="hero-eyebrow mb-4 text-xs font-medium tracking-[0.14em] uppercase">
            The roadmap
          </p>
          <h2 className="font-display text-ink text-3xl md:text-4xl lg:text-[2.5rem] lg:leading-[1.08]">
            One intelligence. From copilot to autopilot.
          </h2>
        </motion.div>

        <div className="roadmap-timeline relative pl-10 md:pl-12">
          <div className="roadmap-line" aria-hidden />

          <div className="flex flex-col gap-12 md:gap-14">
            {phases.map((phase, i) => (
              <motion.article
                key={phase.title}
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 + i * 0.12, duration: 0.5 }}
                className={`relative ${phase.dimmed ? 'opacity-50' : ''}`}
              >
                <span
                  className="roadmap-dot absolute top-1.5 -left-10 md:-left-12"
                  aria-hidden
                />

                <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                  <h3 className="font-display text-ink text-xl md:text-2xl">{phase.title}</h3>
                  <span className={badgeStyles[phase.tone]}>{phase.status}</span>
                </div>

                <p className="text-muted mt-3 max-w-2xl text-sm leading-relaxed md:text-base">
                  {phase.body}
                </p>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
