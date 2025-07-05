/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
        "./public/index.html"
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Tajawal', 'sans-serif'],
            },
            colors: {
                dark: {
                    'bg': '#1a202c',
                    'card': '#2d3748',
                    'text': '#e2e8f0',
                    'text-secondary': '#a0aec0',
                },
                'teal': {
                    '50': '#f0fdfa',
                    '100': '#ccfbf1',
                    '200': '#99f6e4',
                    '300': '#5eead4',
                    '400': '#2dd4bf',
                    '500': '#14b8a6',
                    '600': '#0d9488',
                    '700': '#0f766e',
                    '800': '#115e59',
                    '900': '#134e4a',
                    '950': '#042f2e',
                },
            },
            // --- Menambahkan definisi animasi ---
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(100%)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                'pulse-bg': {
                    '0%, 100%': { backgroundColor: '#e2e8f0' },
                    '50%': { backgroundColor: '#cbd5e1' },
                },
                shake: {
                    '10%, 90%': { transform: 'translate3d(-1px, 0, 0)' },
                    '20%, 80%': { transform: 'translate3d(2px, 0, 0)' },
                    '30%, 50%, 70%': { transform: 'translate3d(-4px, 0, 0)' },
                    '40%, 60%': { transform: 'translate3d(4px, 0, 0)' },
                }
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out forwards',
                'slide-up': 'slideUp 0.3s ease-out forwards',
                'pulse-bg': 'pulse-bg 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'shake': 'shake 0.82s cubic-bezier(.36,.07,.19,.97) both',
            }
        },
    },
    plugins: [],
}
