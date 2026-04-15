import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
  Area,
  AreaChart,
} from 'recharts'
import { ArrowLeftRight, Eye, AlertTriangle, TrendingUp, Users, Activity } from 'lucide-react'
import Blob from '../components/Blob'
import Eyebrow from '../components/Eyebrow'
import Phone from '../components/Phone'
import { StillHeader } from '../components/StillApp'
import { BaselineCard, SmartMatchCard, PostScoreCard } from '../components/WilsonCard'
import Chip from '../components/Chip'
import AnimatedNumber from '../components/AnimatedNumber'
import {
  cohorts,
  contentToRetire,
  retentionCurves,
  headlineRetention,
  sessions,
  splitScreenChoreography,
} from '../data/mockData'

// 700ms custom ease per spec section 2.6.
const FLIP_DURATION = 0.7
const FLIP_EASE: [number, number, number, number] = [0.83, 0, 0.17, 1]

export default function PlatformFlip() {
  const [side, setSide] = useState<'user' | 'platform'>('user')
  const recommended = sessions.find((s) => s.id === splitScreenChoreography.recommendedSessionId)!

  // Delay the console panel entrance animations until after the flip settles.
  const [consoleReady, setConsoleReady] = useState(false)
  useEffect(() => {
    if (side === 'platform') {
      const t = setTimeout(() => setConsoleReady(true), FLIP_DURATION * 1000 * 0.55)
      return () => clearTimeout(t)
    }
    setConsoleReady(false)
  }, [side])

  return (
    <div className="relative px-12 pb-20 overflow-hidden">
      <Blob color="sage" size={320} style={{ top: 80, right: -120 }} />
      <Blob color="lavender" size={260} style={{ bottom: 200, left: -80 }} delay={0.2} />
      <Blob color="coral" size={220} style={{ top: 320, left: '42%' }} delay={0.4} />

      <div className="relative z-10 max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="flex items-end justify-between gap-6 mb-6">
          <div>
            <Eyebrow color="coral">The Two-Sided Loop · Slide 02</Eyebrow>
            <h2 className="display-h2 text-[44px] text-ink mb-2 mt-3">Reversing the Model</h2>
            <p className="font-light italic text-[15px] text-ink-muted">
              Same app. Two views. The loop made visible.
            </p>
          </div>

          {/* Top-right toggle back, visible only on platform side (per spec) */}
          <AnimatePresence>
            {side === 'platform' && (
              <motion.button
                key="back"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
                onClick={() => setSide('user')}
                className="inline-flex items-center gap-2 bg-white border border-border-soft text-ink-soft text-[11.5px] font-medium px-3.5 py-2 rounded-full hover:bg-cream-warm transition-colors shadow-soft"
              >
                <Eye className="w-3.5 h-3.5" />
                Show user view
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Primary toggle */}
        <div className="flex items-center gap-3 mb-8">
          <motion.button
            onClick={() => setSide(side === 'user' ? 'platform' : 'user')}
            whileTap={{ scale: 0.97 }}
            className={`inline-flex items-center gap-2 text-[12.5px] font-medium px-4 py-2.5 rounded-full transition-colors shadow-soft ${
              side === 'user'
                ? 'bg-ink text-cream hover:bg-ink-soft'
                : 'bg-sage-deep text-cream hover:bg-sage-deep/90'
            }`}
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            {side === 'user' ? 'Show what the platform sees' : 'Back to user view'}
          </motion.button>
          <span className="text-[11px] text-ink-faint italic">
            One toggle. Two halves of the same intelligence.
          </span>
        </div>

        {/* Flip stage. Perspective on parent, rotateY on the card. */}
        {/* Fixed min-height so the stage never collapses mid-flip. */}
        <div
          className="flip-stage relative"
          style={{ perspective: 2000, minHeight: 720 }}
        >
          <motion.div
            animate={{ rotateY: side === 'user' ? 0 : 180 }}
            transition={{ duration: FLIP_DURATION, ease: FLIP_EASE }}
            style={{ transformStyle: 'preserve-3d' }}
            className="relative w-full h-full"
          >
            {/* FRONT: user view */}
            <div
              style={{
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
              }}
            >
              <UserView recommended={recommended} />
            </div>

            {/* BACK: platform console */}
            <div
              style={{
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
              }}
            >
              <PlatformConsole ready={consoleReady} />
            </div>
          </motion.div>
        </div>

        {/* Bottom band. Verbatim from deck. */}
        <div className="mt-14 bg-cream-deep rounded-xl px-8 py-6 max-w-4xl mx-auto border border-border-soft/60">
          <p className="font-light italic text-[15px] leading-relaxed text-ink-soft text-center">
            Retention stops being a conditioning game and becomes a results game.
          </p>
        </div>
      </div>
    </div>
  )
}

/* ---------------------------------- USER VIEW ---------------------------------- */

function UserView({ recommended }: { recommended: (typeof sessions)[number] }) {
  return (
    <div className="grid grid-cols-12 gap-10 items-start">
      <div className="col-span-5 flex flex-col items-center">
        <Phone width={340} height={680}>
          <StillHeader subtitle="Session impact" />
          <BaselineCard baselineEFI={splitScreenChoreography.preEFI} />
          <SmartMatchCard
            title={recommended.title}
            duration={recommended.duration}
            technique={recommended.technique}
            upliftRate={87}
            delay={0.2}
          />
          <PostScoreCard
            before={splitScreenChoreography.preEFI}
            after={splitScreenChoreography.postEFI}
            delta={splitScreenChoreography.delta}
            annotation="Your heart rate variability improved between minutes 3 and 6. Stress markers stabilized."
            delay={0.4}
          />
        </Phone>
        <Chip color="sage" className="mt-5">User View</Chip>
      </div>

      <div className="col-span-7 pt-8">
        <div className="text-[10.5px] uppercase tracking-eyebrow text-sage-deep font-semibold mb-3">
          To the user
        </div>
        <p className="font-light text-[30px] leading-[1.15] text-ink mb-5 tracking-tight-display">
          Real measurement. A pre score and a post score on every session.
        </p>
        <p className="text-[14px] text-ink-soft leading-relaxed mb-3">
          The meditation app, exactly as before. Now with a live baseline, a recommendation matched
          to her current state, and a post-session delta that proves the session actually moved the
          needle.
        </p>
        <p className="text-[14px] text-ink-soft leading-relaxed mb-8">
          Users stop guessing whether something is working. They see it working. Actual results are
          the only thing that keeps a human coming back without being manipulated into it.
        </p>

        <div className="bg-sage-soft border border-sage/30 rounded-lg p-5">
          <div className="text-[10.5px] uppercase tracking-eyebrow text-sage-deep font-semibold mb-2">
            Now flip the screen
          </div>
          <div className="text-[13.5px] text-ink-soft leading-snug">
            Behind the same app sits a second view, the one that makes Wilson a business. The
            operator sees which content actually works, for which cohort, at what magnitude.
          </div>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------- PLATFORM CONSOLE ------------------------------ */

function PlatformConsole({ ready }: { ready: boolean }) {
  return (
    <motion.div
      initial={false}
      className="bg-white border border-border-soft rounded-2xl shadow-float overflow-hidden"
    >
      {/* Console chrome */}
      <div className="bg-ink px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-coral/80" />
            <span className="w-2 h-2 rounded-full bg-amber/70" />
            <span className="w-2 h-2 rounded-full bg-sage/80" />
          </div>
          <span className="text-[11px] uppercase tracking-eyebrow font-semibold text-cream">
            Still
          </span>
          <span className="text-ink-faint">·</span>
          <span className="text-[11px] uppercase tracking-eyebrow font-semibold text-cream/90">
            Platform Intelligence
          </span>
          <span className="text-[10px] uppercase tracking-eyebrow text-ink-faint font-medium ml-1">
            powered by Wilson
          </span>
        </div>
        <div className="flex items-center gap-4 text-[10.5px] text-ink-faint tabular">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-sage animate-pulseGlow" />
            Live
          </span>
          <span>Last 30 days</span>
          <span className="flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5" />
            Operator view
          </span>
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-4 bg-cream-warm/40 border-b border-border-soft">
        <KpiCell
          icon={<Users className="w-3.5 h-3.5" />}
          label="Active users"
          value="58,275"
          delta="+4.2%"
          accent="sage"
          ready={ready}
          delay={0}
        />
        <KpiCell
          icon={<Activity className="w-3.5 h-3.5" />}
          label="Avg EFI delta"
          value="+12.2"
          delta="vs +2.1 baseline"
          accent="sage"
          ready={ready}
          delay={0.06}
        />
        <KpiCell
          icon={<AlertTriangle className="w-3.5 h-3.5" />}
          label="Content flagged"
          value="3"
          delta="no uplift"
          accent="coral"
          ready={ready}
          delay={0.12}
        />
        <KpiCell
          icon={<TrendingUp className="w-3.5 h-3.5" />}
          label="Retention, 90d"
          value="+47%"
          delta="with Wilson"
          accent="lavender"
          ready={ready}
          delay={0.18}
        />
      </div>

      {/* Main panels */}
      <div className="grid grid-cols-12">
        {/* Cohort table */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
          className="col-span-5 p-6 border-r border-border-soft"
        >
          <SectionLabel>Cohort Performance</SectionLabel>
          <div className="text-[10.5px] text-ink-faint mb-4 italic">
            Ranked by measured EFI uplift, last 30 days
          </div>
          <table className="w-full text-[11.5px]">
            <thead>
              <tr className="text-[9px] uppercase tracking-eyebrow text-ink-faint font-semibold border-b border-border-soft">
                <th className="text-left py-2 font-semibold w-[46%]">Cohort</th>
                <th className="text-right py-2 font-semibold">Users</th>
                <th className="text-left py-2 font-semibold pl-3">Best Session</th>
                <th className="text-right py-2 font-semibold">Δ EFI</th>
              </tr>
            </thead>
            <tbody>
              {cohorts.map((c, idx) => (
                <motion.tr
                  key={c.name}
                  initial={{ opacity: 0, x: -8 }}
                  animate={ready ? { opacity: 1, x: 0 } : { opacity: 0, x: -8 }}
                  transition={{
                    duration: 0.35,
                    delay: 0.15 + idx * 0.055,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="cohort-row border-b border-border-soft/60 last:border-0 group cursor-default"
                >
                  <td className="py-2.5 pr-2 text-ink-soft leading-tight">{c.name}</td>
                  <td className="py-2.5 text-right text-ink-muted tabular font-medium">
                    {c.users.toLocaleString()}
                  </td>
                  <td className="py-2.5 pl-3 text-ink-muted">{c.bestSession}</td>
                  <td className="py-2.5 text-right">
                    <span className="inline-block text-sage-deep font-semibold tabular group-hover:scale-110 transition-transform origin-right">
                      +{c.avgDelta.toFixed(1)}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* Content to retire */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          className="col-span-3 p-6 border-r border-border-soft bg-cream/30"
        >
          <SectionLabel color="coral">Content to Retire</SectionLabel>
          <div className="text-[10.5px] text-ink-faint mb-4 italic">
            Sessions producing no measurable uplift
          </div>
          <div className="space-y-2.5">
            {contentToRetire.map((c, idx) => (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, x: -8 }}
                animate={ready ? { opacity: 1, x: 0 } : { opacity: 0, x: -8 }}
                transition={{
                  duration: 0.35,
                  delay: 0.35 + idx * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="flex items-start gap-2 bg-coral-soft/50 border border-coral/25 rounded-md px-3 py-2.5"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-coral-deep mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-[11.5px] text-ink-soft leading-tight truncate">
                    {c.title}
                  </div>
                  <div className="text-[10px] text-coral-deep tabular mt-1 font-medium">
                    Δ {c.delta > 0 ? '+' : ''}
                    {c.delta.toFixed(1)} · n={c.sample.toLocaleString()}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="text-[10.5px] text-ink-muted mt-4 italic leading-snug">
            Recommend: review for replacement.
          </div>
        </motion.div>

        {/* Retention chart + headline */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
          className="col-span-4 p-6"
        >
          <SectionLabel color="lavender">Retention Uplift</SectionLabel>
          <div className="text-[10.5px] text-ink-faint mb-3 italic">
            With Wilson recommendations vs without, 90 days
          </div>

          <div className="h-[150px] -mx-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={retentionCurves} margin={{ top: 5, right: 8, left: -22, bottom: 0 }}>
                <defs>
                  <linearGradient id="withWilson" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8fa882" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#8fa882" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="2 4" stroke="#e8dfcd" vertical={false} />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 9, fill: '#8a8476' }}
                  tickLine={false}
                  axisLine={{ stroke: '#e8dfcd' }}
                  ticks={[0, 30, 60, 90]}
                  tickFormatter={(v) => `d${v}`}
                />
                <YAxis
                  tick={{ fontSize: 9, fill: '#8a8476' }}
                  tickLine={false}
                  axisLine={false}
                  domain={[0, 100]}
                  ticks={[0, 50, 100]}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e8dfcd',
                    borderRadius: 8,
                    fontSize: 11,
                    padding: '6px 10px',
                  }}
                  labelStyle={{ color: '#6b645a' }}
                  labelFormatter={(v) => `Day ${v}`}
                />
                <Area
                  type="monotone"
                  dataKey="with"
                  stroke="transparent"
                  fill="url(#withWilson)"
                  isAnimationActive
                  animationDuration={1200}
                  animationBegin={600}
                />
                <Line
                  type="monotone"
                  dataKey="without"
                  stroke="#8a8476"
                  strokeWidth={1.5}
                  strokeDasharray="3 3"
                  dot={false}
                  isAnimationActive
                  animationDuration={900}
                  animationBegin={400}
                />
                <Line
                  type="monotone"
                  dataKey="with"
                  stroke="#4a5c43"
                  strokeWidth={2.5}
                  dot={{ fill: '#4a5c43', r: 2.5, strokeWidth: 0 }}
                  activeDot={{ r: 4 }}
                  isAnimationActive
                  animationDuration={1200}
                  animationBegin={600}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Chart legend */}
          <div className="flex items-center gap-4 mt-2 text-[10px] text-ink-muted">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-[2.5px] bg-sage-deep rounded-full" />
              With Wilson
            </span>
            <span className="flex items-center gap-1.5">
              <span
                className="w-3 h-[1.5px] rounded-full"
                style={{
                  backgroundImage:
                    'linear-gradient(to right, #8a8476 50%, transparent 50%)',
                  backgroundSize: '4px 1.5px',
                }}
              />
              Without
            </span>
          </div>

          {/* The moment. */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
            transition={{ duration: 0.6, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mt-4 pt-4 border-t border-border-soft"
          >
            <div className="text-[9.5px] uppercase tracking-eyebrow text-ink-faint font-semibold">
              Headline result
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-light text-[56px] leading-none text-sage-deep tabular tracking-tight-display">
                +
                <AnimatedNumber
                  value={ready ? headlineRetention : 0}
                  duration={1.1}
                  delay={0.85}
                />
                %
              </span>
              <span className="text-[11px] text-ink-muted leading-tight">
                retention
                <br />
                at 90 days
              </span>
            </div>
            <div className="text-[10.5px] text-ink-muted italic mt-2">
              Double down on what produces results. Retire what does not.
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  )
}

/* ------------------------------------ BITS ------------------------------------ */

function KpiCell({
  icon,
  label,
  value,
  delta,
  accent,
  ready,
  delay,
}: {
  icon: React.ReactNode
  label: string
  value: string
  delta: string
  accent: 'sage' | 'coral' | 'lavender'
  ready: boolean
  delay: number
}) {
  const accentCls = {
    sage: 'text-sage-deep',
    coral: 'text-coral-deep',
    lavender: 'text-lavender-deep',
  }[accent]
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
      transition={{ duration: 0.4, delay, ease: [0.16, 1, 0.3, 1] }}
      className="px-6 py-3.5 border-r border-border-soft last:border-0"
    >
      <div className="flex items-center gap-1.5 text-[9.5px] uppercase tracking-eyebrow text-ink-faint font-semibold">
        <span className={accentCls}>{icon}</span>
        {label}
      </div>
      <div className="flex items-baseline gap-2 mt-1">
        <span className={`text-[20px] font-light tabular tracking-tight-display ${accentCls}`}>
          {value}
        </span>
        <span className="text-[10.5px] text-ink-muted tabular">{delta}</span>
      </div>
    </motion.div>
  )
}

function SectionLabel({
  children,
  color = 'sage',
}: {
  children: React.ReactNode
  color?: 'sage' | 'coral' | 'lavender'
}) {
  const colorCls = {
    sage: 'text-sage-deep',
    coral: 'text-coral-deep',
    lavender: 'text-lavender-deep',
  }[color]
  const dotCls = {
    sage: 'bg-sage',
    coral: 'bg-coral',
    lavender: 'bg-lavender',
  }[color]
  return (
    <div className="flex items-center gap-2 mb-1">
      <span className={`w-1.5 h-1.5 rounded-full ${dotCls}`} />
      <span className={`text-[10px] uppercase tracking-eyebrow font-semibold ${colorCls}`}>
        {children}
      </span>
    </div>
  )
}
