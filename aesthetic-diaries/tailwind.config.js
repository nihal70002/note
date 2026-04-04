/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: '#FFFDD0',
        paper: '#08140f', // Deep magical forest dark background
        ink: '#fff4d2',   // Glowing pale yellow text
        taupe: '#8caf82', // Sage green accents
        rose: '#e09f9c',  // Dusty pink flowers
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['"Playfair Display"', 'serif'],
      }
    },
  },
  plugins: [],
}
