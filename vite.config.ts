import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 3000,
    open: true,
    proxy: {
      // ── FastAPI (Python backend — PCAP traffic analysis) ──────────────────────
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
      },
      // ── GNS3 REST API ─────────────────────────────────────────────────────────
      // All /gns3/... requests are rewritten to /v2/... and proxied to GNS3
      '/gns3': {
        target: 'http://localhost:3080',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/gns3/, '/v2'),
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
})
