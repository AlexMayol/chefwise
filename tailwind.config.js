const { hairlineWidth } = require('nativewind/theme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      borderWidth: {
        hairline: hairlineWidth(),
      },
      // Colors live in global.css `@theme` (Tailwind v4 CSS-first config).
    },
  },
  plugins: [require('tailwindcss-animate')],
};
