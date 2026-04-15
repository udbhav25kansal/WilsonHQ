type ChipProps = {
  children: React.ReactNode
  color?: 'sage' | 'coral' | 'lavender' | 'amber' | 'neutral'
  size?: 'sm' | 'md'
  className?: string
}

const colorMap = {
  sage: 'bg-sage-soft text-sage-deep',
  coral: 'bg-coral-soft text-coral-deep',
  lavender: 'bg-lavender-soft text-lavender-deep',
  amber: 'bg-cream-deep text-amber-deep',
  neutral: 'bg-cream-warm text-ink-muted',
}

const dotMap = {
  sage: 'bg-sage',
  coral: 'bg-coral',
  lavender: 'bg-lavender',
  amber: 'bg-amber',
  neutral: 'bg-ink-faint',
}

export default function Chip({ children, color = 'neutral', size = 'sm', className = '' }: ChipProps) {
  const sizeCls = size === 'sm' ? 'text-[10px] px-2.5 py-1' : 'text-[11.5px] px-3 py-1.5'
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-semibold tracking-eyebrow uppercase ${colorMap[color]} ${sizeCls} ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotMap[color]}`} />
      {children}
    </span>
  )
}
