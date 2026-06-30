import { motion } from 'framer-motion'
import { HeroDotField } from './HeroDotField'

export function Hero() {
  return (
    <section className="hero-section relative min-h-[100svh] overflow-hidden">
      <HeroDotField />

      <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-6xl flex-col justify-end px-6 pb-16 pt-28 md:px-10 md:pb-24 md:pt-32">
        <div className="w-full max-w-3xl">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="hero-eyebrow mb-5 text-xs font-medium tracking-[0.14em] uppercase"
          >
            Lead intelligence for clinics
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="font-display hero-title text-left text-[clamp(2.75rem,7vw,5rem)] leading-[1.0]"
          >
            Focus on the leads that actually convert
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.7 }}
            className="hero-sub mt-6 max-w-xl text-left text-base leading-relaxed md:mt-7 md:text-lg"
          >
            Lumen filters your pipeline to show top leads, allowing your team to
            focus on high-value bookings.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16, duration: 0.7 }}
            className="mt-9 flex flex-row flex-wrap items-center gap-3 md:mt-11 md:gap-4"
          >
            <a href="#contact" className="btn-hero-primary">
              Book a demo
            </a>
            <a href="#how-it-works" className="btn-hero-secondary">
              How it works
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
