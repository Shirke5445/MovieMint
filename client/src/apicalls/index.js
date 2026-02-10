import axios from "axios";

// Determine base URL based on environment
const getBaseURL = () => {
  // If we're in production and served by Express, use relative URL
  if (window.location.hostname.includes('moviemint-e1ia.onrender.com')) {
    return '/api';
  }
  // For local development
  return 'http://localhost:5000/api';
};

export const axiosInstance = axios.create({
  baseURL: getBaseURL(),
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor - attach token automatically
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message
    });
    
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    
    return Promise.reject(error);
  }
);