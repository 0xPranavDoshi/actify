/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#F8F9FA",
        secondary: "#E9ECEF",
        text: "#212529",
        accent: "#9C27B0",
        hover: "#7B1FA2",
        link: "#E040FB",
        accent2: "#0099CC",
        // hover: "#007799",
        // link: "#00CCFF",
      },
    },
  },
  plugins: [],
};
