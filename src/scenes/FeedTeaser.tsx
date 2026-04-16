import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, MessageCircle, Share2, Play, Pause, TrendingDown, TrendingUp, Minus } from 'lucide-react'
import Blob from '../components/Blob'
import Eyebrow from '../components/Eyebrow'
import AnimatedNumber from '../components/AnimatedNumber'
import { feedPosts, type FeedPost } from '../data/mockData'

const POST_INTERVAL_MS = 1900

export default function FeedTeaser() {
  const [visibleCount, setVisibleCount] = useState(1)
  const [isPlaying, setIsPlaying] = useState(true)
  const timerRef = useRef<number | null>(null)
  const scrollRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!isPlaying) return
    if (visibleCount >= feedPosts.length) return
    timerRef.current = window.setTimeout(() => {
      setVisibleCount((c) => Math.min(feedPosts.length, c + 1))
    }, POST_INTERVAL_MS)
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current)
    }
  }, [visibleCount, isPlaying])

  // Keep newest post in view as the feed grows.
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  }, [visibleCount])

  const visiblePosts = feedPosts.slice(0, visibleCount)
  const cumulative = visiblePosts.reduce((sum, p) => sum + p.efi, 0)
  const progress = visibleCount / feedPosts.length

  function reset() {
    setVisibleCount(1)
    setIsPlaying(true)
  }

  return (
    <div className="relative px-4 md:px-12 pb-20 overflow-hidden">
      <Blob color="lavender" size={340} style={{ top: 40, right: -120 }} />
      <Blob color="coral" size={260} style={{ bottom: 80, left: -90 }} delay={0.2} />

      <div className="relative z-10 max-w-6xl mx-auto">
        <Eyebrow color="lavender">Expansion Vector · Slide 04</Eyebrow>
        <div className="flex items-end justify-between gap-6 mt-3 mb-2">
          <h2 className="display-h2 text-[26px] md:text-[44px] text-ink">The Wellbeing Layer for Social Media</h2>
          <div className="hidden md:flex items-center gap-2 text-[10px] uppercase tracking-eyebrow font-semibold text-lavender-deep bg-lavender-soft border border-lavender/30 rounded-full px-3 py-1.5 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-lavender animate-pulse" />
            Timely: UK Online Safety Act · EU DSA
          </div>
        </div>
        <p className="font-light italic text-[15px] text-ink-muted mb-8">
          The same intelligence, applied to the feed.
        </p>

        {/* Controls */}
        <div className="flex items-center gap-3 mb-5">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="inline-flex items-center gap-2 bg-ink text-cream text-[12.5px] font-medium px-4 py-2.5 rounded-full hover:bg-ink-soft transition-colors shadow-soft"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-cream" />}
            {isPlaying ? 'Pause feed' : 'Resume'}
          </button>
          <button
            onClick={reset}
            className="text-[11.5px] text-ink-muted hover:text-ink-soft underline underline-offset-2"
          >
            Reset
          </button>
          <div className="flex-1 flex items-center gap-3 ml-3">
            <div className="flex-1 h-[3px] bg-cream-deep rounded-full overflow-hidden max-w-[260px]">
              <motion.div
                className="h-full bg-gradient-to-r from-sage via-lavender to-coral rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress * 100}%` }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
            <span className="text-[10.5px] text-ink-faint tabular">
              {visibleCount}/{feedPosts.length} posts · {String(visibleCount * 5).padStart(2, '0')}:00 of 30:00
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Feed column */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl border border-border-soft shadow-card overflow-hidden">
              <div className="px-5 py-3 border-b border-border-soft flex items-center justify-between bg-cream-warm">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-coral" />
                  <span className="text-[11px] uppercase tracking-eyebrow font-semibold text-ink-soft">
                    Feed Simulation
                  </span>
                  <span className="text-[10px] text-ink-faint">any social platform</span>
                </div>
                <span className="text-[10.5px] text-ink-faint italic">
                  every post carries a wilson reading
                </span>
              </div>
              <div ref={scrollRef} className="max-h-[620px] overflow-y-auto feed-scroll">
                <AnimatePresence initial={false}>
                  {visiblePosts.map((post, idx) => (
                    <PostCard key={post.id} post={post} index={idx} />
                  ))}
                </AnimatePresence>
                {visibleCount >= feedPosts.length && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="px-6 py-8 text-center text-[11px] text-ink-faint italic border-t border-border-soft"
                  >
                    End of 30 minute scroll session.
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-5 space-y-4">
            <CumulativePanel cumulative={cumulative} count={visibleCount} />
            <ImpactBars posts={visiblePosts} />
            <Insight cumulative={cumulative} count={visibleCount} />
          </div>
        </div>

        {/* For Platforms / Users / Society band, matched to deck slide 4 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mt-12">
          <BenefitCell
            color="sage"
            title="For Platforms"
            body="A measurable wellbeing signal that satisfies regulation and differentiates the product."
          />
          <BenefitCell
            color="coral"
            title="For Users"
            body="A feed that adapts to how you actually feel, not just what you click on."
          />
          <BenefitCell
            color="lavender"
            title="For Society"
            body="The first market mechanism aligning platform incentives with user mental health."
          />
        </div>

        {/* Bottom band */}
        <div className="mt-10 bg-cream-deep rounded-xl px-8 py-6 max-w-4xl mx-auto border border-border-soft/60">
          <p className="font-light italic text-[15px] leading-relaxed text-ink-soft text-center">
            Today's algorithms optimize for time on platform.
            <br />
            <span className="text-ink">Wilson optimizes for what time on platform does to you.</span>
          </p>
        </div>
      </div>
    </div>
  )
}

/* ---------- Post card ---------- */

function PostCard({ post, index }: { post: FeedPost; index: number }) {
  const isPositive = post.efi > 0
  const isNeutralLow = Math.abs(post.efi) <= 2
  const tone: 'positive' | 'negative' | 'neutral' = isNeutralLow
    ? 'neutral'
    : isPositive
      ? 'positive'
      : 'negative'

  // Deterministic-looking engagement counts so Framer re-renders do not shuffle them.
  const seed = index + 1
  const likes = 180 + ((seed * 317) % 1400)
  const comments = 12 + ((seed * 53) % 90)

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="px-5 py-4 border-b border-border-soft last:border-b-0 relative"
    >
      {/* Wilson EFI chip */}
      <EfiChip efi={post.efi} tone={tone} />

      {/* Author row */}
      <div className="flex items-center gap-3 mb-2.5">
        <Avatar post={post} />
        <div className="min-w-0">
          <div className="text-[12.5px] font-semibold text-ink leading-tight truncate">
            {post.author}
          </div>
          <div className="text-[10.5px] text-ink-faint tabular">
            {post.handle} · {post.timeAgo}
          </div>
        </div>
      </div>

      {/* Caption */}
      <div className="text-[12.5px] text-ink-soft leading-relaxed mb-3 pr-20">{post.caption}</div>

      {/* Media */}
      <PostMedia post={post} />

      {/* Engagement */}
      <div className="flex items-center gap-5 text-ink-faint mt-3">
        <button className="flex items-center gap-1.5 text-[11px] hover:text-coral-deep transition-colors">
          <Heart className="w-3.5 h-3.5" />
          <span className="tabular">{likes.toLocaleString()}</span>
        </button>
        <button className="flex items-center gap-1.5 text-[11px] hover:text-ink-soft transition-colors">
          <MessageCircle className="w-3.5 h-3.5" />
          <span className="tabular">{comments}</span>
        </button>
        <button className="flex items-center gap-1.5 text-[11px] hover:text-ink-soft transition-colors">
          <Share2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.article>
  )
}

/* ---------- EFI chip ---------- */

function EfiChip({ efi, tone }: { efi: number; tone: 'positive' | 'negative' | 'neutral' }) {
  const classes = {
    positive: 'bg-sage-soft text-sage-deep border-sage/40',
    negative: 'bg-coral-soft text-coral-deep border-coral/50',
    neutral: 'bg-cream-warm text-ink-muted border-border-soft',
  }[tone]

  const Icon = tone === 'positive' ? TrendingUp : tone === 'negative' ? TrendingDown : Minus

  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0, y: -4 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className={`absolute top-3 right-4 ${tone === 'negative' ? 'efi-chip-alarm' : ''}`}
    >
      {/* Pulse halo on arrival */}
      <motion.span
        aria-hidden
        initial={{ opacity: 0.55, scale: 0.9 }}
        animate={{ opacity: 0, scale: 1.9 }}
        transition={{ duration: 1.2, delay: 0.4, ease: 'easeOut' }}
        className={`absolute inset-0 rounded-full ${
          tone === 'negative'
            ? 'bg-coral/45'
            : tone === 'positive'
              ? 'bg-sage/45'
              : 'bg-ink-faint/25'
        }`}
      />
      <div
        className={`relative px-2.5 py-1 rounded-full border text-[10px] font-semibold tabular flex items-center gap-1.5 backdrop-blur-sm ${classes}`}
      >
        <Icon className="w-3 h-3" strokeWidth={2.25} />
        <span>
          EFI {efi > 0 ? '+' : ''}
          {efi}
        </span>
      </div>
    </motion.div>
  )
}

/* ---------- Avatar (SVG, gradient + initials) ---------- */

function Avatar({ post }: { post: FeedPost }) {
  const initials = post.author
    .split(/\s+/)
    .slice(0, 2)
    .map((s) => s[0])
    .join('')
    .toUpperCase()

  // Slightly darker companion color for gradient feel.
  const darken = shadeColor(post.avatarColor, -18)

  return (
    <div className="w-9 h-9 rounded-full flex-shrink-0 relative overflow-hidden ring-1 ring-border-soft/80">
      <svg viewBox="0 0 36 36" className="w-full h-full">
        <defs>
          <linearGradient id={`av-${post.id}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={post.avatarColor} />
            <stop offset="100%" stopColor={darken} />
          </linearGradient>
          {/* Soft abstract blob overlay, gives each avatar texture */}
          <radialGradient id={`av-glow-${post.id}`} cx="30%" cy="25%" r="60%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.55)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
        </defs>
        <rect width="36" height="36" fill={`url(#av-${post.id})`} />
        <rect width="36" height="36" fill={`url(#av-glow-${post.id})`} />
        <text
          x="50%"
          y="54%"
          textAnchor="middle"
          dominantBaseline="middle"
          fontFamily="Poppins, sans-serif"
          fontSize="13"
          fontWeight="500"
          fill="rgba(255,255,255,0.95)"
          letterSpacing="0.02em"
        >
          {initials}
        </text>
      </svg>
    </div>
  )
}

/* ---------- Post media (SVG abstract scenes per post type) ---------- */

function PostMedia({ post }: { post: FeedPost }) {
  return (
    <div className="w-full h-36 rounded-lg overflow-hidden relative bg-cream-warm">
      {post.type === 'pet' && <PetArt />}
      {post.type === 'argument' && <ArgumentArt />}
      {post.type === 'milestone' && <MilestoneArt />}
      {post.type === 'doom' && <DoomArt />}
      {post.type === 'beauty' && <BeautyArt />}
      {post.type === 'friend' && <FriendArt />}
    </div>
  )
}

function PetArt() {
  // Sunlit autumn scene: layered warm arcs, small dog silhouette, scattered leaves.
  return (
    <svg viewBox="0 0 320 144" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="pet-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f5d9b8" />
          <stop offset="100%" stopColor="#e8a68b" />
        </linearGradient>
      </defs>
      <rect width="320" height="144" fill="url(#pet-sky)" />
      <circle cx="255" cy="40" r="22" fill="#faf5ec" opacity="0.7" />
      <path d="M0 110 Q80 82 160 100 T320 96 L320 144 L0 144 Z" fill="#c97e62" opacity="0.55" />
      <path d="M0 126 Q90 108 180 120 T320 118 L320 144 L0 144 Z" fill="#8d6049" opacity="0.8" />
      {/* dog silhouette */}
      <g transform="translate(120 82)" fill="#4a3628">
        <ellipse cx="30" cy="24" rx="26" ry="14" />
        <circle cx="56" cy="14" r="10" />
        <path d="M62 6 L68 0 L66 10 Z" />
        <rect x="8" y="30" width="4" height="12" rx="2" />
        <rect x="22" y="32" width="4" height="10" rx="2" />
        <rect x="40" y="32" width="4" height="10" rx="2" />
        <path d="M0 22 Q-8 18 -4 30 Z" />
      </g>
      {/* leaves */}
      <g fill="#c97e62">
        <ellipse cx="40" cy="40" rx="6" ry="3" transform="rotate(-25 40 40)" />
        <ellipse cx="80" cy="20" rx="5" ry="2.5" transform="rotate(20 80 20)" />
        <ellipse cx="220" cy="58" rx="5" ry="2.5" transform="rotate(-40 220 58)" />
        <ellipse cx="290" cy="78" rx="6" ry="3" transform="rotate(15 290 78)" />
      </g>
    </svg>
  )
}

function ArgumentArt() {
  // Quote-tweet pile-on: stacked speech blocks, sharp angles, muted dark palette.
  return (
    <svg viewBox="0 0 320 144" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
      <rect width="320" height="144" fill="#3a342c" />
      <g opacity="0.12" stroke="#e8a68b" strokeWidth="1">
        {Array.from({ length: 12 }).map((_, i) => (
          <line key={i} x1={i * 30} y1="0" x2={i * 30 - 40} y2="144" />
        ))}
      </g>
      {/* stacked quote cards */}
      <g>
        <rect x="30" y="24" width="170" height="34" rx="6" fill="#4a4339" />
        <rect x="40" y="32" width="110" height="4" rx="2" fill="#8a8476" />
        <rect x="40" y="42" width="140" height="4" rx="2" fill="#6b645a" />

        <rect x="60" y="62" width="200" height="34" rx="6" fill="#5a5048" />
        <rect x="70" y="70" width="150" height="4" rx="2" fill="#a59988" />
        <rect x="70" y="80" width="170" height="4" rx="2" fill="#8a8476" />

        <rect x="40" y="100" width="190" height="30" rx="6" fill="#6b5d50" />
        <rect x="50" y="108" width="130" height="4" rx="2" fill="#c7b8a4" />
        <rect x="50" y="118" width="160" height="4" rx="2" fill="#a59988" />
      </g>
      {/* coral slash accents (conflict) */}
      <path d="M240 18 L280 58" stroke="#e8a68b" strokeWidth="3" strokeLinecap="round" />
      <path d="M250 24 L270 44" stroke="#c97e62" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
    </svg>
  )
}

function MilestoneArt() {
  // Confetti rise, soft sage and amber.
  return (
    <svg viewBox="0 0 320 144" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="ms-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#edf1e8" />
          <stop offset="100%" stopColor="#dce6d5" />
        </linearGradient>
      </defs>
      <rect width="320" height="144" fill="url(#ms-bg)" />
      {/* Sunburst */}
      <g transform="translate(160 150)" opacity="0.35">
        {Array.from({ length: 14 }).map((_, i) => (
          <rect
            key={i}
            x="-1"
            y="-160"
            width="2"
            height="160"
            fill="#8fa882"
            transform={`rotate(${(i * 360) / 14})`}
          />
        ))}
      </g>
      {/* confetti shards */}
      {[
        ['#8fa882', 30, 38, 8, 3, 20],
        ['#d4b478', 60, 70, 6, 4, -15],
        ['#e8a68b', 90, 30, 7, 3, 40],
        ['#b8aacc', 230, 50, 8, 3, -25],
        ['#8fa882', 260, 90, 6, 3, 10],
        ['#d4b478', 200, 20, 9, 4, 35],
        ['#8fa882', 130, 100, 6, 3, -30],
        ['#e8a68b', 280, 30, 7, 3, 15],
      ].map(([fill, x, y, w, h, rot], i) => (
        <rect
          key={i}
          x={x as number}
          y={y as number}
          width={w as number}
          height={h as number}
          rx="1"
          fill={fill as string}
          transform={`rotate(${rot} ${x} ${y})`}
        />
      ))}
      {/* central trophy shape */}
      <g transform="translate(144 52)">
        <path d="M16 0 h32 v10 a16 16 0 0 1 -32 0 Z" fill="#a88548" />
        <rect x="22" y="22" width="20" height="6" fill="#a88548" />
        <rect x="14" y="28" width="36" height="6" rx="1" fill="#8a6a38" />
      </g>
    </svg>
  )
}

function DoomArt() {
  // Collapsing chart with red tickers.
  return (
    <svg viewBox="0 0 320 144" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
      <rect width="320" height="144" fill="#2e2a24" />
      {/* grid */}
      <g stroke="#4a4339" strokeWidth="1">
        {[0, 1, 2, 3, 4].map((i) => (
          <line key={i} x1="0" y1={24 + i * 24} x2="320" y2={24 + i * 24} />
        ))}
      </g>
      {/* collapsing line */}
      <polyline
        fill="none"
        stroke="#e8a68b"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points="10,40 40,50 70,44 100,62 130,70 160,90 190,84 220,104 250,112 280,122 310,130"
      />
      {/* shaded area */}
      <polygon
        fill="#c97e62"
        opacity="0.22"
        points="10,40 40,50 70,44 100,62 130,70 160,90 190,84 220,104 250,112 280,122 310,130 310,144 10,144"
      />
      {/* headline bar */}
      <rect x="0" y="0" width="320" height="18" fill="#c97e62" />
      <rect x="10" y="6" width="6" height="6" fill="#2e2a24" />
      <rect x="22" y="7" width="140" height="4" rx="1" fill="#2e2a24" opacity="0.75" />
      <text x="280" y="12" fontFamily="Poppins, sans-serif" fontSize="9" fontWeight="600" fill="#2e2a24">
        BREAKING
      </text>
      {/* ticker line */}
      <rect x="0" y="128" width="320" height="16" fill="#1f1c17" />
      <text x="10" y="139" fontFamily="Poppins, sans-serif" fontSize="8" fill="#e8a68b" letterSpacing="0.1em">
        ▼ -4.2%   ▼ -11.8%   ▼ -2.1%   ▼ -7.6%
      </text>
    </svg>
  )
}

function BeautyArt() {
  // Filtered portrait abstraction: symmetrical face blocks, lavender wash.
  return (
    <svg viewBox="0 0 320 144" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="bt-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e3dced" />
          <stop offset="100%" stopColor="#b8aacc" />
        </linearGradient>
      </defs>
      <rect width="320" height="144" fill="url(#bt-bg)" />
      {/* face oval */}
      <ellipse cx="160" cy="80" rx="44" ry="56" fill="#f4e0d4" />
      {/* hair */}
      <path d="M116 60 Q160 10 204 60 Q210 40 180 28 Q160 20 140 28 Q110 40 116 60 Z" fill="#5a4a3a" />
      {/* eyes (filter-perfect dots) */}
      <circle cx="146" cy="80" r="2.5" fill="#2e2a24" />
      <circle cx="174" cy="80" r="2.5" fill="#2e2a24" />
      {/* lips */}
      <path d="M150 104 Q160 110 170 104" stroke="#c97e62" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* sparkle overlay (filter) */}
      <g fill="#ffffff" opacity="0.85">
        <path d="M60 30 l2 6 l6 2 l-6 2 l-2 6 l-2 -6 l-6 -2 l6 -2 z" />
        <path d="M260 50 l1.5 4 l4 1.5 l-4 1.5 l-1.5 4 l-1.5 -4 l-4 -1.5 l4 -1.5 z" />
        <path d="M240 100 l1 3 l3 1 l-3 1 l-1 3 l-1 -3 l-3 -1 l3 -1 z" />
      </g>
      {/* filter badge */}
      <rect x="10" y="118" width="70" height="18" rx="9" fill="rgba(255,255,255,0.75)" />
      <text x="45" y="130" textAnchor="middle" fontFamily="Poppins, sans-serif" fontSize="9" fontWeight="600" fill="#8d7ab0">
        GLOW · AI
      </text>
    </svg>
  )
}

function FriendArt() {
  // Warm wedding frame: soft coral arch, two silhouettes.
  return (
    <svg viewBox="0 0 320 144" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="fr-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f7e2d4" />
          <stop offset="100%" stopColor="#f2d9cc" />
        </linearGradient>
      </defs>
      <rect width="320" height="144" fill="url(#fr-bg)" />
      {/* arch */}
      <path d="M80 144 Q80 40 160 40 Q240 40 240 144" fill="none" stroke="#c97e62" strokeWidth="3" opacity="0.6" />
      <path d="M92 144 Q92 52 160 52 Q228 52 228 144" fill="none" stroke="#e8a68b" strokeWidth="2" opacity="0.5" />
      {/* silhouettes */}
      <g fill="#4a3a2e">
        <circle cx="142" cy="86" r="10" />
        <path d="M126 144 Q126 104 142 102 Q158 104 158 144 Z" />
        <circle cx="178" cy="82" r="11" />
        <path d="M162 144 Q162 102 178 100 Q196 102 196 144 Z" />
      </g>
      {/* petals */}
      <g fill="#c97e62" opacity="0.7">
        <circle cx="40" cy="110" r="3" />
        <circle cx="56" cy="130" r="2" />
        <circle cx="280" cy="118" r="3" />
        <circle cx="266" cy="134" r="2" />
        <circle cx="300" cy="96" r="2" />
      </g>
    </svg>
  )
}

/* ---------- Sidebar panels ---------- */

function CumulativePanel({ cumulative, count }: { cumulative: number; count: number }) {
  const isNegative = cumulative < 0
  const isPositive = cumulative > 0
  const numColor = isNegative ? 'text-coral-deep' : isPositive ? 'text-sage-deep' : 'text-ink-muted'
  const barTone = isNegative ? 'bg-coral' : isPositive ? 'bg-sage' : 'bg-ink-faint'
  // Visualize net as magnitude (max ~15).
  const magnitude = Math.min(1, Math.abs(cumulative) / 15)

  return (
    <div className="bg-white border border-border-soft rounded-xl shadow-soft p-5">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-sage" />
          <span className="text-[10px] uppercase tracking-eyebrow text-ink-muted font-semibold">
            This 30-minute scroll session
          </span>
        </div>
        <span className="text-[9.5px] uppercase tracking-eyebrow text-ink-faint">Live</span>
      </div>

      <div className="grid grid-cols-3 gap-3 mt-4">
        <div>
          <div className="text-[9px] uppercase tracking-eyebrow text-ink-faint font-medium">Posts</div>
          <div className="font-light text-[26px] text-ink leading-none mt-1 tabular">{count}</div>
        </div>
        <div>
          <div className="text-[9px] uppercase tracking-eyebrow text-ink-faint font-medium">Time</div>
          <div className="font-light text-[26px] text-ink leading-none mt-1 tabular">
            {String(count * 5).padStart(2, '0')}:00
          </div>
        </div>
        <div>
          <div className="text-[9px] uppercase tracking-eyebrow text-ink-faint font-medium">Net EFI</div>
          <div className={`font-light text-[34px] leading-none mt-1 tabular ${numColor}`}>
            <AnimatedNumber
              value={cumulative}
              duration={0.6}
              format={(n) => {
                const r = Math.round(n)
                return r > 0 ? `+${r}` : `${r}`
              }}
            />
          </div>
        </div>
      </div>

      {/* Net EFI magnitude bar */}
      <div className="mt-4">
        <div className="h-1.5 bg-cream-warm rounded-full overflow-hidden relative">
          <div className="absolute top-0 bottom-0 left-1/2 w-px bg-border-soft" />
          <motion.div
            animate={{
              width: `${magnitude * 50}%`,
              x: isNegative ? `-${magnitude * 50}%` : '0%',
            }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className={`absolute top-0 bottom-0 ${barTone} rounded-full`}
            style={{ left: '50%' }}
          />
        </div>
        <div className="flex justify-between text-[9px] text-ink-faint tabular mt-1">
          <span>-15</span>
          <span>0</span>
          <span>+15</span>
        </div>
      </div>
    </div>
  )
}

function ImpactBars({ posts }: { posts: FeedPost[] }) {
  const maxAbs = 11
  return (
    <div className="bg-white border border-border-soft rounded-xl shadow-soft p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-coral" />
          <span className="text-[10px] uppercase tracking-eyebrow text-ink-muted font-semibold">
            Per-post impact
          </span>
        </div>
        <span className="text-[9.5px] text-ink-faint tabular">EFI delta</span>
      </div>
      <div className="space-y-2">
        {posts.map((p) => {
          const widthPct = (Math.abs(p.efi) / maxAbs) * 100
          const isNeg = p.efi < 0
          return (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-3"
            >
              <div className="w-14 text-[10px] text-ink-muted truncate">{p.handle.replace('@', '')}</div>
              <div className="flex-1 h-5 relative bg-cream-warm rounded">
                <div className="absolute top-0 bottom-0 left-1/2 w-px bg-border-soft" />
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${widthPct / 2}%` }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
                  className={`absolute top-0 bottom-0 ${isNeg ? 'right-1/2 bg-coral' : 'left-1/2 bg-sage'} rounded`}
                  style={{ opacity: 0.9 }}
                />
              </div>
              <div
                className={`w-10 text-right text-[10.5px] tabular font-semibold ${
                  isNeg ? 'text-coral-deep' : 'text-sage-deep'
                }`}
              >
                {p.efi > 0 ? '+' : ''}
                {p.efi}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

function Insight({ cumulative, count }: { cumulative: number; count: number }) {
  const text = useMemo(() => {
    if (count <= 1) {
      return 'Wilson is reading each post the way a wearable reads a heartbeat: continuously, quietly, per item.'
    }
    if (cumulative >= 0) {
      return `So far the feed is net neutral. Wilson can see which posts lifted her and which drained her, in real time, at the content level.`
    }
    const deficit = Math.abs(cumulative)
    const sessionsToBreakEven = Math.max(1, Math.ceil(deficit / 14))
    return `${deficit} EFI points of deficit in ${count * 5} minutes of scroll. A Roots meditation lifts her +14. She would need ${sessionsToBreakEven} session${sessionsToBreakEven > 1 ? 's' : ''} tonight just to break even from this feed.`
  }, [cumulative, count])

  return (
    <div className="bg-lavender-soft border border-lavender/30 rounded-xl px-5 py-4 relative overflow-hidden">
      <div className="flex items-center gap-2 mb-2">
        <span className="w-1.5 h-1.5 rounded-full bg-lavender" />
        <span className="text-[10px] uppercase tracking-eyebrow text-lavender-deep font-semibold">
          What Wilson sees
        </span>
      </div>
      <motion.div
        key={text}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-[12.5px] text-ink-soft leading-relaxed"
      >
        {text}
      </motion.div>
    </div>
  )
}

/* ---------- Benefit cell ---------- */

function BenefitCell({
  color,
  title,
  body,
}: {
  color: 'sage' | 'coral' | 'lavender'
  title: string
  body: string
}) {
  const accentBg = {
    sage: 'bg-sage-soft',
    coral: 'bg-coral-soft',
    lavender: 'bg-lavender-soft',
  }[color]
  const dot = { sage: 'bg-sage', coral: 'bg-coral', lavender: 'bg-lavender' }[color]
  const text = {
    sage: 'text-sage-deep',
    coral: 'text-coral-deep',
    lavender: 'text-lavender-deep',
  }[color]
  return (
    <div className={`${accentBg} rounded-lg px-5 py-4 border border-border-soft/40`}>
      <div className="flex items-center gap-2 mb-2">
        <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
        <span className={`text-[10px] uppercase tracking-eyebrow font-semibold ${text}`}>{title}</span>
      </div>
      <p className="text-[12.5px] text-ink-soft leading-relaxed">{body}</p>
    </div>
  )
}

/* ---------- Utilities ---------- */

function shadeColor(hex: string, percent: number): string {
  const h = hex.replace('#', '')
  const num = parseInt(h, 16)
  let r = (num >> 16) & 0xff
  let g = (num >> 8) & 0xff
  let b = num & 0xff
  const amt = Math.round(2.55 * percent)
  r = Math.max(0, Math.min(255, r + amt))
  g = Math.max(0, Math.min(255, g + amt))
  b = Math.max(0, Math.min(255, b + amt))
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
}
