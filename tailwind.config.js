/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Background tones
        cream: '#faf5ec',
        'cream-warm': '#f5efe0',
        'cream-deep': '#f3ecdc',

        // Text / ink
        ink: '#2e2a24',
        'ink-soft': '#4a4339',
        'ink-muted': '#6b645a',
        'ink-faint': '#8a8476',

        // Sage (to the user / primary)
        sage: '#8fa882',
        'sage-deep': '#4a5c43',
        'sage-soft': '#edf1e8',
        'sage-blob': '#dce6d5',

        // Coral (to the platform)
        coral: '#e8a68b',
        'coral-deep': '#c97e62',
        'coral-soft': '#f2d9cc',

        // Lavender (society / expansion)
        lavender: '#b8aacc',
        'lavender-deep': '#8d7ab0',
        'lavender-soft': '#e3dced',

        // Amber (sparing accent)
        amber: '#d4b478',
        'amber-deep': '#a88548',

        // Lines
        divider: '#c9b897',
        'border-soft': '#e8dfcd',
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', '-apple-system', 'Segoe UI', 'Helvetica', 'Arial', 'sans-serif'],
      },
      fontWeight: {
        light: '300',
        regular: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
      letterSpacing: {
        eyebrow: '0.16em',
        'tight-display': '-0.015em',
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '20px',
        '2xl': '28px',
      },
      boxShadow: {
        soft: '0 1px 3px rgba(46, 42, 36, 0.04), 0 4px 12px rgba(46, 42, 36, 0.04)',
        card: '0 2px 8px rgba(46, 42, 36, 0.05), 0 8px 24px rgba(46, 42, 36, 0.06)',
        float: '0 8px 32px rgba(46, 42, 36, 0.10)',
        phone: '0 12px 40px rgba(46, 42, 36, 0.12), 0 2px 8px rgba(46, 42, 36, 0.06)',
        glow: '0 0 32px rgba(143, 168, 130, 0.35)',
      },
      transitionTimingFunction: {
        'wilson-out': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'wilson-in': 'cubic-bezier(0.5, 0, 0.75, 0)',
        'wilson-flip': 'cubic-bezier(0.83, 0, 0.17, 1)',
      },
      keyframes: {
        breathe: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.85' },
          '50%': { transform: 'scale(1.06)', opacity: '1' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 24px rgba(143, 168, 130, 0.25)' },
          '50%': { boxShadow: '0 0 40px rgba(143, 168, 130, 0.45)' },
        },
        drift: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '50%': { transform: 'translate(8px, -6px)' },
        },
        rise: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        breathe: 'breathe 4s ease-in-out infinite',
        pulseGlow: 'pulseGlow 4s ease-in-out infinite',
        drift: 'drift 8s ease-in-out infinite',
        rise: 'rise 0.5s cubic-bezier(0.16, 1, 0.3, 1) both',
      },
    },
  },
  plugins: [],
}
