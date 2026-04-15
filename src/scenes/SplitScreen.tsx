import { useEffect, useReducer, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Play, RotateCcw } from 'lucide-react'
import Blob from '../components/Blob'
import Eyebrow from '../components/Eyebrow'
import Phone from '../components/Phone'
import { StillHeader, SessionRow, SessionScreen, SessionCompleteScreen } from '../components/StillApp'
import { BaselineCard, SmartMatchCard, PostScoreCard } from '../components/WilsonCard'
import ScoreBar from '../components/ScoreBar'
import Chip from '../components/Chip'
import { sessions, splitScreenChoreography, demoUser } from '../data/mockData'
import { ease } from '../theme/tokens'

/**
 * Scene 1: The Split Screen. Maps to deck slide 3.
 *
 * Choreography (t=0 when "Run Both" pressed):
 *   0.0  both phones load
 *   0.4  left greeting, right greeting + Wilson baseline card slides in (to ~1.3)
 *   1.5  right smart match slides in
 *   2.0  left taps Morning Anchor (visual press)
 *   2.2  right taps Begin (visual press)
 *   2.5  both enter session screen, breathing starts
 *   2.5 to 7.5  5s session. Right ScoreBar steps at 3.75, 5.0, 6.25
 *   7.5  left "Session complete" fade. right post-score card slides up
 *   8.5  left returns home. right post-score visible, delta animates
 *   9.5  bottom captions and chips fade in
 */

type Phase =
  | 'idle'
  | 'arriving'
  | 'greeting'
  | 'tapping'
  | 'session'
  | 'complete'
  | 'reveal'
  | 'rest'

type SceneState = {
  phase: Phase
  duringScoreIdx: number
  leftHighlightedSession?: string
  pressedRight: boolean
  pressedLeft: boolean
}

const initial: SceneState = {
  phase: 'idle',
  duringScoreIdx: -1,
  pressedRight: false,
  pressedLeft: false,
}

function reducer(state: SceneState, action: { type: string; payload?: any }): SceneState {
  switch (action.type) {
    case 'RESET':
      return initial
    case 'PHASE':
      return { ...state, phase: action.payload }
    case 'SCORE':
      return { ...state, duringScoreIdx: action.payload }
    case 'TAP_LEFT':
      return { ...state, leftHighlightedSession: 'S2', pressedLeft: true }
    case 'TAP_RIGHT':
      return { ...state, pressedRight: true }
    default:
      return state
  }
}

export default function SplitScreen() {
  const [state, dispatch] = useReducer(reducer, initial)
  const [hasRun, setHasRun] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const timersRef = useRef<number[]>([])

  function clearTimers() {
    timersRef.current.forEach((id) => window.clearTimeout(id))
    timersRef.current = []
  }

  function schedule(ms: number, fn: () => void) {
    const id = window.setTimeout(fn, ms)
    timersRef.current.push(id)
  }

  function run() {
    clearTimers()
    dispatch({ type: 'RESET' })
    setHasRun(true)
    setIsRunning(true)
    schedule(40, () => dispatch({ type: 'PHASE', payload: 'arriving' }))
    schedule(440, () => dispatch({ type: 'PHASE', payload: 'greeting' }))
    schedule(2000, () => dispatch({ type: 'TAP_LEFT' }))
    schedule(2200, () => dispatch({ type: 'TAP_RIGHT' }))
    schedule(2500, () => dispatch({ type: 'PHASE', payload: 'session' }))
    schedule(2500, () => dispatch({ type: 'SCORE', payload: -1 }))
    schedule(3750, () => dispatch({ type: 'SCORE', payload: 0 }))
    schedule(5000, () => dispatch({ type: 'SCORE', payload: 1 }))
    schedule(6250, () => dispatch({ type: 'SCORE', payload: 2 }))
    schedule(7500, () => dispatch({ type: 'PHASE', payload: 'complete' }))
    schedule(8500, () => dispatch({ type: 'PHASE', payload: 'reveal' }))
    schedule(8500, () => dispatch({ type: 'SCORE', payload: 3 }))
    schedule(9500, () => dispatch({ type: 'PHASE', payload: 'rest' }))
    schedule(9800, () => setIsRunning(false))
  }

  useEffect(() => {
    return () => clearTimers()
  }, [])

  const recommended = sessions.find((s) => s.id === splitScreenChoreography.recommendedSessionId)!
  const tappedLeft = sessions.find((s) => s.id === 'S2')!

  const currentScore =
    state.duringScoreIdx === -1
      ? splitScreenChoreography.preEFI
      : state.duringScoreIdx === 3
        ? splitScreenChoreography.postEFI
        : splitScreenChoreography.duringSteps[state.duringScoreIdx]

  // Stable timer label during session (avoids re-render flicker from Date.now).
  const sessionRemainingLabel = '0:05'

  const wilsonActive =
    state.phase === 'greeting' ||
    state.phase === 'tapping' ||
    state.phase === 'session' ||
    state.phase === 'complete' ||
    state.phase === 'reveal' ||
    state.phase === 'rest'

  return (
    <div className="relative px-12 pb-24 overflow-hidden">
      {/* Ambient atmosphere: coral on the left side (without), sage on the right (with) */}
      <Blob color="coral" size={340} style={{ top: 120, left: -140 }} />
      <Blob color="sage" size={380} style={{ top: 80, right: -160 }} delay={0.15} />
      <Blob color="lavender" size={220} style={{ bottom: 80, left: '42%' }} delay={0.3} />

      <div className="relative z-10 max-w-[1180px] mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <Eyebrow>The User Journey &middot; Slide 03</Eyebrow>
          </div>
          <h2 className="display-h2 text-[46px] text-ink mb-3 font-light">
            Same App, Different Universe
          </h2>
          <p className="font-light italic text-[15px] text-ink-muted max-w-xl mx-auto">
            A side by side journey through a familiar app like Calm.
          </p>

          {/* Run controls */}
          <div className="mt-7 flex flex-col items-center gap-3">
            <motion.button
              onClick={run}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isRunning}
              className="inline-flex items-center gap-2 bg-sage text-white text-[13px] font-medium px-5 py-2.5 rounded-full hover:bg-sage-deep transition-colors shadow-soft disabled:opacity-80"
            >
              {hasRun ? (
                <RotateCcw className="w-3.5 h-3.5" strokeWidth={2.2} />
              ) : (
                <Play className="w-3.5 h-3.5 fill-white" strokeWidth={2} />
              )}
              <span>{hasRun ? (isRunning ? 'Running' : 'Replay') : 'Run Both'}</span>
            </motion.button>
            <span className="text-[11px] text-ink-faint italic max-w-md">
              Two phones. Same five seconds. One sees nothing. One sees everything.
            </span>
          </div>
        </div>

        {/* Split */}
        <div className="grid grid-cols-2 gap-10 items-start">
          {/* LEFT: Without Wilson */}
          <Column
            side="left"
            label="Without Wilson"
            labelColor="coral"
            subLabel="The app today."
          >
            <div className="relative">
              {/* Ambient halo, subtle, coral (absence) */}
              <div
                aria-hidden
                className="absolute inset-0 -m-6 rounded-[48px] bg-coral-soft/40 blur-2xl"
                style={{ zIndex: 0 }}
              />
              <div className="relative z-10">
                <Phone tilt={-1.2}>
                  <AnimatePresence mode="wait">
                    {state.phase !== 'session' && state.phase !== 'complete' ? (
                      <motion.div
                        key="home-left"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <StillHeader />
                        <div className="mt-1">
                          {sessions.slice(0, 5).map((s) => (
                            <SessionRow
                              key={s.id}
                              session={s}
                              highlighted={state.leftHighlightedSession === s.id}
                            />
                          ))}
                        </div>
                      </motion.div>
                    ) : null}

                    {state.phase === 'session' && (
                      <SessionScreen
                        key="session-left"
                        title={tappedLeft.title}
                        durationLabel={tappedLeft.duration}
                        remainingLabel={sessionRemainingLabel}
                        accent="amber"
                      />
                    )}

                    {state.phase === 'complete' && <SessionCompleteScreen key="complete-left" />}
                  </AnimatePresence>
                </Phone>
              </div>
            </div>

            {/* Caption */}
            <Caption show={state.phase === 'rest'}>
              <div className="text-[12.5px] text-ink-muted italic">
                Day 4 of 90. Completion logged.
              </div>
              <Chip color="coral">96% churn within 90 days</Chip>
            </Caption>
          </Column>

          {/* RIGHT: With Wilson */}
          <Column
            side="right"
            label="With Wilson"
            labelColor="sage"
            subLabel="The same app, with intelligence."
          >
            <div className="relative">
              {/* Ambient halo, sage, gently animated when Wilson is active */}
              <motion.div
                aria-hidden
                className="absolute inset-0 -m-6 rounded-[48px] bg-sage-soft/70 blur-2xl"
                style={{ zIndex: 0 }}
                animate={
                  wilsonActive
                    ? { opacity: [0.55, 0.85, 0.55], scale: [1, 1.015, 1] }
                    : { opacity: 0.35, scale: 1 }
                }
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              />
              <div className="relative z-10">
                <Phone tilt={1.2}>
                  <AnimatePresence mode="wait">
                    {(state.phase === 'idle' ||
                      state.phase === 'arriving' ||
                      state.phase === 'greeting' ||
                      state.phase === 'tapping') && (
                      <motion.div
                        key="home-right"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <StillHeader />
                        {(state.phase === 'greeting' || state.phase === 'tapping') && (
                          <BaselineCard baselineEFI={splitScreenChoreography.preEFI} delay={0} />
                        )}
                        {(state.phase === 'greeting' || state.phase === 'tapping') && (
                          <SmartMatchCard
                            title={recommended.title}
                            duration={recommended.duration}
                            technique={recommended.technique}
                            upliftRate={87}
                            delay={1.0}
                          />
                        )}
                      </motion.div>
                    )}

                    {state.phase === 'session' && (
                      <div key="session-right" className="absolute inset-0">
                        <SessionScreen
                          title={recommended.title}
                          durationLabel={recommended.duration}
                          remainingLabel={sessionRemainingLabel}
                          accent="sage"
                        />
                        <ScoreBar value={currentScore} min={40} max={100} />
                        {/* Soft glow pulse on each score tick */}
                        <motion.div
                          key={`tick-${state.duringScoreIdx}`}
                          aria-hidden
                          className="absolute right-0 top-0 bottom-0 w-10 pointer-events-none"
                          style={{
                            background:
                              'radial-gradient(circle at 90% 50%, rgba(143,168,130,0.35), transparent 60%)',
                          }}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: [0, 0.9, 0] }}
                          transition={{ duration: 0.9, ease: 'easeOut' }}
                        />
                      </div>
                    )}

                    {(state.phase === 'complete' ||
                      state.phase === 'reveal' ||
                      state.phase === 'rest') && (
                      <motion.div
                        key="home-right-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4 }}
                        className="bg-white absolute inset-0"
                      >
                        <StillHeader subtitle="Session impact" />
                        {(state.phase === 'reveal' || state.phase === 'rest') && (
                          <PostScoreCard
                            before={splitScreenChoreography.preEFI}
                            after={splitScreenChoreography.postEFI}
                            delta={splitScreenChoreography.delta}
                            annotation="Your heart rate variability improved between minutes 3 and 6. Stress markers stabilized."
                          />
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Phone>
              </div>
            </div>

            {/* Caption */}
            <Caption show={state.phase === 'rest'}>
              <div className="text-[12.5px] text-ink-muted italic">
                Day 4 of 90. Session worked. Reason to return.
              </div>
              <Chip color="sage">Retention curve inverts</Chip>
            </Caption>
          </Column>
        </div>

        {/* Bottom band: deck slide 3 caption, verbatim */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: ease.out, delay: 0.2 }}
          className="mt-16 bg-cream-deep rounded-2xl px-10 py-6 max-w-3xl mx-auto border border-border-soft/60"
        >
          <p className="font-light italic text-[14.5px] leading-[1.7] text-ink-soft text-center">
            Both sides get smarter every day. The user sees results. The platform sees what produces
            them. This is retention that is earned, not engineered.
          </p>
        </motion.div>

        {/* Idle hint */}
        {!hasRun && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-6 text-center text-[11px] text-ink-faint italic"
          >
            Press <span className="font-semibold text-sage not-italic">Run Both</span> to play the journey.
          </motion.div>
        )}

        {/* User stats footnote */}
        <div className="mt-12 pt-6 border-t border-border-soft/60 grid grid-cols-3 gap-6 text-[10.5px] text-ink-faint tabular">
          <div>
            <span className="uppercase tracking-eyebrow font-semibold text-ink-muted/70 mr-2">
              Sleep
            </span>
            {demoUser.sleepLastNight}
          </div>
          <div className="text-center">
            <span className="uppercase tracking-eyebrow font-semibold text-ink-muted/70 mr-2">
              HRV
            </span>
            {demoUser.hrv} ms (low for her baseline)
          </div>
          <div className="text-right">
            <span className="uppercase tracking-eyebrow font-semibold text-ink-muted/70 mr-2">
              Screen time since 6pm
            </span>
            {demoUser.screenTimeSinceSix}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Local composition helpers                                           */
/* ------------------------------------------------------------------ */

function Column({
  side,
  label,
  labelColor,
  subLabel,
  children,
}: {
  side: 'left' | 'right'
  label: string
  labelColor: 'sage' | 'coral'
  subLabel: string
  children: React.ReactNode
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, ease: ease.out, delay: side === 'left' ? 0 : 0.08 }}
      className="flex flex-col items-center"
    >
      <div className="self-start mb-5 flex items-baseline gap-3">
        <Chip color={labelColor}>{label}</Chip>
        <span className="text-[11px] text-ink-faint italic">{subLabel}</span>
      </div>
      {children}
    </motion.div>
  )
}

function Caption({ show, children }: { show: boolean; children: React.ReactNode }) {
  return (
    <div className="mt-7 min-h-[68px] flex flex-col items-center">
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: ease.out, delay: 0.1 }}
            className="flex flex-col items-center gap-2.5"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
