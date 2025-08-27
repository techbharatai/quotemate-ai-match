// Environment configuration
type Environment = 'local' | 'ngrok' | 'production';

// Set this to switch between environments
const CURRENT_ENV = 'production' as const;

const API_URLS: Record<Environment, string> = {
  local: 'http://localhost:8000',
  ngrok: '', // Replace with your ngrok URL
  production: 'https://migrate-all-in-one.onrender.com'
};

// Helper function to get API base URL
export const getApiBaseUrl = (): string => {
  // In development, respect the CURRENT_ENV settin
  if (!import.meta.env.PROD) {
    return API_URLS[CURRENT_ENV];
  }
  // In production, always use production URL
  return API_URLS.production;
};

// Export the base URL
export const API_BASE_URL = getApiBaseUrl();

// Helper function to get request headers
export const getRequestHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    'Expires': '0',
  };

  // Add headers based on the current environment
  const currentEnvironment = CURRENT_ENV as Environment;
  
  if (currentEnvironment === 'ngrok') {
    headers['ngrok-skip-browser-warning'] = 'true';
  }

  if (currentEnvironment === 'local') {
    headers['Access-Control-Allow-Credentials'] = 'true';
  }

  return headers;
};

// Type guard for Environment type
const isEnvironment = (value: string): value is Environment => {
  return ['local', 'ngrok', 'production'].includes(value);
};

// Get current environment with type safety
export const getCurrentEnv = (): Environment => {
  const env = import.meta.env.VITE_APP_ENV || CURRENT_ENV;
  return env as Environment;
};

// Export the current environment for type checking
export const CURRENT_ENVIRONMENT = CURRENT_ENV as Environment;

// export const FRONTEND_DOMAIN_URL=""
export const ALLOWED_ORIGINS = [
  'http://localhost:5173',  // Vite default dev server
  'http://127.0.0.1:5173',  // Vite alternative
  'http://localhost:3000',  // Common React dev server
  'http://127.0.0.1:3000',  // Common React alternative
  'http://localhost:8080',  // Other common ports
  'http://127.0.0.1:8080',
  getApiBaseUrl()
].filter(Boolean); // Remove any empty strings
