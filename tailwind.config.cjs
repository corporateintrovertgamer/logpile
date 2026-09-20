module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0c0d10',
        panel: '#14161b',
        panel2: '#1b1e25',
        line: '#2b303a',
        muted: '#8a919e',
        accent: '#d6ff4b',
        violet: '#9c7bff',
      },
      boxShadow: {
        soft: '0 14px 40px rgba(0, 0, 0, 0.26)',
      },
    },
  },
  plugins: [],
}
