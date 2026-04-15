import { motion } from 'framer-motion'
import Blob, { Leaf } from '../components/Blob'
import Eyebrow from '../components/Eyebrow'
import StatPill from '../components/StatPill'
import SceneCard from '../components/SceneCard'

export default function Landing() {
  return (
    <div className="relative min-h-screen px-12 pb-16">
      {/* Decorative blobs, matched to deck */}
      <Blob color="sage" size={420} style={{ top: -120, right: -120 }} />
      <Blob color="coral" size={320} style={{ bottom: -100, left: -100 }} delay={0.2} />
      <Blob color="lavender" size={220} style={{ top: '40%', right: -60 }} delay={0.35} />
      <Leaf style={{ top: 110, right: 220 }} />
      <Leaf style={{ bottom: 200, left: 180 }} rotate={120} />
      <Leaf style={{ top: 380, right: 460 }} rotate={70} />

      <div className="relative z-10 max-w-6xl mx-auto pt-8 grid grid-cols-12 gap-12 items-start">
        {/* Left: hero */}
        <div className="col-span-7">
          <Eyebrow>The Intelligence Layer for Wellness</Eyebrow>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="display-h1 text-[110px] text-ink mt-5 mb-2"
          >
            Wilson
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
            className="font-light italic text-[20px] text-ink-muted leading-snug max-w-md"
          >
            Real measurement. Real outcomes.
            <br />
            The end of guesswork in wellness.
          </motion.p>

          <div className="w-12 h-px bg-divider my-7" />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-[13.5px] leading-relaxed text-ink-soft max-w-lg"
          >
            Wilson is an SDK that plugs into any wellness app: meditation, therapy, fitness, sleep, nutrition.
            It gives the host app something no app can build alone: cross-ecosystem intelligence that measures
            whether interventions actually work, without ever exposing user data to the host.
          </motion.p>

          {/* Stat pills */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="grid grid-cols-3 gap-3 mt-9 max-w-xl"
          >
            <StatPill number="95,000+" label="Wellness Apps" color="sage" />
            <StatPill number="$7.8B" label="Market (2025)" color="coral" />
            <StatPill number="96%" label="Churn at 90 Days" color="lavender" />
          </motion.div>
        </div>

        {/* Right: scene cards */}
        <div className="col-span-5 pt-2">
          <Eyebrow color="coral">Begin · A 3-minute experience</Eyebrow>
          <div className="grid grid-cols-1 gap-3 mt-5">
            <SceneCard
              index={1}
              slide="Slide 03"
              title="The Split Screen"
              subtitle="Same app, two universes. The contrast does the selling."
              to="/split"
              color="sage"
              delay={0.55}
            />
            <SceneCard
              index={2}
              slide="Slide 02"
              title="The Platform Flip"
              subtitle="What the app sees about you, made visible. The two-sided loop."
              to="/platform"
              color="coral"
              delay={0.65}
            />
            <SceneCard
              index={3}
              slide="Slide 05"
              title="The Flywheel"
              subtitle="Drag to add users and partner apps. Watch the moat deepen."
              to="/flywheel"
              color="lavender"
              delay={0.75}
            />
            <SceneCard
              index={4}
              slide="Slide 04"
              title="The Feed"
              subtitle="Wilson on social media. The wellbeing layer for the attention economy."
              to="/feed"
              color="amber"
              delay={0.85}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 max-w-6xl mx-auto mt-20 pt-6 border-t border-border-soft flex items-center justify-between text-[10px] text-ink-faint tracking-[0.08em]">
        <span>Wilson Intelligence &nbsp;·&nbsp; Confidential</span>
        <span className="italic">Use &larr; &rarr; or 1 / 2 / 3 / 4 to navigate.</span>
      </div>
    </div>
  )
}
