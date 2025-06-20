/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      xs: "375px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px"
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
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        chonburi: ['Chonburi'],
      },
      gridAutoRows: {
        'fr': 'minmax(0, 1fr)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out forwards',
      },
    },
  },
  plugins: [
    // Si necesitas truncar títulos con line-clamp, descomenta:
    // require('@tailwindcss/line-clamp'),
  ],
}
