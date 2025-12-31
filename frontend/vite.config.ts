import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import * as path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // Alias @ to the src directory
    },
  },
  server: {
    // Configure the proxy to forward /api requests to the FastAPI backend
    
  },
})
