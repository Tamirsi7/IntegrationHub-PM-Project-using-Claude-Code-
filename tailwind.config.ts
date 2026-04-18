import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#F5F0E8',
        linx: {
          yellow: '#F5C842',
          orange: '#E05C2A',
          purple: '#6B3FA0',
          blue:   '#3B82F6',
          green:  '#22C55E',
          red:    '#EF4444',
          amber:  '#FBBF24',
        },
      },
      boxShadow: {
        'offset':        '2px 2px 0px #0F172A',
        'offset-md':     '4px 4px 0px #0F172A',
        'offset-yellow': '4px 4px 0px #F5C842',
        'offset-orange': '4px 4px 0px #E05C2A',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
      },
      keyframes: {
        'slide-in-right': {
          '0%':   { opacity: '0', transform: 'translateX(12px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'slide-in-up': {
          '0%':   { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%':   { opacity: '0', transform: 'scale(0.85)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'check-draw': {
          '0%':   { strokeDashoffset: '24' },
          '100%': { strokeDashoffset: '0' },
        },
        'toast-in': {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-ring': {
          '0%':   { transform: 'scale(1)',   opacity: '0.5' },
          '100%': { transform: 'scale(1.7)', opacity: '0' },
        },
        'fade-in': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'slide-in-right': 'slide-in-right 0.3s ease-out forwards',
        'slide-in-up':    'slide-in-up 0.35s ease-out forwards',
        'scale-in':       'scale-in 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards',
        'check-draw':     'check-draw 0.4s ease-out forwards',
        'toast-in':       'toast-in 0.25s ease-out forwards',
        'pulse-ring':     'pulse-ring 1.2s ease-out infinite',
        'fade-in':        'fade-in 0.3s ease-out forwards',
      },
    },
  },
  plugins: [],
} satisfies Config
