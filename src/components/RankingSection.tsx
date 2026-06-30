import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { LeadRankingAnimation } from './LeadRankingAnimation'

const legend = [
  { color: 'bg-cyan', label: 'Diamond' },
  { color: 'bg-gold', label: 'Gold' },
  { color: 'bg-[#c0c4cc]', label: 'Silver' },
  { color: 'bg-[#cd8c50]', label: 'Bronze' },
  { color: 'bg-muted', label: 'Unverified' },
]

export function RankingSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })

  return (
    <section
      id="product"
      ref={ref}
      className="border-t border-border px-6 py-20 md:px-10 md:py-28"
    >
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="mb-12 max-w-2xl"
        >
          <h2 className="font-display text-ink text-3xl md:text-4xl">
            Unsorted inquiries become a clear call list.
          </h2>
          <p className="text-muted mt-4 text-base leading-relaxed">
            Lumen weighs interest, budget, timing, and procedure fit — then
            reorders your queue so the leads most likely to book are always on top.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.15, duration: 0.8 }}
          className="glass overflow-hidden rounded-2xl p-4 md:p-6"
        >
          <LeadRankingAnimation />
        </motion.div>

        <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 md:gap-x-8">
          {legend.map((item) => (
            <div key={item.label} className="flex items-center gap-2.5">
              <span className={`h-2 w-2 rounded-full ${item.color}`} />
              <span className="text-muted text-sm">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
