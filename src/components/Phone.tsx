import { motion } from 'framer-motion'

type PhoneProps = {
  children: React.ReactNode
  tilt?: number
  width?: number
  height?: number
  className?: string
}

export default function Phone({ children, tilt = 0, width = 320, height = 640, className = '' }: PhoneProps) {
  return (
    <motion.div
      initial={{ y: 12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      style={{
        width,
        height,
        transform: `rotate(${tilt}deg)`,
      }}
      className={`bg-white rounded-[32px] shadow-phone ring-1 ring-border-soft/60 relative overflow-hidden ${className}`}
    >
      {/* Notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 bg-ink rounded-b-2xl z-20" />
      {/* Status bar */}
      <div className="absolute top-1.5 left-0 right-0 px-6 flex items-center justify-between text-[10px] text-ink-soft font-medium z-10">
        <span className="tabular">9:42</span>
        <div className="flex items-center gap-1">
          <div className="w-3 h-1.5 rounded-sm bg-ink-soft/60" />
          <div className="w-3 h-1.5 rounded-sm bg-ink-soft/40" />
          <div className="w-4 h-2 rounded-sm border border-ink-soft/60" />
        </div>
      </div>
      {/* Inner screen content */}
      <div className="absolute inset-0 pt-8 overflow-hidden">{children}</div>
    </motion.div>
  )
}
