import { motion } from 'framer-motion'
import type { Session } from '../data/mockData'

const accentBg = {
  sage: 'bg-sage-soft',
  coral: 'bg-coral-soft',
  lavender: 'bg-lavender-soft',
  amber: 'bg-cream-deep',
}
const accentDot = {
  sage: 'bg-sage',
  coral: 'bg-coral',
  lavender: 'bg-lavender',
  amber: 'bg-amber',
}

/** App header used across Still views. */
export function StillHeader({ subtitle = 'Tuesday morning' }: { subtitle?: string }) {
  return (
    <div className="px-6 pt-2 pb-4">
      <div className="text-[10px] uppercase tracking-[0.18em] text-ink-faint font-semibold">Still</div>
      <div className="font-light text-[22px] text-ink mt-1">{subtitle}</div>
    </div>
  )
}

/** A list row for a session. */
export function SessionRow({
  session,
  highlighted,
  onTap,
}: {
  session: Session
  highlighted?: boolean
  onTap?: () => void
}) {
  return (
    <motion.button
      onClick={onTap}
      whileTap={{ scale: 0.98 }}
      animate={highlighted ? { backgroundColor: 'rgba(143, 168, 130, 0.12)' } : { backgroundColor: 'rgba(0,0,0,0)' }}
      transition={{ duration: 0.3 }}
      className={`w-full text-left px-6 py-3.5 flex items-center gap-3 hover:bg-cream-warm transition-colors`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${accentDot[session.accent]}`} />
      <div className="flex-1">
        <div className="text-[13px] font-medium text-ink">{session.title}</div>
        <div className="text-[10.5px] text-ink-muted">{session.duration} · {session.technique}</div>
      </div>
      <span className="text-[10px] text-ink-faint">›</span>
    </motion.button>
  )
}

/** The breathing-circle session screen used during a meditation. */
export function SessionScreen({
  title,
  durationLabel,
  remainingLabel,
  accent = 'sage',
}: {
  title: string
  durationLabel: string
  remainingLabel: string
  accent?: 'sage' | 'coral' | 'lavender' | 'amber'
}) {
  const ringColor = {
    sage: 'border-sage',
    coral: 'border-coral',
    lavender: 'border-lavender',
    amber: 'border-amber',
  }[accent]
  return (
    <div className={`absolute inset-0 ${accentBg[accent]} flex flex-col items-center justify-center pt-6`}>
      <div className="text-[10px] uppercase tracking-[0.18em] text-ink-muted">Now playing</div>
      <div className="font-light text-[20px] text-ink mt-1 mb-12">{title}</div>
      <motion.div
        className={`w-40 h-40 rounded-full border-2 ${ringColor} bg-white/40 backdrop-blur-sm`}
        animate={{ scale: [1, 1.08, 1], opacity: [0.85, 1, 0.85] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="mt-12 text-[11px] text-ink-muted tabular">
        {remainingLabel} <span className="opacity-50">/ {durationLabel}</span>
      </div>
    </div>
  )
}

/** "Session complete" plain finish screen. */
export function SessionCompleteScreen() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="absolute inset-0 bg-cream-warm flex flex-col items-center justify-center"
    >
      <div className="text-[11px] uppercase tracking-[0.18em] text-ink-muted">Session</div>
      <div className="font-light text-[22px] text-ink mt-2">Complete.</div>
    </motion.div>
  )
}
