const { defineConfig } = require('vite')
const react = require('@vitejs/plugin-react')

module.exports = defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'app-dist',
    emptyOutDir: true,
  },
})
