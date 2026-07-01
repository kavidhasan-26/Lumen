import { motion, useInView } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

const stepGlow = [
  'shadow-[0_0_40px_rgba(167,139,250,0.12)]',
  'shadow-[0_0_40px_rgba(167,139,250,0.1)]',
  'shadow-[0_0_40px_rgba(167,139,250,0.08)]',
]

const steps = [
  {
    id: 'score',
    title: 'Score',
    body: 'Every lead is read and ranked on real conversion probability the instant it lands. Diamond leads rise to the top — no good lead hides in the queue.',
    outcome: 'Your team always knows who to call first.',
    accent: 'var(--color-purple)',
    shellClass: 'glimpse-shell--purple',
    fillClass: 'from-purple/12',
  },
  {
    id: 'categorize',
    title: 'Categorize',
    body: "Lumen builds a living profile of who's really on the other end — their motivation, financial comfort, and the right channel and moment to reach them.",
    outcome: 'No more guessing from a name and number.',
    accent: 'var(--color-purple)',
    shellClass: 'glimpse-shell--purple',
    fillClass: 'from-purple/12',
  },
  {
    id: 'coach',
    title: 'Coach',
    body: "Your agent opens with a tailored, ready-to-use pitch — the right talk-track in the patient's own language, with the affordability angle already worked out.",
    outcome: 'Every call starts with context, not cold discovery.',
    accent: 'var(--color-purple)',
    shellClass: 'glimpse-shell--purple',
    fillClass: 'from-purple/12',
  },
]

function ScoreRing({ score, size = 72 }: { score: number; size?: number }) {
  const r = 28
  const c = 2 * Math.PI * r
  const offset = c - (score / 100) * c

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg viewBox="0 0 72 72" className="h-full w-full -rotate-90" aria-hidden>
        <circle cx="36" cy="36" r={r} fill="none" stroke="var(--color-border)" strokeWidth="4" />
        <motion.circle
          cx="36"
          cy="36"
          r={r}
          fill="none"
          stroke="var(--color-purple)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          whileInView={{ strokeDashoffset: offset }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-ink text-lg leading-none">{score}</span>
      </div>
    </div>
  )
}

function ScoreGlimpse() {
  const queue = [
    { tier: 'Diamond', score: 94, featured: true },
    { tier: 'Gold', score: 78 },
    { tier: 'Silver', score: 61 },
  ]

  return (
    <div className="glimpse-card divide-border/60 divide-y overflow-hidden rounded-2xl">
      {queue.map((row, i) => (
        <motion.div
          key={row.tier}
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.06 }}
          className={`flex items-center gap-4 px-4 py-3.5 ${row.featured ? 'bg-surface-raised/40' : ''}`}
        >
          {row.featured ? (
            <ScoreRing score={row.score} size={56} />
          ) : (
            <span className="text-ink/75 font-display w-12 shrink-0 text-right text-sm tabular-nums">
              {row.score}
            </span>
          )}
          <div className="min-w-0 flex-1">
            <p
              className={`text-[10px] font-medium tracking-[0.1em] uppercase ${
                row.featured ? 'text-purple' : 'text-muted'
              }`}
            >
              {row.tier}
            </p>
            {row.featured && (
              <>
                <p className="font-display text-ink mt-1 text-sm">Top of today&apos;s queue</p>
                <p className="text-muted mt-0.5 text-[11px]">
                  Losing interest · ranked first · call now
                </p>
              </>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  )
}

function CategorizeGlimpse() {
  const groups = [
    {
      label: 'Interest',
      items: ['Hair transplant', 'High intent'],
    },
    {
      label: 'Fit',
      items: ['High affordability', 'EMI eligible'],
    },
    {
      label: 'Context',
      items: ['WhatsApp lead', '2d ago'],
    },
  ]

  return (
    <div className="glimpse-card overflow-hidden rounded-2xl">
      <div className="border-border/60 border-b px-4 py-3">
        <p className="text-muted text-[10px] font-medium tracking-[0.14em] uppercase">
          Lead snapshot
        </p>
      </div>
      <div className="divide-border/50 divide-y">
        {groups.map((group, gi) => (
          <motion.div
            key={group.label}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: gi * 0.1 }}
            className="flex items-center gap-4 px-4 py-3.5"
          >
            <div className="flex w-[5.5rem] shrink-0 items-center gap-2">
              <span className="bg-ink/35 h-1.5 w-1.5 shrink-0 rounded-full" />
              <span className="text-muted text-[10px] leading-none tracking-[0.08em] uppercase">
                {group.label}
              </span>
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              {group.items.map((item) => (
                <span key={item} className="text-ink/90 text-xs font-medium">
                  {item}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function CoachGlimpse() {
  const tags = ['Employed', 'High credit score', 'Prefers weekend calls']

  return (
    <div className="space-y-3">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="glimpse-card-accent glimpse-card-accent--purple rounded-2xl p-4"
      >
        <p className="text-muted text-[10px] font-medium tracking-[0.14em] uppercase">
          Call briefing
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {tags.map((tag, i) => (
            <motion.span
              key={tag}
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08 + i * 0.06 }}
              className="glimpse-tag rounded-full px-2.5 py-1 text-[10px]"
            >
              {tag}
            </motion.span>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.15 }}
        className="glimpse-card relative rounded-2xl p-4"
      >
        <div className="bg-purple/70 absolute top-4 bottom-4 left-0 w-0.5 rounded-full" />
        <p className="text-muted pl-3 text-[10px] font-medium tracking-[0.14em] uppercase">
          Open with
        </p>
        <p className="text-ink/90 mt-2 pl-3 text-sm leading-relaxed">
          &ldquo;I saw you&apos;re exploring a hair transplant — we start with a quick doctor
          assessment and graft plan. Want a slot this weekend?&rdquo;
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.28 }}
        className="glimpse-card rounded-2xl p-4"
      >
        <div className="mb-3 flex items-center justify-between">
          <span className="text-muted text-[10px] font-medium tracking-[0.14em] uppercase">
            Best time to call
          </span>
          <span className="text-ink text-xs font-medium">Sat · 6 PM</span>
        </div>
        <div className="glimpse-timeline-track relative h-1.5 overflow-hidden rounded-full">
          <motion.div
            className="bg-purple absolute top-0 left-[58%] h-full w-[18%] rounded-full"
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.5 }}
            style={{ transformOrigin: 'left' }}
          />
        </div>
        <div className="text-muted mt-2 flex justify-between text-[10px]">
          <span>Mon</span>
          <span>Fri</span>
          <span className="text-purple">Sat</span>
          <span>Sun</span>
        </div>
      </motion.div>
    </div>
  )
}

function StepGlimpse({
  index,
  accent,
  shellClass,
  fillClass,
}: {
  index: number
  accent: string
  shellClass: string
  fillClass: string
}) {
  return (
    <div className="mt-8">
      <div className="mb-3 flex items-center gap-3">
        <span className="h-px flex-1 bg-border" />
        <span className="hero-eyebrow text-[10px] font-medium tracking-[0.14em] uppercase">
          What surfaces
        </span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <div className={`glimpse-shell relative overflow-hidden rounded-[1.25rem] border p-1 ${shellClass}`}>
        <div
          className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${fillClass} via-transparent to-transparent`}
        />
        <div
          className="pointer-events-none absolute -top-16 -right-10 h-40 w-40 rounded-full blur-3xl"
          style={{ background: accent, opacity: 0.14 }}
        />

        <div className="glimpse-inner relative rounded-[1rem] p-4 md:p-5">
          {index === 0 && <ScoreGlimpse />}
          {index === 1 && <CategorizeGlimpse />}
          {index === 2 && <CoachGlimpse />}
        </div>
      </div>
    </div>
  )
}

function StepPanel({
  step,
  index,
  onActive,
}: {
  step: (typeof steps)[number]
  index: number
  onActive: (index: number) => void
}) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { margin: '-45% 0px -45% 0px' })

  useEffect(() => {
    if (inView) onActive(index)
  }, [inView, index, onActive])

  return (
    <article
      ref={ref}
      className={`step-card glass min-h-[55vh] rounded-2xl p-6 transition-all duration-500 md:min-h-[65vh] md:p-8 ${
        inView
          ? `step-card--active border-ink/15 ring-1 ring-ink/10 ${stepGlow[index]}`
          : 'step-card--idle'
      }`}
    >
      <span className="text-purple text-xs tracking-wide">/ 0{index + 1}</span>
      <h3 className="font-display text-ink mt-3 text-2xl md:text-3xl">{step.title}</h3>
      <p className="text-muted mt-4 text-sm leading-relaxed md:text-base">{step.body}</p>
      <p className="text-ink/75 mt-4 text-sm font-medium">{step.outcome}</p>

      <StepGlimpse
        index={index}
        accent={step.accent}
        shellClass={step.shellClass}
        fillClass={step.fillClass}
      />
    </article>
  )
}

export function ThreeSteps() {
  const sectionRef = useRef<HTMLElement>(null)
  const inView = useInView(sectionRef, { once: true, margin: '-10%' })
  const [active, setActive] = useState(0)

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="border-t border-border px-6 py-24 md:px-10 md:py-32"
    >
      <div className="mx-auto grid max-w-5xl gap-12 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:gap-16 lg:gap-20">
        <div className="md:sticky md:top-28 md:self-start lg:top-32">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            className="hero-eyebrow mb-4 text-xs font-medium tracking-[0.14em] uppercase"
          >
            From inquiry to call-ready
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.05 }}
            className="font-display text-ink text-3xl md:text-4xl lg:text-[2.75rem] lg:leading-[1.1]"
          >
            Three things happen before the phone rings.
          </motion.h2>

          <div className="mt-8 hidden flex-col gap-3 md:flex">
            {steps.map((step, i) => (
              <div
                key={step.id}
                className={`flex items-center gap-3 transition-opacity duration-300 ${
                  active === i ? 'opacity-100' : 'opacity-30'
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full transition-colors duration-300 ${
                    active === i ? 'bg-ink' : 'bg-border'
                  }`}
                />
                <span className="text-muted text-sm">
                  <span className="text-purple mr-2">/ 0{i + 1}</span>
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-8 md:gap-16 lg:gap-24">
          {steps.map((step, i) => (
            <StepPanel key={step.id} step={step} index={i} onActive={setActive} />
          ))}
        </div>
      </div>
    </section>
  )
}
