/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './src/app/**/*.{js,ts,jsx,tsx}',
      './src/components/**/*.{js,ts,jsx,tsx}',
    ],

    theme: {
      extend: {
        fontFamily: {
          plex: ['var(--font-plex)', 'sans-serif'],
          sans: ['var(--font-plex)', 'sans-serif'],  
        },
      },
    },
    plugins: [],
  };