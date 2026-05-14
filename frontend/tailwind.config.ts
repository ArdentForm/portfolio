import type {Config} from 'tailwindcss'
import typography from '@tailwindcss/typography'

export default {
  content: ['./app/**/*.{ts,tsx}', './sanity/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    container: {
      center: true,
      padding: '2rem',
    },
    extend: {
      boxShadow: {
        layer: '0 35px 60px -15px rgba(0, 0, 0, 0.3)',
      },
      keyframes: {
        shake: {
          '0%, 100%': {transform: 'translateX(0)'},
          '20%': {transform: 'translateX(-5px)'},
          '40%': {transform: 'translateX(5px)'},
          '60%': {transform: 'translateX(-3px)'},
          '80%': {transform: 'translateX(3px)'},
        },
      },
      animation: {
        shake: 'shake 0.35s ease-out',
      },
      colors: {
        black: 'oklch(9% 0.007 50)',
        white: 'oklch(99% 0.003 60)',
        cyan: {
          50: '#e7fefe',
          100: '#c5fcfc',
          200: '#96f8f8',
          300: '#62efef',
          400: '#18e2e2',
          500: '#04b8be',
          600: '#037782',
          700: '#024950',
          800: '#042f34',
          900: '#072227',
          950: '#0d181c',
        },
        gray: {
          50:  'oklch(97% 0.004 60)',
          100: 'oklch(93% 0.006 55)',
          200: 'oklch(88% 0.008 50)',
          300: 'oklch(78% 0.010 50)',
          400: 'oklch(68% 0.011 50)',
          500: 'oklch(58% 0.012 50)',
          600: 'oklch(47% 0.010 50)',
          700: 'oklch(35% 0.010 50)',
          800: 'oklch(23% 0.012 50)',
          900: 'oklch(17% 0.010 50)',
          950: 'oklch(13% 0.009 50)',
        },
        red: {
          50: '#fff6f5',
          100: '#ffe7e5',
          200: '#ffdedc',
          300: '#fdada5',
          400: '#f77769',
          500: '#ef4434',
          600: '#cc2819',
          700: '#8b2018',
          800: '#4d1714',
          900: '#321615',
          950: '#1e1011',
        },
        orange: {
          50: '#fcf1e8',
          100: '#f9e3d2',
          200: '#f4c7a6',
          300: '#efab7a',
          400: '#ea8f4e',
          500: '#e57322',
          600: '#ba5f1e',
          700: '#8f4b1b',
          800: '#653818',
          900: '#3a2415',
          950: '#251a13',
        },
        yellow: {
          50: '#fefae1',
          100: '#fcf3bb',
          200: '#f9e994',
          300: '#f7d455',
          400: '#f9bc15',
          500: '#d28a04',
          600: '#965908',
          700: '#653a0b',
          800: '#3b220c',
          900: '#271a11',
          950: '#181410',
        },
        green: {
          50: '#e7f9ed',
          100: '#d0f4dc',
          200: '#a1eaba',
          300: '#72e097',
          400: '#43d675',
          500: '#3ab564',
          600: '#329454',
          700: '#297343',
          800: '#215233',
          900: '#183122',
          950: '#14211a',
        },
      },
      fontFamily: {
        sans: ['var(--font-monument)'],
        mono: ['var(--font-ibm-plex-mono)'],
      },
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [
    typography,
    function ({ addUtilities }: any) {
      addUtilities({
        '.no-scrollbar': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
      })
    },
  ],
} satisfies Config
