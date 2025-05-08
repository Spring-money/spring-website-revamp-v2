/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#CAEF7D',
        black: '#1B1F13',
        white: '#FCFFEE',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      transitionDuration: {
        300: '300ms',
      },
      backgroundColor:{
        white:"#FCFFFE"
      },
      backgroundImage:{
        linearGradient1:"linear-gradient(180deg, #EBECFA 0%, #FCFFFE 100%)",
        linearGradient2:"linear-gradient(180deg, #FCFFFE 17.39%, #EBECFA 100%)",
        linearGradient3:"linear-gradient(180deg, #F0FAF7 0%, #FCFFFE 100%)",
        linearGradient4:"linear-gradient(180deg, #FCFFFE -36.42%, #F0FAF7 141.8%)",
        linearGradient5:"linear-gradient(180deg, #FCFFFE 0%, #F0FAF7 100%)",
        // linearGradient6:"linear-gradient(180deg, #F0FAF7 0%, #FCFFFE 100%)",
      }
    },
  },
  plugins: [],
};
