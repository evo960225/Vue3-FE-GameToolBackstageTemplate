const colors = require('tailwindcss/colors')

module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'orange': colors.orange,
        'teal': colors.teal,
        'bgray': colors.slate,
        'fa': '#fafafa'

      },
      screens: {
        'xs': {'max': '575px'},
        'sm': {'max': '767px'},
        'md': {'max': '1023px'},
        'lg': {'max': '1279px'},
        'xl': {'max': '1535px'},
        '2xl': {'min': '1536px'},
        'pc': {'min': '1023px'},
        'tab': {'min': '576px','max': '1023px'},
        'ph':{'max': '575px'}
      },
      height: {
        '1/4': '25%',
        '1/2': '50%',
        '3/4': '75%',
        'full': '100%',
        '80vh': '80vh',
      },
      minWidth: {
        '25vw': '25vw',
        '30vw': '30vw',
        '250': '250px',
        '300': '300px',
      },
      minHeight: {
        '70vh': '70vh',
      },
      maxHeight: {
        '1/4': '25%',
        '1/2': '50%',
        '3/4': '75%',
        'full': '100%',
        '80vh': '80vh',
      },
      letterSpacing:{
        '010' : '.1rem',
        '020' : '.2rem',
        '030' : '.3rem',
        '050' : '.5rem',
        '070' : '.7rem',
        '090' : '.9rem',
        '120' : '1.2rem',
        '150' : '1.5rem',
        '180' : '1.8rem',
      },
      grayscale: {
        50: '50%',
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
      },
      brightness: {
        '90': '.90',
        '95': '.95'
      },
      opacity: {
        '85': '.85',
        '95': '.95',
      },
      maxWidth: {
        'xxs': '10rem'
      },
      width: {
        '1/7': '14.2857143%',
        '2/7': '28.5714286%',
        '3/7': '42.8571429%',
        '4/7': '57.1428571%',
        '5/7': '71.4285714%',
        '6/7': '85.7142857%',
      },
      boxShadow: {
        'el': '0px 2px 12px 0px rgba(0, 0, 0, 0.1)',
        '3xl': '0 35px 60px -15px rgba(0, 0, 0, 0.3)',
      },
      fontSize: {
        '1.5xl': ['1.375rem', '1.5rem']
      }
    },
  },
  variants: {
    extend: {
      fontWeight: ['hover'],
      filter: ['hover', 'group-hover'],
      brightness: ['hover', 'group-hover'],
      dropShadow: ['hover', 'group-hover'],
      animation: ['hover', 'group-hover'],
    }
  },
  plugins: []
}
