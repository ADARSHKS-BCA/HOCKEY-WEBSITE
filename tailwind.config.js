/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#00d4ff', // Electric Blue
          secondary: '#ff2d55', // Neon Pink / Red
          accent: '#ffd60a', // Bright Yellow
          green: '#34d399', 
          // Light Mode Colors
          light: '#f8fafc',
          cardLight: '#ffffff',
          textLight: '#1e293b',
          glassLight: 'rgba(255,255,255,0.7)',
          // Dark Mode Colors
          dark: '#0a1628',
          cardDark: '#0f1f3a',
          textDark: '#ffffff',
          glassDark: 'rgba(255,255,255,0.05)',
        }
      },
      fontFamily: {
        heading: ['Outfit', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      transitionTimingFunction: {
        'apple-fluid': 'cubic-bezier(0.25, 1, 0.5, 1)',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s cubic-bezier(0.25, 1, 0.5, 1) forwards',
        'fade-in': 'fadeIn 0.5s cubic-bezier(0.25, 1, 0.5, 1) forwards',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(0,212,255,0.2)' },
          '50%': { boxShadow: '0 0 30px rgba(0,212,255,0.4)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [],
}
