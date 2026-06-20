import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    // Three.js is code-split into its own deferred chunk (loaded after paint),
    // so a slightly higher per-chunk warning threshold is expected and safe.
    chunkSizeWarningLimit: 1000,
  },
})
