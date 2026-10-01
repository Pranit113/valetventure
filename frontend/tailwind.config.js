/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'media',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#C4622D',
          light: '#E8845A',
          dark: '#9E4A1E',
        },
        accent: '#D4A853',
        bg: {
          DEFAULT: '#FAF7F2',
          dark: '#1A1612',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          2: '#F2EDE6',
          dark: '#2A2320',
          '2-dark': '#332D29',
        },
        text: {
          DEFAULT: '#1A1612',
          muted: '#6B5E54',
          dark: '#FAF7F2',
          'muted-dark': '#A89B92',
        },
        border: {
          DEFAULT: '#E8DDD4',
          dark: '#3D3530',
        },
        success: '#4CAF50',
        error: '#E53935',
        warning: '#FF9800',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
      },
      spacing: {
        '4': '4px',
        '8': '8px',
        '12': '12px',
        '16': '16px',
        '20': '20px',
        '24': '24px',
        '32': '32px',
        '40': '40px',
        '48': '48px',
        '64': '64px',
        '80': '80px',
      }
    },
  },
  plugins: [],
}
