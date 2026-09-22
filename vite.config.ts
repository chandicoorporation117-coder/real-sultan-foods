import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// `base` lets the built site live under a GitHub Pages project path
// (e.g. https://user.github.io/real-sultan-foods/). Set BASE_PATH in CI.
export default defineConfig({
  base: process.env.BASE_PATH ?? '/',
  plugins: [react(), tailwindcss()],
  build: { outDir: 'dist', assetsDir: 'assets', sourcemap: false },
});
