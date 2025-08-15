/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{astro,html,js,ts,vue}"
  ],
   theme: {
    extend: {
      fontFamily: {
        yuji: ['"Yuji Syuku"', 'serif'],
      },
    },
  },
  plugins: [],
};
