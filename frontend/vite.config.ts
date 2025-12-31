import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // --- Start of Configuration for Backend Proxy ---
  server: {
    // Optional: Sets the host and port for the frontend dev server (default is 5173)
    // host: '0.0.0.0', 
    // port: 5173, 
    
    // Configure a proxy to forward API requests to the FastAPI backend
    proxy: {
      // If the frontend makes a request to /api/..., Vite forwards it to the target
      '/api': {
        // Your FastAPI backend is listening on 127.0.0.1:8000 inside the VPS
        target: 'http://127.0.0.1:8000', 
        changeOrigin: true, // Necessary for virtual hosted sites
        // Rewrite the path: '/api/trades/available' becomes '/trades/available' for FastAPI
        rewrite: (path) => path.replace(/^\/api/, ''), 
      },
    },
  },
  // --- End of Configuration for Backend Proxy ---
})
