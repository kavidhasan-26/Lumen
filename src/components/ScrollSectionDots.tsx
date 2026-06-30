import { motion, useTransform, type MotionValue } from 'framer-motion'

const CAPSULE_HEIGHT = 32
const TRAVEL = 48

export function ScrollSectionDots({
  progress,
  className = '',
}: {
  progress: MotionValue<number>
  className?: string
}) {
  const capsuleY = useTransform(progress, [0, 1], [0, TRAVEL])

  return (
    <div
      className={`scroll-indicator ${className}`}
      style={{ height: TRAVEL + CAPSULE_HEIGHT }}
      aria-hidden
    >
      <div className="scroll-indicator__rail" />
      <motion.div className="scroll-indicator__track" style={{ y: capsuleY }} />
    </div>
  )
}
