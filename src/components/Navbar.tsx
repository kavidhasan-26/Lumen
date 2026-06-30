import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'
import { LumenLogo } from './LumenLogo'
import { ThemeToggle } from './ThemeToggle'

const links = [
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Roadmap', href: '#roadmap' },
]

export function Navbar() {
  const [onHero, setOnHero] = useState(true)
  const { theme } = useTheme()
  const isLight = theme === 'light'

  useEffect(() => {
    const onScroll = () => {
      setOnHero(window.scrollY < window.innerHeight * 0.72)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const shellClass = isLight
    ? 'border-border bg-surface/75 text-ink shadow-[0_8px_32px_rgba(26,26,26,0.06)] backdrop-blur-xl'
    : onHero
      ? 'border-white/10 bg-black/35 text-ink shadow-[0_8px_32px_rgba(0,0,0,0.45)] backdrop-blur-xl'
      : 'border-border bg-void/55 text-ink shadow-[0_8px_32px_rgba(0,0,0,0.25)] backdrop-blur-xl'

  return (
    <motion.header
      className="fixed top-0 right-0 left-0 z-50 px-4 py-4 md:px-6"
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mx-auto flex max-w-6xl items-center gap-4">
        <div
          className={`flex min-w-0 flex-1 items-center justify-between rounded-2xl border px-5 py-3.5 transition-all duration-300 md:px-6 ${shellClass}`}
        >
        <a href="#" className="lumen-logo-link shrink-0">
          <LumenLogo />
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-muted text-sm font-medium transition-colors hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center">
          <a
            href="#contact"
            className="bg-ink text-void rounded-full px-4 py-2 text-xs font-medium transition-all hover:opacity-90 md:text-sm"
          >
            Book a demo
          </a>
        </div>
        </div>

        <ThemeToggle onHero={onHero} />
      </div>
    </motion.header>
  )
}
