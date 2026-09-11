/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0066A1",
        secondary: "#0086C9",
        background: "#F5F7FA",
        card: "#FFFFFF",
        border: "#D9E2EC",
      },
    },
  },
  plugins: [],
};
