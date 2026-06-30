import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { BookDemoForm } from './BookDemoForm'
import { FunnelLineBackground } from './FunnelLineBackground'

export function Footer() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })

  return (
    <footer id="contact" ref={ref}>
      <section className="cta-funnel relative overflow-hidden px-6 pt-24 pb-10 md:px-10 md:pt-32 md:pb-12">
        <FunnelLineBackground />

        <div className="cta-funnel__shade pointer-events-none absolute inset-0" aria-hidden />
        <div className="cta-funnel__top-fade pointer-events-none absolute inset-x-0 top-0 z-[1]" aria-hidden />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="relative z-10 mx-auto max-w-lg text-center"
        >
          <h2 className="font-display text-ink text-4xl md:text-5xl lg:text-6xl">
            Ready to call smarter?
          </h2>
          <p className="cta-funnel__subtext mt-4 text-sm leading-relaxed text-white md:text-base">
            See how Lumen ranks the leads already sitting in your pipeline.
          </p>
          <BookDemoForm />
        </motion.div>

        <p className="text-muted relative z-10 mt-16 text-center text-xs md:mt-20">
          © {new Date().getFullYear()} Lumen
        </p>
      </section>
    </footer>
  )
}
