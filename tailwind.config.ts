import type { Config } from 'tailwindcss'

export default {
  darkMode: 'media',
  content: [
    './app/components/**/*.{vue,ts}',
    './app/composables/**/*.ts',
    './app/layouts/**/*.vue',
    './app/pages/**/*.vue',
    './app/app.vue',
  ],
  theme: {
    extend: {
      colors: {
        // Single accent — energetic cycling orange. Used only for the primary CTA and active/focus states.
        // Shades aren't a flat scale-up of one hue value: 300/400 are tuned brighter for legibility on
        // dark surfaces (hero overlay, dark-mode cards) while 500/600 are tuned darker for contrast on white.
        accent: {
          50: '#fff4ed',
          100: '#ffe3d1',
          200: '#ffc59f',
          300: '#fd9a5c',
          400: '#fb7a35',
          500: '#e8480a', // base accent
          600: '#c53d05',
          700: '#9c3005',
          800: '#7a2504',
          900: '#5c1c03',
        },
        // Single neutral scale — true gray (no blue undertone), backgrounds/borders/text.
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },
        // State colors — feedback only (validation, result emphasis). Not decorative.
        success: {
          50: '#f0fdf4',
          500: '#16a34a',
          700: '#15803d',
        },
        danger: {
          50: '#fef2f2',
          500: '#dc2626',
          700: '#b91c1c',
        },
      },
      fontFamily: {
        // One font: system stack. Fast, no web-font payload, neutral and readable.
        sans: [
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      fontSize: {
        // Explicit, capped scale: label, small, body, h2, h1. No other sizes.
        label: ['0.8125rem', { lineHeight: '1.25rem', letterSpacing: '0.01em' }], // 13px
        small: ['0.875rem', { lineHeight: '1.375rem' }], // 14px
        body: ['1rem', { lineHeight: '1.625rem' }], // 16px
        h2: ['1.25rem', { lineHeight: '1.75rem', fontWeight: '600' }], // 20px
        h1: ['1.75rem', { lineHeight: '2.25rem', fontWeight: '700' }], // 28px
      },
      borderRadius: {
        // Two radii only: controls (md) and cards (lg).
        md: '0.5rem', // 8px — inputs, buttons
        lg: '0.75rem', // 12px — cards
      },
      maxWidth: {
        // Reading/form column width — keeps the calculator from sprawling on desktop.
        form: '32rem', // 512px
      },
    },
  },
  plugins: [],
} satisfies Config
