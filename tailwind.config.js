/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'mielon': {
          gold: '#D4AF37',
          brown: '#5D4037',
          cream: '#FAFAFA',
          charcoal: '#2D2D2D',
        }
      }
    },
  },
  plugins: [],
}

