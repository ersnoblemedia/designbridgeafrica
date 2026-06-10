/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          350: '#b0bcce',
          605: '#4b556b',
          650: '#334155',
          805: '#1e293b',
          905: '#0f172a',
        },
      },
      fontSize: {
        'xs': ['0.8125rem', { lineHeight: '1.25rem' }],   // ~13px (was 12px)
        'sm': ['0.9375rem', { lineHeight: '1.4375rem' }], // ~15px (was 14px)
        'base': ['1.0625rem', { lineHeight: '1.625rem' }], // ~17px (was 16px)
        'lg': ['1.1875rem', { lineHeight: '1.8125rem' }], // ~19px (was 18px)
        'xl': ['1.3125rem', { lineHeight: '1.9375rem' }], // ~21px (was 20px)
        '2xl': ['1.625rem', { lineHeight: '2.125rem' }],  // ~26px (was 24px)
        '3xl': ['2rem', { lineHeight: '2.375rem' }],      // ~32px (was 30px)
        '4xl': ['2.5rem', { lineHeight: '2.875rem' }],     // ~40px (was 36px)
        '5xl': ['3.25rem', { lineHeight: '1' }],          // ~52px (was 48px)
      },
    },
  },
  plugins: [],
}
