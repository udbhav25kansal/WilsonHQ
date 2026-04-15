type StatPillProps = {
  number: string
  label: string
  color?: 'sage' | 'coral' | 'lavender' | 'amber'
}

const dotMap = {
  sage: 'bg-sage',
  coral: 'bg-coral',
  lavender: 'bg-lavender',
  amber: 'bg-amber',
}
const numberColor = {
  sage: 'text-sage-deep',
  coral: 'text-coral-deep',
  lavender: 'text-lavender-deep',
  amber: 'text-amber-deep',
}

export default function StatPill({ number, label, color = 'sage' }: StatPillProps) {
  return (
    <div className="bg-white/70 backdrop-blur-sm border border-border-soft rounded-xl px-5 py-3.5 shadow-soft">
      <div className="flex items-center gap-2 mb-1">
        <span className={`w-2 h-2 rounded-full ${dotMap[color]}`} />
      </div>
      <div className={`font-light text-[34px] leading-none tabular tracking-tight-display ${numberColor[color]}`}>
        {number}
      </div>
      <div className="text-[11px] text-ink-muted mt-1">{label}</div>
    </div>
  )
}
