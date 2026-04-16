import { motion } from 'framer-motion'
import Blob, { Leaf } from '../components/Blob'
import Eyebrow from '../components/Eyebrow'
import StatPill from '../components/StatPill'
import SceneCard from '../components/SceneCard'

export default function Landing() {
  return (
    <div className="relative min-h-screen px-5 md:px-12 pb-16">
      {/* Decorative blobs, matched to deck */}
      <Blob color="sage" size={420} style={{ top: -120, right: -120 }} />
      <Blob color="coral" size={320} style={{ bottom: -100, left: -100 }} delay={0.2} />
      <Blob color="lavender" size={220} style={{ top: '40%', right: -60 }} delay={0.35} />
      <Leaf style={{ top: 110, right: 220 }} />
      <Leaf style={{ bottom: 200, left: 180 }} rotate={120} />
      <Leaf style={{ top: 380, right: 460 }} rotate={70} />

      <div className="relative z-10 max-w-6xl mx-auto pt-4 md:pt-8 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
        {/* Left: hero */}
        <div className="lg:col-span-7">
          <Eyebrow>The Intelligence Layer for Wellness</Eyebrow>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="display-h1 text-[64px] md:text-[88px] lg:text-[110px] text-ink mt-5 mb-2"
          >
            Wilson
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
            className="font-light italic text-[16px] md:text-[20px] text-ink-muted leading-snug max-w-md"
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
            Today, 95,000 wellness apps spend billions trying to keep users engaged. By month three,
            most of those users are gone. Wilson is the intelligence layer that fixes that. An SDK that
            plugs into any wellness app and measures whether interventions actually work, without ever
            exposing user data to the host.
          </motion.p>

          {/* Stat pills: framed as the industry status quo Wilson disrupts. */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="mt-9 max-w-xl"
          >
            <div className="text-[10px] uppercase tracking-eyebrow text-ink-faint font-semibold mb-3">
              The wellness industry today
            </div>
            <div className="grid grid-cols-3 gap-3">
              <StatPill number="95,000+" label="Wellness Apps" color="sage" />
              <StatPill number="$7.8B" label="Market (2025)" color="coral" />
              <StatPill number="96%" label="Industry Churn at 90 Days" color="lavender" />
            </div>
          </motion.div>
        </div>

        {/* Right: scene cards */}
        <div className="lg:col-span-5 pt-2">
          <Eyebrow color="coral">Begin · A 3-minute experience</Eyebrow>
          <div className="grid grid-cols-1 gap-3 mt-5">
            <SceneCard
              index={1}
              slide="Slide 03"
              title="Outcomes That Drive Retention"
              subtitle="The 96% churn problem, solved by measuring whether sessions actually work."
              to="/split"
              color="sage"
              delay={0.55}
            />
            <SceneCard
              index={2}
              slide="Slide 02"
              title="What Platforms Will Pay For"
              subtitle="Cohort intelligence and retention uplift the host app cannot build alone."
              to="/platform"
              color="coral"
              delay={0.65}
            />
            <SceneCard
              index={3}
              slide="Slide 05"
              title="The Moat That Compounds"
              subtitle="Every new user and partner app sharpens the engine. No single app sees the full picture."
              to="/flywheel"
              color="lavender"
              delay={0.75}
            />
            <SceneCard
              index={4}
              slide="Slide 04"
              title="The Wellbeing Standard for Social"
              subtitle="Wilson as the measurement layer regulators, platforms, and users all want."
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
