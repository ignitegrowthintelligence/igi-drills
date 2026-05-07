/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#070b14',
        surface: '#0d1526',
        'surface-2': '#131f38',
        border: '#1e3054',
        text: '#e2eaf6',
        muted: '#6a87ab',
        accent: '#f59e0b',
        green: '#22c55e',
        red: '#f87171',
        blue: '#4a9eff',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
