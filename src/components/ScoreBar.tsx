import { motion } from 'framer-motion'

/** Vertical EFI progress bar shown alongside the session screen. */
export default function ScoreBar({ value, min = 0, max = 100 }: { value: number; min?: number; max?: number }) {
  const pct = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100))
  return (
    <div className="absolute right-3 top-12 bottom-16 w-1.5 rounded-full bg-white/30 overflow-hidden z-10">
      <motion.div
        className="absolute bottom-0 left-0 right-0 bg-sage rounded-full"
        initial={{ height: '0%' }}
        animate={{ height: `${pct}%` }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{ boxShadow: '0 0 8px rgba(143,168,130,0.5)' }}
      />
      <motion.div
        animate={{ y: `-${pct}%` }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="absolute -right-7 bottom-0 text-[10px] text-sage-deep font-semibold tabular bg-white/80 px-1 rounded"
      >
        {value}
      </motion.div>
    </div>
  )
}
