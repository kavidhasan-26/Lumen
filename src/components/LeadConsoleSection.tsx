import { AnimatePresence, motion, useInView, useMotionValueEvent, useScroll } from 'framer-motion'
import { useCallback, useRef, useState } from 'react'

type Lead = {
  id: string
  name: string
  demographic: string
  score: number
  tags: { label: string; accent: boolean }[]
  interestLine: string
  phone: string
  bestTime: string
  thingsToKnow: string[]
  openWith: string
  processedIn: string
}

const leads: Lead[] = [
  {
    id: 'faijul',
    name: 'Faijul Haque',
    demographic: 'Male, 29 years',
    score: 92,
    tags: [
      { label: 'Eyebrow Transplant', accent: true },
      { label: 'Very High intent', accent: true },
      { label: 'Eligible for EMI', accent: false },
      { label: 'Model Town, Delhi', accent: false },
    ],
    interestLine: 'Shown interest on 3 Mar 2026',
    phone: '+91 7998216664',
    bestTime: 'Tue–Thu 7–9 PM',
    thingsToKnow: [
      'Works in a private company — stable income, EMI comfort is high.',
      'CIBIL 780 · no prior loan defaults.',
      'Prefers informal WhatsApp tone — keep it conversational.',
    ],
    openWith:
      '“Hi Faijul, main clinic se bol rahi hoon — aapne eyebrow transplant ke baare mein interest dikhaya tha. Kya abhi 2 minute baat ho sakti hai?”',
    processedIn: '0.8s',
  },
  {
    id: 'priya',
    name: 'Priya Sharma',
    demographic: 'Female, 34 years',
    score: 88,
    tags: [
      { label: 'Rhinoplasty', accent: true },
      { label: 'High intent', accent: true },
      { label: 'Self-pay ready', accent: false },
      { label: 'South Extension, Delhi', accent: false },
    ],
    interestLine: 'Shown interest on 28 Jun 2026',
    phone: '+91 9811042238',
    bestTime: 'Weekdays 11 AM–1 PM',
    thingsToKnow: [
      'Consulted one competitor last month — price-sensitive but motivated.',
      'Prefers a detailed procedure walkthrough before committing.',
      'Responds fastest on WhatsApp voice notes.',
    ],
    openWith:
      '“Hi Priya, aapne rhinoplasty ke liye interest dikhaya tha — main aapke profile ke saath options aur recovery timeline share kar sakti hoon. Abhi 2 minute baat ho sakti hai?”',
    processedIn: '0.6s',
  },
  {
    id: 'amit',
    name: 'Amit Raj',
    demographic: 'Male, 41 years',
    score: 76,
    tags: [
      { label: 'Hair Transplant', accent: true },
      { label: 'Medium intent', accent: false },
      { label: 'EMI eligible', accent: false },
      { label: 'Sector 43, Gurugram', accent: false },
    ],
    interestLine: 'Shown interest on 24 Jun 2026',
    phone: '+91 9873301945',
    bestTime: 'Sat–Sun 10 AM–12 PM',
    thingsToKnow: [
      'Employed in IT — researching graft count and density for 3+ weeks.',
      'Travels frequently; weekend slots work best.',
      'Asked about post-op downtime twice in the enquiry form.',
    ],
    openWith:
      '“Hi Amit, aapne hair transplant ke baare mein enquiry ki thi — graft planning aur recovery timeline 2 minute mein samjha deti hoon. Abhi baat ho sakti hai?”',
    processedIn: '0.9s',
  },
  {
    id: 'sneha',
    name: 'Sneha Malhotra',
    demographic: 'Female, 27 years',
    score: 95,
    tags: [
      { label: 'Lip Filler', accent: true },
      { label: 'Very High intent', accent: true },
      { label: 'Premium segment', accent: true },
      { label: 'DLF Phase 1, Gurugram', accent: false },
    ],
    interestLine: 'Shown interest on 29 Jun 2026',
    phone: '+91 9560018842',
    bestTime: 'Today after 6 PM',
    thingsToKnow: [
      'Previously treated at another clinic — knows the category well.',
      'Asked specifically about doctor credentials and product brand.',
      'Mentioned an event in 3 weeks — timing matters.',
    ],
    openWith:
      '“Hi Sneha, aapne lip filler ke liye interest dikhaya tha — doctor credentials aur exact product plan 2 minute mein cover kar lete hain. Abhi baat ho sakti hai?”',
    processedIn: '0.5s',
  },
  {
    id: 'rohit',
    name: 'Rohit Verma',
    demographic: 'Male, 32 years',
    score: 68,
    tags: [
      { label: 'Dental Veneers', accent: true },
      { label: 'Low intent', accent: false },
      { label: 'EMI eligible', accent: false },
      { label: 'Karol Bagh, Delhi', accent: false },
    ],
    interestLine: 'Shown interest on 15 Jun 2026',
    phone: '+91 8826093310',
    bestTime: 'Mon–Wed 8–10 PM',
    thingsToKnow: [
      'Compared three clinics in the last fortnight.',
      'EMI monthly cap seems to be the main decision driver.',
      'Prefers a clear cost breakdown before committing.',
    ],
    openWith:
      '“Hi Rohit, aapne dental veneers ke baare mein interest dikhaya tha — EMI options aur total cost breakdown 2 minute mein share kar deta hoon. Abhi baat ho sakti hai?”',
    processedIn: '1.1s',
  },
]

const SCROLL_VH_PER_LEAD = 68
const SCROLL_HOLD_VH = 24

function leadIndexFromProgress(progress: number, total: number) {
  if (total <= 1) return 0
  return Math.min(total - 1, Math.max(0, Math.floor(progress * total)))
}

function progressFromLeadIndex(index: number, total: number) {
  if (total <= 1) return 0
  return Math.min(1, (index + 0.5) / total)
}

function maskPhone(phone: string) {
  const digits = phone.replace(/\D/g, '')
  const last4 = digits.slice(-4)
  return `+91 ••••• ${last4}`
}

function ScoreRing({ score, leadId }: { score: number; leadId: string }) {
  const r = 34
  const c = 2 * Math.PI * r
  const offset = c - (score / 100) * c

  return (
    <div className="console-score-ring relative h-[5.5rem] w-[5.5rem] shrink-0">
      <svg viewBox="0 0 88 88" className="h-full w-full -rotate-90" aria-hidden>
        <circle cx="44" cy="44" r={r} fill="none" stroke="var(--color-border)" strokeWidth="3" />
        <motion.circle
          key={leadId}
          cx="44"
          cy="44"
          r={r}
          fill="none"
          stroke="var(--color-gold)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-ink text-2xl leading-none">{score}</span>
        <span className="text-gold mt-0.5 text-[9px] font-semibold tracking-[0.14em] uppercase">Score</span>
      </div>
    </div>
  )
}

function PhoneIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}

function ChevronDownIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  )
}

export function LeadConsoleSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const inView = useInView(sectionRef, { once: true, margin: '-10%' })
  const [leadIndex, setLeadIndex] = useState(0)
  const isProgrammaticScroll = useRef(false)
  const scrollUnlockTimer = useRef<number | null>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  useMotionValueEvent(scrollYProgress, 'change', (progress) => {
    if (isProgrammaticScroll.current) return
    const nextIndex = leadIndexFromProgress(progress, leads.length)
    setLeadIndex((current) => (current === nextIndex ? current : nextIndex))
  })

  const scrollToLead = useCallback((index: number) => {
    const section = sectionRef.current
    if (!section) return

    const boundedIndex = ((index % leads.length) + leads.length) % leads.length
    const sectionTop = section.offsetTop
    const scrollable = Math.max(1, section.offsetHeight - window.innerHeight)
    const target = sectionTop + progressFromLeadIndex(boundedIndex, leads.length) * scrollable

    isProgrammaticScroll.current = true
    if (scrollUnlockTimer.current !== null) {
      window.clearTimeout(scrollUnlockTimer.current)
    }

    setLeadIndex(boundedIndex)
    window.scrollTo({ top: target, behavior: 'smooth' })
    scrollUnlockTimer.current = window.setTimeout(() => {
      isProgrammaticScroll.current = false
    }, 700)
  }, [])

  const nextLead = () => {
    scrollToLead(leadIndex + 1)
  }

  const lead = leads[leadIndex]

  return (
    <section
      id="console"
      ref={sectionRef}
      className="lead-console relative border-t border-border"
      style={{ height: `${leads.length * SCROLL_VH_PER_LEAD + SCROLL_HOLD_VH}vh` }}
    >
      <div className="sticky top-0 flex min-h-[100svh] flex-col justify-center px-6 py-24 md:px-10 md:py-32">
        <div className="mx-auto w-full max-w-5xl">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="font-display text-ink mb-12 text-center text-3xl md:mb-14 md:text-4xl lg:text-[2.75rem] lg:leading-[1.08]"
        >
          A lead lands. Lumen lights it up.
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.08, duration: 0.55 }}
          className="console-window relative overflow-hidden rounded-2xl border"
        >
          <div className="console-chrome relative z-10 flex items-center justify-between gap-4 border-b px-4 py-3 md:px-5">
            <div className="flex items-center gap-3">
              <div className="console-dots flex gap-1.5" aria-hidden>
                <span />
                <span />
                <span />
              </div>
              <span className="text-muted text-xs font-medium md:text-sm">Lumen Copilot</span>
            </div>
            <span className="console-live flex items-center gap-2 text-[10px] font-semibold tracking-[0.14em] uppercase">
              <span className="bg-gold relative flex h-2 w-2 rounded-full">
                <span className="bg-gold absolute inline-flex h-full w-full animate-ping rounded-full opacity-60" />
              </span>
              Live
            </span>
          </div>

          <div className="console-body relative z-10">
            <div className="console-body__frame">
            <AnimatePresence mode="wait">
              <motion.div
                key={lead.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                className="console-body__grid grid h-full md:grid-cols-[1.05fr_0.95fr]"
              >
                <div className="console-lead border-b p-5 md:border-r md:border-b-0 md:p-6 lg:p-7">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="font-display text-ink truncate text-2xl md:text-[1.65rem]">{lead.name}</h3>
                      <p className="text-muted mt-1 text-sm">{lead.demographic}</p>
                    </div>
                    <ScoreRing score={lead.score} leadId={lead.id} />
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {lead.tags.map((tag) => (
                      <span
                        key={tag.label}
                        className={`console-tag ${tag.accent ? 'console-tag--accent' : ''}`}
                      >
                        <span className={`console-tag__dot ${tag.accent ? 'console-tag__dot--accent' : ''}`} />
                        {tag.label}
                      </span>
                    ))}
                  </div>

                  <div className="console-divider my-5" />

                  <p className="text-muted text-xs leading-relaxed md:text-sm">{lead.interestLine}</p>

                  <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <button type="button" className="console-call-btn" aria-label={`Call lead ${lead.name}`}>
                      <PhoneIcon />
                      {maskPhone(lead.phone)}
                    </button>
                    <button type="button" className="console-status-btn">
                      Set status
                      <ChevronDownIcon />
                    </button>
                  </div>

                  <p className="text-muted mt-4 text-xs md:text-sm">
                    Best time to call — <span className="text-ink/80">{lead.bestTime}</span>
                  </p>
                </div>

                <div className="console-tips p-5 md:p-6 lg:p-7">
                  <p className="console-tips__eyebrow mb-5 flex items-center gap-2 text-[10px] font-semibold tracking-[0.14em] uppercase">
                    <span className="bg-gold h-2 w-2 rounded-full" />
                    Lumen&apos;s on-call tips
                  </p>

                  <div className="mb-6">
                    <p className="text-gold mb-3 text-[10px] font-semibold tracking-[0.12em] uppercase">
                      Things to know
                    </p>
                    <ul className="space-y-2.5">
                      {lead.thingsToKnow.map((item) => (
                        <li key={item} className="console-tip-item text-sm leading-relaxed">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="text-gold mb-3 text-[10px] font-semibold tracking-[0.12em] uppercase">Open with</p>
                    <p className="console-open-with text-sm leading-relaxed">{lead.openWith}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
            </div>
          </div>

          <div className="console-footer relative z-10 flex flex-col gap-3 border-t px-4 py-3 sm:flex-row sm:items-center sm:justify-between md:px-5">
            <p className="console-footer__meta font-mono text-[11px]">
              // enquiry processed in {lead.processedIn}
            </p>
            <button type="button" className="console-next-btn" onClick={nextLead}>
              Next lead →
            </button>
          </div>

          <div className="console-grid-bg pointer-events-none absolute inset-x-0 bottom-0 z-0" aria-hidden />
        </motion.div>

        <div className="console-pagination mt-6 flex items-center justify-center gap-2">
          {leads.map((item, index) => (
            <button
              key={item.id}
              type="button"
              className={`console-pagination__dot ${index === leadIndex ? 'is-active' : ''}`}
              onClick={() => scrollToLead(index)}
              aria-label={`View lead ${index + 1}: ${item.name}`}
              aria-current={index === leadIndex ? 'true' : undefined}
            />
          ))}
        </div>
        </div>
      </div>
    </section>
  )
}
