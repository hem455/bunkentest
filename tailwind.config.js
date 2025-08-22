/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  safelist: [
    'bg-amber-100', 'text-amber-700', 'ring-amber-200',
    'bg-violet-100', 'text-violet-700', 'ring-violet-200', 
    'bg-rose-100', 'text-rose-700', 'ring-rose-200',
    'bg-slate-100', 'text-slate-700', 'ring-slate-200',
    'bg-sky-100', 'text-sky-700', 'ring-sky-200',
    'bg-violet-600', 'hover:bg-violet-500',
    'bg-emerald-600', 'hover:bg-emerald-500',
    'shadow-slate-200/40', 'ring-slate-200',
    'leading-6', 'leading-5', 'tracking-tight'
  ],
  plugins: [],
}