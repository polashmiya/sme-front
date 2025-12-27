/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#8C57FF',
          foreground: '#ffffff',
        },
        muted: {
          DEFAULT: '#f3f4f6',
          foreground: '#6b7280',
        },
        sidebar: '#0f172a',
        header: '#111827',
      },
      spacing: {
        'header': '56px',
        'sidebar': '260px',
      },
      borderRadius: {
        lg: '12px',
      },
    },
  },
  plugins: [],
}
