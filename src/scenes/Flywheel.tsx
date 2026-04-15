import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import Blob from '../components/Blob'
import Eyebrow from '../components/Eyebrow'
import { flywheelDefaults, flywheelNodes } from '../data/mockData'

const accentColor = {
  sage: '#8fa882',
  coral: '#e8a68b',
  lavender: '#b8aacc',
  amber: '#d4b478',
}

export default function Flywheel() {
  const [partnerApps, setPartnerApps] = useState(flywheelDefaults.partnerApps)
  const [users, setUsers] = useState(flywheelDefaults.users)

  const metrics = useMemo(() => computeMetrics(partnerApps, users), [partnerApps, users])

  // Render orbital partner-app nodes around primary nodes.
  // We cap visible orbital nodes at ~60 to keep the viz elegant.
  const visibleOrbitals = Math.min(60, partnerApps)

  return (
    <div className="relative px-12 pb-20 overflow-hidden">
      <Blob color="lavender" size={300} style={{ top: 60, left: -100 }} />
      <Blob color="sage" size={260} style={{ bottom: 80, right: -80 }} delay={0.2} />

      <div className="relative z-10 max-w-6xl mx-auto">
        <Eyebrow color="lavender">The Flywheel · Slide 05</Eyebrow>
        <h2 className="display-h2 text-[44px] text-ink mb-2 mt-3">Every User Makes It Smarter</h2>
        <p className="font-light italic text-[15px] text-ink-muted mb-8">
          Drag to add partner apps and users. Watch the moat deepen.
        </p>

        {/* Live metrics row */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <MetricCard
            label="Cross-app signals"
            value={metrics.crossAppSignals}
            format={(n) => Math.round(n).toLocaleString()}
            color="sage"
          />
          <MetricCard
            label="Recommendation accuracy"
            value={metrics.recommendationAccuracy}
            format={(n) => `${n.toFixed(0)}%`}
            color="coral"
          />
          <MetricCard
            label="Retention uplift"
            value={metrics.retentionUplift}
            format={(n) => `+${n.toFixed(0)}%`}
            color="lavender"
          />
        </div>

        {/* Canvas */}
        <div
          className="relative bg-sage-deep rounded-2xl shadow-card overflow-hidden"
          style={{ height: 480 }}
        >
          {/* Radial fade toward center */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(circle at center, rgba(220,230,213,0.22) 0%, rgba(74,92,67,0) 55%)',
            }}
          />
          {/* Soft vignette at edges */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(circle at center, rgba(0,0,0,0) 55%, rgba(27,38,24,0.35) 100%)',
            }}
          />

          <FlywheelCanvas
            partnerApps={partnerApps}
            users={users}
            visibleOrbitals={visibleOrbitals}
            accuracy={metrics.recommendationAccuracy}
          />
        </div>

        {/* Sliders */}
        <div className="grid grid-cols-2 gap-8 mt-8">
          <SliderControl
            label="Partner apps"
            value={partnerApps}
            min={flywheelDefaults.partnerAppsRange[0]}
            max={flywheelDefaults.partnerAppsRange[1]}
            onChange={setPartnerApps}
            display={partnerApps.toLocaleString()}
            color="sage"
          />
          <SliderControl
            label="Users"
            value={users}
            min={flywheelDefaults.usersRange[0]}
            max={flywheelDefaults.usersRange[1]}
            onChange={setUsers}
            display={formatUsers(users)}
            color="lavender"
          />
        </div>

        {/* Bottom band */}
        <div className="mt-12 bg-cream-deep rounded-xl px-8 py-5 max-w-4xl mx-auto space-y-1.5">
          <p className="font-light italic text-[14px] leading-relaxed text-ink-soft text-center">
            No single app can build this. No single app sees the full picture. Wilson does.
          </p>
          <p className="font-light italic text-[14px] leading-relaxed text-ink-soft text-center">
            Every new user and every new partner app sharpens the engine.
          </p>
        </div>
      </div>
    </div>
  )
}

/** Live metrics math. Formulas chosen to feel earned, not arbitrary. */
function computeMetrics(partnerApps: number, users: number) {
  const crossAppSignals = Math.floor(Math.pow(partnerApps, 1.6) / 4) + 12
  const recommendationAccuracy = clamp(
    60 + Math.log10(users / 10000) * 8 + Math.log2(partnerApps) * 1.2,
    60,
    94,
  )
  const retentionUplift = clamp(
    12 + Math.log10(users / 10000) * 5 + Math.log2(partnerApps) * 0.8,
    12,
    62,
  )
  return { crossAppSignals, recommendationAccuracy, retentionUplift }
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

function formatUsers(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`
  return n.toString()
}

/** Smoothly eases a displayed number toward the target. Feels less jumpy than raw state. */
function useAnimatedNumber(target: number, duration = 450) {
  const [value, setValue] = useState(target)
  const fromRef = useRef(target)
  const startRef = useRef<number | null>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    fromRef.current = value
    startRef.current = null
    if (rafRef.current) cancelAnimationFrame(rafRef.current)

    const tick = (t: number) => {
      if (startRef.current === null) startRef.current = t
      const elapsed = t - startRef.current
      const p = Math.min(1, elapsed / duration)
      // easeOutQuint
      const eased = 1 - Math.pow(1 - p, 5)
      const next = fromRef.current + (target - fromRef.current) * eased
      setValue(next)
      if (p < 1) rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target])

  return value
}

function MetricCard({
  label,
  value,
  format,
  color,
}: {
  label: string
  value: number
  format: (n: number) => string
  color: 'sage' | 'coral' | 'lavender'
}) {
  const animated = useAnimatedNumber(value)
  const dot = { sage: 'bg-sage', coral: 'bg-coral', lavender: 'bg-lavender' }[color]
  const text = {
    sage: 'text-sage-deep',
    coral: 'text-coral-deep',
    lavender: 'text-lavender-deep',
  }[color]
  return (
    <div className="bg-white border border-border-soft rounded-lg px-5 py-3 shadow-soft">
      <div className="flex items-center gap-2 mb-1">
        <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
        <span className="text-[10px] uppercase tracking-eyebrow text-ink-muted font-semibold">
          {label}
        </span>
      </div>
      <div className={`font-light text-[34px] leading-none tabular tracking-tight-display ${text}`}>
        {format(animated)}
      </div>
    </div>
  )
}

function SliderControl({
  label,
  value,
  min,
  max,
  onChange,
  display,
  color,
}: {
  label: string
  value: number
  min: number
  max: number
  onChange: (n: number) => void
  display: string
  color: 'sage' | 'lavender'
}) {
  // Use logarithmic scaling for the user count, linear for partner apps
  const isLog = label === 'Users'
  const logMin = Math.log(min)
  const logMax = Math.log(max)

  function handle(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = Number(e.target.value)
    if (isLog) {
      const v = Math.exp(logMin + (raw / 1000) * (logMax - logMin))
      onChange(Math.round(v))
    } else {
      onChange(raw)
    }
  }

  const sliderValue = isLog
    ? ((Math.log(value) - logMin) / (logMax - logMin)) * 1000
    : value

  const trackColor = color === 'sage' ? '#8fa882' : '#b8aacc'

  return (
    <div className="bg-white border border-border-soft rounded-lg px-5 py-4 shadow-soft">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] uppercase tracking-eyebrow text-ink-muted font-semibold">
          {label}
        </span>
        <span className="font-light text-[20px] text-ink tabular leading-none">{display}</span>
      </div>
      <input
        type="range"
        min={isLog ? 0 : min}
        max={isLog ? 1000 : max}
        step={isLog ? 1 : 1}
        value={sliderValue}
        onChange={handle}
        className="w-full custom-slider"
        style={{
          accentColor: trackColor,
          color: trackColor,
        }}
      />
      <div className="flex items-center justify-between mt-1 text-[9.5px] text-ink-faint tabular">
        <span>{isLog ? formatUsers(min) : min.toLocaleString()}</span>
        <span>{isLog ? formatUsers(max) : max.toLocaleString()}</span>
      </div>
    </div>
  )
}

/** SVG canvas for the flywheel network. */
function FlywheelCanvas({
  partnerApps,
  users,
  visibleOrbitals,
  accuracy,
}: {
  partnerApps: number
  users: number
  visibleOrbitals: number
  accuracy: number
}) {
  const cx = 450
  const cy = 240
  const ringRadius = 160
  const orbitRadius = 220

  // Brightness of links scales with users
  const linkOpacity = clamp(0.25 + Math.log10(users / 10000) * 0.12, 0.25, 0.85)
  const linkWidth = clamp(0.8 + Math.log10(users / 10000) * 0.35, 0.8, 2.4)
  const glowIntensity = clamp(0.4 + (accuracy - 60) / 60, 0.4, 1)
  // Signal flow cadence: more users, faster pulses.
  const signalDuration = clamp(3.2 - Math.log10(users / 10000) * 0.35, 1.6, 3.2)

  const primaryAngles = flywheelNodes.map(
    (_, i) => (i / flywheelNodes.length) * Math.PI * 2 - Math.PI / 2,
  )
  const primaries = flywheelNodes.map((node, i) => ({
    ...node,
    x: cx + Math.cos(primaryAngles[i]) * ringRadius,
    y: cy + Math.sin(primaryAngles[i]) * ringRadius,
    angle: primaryAngles[i],
  }))

  // Generate orbital partner-app nodes with stable seeded pseudo-random positions
  const orbitals = useMemo(() => {
    const arr: {
      x: number
      y: number
      parentIdx: number
      size: number
      phase: number
      driftX: number
      driftY: number
      driftDur: number
    }[] = []
    for (let i = 0; i < visibleOrbitals; i++) {
      const seed = i * 9301 + 49297
      const r1 = ((seed * 233280) % 233280) / 233280
      const r2 = (((seed + 7) * 9301) % 233280) / 233280
      const r3 = (((seed + 13) * 49297) % 233280) / 233280
      const parentIdx = i % flywheelNodes.length
      const baseAngle = primaries[parentIdx].angle
      const angleSpread = (r1 - 0.5) * 0.95
      const radius = orbitRadius + (r2 * 70 - 10)
      arr.push({
        x: cx + Math.cos(baseAngle + angleSpread) * radius,
        y: cy + Math.sin(baseAngle + angleSpread) * radius,
        parentIdx,
        size: 3.5 + r2 * 4,
        phase: r1 * Math.PI * 2,
        driftX: 3 + r3 * 5,
        driftY: 2 + r1 * 5,
        driftDur: 6 + (r2 * 5),
      })
    }
    return arr
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleOrbitals])

  return (
    <svg viewBox="0 0 900 480" className="w-full h-full">
      <defs>
        <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#dce6d5" stopOpacity={glowIntensity * 0.85} />
          <stop offset="55%" stopColor="#dce6d5" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#dce6d5" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="coreFill" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#faf5ec" />
        </radialGradient>
        <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>

      {/* Outer halo pulses, two rings for depth */}
      <motion.circle
        cx={cx}
        cy={cy}
        r={160}
        fill="url(#coreGlow)"
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.circle
        cx={cx}
        cy={cy}
        r={110}
        fill="none"
        stroke="#dce6d5"
        strokeOpacity={0.12}
        strokeWidth={1}
        animate={{ r: [108, 120, 108], opacity: [0.12, 0.22, 0.12] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Lines from primaries to Wilson core */}
      {primaries.map((p, i) => {
        const color = accentColor[p.accent as keyof typeof accentColor]
        return (
          <motion.line
            key={`core-${i}`}
            x1={cx}
            y1={cy}
            x2={p.x}
            y2={p.y}
            stroke={color}
            strokeWidth={linkWidth}
            strokeOpacity={linkOpacity}
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.6, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
          />
        )
      })}

      {/* Signal flow particles: each primary sends a pulsing dot inward to Wilson */}
      {primaries.map((p, i) => {
        const color = accentColor[p.accent as keyof typeof accentColor]
        return (
          <motion.circle
            key={`signal-${i}`}
            r={2.6}
            fill={color}
            filter="url(#softGlow)"
            initial={false}
            animate={{
              cx: [p.x, cx],
              cy: [p.y, cy],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: signalDuration,
              repeat: Infinity,
              ease: 'easeIn',
              delay: (i * signalDuration) / primaries.length,
              times: [0, 0.15, 0.85, 1],
            }}
          />
        )
      })}

      {/* Orbital nodes connected to primaries */}
      {orbitals.map((o, i) => {
        const parent = primaries[o.parentIdx]
        const parentColor = accentColor[parent.accent as keyof typeof accentColor]
        return (
          <g key={`orb-${i}`}>
            <line
              x1={parent.x}
              y1={parent.y}
              x2={o.x}
              y2={o.y}
              stroke="#dce6d5"
              strokeOpacity={linkOpacity * 0.45}
              strokeWidth={0.7}
            />
            <motion.circle
              r={o.size}
              fill="#dce6d5"
              fillOpacity={0.88}
              stroke={parentColor}
              strokeOpacity={0.5}
              strokeWidth={0.6}
              initial={{ scale: 0, opacity: 0, cx: parent.x, cy: parent.y }}
              animate={{
                scale: 1,
                opacity: 0.9,
                cx: [o.x, o.x + o.driftX, o.x - o.driftX * 0.6, o.x],
                cy: [o.y, o.y - o.driftY, o.y + o.driftY * 0.7, o.y],
              }}
              transition={{
                scale: { duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: (i % 12) * 0.02 },
                opacity: { duration: 0.5, delay: (i % 12) * 0.02 },
                cx: { duration: o.driftDur, repeat: Infinity, ease: 'easeInOut' },
                cy: { duration: o.driftDur + 1.3, repeat: Infinity, ease: 'easeInOut' },
              }}
            />
          </g>
        )
      })}

      {/* Primary nodes */}
      {primaries.map((p, i) => {
        const color = accentColor[p.accent as keyof typeof accentColor]
        return (
          <motion.g
            key={p.id}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* gentle breathing ring behind the node */}
            <motion.circle
              cx={p.x}
              cy={p.y}
              r={36}
              fill="none"
              stroke={color}
              strokeOpacity={0.25}
              strokeWidth={1}
              animate={{ r: [34, 40, 34], opacity: [0.15, 0.3, 0.15] }}
              transition={{
                duration: 4 + (i % 3) * 0.4,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.2,
              }}
            />
            <circle
              cx={p.x}
              cy={p.y}
              r={30}
              fill="#faf5ec"
              fillOpacity={0.97}
              stroke={color}
              strokeWidth={1.5}
            />
            <circle cx={p.x} cy={p.y} r={4} fill={color} />
            <text
              x={p.x}
              y={p.y + 48}
              textAnchor="middle"
              fontSize="11"
              fill="#faf5ec"
              fontWeight={500}
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              {p.label}
            </text>
          </motion.g>
        )
      })}

      {/* Wilson core */}
      <motion.g
        animate={{ scale: [1, 1.035, 1] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: `${cx}px ${cy}px` }}
      >
        <motion.circle
          cx={cx}
          cy={cy}
          r={68}
          fill="none"
          stroke="#8fa882"
          strokeOpacity={0.25}
          strokeWidth={1}
          animate={{ r: [66, 74, 66], opacity: [0.2, 0.38, 0.2] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
        />
        <circle cx={cx} cy={cy} r={56} fill="url(#coreFill)" stroke="#8fa882" strokeWidth="2" />
        <circle
          cx={cx}
          cy={cy}
          r={48}
          fill="none"
          stroke="#8fa882"
          strokeWidth="0.5"
          strokeOpacity="0.4"
        />
        <text
          x={cx}
          y={cy - 4}
          textAnchor="middle"
          fontSize="18"
          fill="#2e2a24"
          fontWeight={300}
          style={{ fontFamily: 'Poppins, sans-serif' }}
        >
          Wilson
        </text>
        <text
          x={cx}
          y={cy + 14}
          textAnchor="middle"
          fontSize="9"
          fill="#6b645a"
          fontWeight={500}
          letterSpacing="1.2"
          style={{ fontFamily: 'Poppins, sans-serif' }}
        >
          INTELLIGENCE LAYER
        </text>
      </motion.g>
    </svg>
  )
}
