# WilsonHQ

Interactive prototype for **Wilson Intelligence**: the cross-ecosystem intelligence layer for wellness apps. This prototype brings the pitch deck v2 to life as a single web experience an investor can touch in three minutes.

> Real measurement. Real outcomes. The end of guesswork in wellness.

## What this is

One URL, four scenes, each mapped to a slide of the pitch deck.

| Scene | Maps to slide | Route |
|---|---|---|
| Landing | Slide 1 (cover) | `/` |
| The Split Screen | Slide 3 ("Same App, Different Universe") | `/split` |
| The Platform Flip | Slide 2 ("Reversing the Model") | `/platform` |
| The Flywheel | Slide 5 ("Every User Makes It Smarter") | `/flywheel` |
| The Feed | Slide 4 (Expansion Vector) | `/feed` |

## Run locally

Requires Node 18 or later.

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

## Build a static bundle

For deploying anywhere or running offline on the pitch laptop:

```bash
npm run build
npm run preview
```

The `dist/` folder is fully static. Drop on Vercel, Netlify, or open `dist/index.html` from a USB stick if WiFi fails.

## Keyboard navigation

| Key | Action |
|---|---|
| `←` `→` | Step between scenes |
| `0` | Landing |
| `1` | Split Screen |
| `2` | Platform Flip |
| `3` | Flywheel |
| `4` | Feed |

## Stack

Vite, React 18, TypeScript, Tailwind CSS, Framer Motion, React Router, Recharts, Lucide.

## Project structure

```
src/
  main.tsx              entry
  App.tsx               routes + keyboard nav
  index.css             tailwind layers + custom slider
  theme/tokens.ts       colors, easing, spring presets
  data/mockData.ts      every hardcoded number, name, copy line
  components/           shared design system
    Layout.tsx
    Nav.tsx
    Eyebrow.tsx
    Blob.tsx
    Phone.tsx
    StillApp.tsx        the meditation-app surface
    WilsonCard.tsx      Wilson panels inside Still
    ScoreBar.tsx
    AnimatedNumber.tsx
    StatPill.tsx
    SceneCard.tsx
    Chip.tsx
  scenes/
    Landing.tsx
    SplitScreen.tsx
    PlatformFlip.tsx
    Flywheel.tsx
    FeedTeaser.tsx
```

## Design tokens

Pulled directly from the deck. Single typeface: **Poppins** at 300 / 400 / 500 / 600 / 700.

Accent palette:
- **Sage** `#8fa882` (to the user, primary brand)
- **Coral** `#e8a68b` (to the platform)
- **Lavender** `#b8aacc` (society / expansion)
- **Amber** `#d4b478` (sparing accent)

All defined as Tailwind tokens in `tailwind.config.js` and mirrored in `src/theme/tokens.ts` for JS-side use (Framer Motion, SVG, Recharts).

## Notes

- The prototype is fully hardcoded. No backend, no API, no model. All data lives in `src/data/mockData.ts` for easy editing.
- Every scene caption and bottom band reuses the deck's copy verbatim where possible.
- No em dashes anywhere in user-visible text. Stylistic preference, enforced.

## Reference

- `wilson_pitch_v2.pdf` (the deck) — source of truth for all visuals and copy.
- `wilson-prototype-spec.md` — full build specification.
- `wilson-prototype-proposal.pdf` — the one-page proposal Janice approved.
