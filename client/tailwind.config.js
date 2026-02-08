/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: '#005F02', // Deep Green (Primary Text/Buttons)
        moss: '#427A43',   // Medium Green (Accents/Hover)
        sand: '#C0B87A',   // Gold/Khaki (Borders/Cards)
        cream: '#F2E3BB',  // Beige (Main Background)
      },
      fontFamily: {
        // Optional: Adds a cool vibe if you import a Google Font later
        sans: ['Inter', 'sans-serif'], 
      }
    },
  },
  plugins: [],
}