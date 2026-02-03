// frontend/config.ts

const isDevelopment = import.meta.env.DEV;

export const config = {
  // Production URL remains the same
  frontendUrl: isDevelopment ? 'http://localhost:5173' : 'https://peacefulhaven.lol',
  
  // Use the VPS IP for the API so the browser can reach it
  apiBaseUrl: isDevelopment ? 'http://141.253.120.119:8000' : 'https://api.peacefulhaven.lol',
};
