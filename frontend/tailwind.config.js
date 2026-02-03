/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        // Brand Palette
        brand: {
          black: '#050a1b', // Updated Background per user request
          blue: '#2B6CB0',  // Primary Blue
          orange: '#ED8936', // Accent Orange
          teal: '#81E6D9',   // Soft Teal (Keeping definition, but replacing usage)
          cyan: '#0BC5EA',   // Cyan (SMP tag)
        },
        obsidian: '#050a1b', // Mapping old name to new background
        'deep-slate': '#1A202C', // Slightly lighter for cards
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-gradient': 'linear-gradient(to bottom, rgba(10, 10, 12, 0.3), rgba(10, 10, 12, 1))',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
