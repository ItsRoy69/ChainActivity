/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'selector',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Lato', '"PingFang SC"', '"Microsoft YaHei"', 'Helvetica', 'Arial', 'sans-serif'],
      },
      colors: {
        glass: "rgba(255, 255, 255, 0.05)",
        glassBorder: "rgba(255, 255, 255, 0.1)",
        brand: {
          orange: "#5CE65C",
          dark: "#1A1A1A",
        }
      }
    }
  },
  plugins: [],
}
