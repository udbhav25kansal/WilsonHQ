import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

type SceneCardProps = {
  index: number
  slide: string
  title: string
  subtitle: string
  to: string
  color: 'sage' | 'coral' | 'lavender' | 'amber'
  delay?: number
}

const accentText = {
  sage: 'text-sage',
  coral: 'text-coral-deep',
  lavender: 'text-lavender-deep',
  amber: 'text-amber-deep',
}
const accentDot = {
  sage: 'bg-sage',
  coral: 'bg-coral',
  lavender: 'bg-lavender',
  amber: 'bg-amber',
}
const accentBorder = {
  sage: 'group-hover:border-sage/60',
  coral: 'group-hover:border-coral/60',
  lavender: 'group-hover:border-lavender/60',
  amber: 'group-hover:border-amber/60',
}

export default function SceneCard({ index, slide, title, subtitle, to, color, delay = 0 }: SceneCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay }}
    >
      <Link
        to={to}
        className={`group block bg-white border border-border-soft rounded-lg p-5 shadow-soft hover:shadow-card transition-all ${accentBorder[color]}`}
      >
        <div className="flex items-center justify-between mb-3">
          <div className={`flex items-center gap-2 text-[10px] font-semibold uppercase tracking-eyebrow ${accentText[color]}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${accentDot[color]}`} />
            Scene {String(index).padStart(2, '0')} &nbsp;·&nbsp; {slide}
          </div>
          <ArrowUpRight className="w-4 h-4 text-ink-faint group-hover:text-ink-soft transition-colors" strokeWidth={1.8} />
        </div>
        <div className="font-light text-[22px] leading-tight text-ink mb-1.5 tracking-tight-display">{title}</div>
        <div className="text-[12px] text-ink-muted leading-snug">{subtitle}</div>
      </Link>
    </motion.div>
  )
}
