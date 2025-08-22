/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Dialin AI inspired color palette
        background: {
          DEFAULT: '#f8fafc',
          dark: '#1e293b',
          card: '#ffffff',
        },
        text: {
          primary: '#1e293b',
          secondary: '#64748b',
          muted: '#94a3b8',
        },
        severity: {
          info: {
            bg: '#dbeafe',
            border: '#3b82f6',
            text: '#1e40af',
          },
          warn: {
            bg: '#fef3c7',
            border: '#f59e0b',
            text: '#92400e',
          },
          error: {
            bg: '#fee2e2',
            border: '#ef4444',
            text: '#dc2626',
          },
        },
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      animation: {
        'fade-in': 'fadeIn 150ms ease-in-out',
        'slide-in': 'slideIn 200ms ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}