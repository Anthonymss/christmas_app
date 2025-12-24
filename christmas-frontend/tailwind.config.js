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
          holly: '#EF4444', // Bright Holly Red
          green: '#165B33', // Deep Christmas Green
          gold: '#D4AF37', // Metallic Gold
          cream: '#F8F5E6', // Warm Cream
          silver: '#E5E7EB', // Cool Silver
          dark: '#020617', // Rich Black/Green
          night: '#0B1026', // Deep Winter Night
        }
      },
      fontFamily: {
        christmas: ['"Cinzel"', 'serif'],
        sans: ['"Outfit"', '"Raleway"', 'sans-serif'] // Prioritize Outfit as per index.css
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'snow': 'snow 10s linear infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'pop-in': 'popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
        'gradient-xy': 'gradientXY 15s ease infinite',
        'breathe': 'breathe 3s ease-in-out infinite',
        'twinkle': 'twinkle 2s ease-in-out infinite',
        'glow': 'glowV2 2s ease-in-out infinite',
        'sparkle': 'sparkle 0.8s cubic-bezier(0, 0, 0.2, 1) forwards',
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
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        popIn: {
          '0%': { opacity: '0', transform: 'scale(0.5)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        gradientXY: {
          '0%, 100%': {
            'background-size': '400% 400%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        },
        breathe: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
        twinkle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
        glowV2: {
          '0%, 100%': { boxShadow: '0 0 5px currentColor' },
          '50%': { boxShadow: '0 0 20px currentColor, 0 0 10px currentColor' },
        },
        sparkle: {
          '0%': { transform: 'scale(0) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'scale(1.5) rotate(180deg)', opacity: '0' },
        }
      }
    },
  },
  plugins: [],
}
