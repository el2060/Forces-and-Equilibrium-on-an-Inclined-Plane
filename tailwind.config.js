/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: {
          blue: '#007AFF',
          'blue-dark': '#005fa3',
          green: '#21AD93',
          red: '#FF6E6C',
          yellow: '#FFDE00',
        },
        neutral: {
          bg: '#F4EFEA',
          text: '#383838',
        }
      },
      fontFamily: {
        mono: ['IBM Plex Mono', 'Menlo', 'Consolas', 'Liberation Mono', 'monospace'],
      },
      boxShadow: {
        card: '0 4px 16px rgba(44,51,91,0.07)',
      },
      borderRadius: {
        '2xl': '16px',
      },
      animation: {
        'pulse-spotlight': 'pulse-spotlight 1.5s infinite',
      },
      keyframes: {
        'pulse-spotlight': {
          '0%': {
            boxShadow: '0 0 0 0 rgba(0, 122, 255, 0.4)',
          },
          '70%': {
            boxShadow: '0 0 0 10px rgba(0, 122, 255, 0)',
          },
          '100%': {
            boxShadow: '0 0 0 0 rgba(0, 122, 255, 0)',
          },
        },
      },
    },
  },
  plugins: [],
}
