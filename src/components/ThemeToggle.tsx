import { useTheme } from '../context/ThemeContext'

function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M21 14.5A8.5 8.5 0 0 1 9.5 3 7 7 0 1 0 21 14.5Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function ThemeToggle({ onHero = false }: { onHero?: boolean }) {
  const { theme, toggleTheme } = useTheme()
  const isLight = theme === 'light'

  const shellClass = isLight
    ? 'border-border bg-surface/75 text-ink shadow-[0_8px_32px_rgba(26,26,26,0.06)] backdrop-blur-xl'
    : onHero
      ? 'border-white/10 bg-black/35 text-ink shadow-[0_8px_32px_rgba(0,0,0,0.45)] backdrop-blur-xl'
      : 'border-border bg-void/55 text-ink shadow-[0_8px_32px_rgba(0,0,0,0.25)] backdrop-blur-xl'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isLight ? 'dark' : 'light'} theme`}
      className={`theme-toggle-icon flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-all hover:scale-105 ${shellClass}`}
    >
      {isLight ? <MoonIcon /> : <SunIcon />}
    </button>
  )
}
