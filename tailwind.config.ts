import type { Config } from 'tailwindcss'
import forms from '@tailwindcss/forms'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        sidebar: {
          bg: '#0f1f3d', hover: '#162d54', active: '#1e3f72', border: '#1a2e50',
          text: '#8ba4c8', 'text-active': '#ffffff', 'text-label': '#4a6585',
        },
        primary: {
          50: '#eff6ff', 100: '#dbeafe', 200: '#bfdbfe', 300: '#93c5fd',
          400: '#60a5fa', 500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8',
          800: '#1e40af', 900: '#1e3a8a', DEFAULT: '#2563eb',
        },
        accent: { 400: '#22d3ee', 500: '#06b6d4', 600: '#0891b2', DEFAULT: '#06b6d4' },
        surface: {
          base: '#f3f4f6', card: '#ffffff', border: '#e5e7eb',
          'border-strong': '#d1d5db', muted: '#f9fafb',
        },
        success: { light: '#f0fdf4', DEFAULT: '#16a34a', border: '#bbf7d0', text: '#15803d' },
        warning: { light: '#fffbeb', DEFAULT: '#d97706', border: '#fde68a', text: '#b45309' },
        danger: { light: '#fef2f2', DEFAULT: '#dc2626', border: '#fecaca', text: '#b91c1c' },
        info: { light: '#eff6ff', DEFAULT: '#2563eb', border: '#bfdbfe', text: '#1d4ed8' },
      },
      borderRadius: { sm: '0.25rem', DEFAULT: '0.375rem', lg: '0.5rem', xl: '0.75rem' },
      boxShadow: {
        card: '0 1px 3px 0 rgb(0 0 0 / 0.08), 0 1px 2px -1px rgb(0 0 0 / 0.06)',
        panel: '0 1px 4px 0 rgb(0 0 0 / 0.10)',
        modal: '0 20px 25px -5px rgb(0 0 0 / 0.12), 0 8px 10px -6px rgb(0 0 0 / 0.10)',
      },
      fontFamily: { sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'] },
      animation: {
        'fade-in': 'fadeIn 150ms ease-out',
        skeleton: 'skeleton 1.5s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0', transform: 'translateY(-4px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        skeleton: { '0%, 100%': { opacity: '1' }, '50%': { opacity: '0.5' } },
      },
    },
  },
  plugins: [forms],
} satisfies Config
