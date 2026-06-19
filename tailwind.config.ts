import type { Config } from 'tailwindcss'

export default {
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
        // Single accent — calm cycling teal. Used only for the primary CTA and active/focus states.
        accent: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#0891b2', // base accent
          600: '#0e7490',
          700: '#155e75',
          800: '#164e63',
          900: '#083344',
        },
        // Single neutral scale — backgrounds, borders, text. The product's main surface palette.
        neutral: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
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
