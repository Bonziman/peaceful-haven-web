// frontend/config.ts

const isDevelopment = import.meta.env.DEV;

export const config = {
  // Production URL remains the same
  frontendUrl: isDevelopment ? 'http://localhost:5173' : 'https://peacefulhaven.lol',
  
  // *** CRUCIAL FIX ***
  // When inside the Docker container, use the Docker service name 'web'
  apiBaseUrl: isDevelopment ? 'http://localhost:8000' : 'https://api.peacefulhaven.lol',
};
