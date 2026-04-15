type EyebrowProps = {
  children: React.ReactNode
  color?: 'sage' | 'coral' | 'lavender' | 'amber'
  className?: string
}

const colorClass = {
  sage: 'text-sage',
  coral: 'text-coral-deep',
  lavender: 'text-lavender-deep',
  amber: 'text-amber-deep',
}

const strokeColor = {
  sage: '#8fa882',
  coral: '#c97e62',
  lavender: '#8d7ab0',
  amber: '#a88548',
}

export default function Eyebrow({ children, color = 'sage', className = '' }: EyebrowProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg width="36" height="10" viewBox="0 0 36 10" fill="none" aria-hidden>
        <path
          d="M1 5 C 5 1, 9 1, 13 5 S 21 9, 25 5 S 33 1, 35 5"
          stroke={strokeColor[color]}
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
      <span className={`uppercase font-semibold text-[10.5px] tracking-eyebrow ${colorClass[color]}`}>
        {children}
      </span>
    </div>
  )
}
