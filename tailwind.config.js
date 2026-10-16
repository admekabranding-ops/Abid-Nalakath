/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#3A160F',
          deep: '#651B0D',
          burnt: '#C63D08',
          orange: '#F4510B',
          gold: '#FF9D00',
          amber: '#FFA500',
          surface: '#F7F6F4',
          text: '#151515',
          muted: '#686868'
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        display: ['"Outfit"', '"Plus Jakarta Sans"', 'sans-serif'],
      },
      boxShadow: {
        'glow-orange': '0 10px 30px -5px rgba(244, 81, 11, 0.45)',
        'glow-soft': '0 8px 25px -4px rgba(255, 157, 0, 0.35)',
        'card-soft': '0 15px 35px -5px rgba(0, 0, 0, 0.06), 0 5px 15px rgba(0, 0, 0, 0.03)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float-slow': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
