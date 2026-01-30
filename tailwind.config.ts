import type { Config } from "tailwindcss";

export default {
  // content: ["./src/**/*.{html,js}"],
  darkMode: "class",
  theme: {
    fontFamily: {
      sans: ["Inter"],
      serif: ["serif"],
      mono: ["monospace"],
      display: ["Inter"],
      body: ["Inter"],
    },
    extend: {
      colors: {
        // ChefWise custom color tokens based on landing page design
        primary: {
          50: "#ecfdf5", // emerald-50
          100: "#d1fae5", // emerald-100
          200: "#a7f3d0", // emerald-200
          300: "#6ee7b7", // emerald-300
          400: "#34d399", // emerald-400
          500: "#10b981", // emerald-500
          600: "#059669", // emerald-600
          700: "#047857", // emerald-700
          800: "#065f46", // emerald-800
          900: "#064e3b", // emerald-900
          950: "#022c22", // emerald-950
        },
        secondary: {
          50: "#f0fdfa", // teal-50
          100: "#ccfbf1", // teal-100
          200: "#99f6e4", // teal-200
          300: "#5eead4", // teal-300
          400: "#2dd4bf", // teal-400
          500: "#14b8a6", // teal-500
          600: "#0d9488", // teal-600
          700: "#0f766e", // teal-700
          800: "#115e59", // teal-800
          900: "#134e4a", // teal-900
          950: "#042f2e", // teal-950
        },
        accent: {
          50: "#ecfeff", // cyan-50
          100: "#cffafe", // cyan-100
          200: "#a5f3fc", // cyan-200
          300: "#67e8f9", // cyan-300
          400: "#22d3ee", // cyan-400
          500: "#06b6d4", // cyan-500
          600: "#0891b2", // cyan-600
          700: "#0e7490", // cyan-700
          800: "#155e75", // cyan-800
          900: "#164e63", // cyan-900
          950: "#083344", // cyan-950
        },
      },
      spacing: {
        "8xl": "96rem",
        "9xl": "128rem",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
        "6xl": "3rem",
      },
    },
  },
  content: [
    `./app/components/**/*.{vue,js,ts}`,
    `./app/layouts/**/*.vue`,
    `./app/pages/**/*.vue`,
    `./app/composables/**/*.{js,ts}`,
    `./app/plugins/**/*.{js,ts}`,
    `./app/utils/**/*.{js,ts}`,
    `./app/app.{js,ts,vue}`,
    `./app/error.{js,ts,vue}`,
  ],
} satisfies Config;
