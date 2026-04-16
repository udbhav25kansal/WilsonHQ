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
 * SEQUENTIAL choreography. The eye can only follow one side at a time, so the
 * left side ("Without Wilson") plays first while the right side is dimmed,
 * then attention transfers to the right side which plays its full sequence
 * while the left side stays in its drifted-away final state.
 *
 * Timeline (t=0 when "Run Both" pressed):
 *
 * Phase 1: Without Wilson (left active, right dimmed)
 *   0.0   activeSide -> 'left', leftPhase 'arriving'
 *   0.4   leftPhase 'browsing' (catalog visible)
 *   2.0   tap S2 (visual highlight)
 *   2.5   leftPhase 'session' (5s breathing screen)
 *   7.5   leftPhase 'complete' (fades to "Session complete")
 *   8.5   leftPhase 'home' (returns home, no signal)
 *   9.0   left caption + coral chip ("Day 4. 96% churn") fades in
 *
 * Pause (~1.5s) — investor reads the caption.
 *
 * Phase 2: With Wilson (right active, left stays in drifted-away state)
 *   10.5  activeSide -> 'right'
 *   11.0  rightPhase 'arriving'
 *   11.4  rightPhase 'browsing' (greeting + Wilson baseline card slides in)
 *   12.4  smart match card slides in
 *   13.5  rightPhase 'tapping' (visual press on Begin)
 *   14.0  rightPhase 'session' (5s, EFI bar pulses upward)
 *   15.25 score 63
 *   16.5  score 67
 *   17.75 score 71
 *   19.0  rightPhase 'reveal' (post-score card slides up, +14 delta animates)
 *   20.5  right caption + sage chip ("Reason to return") fades in
 *
 * Final state:
 *   21.5  activeSide -> 'both' (both halos calm, both captions visible)
 */

type LeftPhase = 'idle' | 'arriving' | 'browsing' | 'tapping' | 'session' | 'complete' | 'home'
type RightPhase = 'idle' | 'arriving' | 'browsing' | 'tapping' | 'session' | 'reveal'
type ActiveSide = 'none' | 'left' | 'right' | 'both'

type SceneState = {
  leftPhase: LeftPhase
  rightPhase: RightPhase
  activeSide: ActiveSide
  duringScoreIdx: number
  leftHighlightedSession?: string
  showLeftCaption: boolean
  showRightCaption: boolean
}

const initial: SceneState = {
  leftPhase: 'idle',
  rightPhase: 'idle',
  activeSide: 'none',
  duringScoreIdx: -1,
  showLeftCaption: false,
  showRightCaption: false,
}

function reducer(state: SceneState, action: { type: string; payload?: any }): SceneState {
  switch (action.type) {
    case 'RESET':
      return initial
    case 'LEFT_PHASE':
      return { ...state, leftPhase: action.payload }
    case 'RIGHT_PHASE':
      return { ...state, rightPhase: action.payload }
    case 'ACTIVE':
      return { ...state, activeSide: action.payload }
    case 'SCORE':
      return { ...state, duringScoreIdx: action.payload }
    case 'TAP_LEFT':
      return { ...state, leftHighlightedSession: 'S2' }
    case 'SHOW_LEFT_CAPTION':
      return { ...state, showLeftCaption: true }
    case 'SHOW_RIGHT_CAPTION':
      return { ...state, showRightCaption: true }
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

    // ---------- Phase 1: Without Wilson (left runs alone) ----------
    schedule(40, () => dispatch({ type: 'ACTIVE', payload: 'left' }))
    schedule(60, () => dispatch({ type: 'LEFT_PHASE', payload: 'arriving' }))
    schedule(440, () => dispatch({ type: 'LEFT_PHASE', payload: 'browsing' }))
    schedule(2000, () => dispatch({ type: 'TAP_LEFT' }))
    schedule(2000, () => dispatch({ type: 'LEFT_PHASE', payload: 'tapping' }))
    schedule(2500, () => dispatch({ type: 'LEFT_PHASE', payload: 'session' }))
    schedule(7500, () => dispatch({ type: 'LEFT_PHASE', payload: 'complete' }))
    schedule(8500, () => dispatch({ type: 'LEFT_PHASE', payload: 'home' }))
    schedule(9000, () => dispatch({ type: 'SHOW_LEFT_CAPTION' }))

    // Pause for the investor to absorb the bad outcome
    // ---------- Phase 2: With Wilson (right runs, left stays drifted away) ----------
    schedule(10500, () => dispatch({ type: 'ACTIVE', payload: 'right' }))
    schedule(11000, () => dispatch({ type: 'RIGHT_PHASE', payload: 'arriving' }))
    schedule(11400, () => dispatch({ type: 'RIGHT_PHASE', payload: 'browsing' }))
    schedule(13500, () => dispatch({ type: 'RIGHT_PHASE', payload: 'tapping' }))
    schedule(14000, () => dispatch({ type: 'RIGHT_PHASE', payload: 'session' }))
    schedule(14000, () => dispatch({ type: 'SCORE', payload: -1 }))
    schedule(15250, () => dispatch({ type: 'SCORE', payload: 0 }))
    schedule(16500, () => dispatch({ type: 'SCORE', payload: 1 }))
    schedule(17750, () => dispatch({ type: 'SCORE', payload: 2 }))
    schedule(19000, () => dispatch({ type: 'RIGHT_PHASE', payload: 'reveal' }))
    schedule(19000, () => dispatch({ type: 'SCORE', payload: 3 }))
    schedule(20500, () => dispatch({ type: 'SHOW_RIGHT_CAPTION' }))

    // ---------- Final state: both visible side by side ----------
    schedule(21500, () => dispatch({ type: 'ACTIVE', payload: 'both' }))
    schedule(21800, () => setIsRunning(false))
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

  const sessionRemainingLabel = '0:05'

  // Activity status, used by halos and dimming
  const leftActive = state.activeSide === 'left'
  const rightActive = state.activeSide === 'right'

  return (
    <div className="relative px-4 md:px-12 pb-24 overflow-hidden">
      <Blob color="coral" size={340} style={{ top: 120, left: -140 }} />
      <Blob color="sage" size={380} style={{ top: 80, right: -160 }} delay={0.15} />
      <Blob color="lavender" size={220} style={{ bottom: 80, left: '42%' }} delay={0.3} />

      <div className="relative z-10 max-w-[1180px] mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <Eyebrow>The User Journey &middot; Slide 03</Eyebrow>
          </div>
          <h2 className="display-h2 text-[30px] md:text-[46px] text-ink mb-3 font-light">
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
              First the world today. Then the world with Wilson. Watch one side at a time.
            </span>
          </div>
        </div>

        {/* Split */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-10 items-start">
          {/* LEFT: Without Wilson */}
          <Column
            side="left"
            label="Without Wilson"
            labelColor="coral"
            subLabel="The app today."
            isActive={leftActive}
            isDimmed={rightActive}
          >
            <div className="relative">
              {/* Coral attention halo. Visible only when this side is the active focus. */}
              <motion.div
                aria-hidden
                className="absolute inset-0 -m-8 rounded-[52px] bg-coral-soft blur-2xl"
                style={{ zIndex: 0 }}
                animate={
                  leftActive
                    ? { opacity: [0.6, 0.95, 0.6], scale: [1, 1.02, 1] }
                    : { opacity: 0.18, scale: 1 }
                }
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              />
              <div className="relative z-10">
                <Phone tilt={-1.2}>
                  <AnimatePresence mode="wait">
                    {state.leftPhase !== 'session' && state.leftPhase !== 'complete' ? (
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

                    {state.leftPhase === 'session' && (
                      <SessionScreen
                        key="session-left"
                        title={tappedLeft.title}
                        durationLabel={tappedLeft.duration}
                        remainingLabel={sessionRemainingLabel}
                        accent="amber"
                      />
                    )}

                    {state.leftPhase === 'complete' && (
                      <SessionCompleteScreen key="complete-left" />
                    )}
                  </AnimatePresence>
                </Phone>
              </div>
            </div>

            {/* Caption */}
            <Caption show={state.showLeftCaption}>
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
            isActive={rightActive}
            isDimmed={leftActive}
          >
            <div className="relative">
              {/* Sage attention halo. Strong only when this side is the active focus. */}
              <motion.div
                aria-hidden
                className="absolute inset-0 -m-8 rounded-[52px] bg-sage-soft blur-2xl"
                style={{ zIndex: 0 }}
                animate={
                  rightActive
                    ? { opacity: [0.65, 1, 0.65], scale: [1, 1.025, 1] }
                    : { opacity: 0.2, scale: 1 }
                }
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              />
              <div className="relative z-10">
                <Phone tilt={1.2}>
                  <AnimatePresence mode="wait">
                    {(state.rightPhase === 'idle' ||
                      state.rightPhase === 'arriving' ||
                      state.rightPhase === 'browsing' ||
                      state.rightPhase === 'tapping') && (
                      <motion.div
                        key="home-right"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <StillHeader />
                        {(state.rightPhase === 'browsing' || state.rightPhase === 'tapping') && (
                          <BaselineCard baselineEFI={splitScreenChoreography.preEFI} delay={0} />
                        )}
                        {(state.rightPhase === 'browsing' || state.rightPhase === 'tapping') && (
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

                    {state.rightPhase === 'session' && (
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
                              'radial-gradient(circle at 90% 50%, rgba(143,168,130,0.4), transparent 60%)',
                          }}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: [0, 1, 0] }}
                          transition={{ duration: 0.9, ease: 'easeOut' }}
                        />
                      </div>
                    )}

                    {state.rightPhase === 'reveal' && (
                      <motion.div
                        key="home-right-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4 }}
                        className="bg-white absolute inset-0"
                      >
                        <StillHeader subtitle="Session impact" />
                        <PostScoreCard
                          before={splitScreenChoreography.preEFI}
                          after={splitScreenChoreography.postEFI}
                          delta={splitScreenChoreography.delta}
                          annotation="Your heart rate variability improved between minutes 3 and 6. Stress markers stabilized."
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Phone>
              </div>
            </div>

            {/* Caption */}
            <Caption show={state.showRightCaption}>
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
        <div className="mt-12 pt-6 border-t border-border-soft/60 grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 text-[10.5px] text-ink-faint tabular">
          <div>
            <span className="uppercase tracking-eyebrow font-semibold text-ink-muted/70 mr-2">
              Sleep
            </span>
            {demoUser.sleepLastNight}
          </div>
          <div className="md:text-center">
            <span className="uppercase tracking-eyebrow font-semibold text-ink-muted/70 mr-2">
              HRV
            </span>
            {demoUser.hrv} ms (low for her baseline)
          </div>
          <div className="md:text-right">
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
  isActive,
  isDimmed,
  children,
}: {
  side: 'left' | 'right'
  label: string
  labelColor: 'sage' | 'coral'
  subLabel: string
  isActive: boolean
  isDimmed: boolean
  children: React.ReactNode
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{
        opacity: isDimmed ? 0.42 : 1,
        y: 0,
        filter: isDimmed ? 'saturate(0.6)' : 'saturate(1)',
      }}
      transition={{
        opacity: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
        filter: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
        y: { duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: side === 'left' ? 0 : 0.08 },
      }}
      className="flex flex-col items-center"
    >
      <div className="self-start mb-5 flex items-baseline gap-3">
        <motion.div
          animate={{ scale: isActive ? 1.04 : 1 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <Chip color={labelColor}>
            {isActive && (
              <motion.span
                aria-hidden
                className={`mr-0.5 inline-block w-1 h-1 rounded-full ${labelColor === 'sage' ? 'bg-sage' : 'bg-coral'}`}
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
              />
            )}
            {label}
          </Chip>
        </motion.div>
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
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="flex flex-col items-center gap-2.5"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
