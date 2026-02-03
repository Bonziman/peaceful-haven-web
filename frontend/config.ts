// frontend/config.ts

const isDevelopment = import.meta.env.DEV; 

export const config = {
  // Use the exact address you use to access the backend successfully on your laptop.
  apiBaseUrl: isDevelopment ? 'http://localhost:8000' : 'https://api.peacefulhaven.lol',
  frontendUrl: isDevelopment ? 'http://localhost:5173' : 'https://web.peacefulhaven.lol',
};
