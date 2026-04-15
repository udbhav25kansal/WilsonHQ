// All hardcoded data for the prototype. No backend, no API calls.
// Choreography lives here.

export const demoUser = {
  sleepLastNight: '5h 42m',
  hrv: 32, // ms
  restingHR: 72,
  stressIndex: 74,
  focusScore: 41,
  screenTimeSinceSix: '2h 48m',
  baselineEFI: 58,
}

export type Session = {
  id: string
  title: string
  duration: string
  technique: string
  target: string
  accent: 'sage' | 'coral' | 'lavender' | 'amber'
}

export const sessions: Session[] = [
  { id: 'S1', title: 'Roots', duration: '6 min', technique: 'grounding', target: 'stress, doubt', accent: 'sage' },
  { id: 'S2', title: 'Morning Anchor', duration: '4 min', technique: 'breath', target: 'low energy', accent: 'amber' },
  { id: 'S3', title: 'Soft Landing', duration: '8 min', technique: 'somatic release', target: 'post-conflict', accent: 'coral' },
  { id: 'S4', title: 'The Inner Observer', duration: '10 min', technique: 'mindfulness', target: 'rumination', accent: 'lavender' },
  { id: 'S5', title: 'Phone-Down', duration: '3 min', technique: 'transition', target: 'post-scroll', accent: 'sage' },
  { id: 'S6', title: 'Recovery Breath', duration: '7 min', technique: 'vagal', target: 'high HRV', accent: 'coral' },
]

// Scene 1 EFI choreography: pre 58, during steps, post 72, delta +14
export const splitScreenChoreography = {
  preEFI: 58,
  duringSteps: [63, 67, 71], // shown at 25%, 50%, 75% of session
  postEFI: 72,
  delta: 14,
  sessionDurationSec: 5.0,
  recommendedSessionId: 'S1',
}

// Scene 2: platform console
export type Cohort = {
  name: string
  users: number
  bestSession: string
  avgDelta: number
}

export const cohorts: Cohort[] = [
  { name: 'Stress-elevated professionals', users: 12847, bestSession: 'Roots', avgDelta: 14.2 },
  { name: 'Under-slept creatives', users: 8431, bestSession: 'Morning Anchor', avgDelta: 11.8 },
  { name: 'Post-argument users', users: 3209, bestSession: 'Soft Landing', avgDelta: 16.4 },
  { name: 'Chronic doomscrollers', users: 21502, bestSession: 'Phone-Down', avgDelta: 9.6 },
  { name: 'Recovering from burnout', users: 6184, bestSession: 'The Inner Observer', avgDelta: 13.1 },
  { name: 'High-HRV weekend athletes', users: 6102, bestSession: 'Recovery Breath', avgDelta: 8.1 },
]

export const contentToRetire = [
  { title: 'Sleep Stories: Forest Edition', delta: 0.3, sample: 4210 },
  { title: 'Affirmations for Confidence', delta: -1.1, sample: 2887 },
  { title: 'Mindful Eating Guide', delta: 0.8, sample: 1604 },
]

export const retentionCurves = [
  { day: 0, without: 100, with: 100 },
  { day: 10, without: 78, with: 92 },
  { day: 20, without: 54, with: 84 },
  { day: 30, without: 38, with: 78 },
  { day: 40, without: 26, with: 73 },
  { day: 50, without: 18, with: 69 },
  { day: 60, without: 12, with: 66 },
  { day: 70, without: 8, with: 63 },
  { day: 80, without: 6, with: 61 },
  { day: 90, without: 4, with: 59 },
]

export const headlineRetention = 47

// Scene 3: Flywheel formulas live in the scene component itself,
// but defaults are here.
export const flywheelDefaults = {
  partnerApps: 12,
  users: 250000,
  partnerAppsRange: [3, 500] as [number, number],
  usersRange: [10000, 10000000] as [number, number],
}

export const flywheelNodes = [
  { id: 'sessions', label: 'User Sessions', accent: 'sage' as const },
  { id: 'outcomes', label: 'Outcome Data', accent: 'coral' as const },
  { id: 'learning', label: 'Cross-App Learning', accent: 'lavender' as const },
  { id: 'matching', label: 'Better Matching', accent: 'amber' as const },
  { id: 'retention', label: 'Higher Retention', accent: 'sage' as const },
]

// Scene 4: feed posts
export type FeedPost = {
  id: string
  author: string
  handle: string
  timeAgo: string
  type: 'pet' | 'argument' | 'milestone' | 'doom' | 'beauty' | 'friend'
  caption: string
  efi: number
  avatarColor: string
  mediaColor: string
}

export const feedPosts: FeedPost[] = [
  {
    id: 'P1',
    author: 'Sunny Days',
    handle: '@sunnydaysco',
    timeAgo: '2m',
    type: 'pet',
    caption: 'Golden retriever discovering autumn leaves for the first time.',
    efi: 3,
    avatarColor: '#d4b478',
    mediaColor: '#e8a68b',
  },
  {
    id: 'P2',
    author: 'The Daily Take',
    handle: '@dailytake',
    timeAgo: '8m',
    type: 'argument',
    caption: 'This is the worst take I have seen all week and here is exactly why.',
    efi: -11,
    avatarColor: '#6b645a',
    mediaColor: '#4a4339',
  },
  {
    id: 'P3',
    author: 'Maya R.',
    handle: '@mayarwrites',
    timeAgo: '14m',
    type: 'milestone',
    caption: 'After two years of saying no to everything, I just said yes to the new role.',
    efi: 5,
    avatarColor: '#8fa882',
    mediaColor: '#dce6d5',
  },
  {
    id: 'P4',
    author: 'Wire Service',
    handle: '@wireservice',
    timeAgo: '21m',
    type: 'doom',
    caption: 'Breaking: economic indicator drops to lowest level in eleven years.',
    efi: -8,
    avatarColor: '#8a8476',
    mediaColor: '#6b645a',
  },
  {
    id: 'P5',
    author: 'GlowAndGo',
    handle: '@glowandgo',
    timeAgo: '24m',
    type: 'beauty',
    caption: 'The viral filter that everyone is using this week. Try it tonight.',
    efi: -6,
    avatarColor: '#b8aacc',
    mediaColor: '#e3dced',
  },
  {
    id: 'P6',
    author: 'Theo Lin',
    handle: '@theolin',
    timeAgo: '29m',
    type: 'friend',
    caption: 'College roommate just got married. So happy I could cry.',
    efi: 7,
    avatarColor: '#c97e62',
    mediaColor: '#f2d9cc',
  },
]

export const cumulativeFeedImpact = feedPosts.reduce((sum, p) => sum + p.efi, 0) // -10
