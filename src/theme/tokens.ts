// Single source of truth for design tokens used in JS (Framer Motion, SVG, charts).
// Tailwind config mirrors these values.

export const colors = {
  cream: '#faf5ec',
  creamWarm: '#f5efe0',
  creamDeep: '#f3ecdc',

  ink: '#2e2a24',
  inkSoft: '#4a4339',
  inkMuted: '#6b645a',
  inkFaint: '#8a8476',

  sage: '#8fa882',
  sageDeep: '#4a5c43',
  sageSoft: '#edf1e8',
  sageBlob: '#dce6d5',

  coral: '#e8a68b',
  coralDeep: '#c97e62',
  coralSoft: '#f2d9cc',

  lavender: '#b8aacc',
  lavenderDeep: '#8d7ab0',
  lavenderSoft: '#e3dced',

  amber: '#d4b478',
  amberDeep: '#a88548',

  divider: '#c9b897',
  borderSoft: '#e8dfcd',
} as const

export const ease = {
  out: [0.16, 1, 0.3, 1] as [number, number, number, number],
  in: [0.5, 0, 0.75, 0] as [number, number, number, number],
  flip: [0.83, 0, 0.17, 1] as [number, number, number, number],
}

export const spring = {
  soft: { type: 'spring' as const, stiffness: 120, damping: 18 },
  bouncy: { type: 'spring' as const, stiffness: 220, damping: 16 },
  gentle: { type: 'spring' as const, stiffness: 80, damping: 22 },
}

export const durations = {
  enter: 0.42,
  exit: 0.24,
  number: 1.0,
  flip: 0.7,
}
