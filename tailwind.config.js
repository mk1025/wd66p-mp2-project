/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./index.html",
    "./pages/**/*.{html,js,ts}",
    "./scripts/**/*.{js,ts}",
    "./dist/**/*.js",
    "./node_modules/flowbite/**/*.js",
    "./styles/*.scss",
  ],
  plugins: [require("tailwind-scrollbar"), require("flowbite/plugin")],
};
