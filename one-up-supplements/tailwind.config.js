/** @type {import('tailwindcss').Config} */
export default {
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        void: '#070708',
        carbon: '#0C0C0E',
        charcoal: '#141417',
        graphite: '#1C1C21',
        ash: '#26262C',
        steel: '#33333B',
        fog: '#8A8A93',
        mist: '#B5B5BD',
        bone: '#ECECEE',
        volt: {
          DEFAULT: '#C6FF2E',
          50: '#FAFFEB',
          100: '#F1FFC7',
          200: '#E5FF94',
          300: '#D6FF5C',
          400: '#C6FF2E',
          500: '#A6E600',
          600: '#84B800',
          700: '#638A00',
          800: '#445E00',
          900: '#2A3A00',
        },
      },
      fontFamily: {
        display: ['Syne', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        body: ['Manrope', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        tightest: '-0.04em',
        ultrawide: '0.35em',
      },
      maxWidth: {
        container: '1440px',
      },
      boxShadow: {
        volt: '0 0 0 1px rgba(198,255,46,0.4), 0 0 32px -4px rgba(198,255,46,0.35)',
        'volt-lg': '0 0 60px -8px rgba(198,255,46,0.45)',
        lift: '0 24px 60px -20px rgba(0,0,0,0.8)',
      },
      backgroundImage: {
        'radial-volt':
          'radial-gradient(60% 60% at 50% 0%, rgba(198,255,46,0.16) 0%, rgba(7,7,8,0) 70%)',
        'grid-faint':
          'linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)',
      },
      keyframes: {
        'fade-up': {
          '0%': {opacity: '0', transform: 'translateY(24px)'},
          '100%': {opacity: '1', transform: 'translateY(0)'},
        },
        marquee: {
          '0%': {transform: 'translateX(0)'},
          '100%': {transform: 'translateX(-50%)'},
        },
        'pulse-glow': {
          '0%, 100%': {opacity: '0.55'},
          '50%': {opacity: '1'},
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s cubic-bezier(0.16,1,0.3,1) both',
        marquee: 'marquee 28s linear infinite',
        'pulse-glow': 'pulse-glow 2.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
