import { motion } from 'framer-motion'
import AnimatedNumber from './AnimatedNumber'
import { ArrowUpRight } from 'lucide-react'

/** Wilson "baseline" card that introduces itself at the start of a session. */
export function BaselineCard({ baselineEFI, delay = 0 }: { baselineEFI: number; delay?: number }) {
  return (
    <motion.div
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay }}
      className="mx-3 mt-2 rounded-lg bg-white border border-sage/30 shadow-soft px-4 py-3"
    >
      <div className="flex items-center gap-1.5 mb-2">
        <span className="w-1.5 h-1.5 rounded-full bg-sage animate-pulseGlow" />
        <span className="text-[9.5px] uppercase tracking-eyebrow font-semibold text-sage">Wilson</span>
      </div>
      <div className="text-[11px] text-ink-soft leading-snug mb-3">
        Your body is telling me today was heavier than most.
      </div>
      <div className="space-y-1 text-[10.5px] tabular">
        <Row label="Sleep last night" value="5h 42m" />
        <Row label="Heart rate variability" value="low" />
        <Row label="Stress markers" value="elevated" />
      </div>
      <div className="mt-3 pt-2.5 border-t border-border-soft flex items-baseline justify-between">
        <span className="text-[10px] uppercase tracking-eyebrow text-ink-muted font-medium">Baseline EFI</span>
        <span className="font-light text-[26px] text-ink leading-none">
          <AnimatedNumber value={baselineEFI} duration={0.9} delay={delay + 0.4} />
        </span>
      </div>
    </motion.div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-ink-muted">{label}</span>
      <span className="text-ink-soft font-medium">{value}</span>
    </div>
  )
}

/** Smart match recommendation card. */
export function SmartMatchCard({
  title,
  duration,
  technique,
  upliftRate,
  onBegin,
  delay = 0,
}: {
  title: string
  duration: string
  technique: string
  upliftRate: number
  onBegin?: () => void
  delay?: number
}) {
  return (
    <motion.div
      initial={{ y: 16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay }}
      className="mx-3 mt-2 rounded-lg bg-sage-soft border border-sage/30 px-4 py-3"
    >
      <div className="text-[9.5px] uppercase tracking-eyebrow font-semibold text-sage-deep mb-1.5">
        Recommended for you, today
      </div>
      <div className="font-medium text-[14px] text-ink leading-tight">
        {title} <span className="font-light text-ink-muted">· {duration}</span>
      </div>
      <div className="text-[10.5px] text-ink-muted mt-0.5">{technique}</div>
      <div className="text-[10.5px] text-sage-deep mt-2 leading-snug">
        <span className="font-semibold tabular">{upliftRate}%</span> uplift rate for users in your current state.
      </div>
      <button
        onClick={onBegin}
        className="mt-3 w-full rounded-md bg-sage text-white text-[11.5px] font-medium py-2 hover:bg-sage-deep transition-colors"
      >
        Begin session
      </button>
    </motion.div>
  )
}

/** Post-score reveal card with delta. */
export function PostScoreCard({
  before,
  after,
  delta,
  annotation,
  delay = 0,
}: {
  before: number
  after: number
  delta: number
  annotation: string
  delay?: number
}) {
  return (
    <motion.div
      initial={{ y: 24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay }}
      className="mx-3 mt-3 rounded-lg bg-white border border-sage/40 shadow-card px-4 py-4"
    >
      <div className="flex items-center gap-1.5 mb-3">
        <span className="w-1.5 h-1.5 rounded-full bg-sage" />
        <span className="text-[9.5px] uppercase tracking-eyebrow font-semibold text-sage">Session impact</span>
      </div>
      <div className="grid grid-cols-3 gap-2 mb-3">
        <Stat label="Before" value={before} />
        <Stat label="After" value={after} delay={delay + 0.3} animate />
        <Delta value={delta} delay={delay + 0.5} />
      </div>
      <div className="text-[10.5px] text-ink-muted leading-snug pt-2 border-t border-border-soft">
        {annotation}
      </div>
    </motion.div>
  )
}

function Stat({ label, value, delay = 0, animate = false }: { label: string; value: number; delay?: number; animate?: boolean }) {
  return (
    <div>
      <div className="text-[9px] uppercase tracking-eyebrow text-ink-faint font-medium">{label}</div>
      <div className="font-light text-[24px] text-ink leading-none mt-1 tabular">
        {animate ? <AnimatedNumber value={value} duration={0.8} delay={delay} /> : value}
      </div>
    </div>
  )
}

function Delta({ value, delay = 0 }: { value: number; delay?: number }) {
  return (
    <div>
      <div className="text-[9px] uppercase tracking-eyebrow text-sage font-medium">Delta</div>
      <div className="font-light text-[24px] text-sage-deep leading-none mt-1 flex items-baseline gap-0.5">
        <span className="tabular">+<AnimatedNumber value={value} duration={1.0} delay={delay} /></span>
        <ArrowUpRight className="w-4 h-4 text-sage" strokeWidth={2.5} />
      </div>
    </div>
  )
}
