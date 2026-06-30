import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion'
import { useRef } from 'react'

type Token = string | { text: string; gradient?: boolean }

const tokens: Token[] = [
  'Lumen',
  "doesn't",
  'replace',
  'your',
  'pre-sales',
  'team.',
  'It',
  'gives',
  'them',
  { text: 'X-ray vision', gradient: true },
  '—',
  'so',
  'every',
  'call',
  'starts',
  'with',
  'the',
  'context,',
  'the',
  'pitch,',
  'and',
  'the',
  'plan',
  'already',
  'in',
  'hand.',
]

const WORD_COUNT = tokens.length
const SCROLL_VH_PER_WORD = 9

function ScrollWord({
  index,
  total,
  progress,
  children,
  className = '',
}: {
  index: number
  total: number
  progress: MotionValue<number>
  children: React.ReactNode
  className?: string
}) {
  const start = index / total
  const end = Math.min(1, (index + 1.15) / total)
  const opacity = useTransform(progress, [start, end], [0.14, 1])

  return (
    <motion.span style={{ opacity }} className={`inline ${className}`}>
      {children}
      {' '}
    </motion.span>
  )
}

export function VisionStatement() {
  const sectionRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  return (
    <section
      ref={sectionRef}
      className="vision-statement relative border-t border-border"
      style={{ height: `${WORD_COUNT * SCROLL_VH_PER_WORD}vh` }}
    >
      <div className="sticky top-0 flex min-h-[100svh] items-center justify-center px-6 py-24 md:px-10">
        <p className="font-display text-ink mx-auto max-w-4xl text-center text-[clamp(1.65rem,4.5vw,2.75rem)] leading-[1.25] tracking-[-0.02em]">
          {tokens.map((token, i) => {
            if (typeof token === 'string') {
              return (
                <ScrollWord key={`${token}-${i}`} index={i} total={WORD_COUNT} progress={scrollYProgress}>
                  {token}
                </ScrollWord>
              )
            }

            return (
              <ScrollWord
                key={`${token.text}-${i}`}
                index={i}
                total={WORD_COUNT}
                progress={scrollYProgress}
                className={token.gradient ? 'vision-gradient' : ''}
              >
                {token.text}
              </ScrollWord>
            )
          })}
        </p>
      </div>
    </section>
  )
}
