const { defineConfig } = require('vite');
const react = require('@vitejs/plugin-react');
const tailwindcss = require('@tailwindcss/postcss7-compat');
const autoprefixer = require('autoprefixer');

module.exports = defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
  css: {
    postcss: {
      plugins: [
        tailwindcss(),
        autoprefixer(),
      ],
    },
  },
});
