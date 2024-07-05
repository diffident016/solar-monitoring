/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        lato: ["Lato"],
        "lato-bold": ["Lato-bold"],
        "lato-light": ["Lato-light"],
      },
    },
  },
  plugins: [],
};
