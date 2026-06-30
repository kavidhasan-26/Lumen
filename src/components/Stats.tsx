import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const stats = [
  { value: '100%', label: 'Of leads in your pipeline scored' },
  { value: '6×', label: 'More bookings from top-ranked calls' },
  { value: '<60s', label: 'To rank a new inquiry' },
  { value: '15–20%', label: 'Revenue lift at pilot clinics' },
]

export function Stats() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })

  return (
    <section ref={ref} className="border-t border-border px-6 py-16 md:px-10 md:py-20">
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-10 md:grid-cols-4 md:gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.08 }}
            className="text-center"
          >
            <p className="font-display stat-value text-purple text-3xl md:text-4xl">{stat.value}</p>
            <p className="text-muted mt-2 text-sm">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
