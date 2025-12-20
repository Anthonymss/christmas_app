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
        christmas: {
          red: '#C41E3A', // Cardinal Red
          green: '#165B33', // Deep Christmas Green
          gold: '#D4AF37', // Metallic Gold
          cream: '#F8F5E6', // Warm Cream
          dark: '#020617', // Rich Black/Green
        }
      },
      fontFamily: {
        christmas: ['"Cinzel"', 'serif'], // Premium Serif
        sans: ['"Raleway"', 'sans-serif'] // Elegant Sans
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'snow': 'snow 10s linear infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        snow: {
          '0%': { transform: 'translateY(-10px)' },
          '100%': { transform: 'translateY(100vh)' }
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' }
        }
      }
    },
  },
  plugins: [],
}
