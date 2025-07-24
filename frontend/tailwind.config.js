/** @type {import('tailwindcss').Config} */




module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      fontFamily:{
        company:['League Spartan' , 'sans-serif']
      },
      colors:{
        brand:{
        'cream': "#fffceb"
      }
      }
    },
  },
  plugins: [],
}

