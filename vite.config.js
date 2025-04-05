import { defineConfig } from 'vite';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

export default defineConfig({
  root: './',
  publicDir: 'public',
  define: {
    // Enable VITE_ env variables
    __VITE_ENV__: JSON.stringify(process.env)
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    rollupOptions: {
      external: ['jquery'],
      output: {
        globals: {
          jquery: '$'
        }
      }
    },
    sourcemap: true,
  },
  css: {
    postcss: {
      plugins: [
        tailwindcss,
        autoprefixer,
      ],
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});