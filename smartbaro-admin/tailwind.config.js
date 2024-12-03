const colors = require('tailwindcss/colors');

module.exports = {
    mode: 'jit',
    darkMode: 'class',
    content: ['./pages/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}', './public/**/*.html', './node_modules/react-tailwindcss-datepicker/dist/index.esm.js'],
    theme: {
        extend: {
            width: {
                1200: '1200px',
            },
            colors: {
                transparent: 'transparent',
                current: 'currentColor',
                black: colors.black,
                white: colors.white,
                gray: colors.slate,
                green: colors.emerald,
                purple: colors.violet,
                yellow: colors.amber,
                pink: colors.fuchsia,
                point: '#0095a0',
                second: '#005a98',
            },
        },
    },
};
