/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./App.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        scout: {
          DEFAULT: "#00D4FF",
          dark: "#00A3CC",
          bg: "#111111",
        },
      },
    },
  },
  plugins: [],
};
