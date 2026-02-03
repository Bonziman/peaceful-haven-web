import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import * as path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // Alias @ to the src directory
    },
  },
  server: {
    port: 25565,
    host: '0.0.0.0',
    // Configure the proxy to forward /api requests to the FastAPI backend
    proxy: {
      '/api': {
        // Target is the address/port where your FastAPI application runs inside the VPS
        target: 'http://127.0.0.1:8000', 
        changeOrigin: true, // Needed for proper virtual hosting
        // Rewrite the path: remove the /api prefix before sending to FastAPI
        rewrite: (path) => path.replace(/^\/api/, ''), 
      },
    },
  },
})
