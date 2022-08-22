module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx,css,md,mdx,html,json,scss}'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      18: '4.5rem',
      keyframes: {
        spin: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(-360deg)' }
        }
      }
    }
  },
  plugins: []
};
