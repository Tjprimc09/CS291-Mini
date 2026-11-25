import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/graph-data': 'http://127.0.0.1:5000',
      '/shortest-path': 'http://127.0.0.1:5000',
      '/airports-by-state': 'http://127.0.0.1:5000',
    },
  },
})