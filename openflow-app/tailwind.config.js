/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'bg-app': 'var(--bg-app)',
                'bg-sidebar': 'var(--bg-sidebar)',
                'bg-card': 'var(--bg-card)',
                'bg-card-hover': 'var(--bg-card-hover)',
                primary: 'var(--primary)',
                'primary-hover': 'var(--primary-hover)',
                secondary: 'var(--secondary)',
                muted: 'var(--text-muted)',
                'accent-green': 'var(--accent-green)',
                'accent-orange': 'var(--accent-orange)',
                'accent-red': 'var(--accent-red)',
                'border-light': 'var(--border-light)',
                'border-subtle': 'var(--border-subtle)',
                'text-primary': 'var(--text-primary)',
                'text-secondary': 'var(--text-secondary)',
            },
            fontFamily: {
                arabic: ['var(--font-arabic)'],
                english: ['var(--font-english)']
            }
        },
    },
    plugins: [],
}
