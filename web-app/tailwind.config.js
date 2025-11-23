/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'mambu-green': '#4FB645',
                'mambu-dark': '#212121',
            }
        },
    },
    plugins: [],
}
