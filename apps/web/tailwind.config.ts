import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/**/*.{ts,tsx,js,jsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '1rem',
      screens: {
        '2xl': '1280px',
      },
    },
    extend: {
      colors: {
        ivory: {
          50: '#fdfaf5',
          100: '#faf3e8',
          200: '#f5e6cf',
          300: '#ecd3a8',
          400: '#dfb678',
          500: '#cd9651',
        },
        gold: {
          50: '#fbf6e6',
          100: '#f5e9b9',
          200: '#ecd577',
          300: '#dabb3d',
          400: '#c19f23',
          500: '#a07f17',
          600: '#7d6210',
          700: '#5d480c',
        },
        emerald_deep: {
          50: '#eaf3ef',
          100: '#c6e0d3',
          200: '#94c1ad',
          300: '#5f9d83',
          400: '#3a7a62',
          500: '#1f5947',
          600: '#164538',
          700: '#0f3528',
          800: '#0a261d',
        },
        terracotta: {
          50: '#fbeee7',
          100: '#f3d3bf',
          200: '#e5a786',
          300: '#d27a52',
          400: '#bd562f',
          500: '#9a4221',
          600: '#7a341a',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gold-gradient':
          'linear-gradient(135deg, #c19f23 0%, #dabb3d 50%, #f5e9b9 100%)',
        'emerald-radial':
          'radial-gradient(ellipse at top, #164538 0%, #0a261d 100%)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s ease-out forwards',
        shimmer: 'shimmer 8s linear infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
