/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        summit: {
          primary: '#1a6b3c',
          secondary: '#2d9d5f',
          dark: '#0f3d22',
          light: '#e8f5ee',
        }
      }
    },
  },
  plugins: [],
}