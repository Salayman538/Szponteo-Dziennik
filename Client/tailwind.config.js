/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./App.tsx", "./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: { 
        poppins: ['Poppins-Regular', 'sans-serif'],
        poppinsBold: ['Poppins-Bold', 'sans-serif'],
        poppinsLight: ['Poppins-Light', 'sans-serif'],
        poppinsMedium: ['Poppins-Medium', 'sans-serif'],
        poppinsSemiBold: ['Poppins-SemiBold', 'sans-serif'], 
      },
      colors: {
        primary: '#265FEF',
        black: '#19191F',
        white: '#FEFEFE',
        light: '#EFEFEF',
        blueGray: '#EEF4FB',
        whiteGray: '#EDEDED',
        lightGray: '#DDDDDD',
        gray: '#A2A2A2',
        darkGray: '#505050',
      }
    },
  },
  plugins: [],
}