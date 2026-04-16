import { motion } from 'framer-motion'
import AnimatedNumber from './AnimatedNumber'
import { ArrowUpRight } from 'lucide-react'

/** Wilson "baseline" card that introduces itself at the start of a session.
 *  Pulls from a diverse set of connected health sources to make the SDK premise
 *  visible at a glance. */
export function BaselineCard({ baselineEFI, delay = 0 }: { baselineEFI: number; delay?: number }) {
  return (
    <motion.div
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay }}
      className="mx-3 mt-2 rounded-lg bg-white border border-sage/30 shadow-soft px-4 py-3"
    >
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-sage animate-pulseGlow" />
          <span className="text-[9.5px] uppercase tracking-eyebrow font-semibold text-sage">Wilson</span>
        </div>
        <span className="text-[8.5px] text-ink-faint italic leading-tight text-right">
          reading from 6 connected sources
        </span>
      </div>
      <div className="text-[8.5px] text-ink-faint mb-2.5 leading-snug">
        Apple Health · Apple Watch · Fitbit · Whoop · Calm · Strava
      </div>
      <div className="text-[11px] text-ink-soft leading-snug mb-3">
        Your body is telling me today was heavier than most.
      </div>
      <div className="space-y-1 text-[10.5px] tabular">
        <Row label="Sleep last night" value="5h 42m" />
        <Row label="Resting heart rate" value="72 bpm (+8)" />
        <Row label="Heart rate variability" value="low" />
        <Row label="Steps yesterday" value="3,240" />
        <Row label="Caffeine today" value="320 mg" />
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

/** Smart match recommendation card. The reasoning is grounded in this user's
 *  own history, not in cohort or demographic averages, which is the actual
 *  Wilson IP. */
export function SmartMatchCard({
  title,
  duration,
  technique,
  onBegin,
  delay = 0,
}: {
  title: string
  duration: string
  technique: string
  /** Kept for API compatibility, currently unused in copy. */
  upliftRate?: number
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
        Matched to your history
      </div>
      <div className="font-medium text-[14px] text-ink leading-tight">
        {title} <span className="font-light text-ink-muted">· {duration}</span>
      </div>
      <div className="text-[10.5px] text-ink-muted mt-0.5">{technique}</div>
      <div className="text-[10.5px] text-sage-deep mt-2.5 leading-snug">
        Across your last <span className="font-semibold tabular">12 mornings</span> like
        this one (low sleep, low HRV, elevated stress), this session lifted your EFI by{' '}
        <span className="font-semibold tabular">+13</span> on average.
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
