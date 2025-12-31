// API Configuration
const getApiBaseUrl = () => {
  // In development, use localhost
  if (import.meta.env.DEV) {
    return 'http://localhost:8000';
  }
  // In production, use the API domain
  return import.meta.env.VITE_API_BASE_URL || 'https://api.peacefulhaven.lol';
};

export const config = {
  apiBaseUrl: getApiBaseUrl(),
};
