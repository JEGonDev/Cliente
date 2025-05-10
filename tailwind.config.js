/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      xs: "375px",  // Nuevo breakpoint para pantallas pequeñas
      sm: "640px",  // @media (min-width: 640px)
      md: "768px",  // @media (min-width: 768px)
      lg: "1024px", // @media (min-width: 1024px)
      xl: "1280px", // @media (min-width: 1280px)
      "2xl": "1536px" // @media (min-width: 1536px)
    },
    extend: {
      colors: {
        primary: "#23582a",
        secondary: "#82bd69",
        header: "#76CE10",
        textFont: "#021603",
        neutral: {
          light: "#F5F5F5",
          dark: "#212121",
        },
        accent: "#E53935",
        blue: "#1fb6ff",
        purple: "#7e5bef",
        pink: "#ff49db",
        orange: "#ff7849",
        green: "#13ce66",
        yellow: "#ffc82c",
        gray: {
          dark: "#273444",
          DEFAULT: "#8492a6",
          light: "#d3dce6",
        },
      },
    },
  },
  plugins: [],
}


