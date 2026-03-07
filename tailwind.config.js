/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        custom: {
          bg: '#28370d',
          text: '#89c201',
          border: '#2a3e0d',
          accent: '#c52f17',
          'text-light': '#a5d234',
          'text-dark': '#6a9a0a',
        },
        green: {
          400: '#89c201',
          600: '#6a9a0a',
          800: '#2a3e0d',
          950: '#28370d',
          300: '#a5d234',
        },
      },
      fontFamily: {
        retro: ['Determination', 'Retro Gaming', 'monospace'],
        pixel: ['Minecrafter', 'Retro Gaming', 'monospace'],
      },
    },
  },
  plugins: [],
}

