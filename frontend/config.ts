// frontend/config.ts

// Vite provides a built-in environment variable `import.meta.env.DEV`
// which is true when running 'npm run dev' and false during 'npm run build'.
const isDevelopment = import.meta.env.DEV;

// The base URL for the FastAPI API.
// In development, we use '/api', which Vite will intercept and proxy to http://127.0.0.1:8000.
// In production, we use the public URL, which Nginx will route.
const API_BASE_URL = isDevelopment ? '/api' : 'https://api.peacefulhaven.lol';


export const config = {
  // Your public-facing frontend URL (used by the backend for CORS/OAuth)
  frontendUrl: isDevelopment ? 'http://localhost:5173' : 'https://peacefulhaven.lol',
  
  // The API Base URL used by axios
  apiBaseUrl: API_BASE_URL,
};
