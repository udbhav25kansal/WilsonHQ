import { Link, useLocation } from 'react-router-dom'

const scenes = [
  { num: '01', path: '/split', label: 'Retention', accent: 'sage' },
  { num: '02', path: '/platform', label: 'The Buyer', accent: 'coral' },
  { num: '03', path: '/flywheel', label: 'The Moat', accent: 'lavender' },
  { num: '04', path: '/feed', label: 'Beyond Wellness', accent: 'amber' },
] as const

const accentText = {
  sage: 'text-sage-deep',
  coral: 'text-coral-deep',
  lavender: 'text-lavender-deep',
  amber: 'text-amber-deep',
}
const accentBg = {
  sage: 'bg-sage-soft',
  coral: 'bg-coral-soft',
  lavender: 'bg-lavender-soft',
  amber: 'bg-cream-deep',
}
const accentDot = {
  sage: 'bg-sage',
  coral: 'bg-coral',
  lavender: 'bg-lavender',
  amber: 'bg-amber',
}

export default function Nav() {
  const location = useLocation()
  return (
    <header className="absolute top-0 left-0 right-0 z-30 px-4 md:px-8 py-4 md:py-5 flex items-center justify-between gap-3">
      <Link to="/" className="group flex items-center gap-2 md:gap-2.5 flex-shrink-0">
        <span className="w-2 h-2 rounded-full bg-sage group-hover:scale-110 transition-transform" />
        <span className="font-semibold text-[12px] md:text-[13px] tracking-[0.05em] text-ink whitespace-nowrap">Wilson Intelligence</span>
      </Link>

      <nav className="flex items-center gap-1 md:gap-1.5 flex-wrap justify-end">
        {scenes.map((s) => {
          const active = location.pathname === s.path
          return (
            <Link
              key={s.path}
              to={s.path}
              className={`group flex items-center gap-1.5 md:gap-2 rounded-full px-2.5 md:px-3 py-1 md:py-1.5 text-[10.5px] md:text-[11px] font-medium transition-all ${
                active
                  ? `${accentBg[s.accent]} ${accentText[s.accent]}`
                  : 'text-ink-faint hover:text-ink-soft hover:bg-cream-warm'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${active ? accentDot[s.accent] : 'bg-ink-faint/40'}`} />
              <span className="tabular">{s.num}</span>
              <span className="hidden md:inline">{s.label}</span>
            </Link>
          )
        })}
      </nav>
    </header>
  )
}
