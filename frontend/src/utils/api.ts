import axios from 'axios';

// Get API URL from global config, fallback to empty string for relative URLs
const API_BASE_URL = typeof window !== 'undefined' && window.APP_CONFIG 
  ? window.APP_CONFIG.API_URL 
  : '';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export default api;
