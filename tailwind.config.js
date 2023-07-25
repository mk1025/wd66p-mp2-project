/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./pages/**/*.{html,js,ts}",
    "./scripts/**/*.{js,ts}",
    "./node_modules/flowbite/**/*.js",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("tailwind-scrollbar"), require("flowbite/plugin")],
};
