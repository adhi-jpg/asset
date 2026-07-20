/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        clinical: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0284c7',
          700: '#0369a1',
          900: '#0c4a6e',
          950: '#082f49'
        },
        slate: {
          850: '#152033',
          950: '#0b1120'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif']
      }
    },
  },
  plugins: [],
}
