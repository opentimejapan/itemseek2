/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui-mobile/src/**/*.{js,ts,jsx,tsx}'
  ],
  presets: [require('../../packages/ui-mobile/tailwind.config.js')],
  theme: {
    extend: {},
  },
  plugins: [],
};