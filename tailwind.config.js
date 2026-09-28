/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: { DEFAULT: '#d4a857', light: '#e8c178' },
        orange: { DEFAULT: '#e8915a' },
        cream: '#f0e0d0',
        graphite: {
          DEFAULT: '#1a1520',
          light: '#221c2a',
          tertiary: '#2a2235',
        },
        'dark-burgundy': '#3a1520',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-gold': 'linear-gradient(135deg, #d4a857, #e8915a)',
        'gradient-bg': 'linear-gradient(180deg, #1a1520 0%, #221c2a 50%, #1a1520 100%)',
        'gradient-bg-light': 'linear-gradient(180deg, #faf6f0 0%, #f3ede4 50%, #faf6f0 100%)',
      },
      boxShadow: {
        'soft': '0 4px 24px rgba(0,0,0,0.3)',
        'glow': '0 0 40px rgba(212,168,87,0.15)',
        'glow-strong': '0 0 60px rgba(212,168,87,0.3)',
        'card': '0 8px 32px rgba(0,0,0,0.4)',
      },
      animation: {
        'pulse-ring': 'pulse-ring 2s infinite',
        'gradient-shift': 'gradient-shift 4s ease infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        'pulse-ring': {
          '0%': { transform: 'scale(1)', opacity: '0.5' },
          '100%': { transform: 'scale(1.3)', opacity: '0' },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}
