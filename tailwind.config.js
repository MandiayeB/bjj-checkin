/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontSize: {
        'touch': ['1.125rem', { lineHeight: '1.6' }], // ~18px for iPad friendliness
      }
    },
  },
  plugins: [],
}
