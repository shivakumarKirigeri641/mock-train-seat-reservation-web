/**
 * Centralized API Service with Error Handling and Interceptors
 * Provides axios instance with automatic error handling, retry logic, and request/response interceptors
 */

import axios from "axios";
import { parseError, isAuthError } from "./errorHandler";

// Create custom axios instance
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
  timeout: 10000,
  withCredentials: true,
});

// Track failed requests for retry
let failedQueue = [];
let isRefreshing = false;

// Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Log outgoing requests in development
    if (process.env.NODE_ENV === "development") {
      console.log(`API Request: ${config.method.toUpperCase()} ${config.url}`);
    }

    // Add timestamp to prevent caching
    if (config.method === "get" && !config.params) {
      config.params = {};
    }
    if (config.method === "get" && config.params) {
      config.params._t = new Date().getTime();
    }

    return config;
  },
  (error) => {
    console.error("Request config error:", error);
    return Promise.reject(error);
  }
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => {
    // Log successful responses in development
    if (process.env.NODE_ENV === "development") {
      console.log(
        `API Response: ${response.status} ${response.config.method.toUpperCase()} ${response.config.url}`
      );
    }

    // Check for API-level errors in response data
    if (response.data && response.data.successstatus === false) {
      const error = new Error(
        response.data.message || "API returned an error"
      );
      error.response = response;
      return Promise.reject(error);
    }

    return response;
  },
  (error) => {
    const originalRequest = error.config;

    // Handle 401 errors (Unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (!isRefreshing) {
        isRefreshing = true;
        originalRequest._retry = true;

        // Could add token refresh logic here if needed
        // For now, just reject and let components handle redirect to login

        isRefreshing = false;
        processQueue(null, error);

        // Dispatch event for app to handle 401
        window.dispatchEvent(
          new CustomEvent("unauthorized", { detail: error })
        );
      }

      return Promise.reject(error);
    }

    // Log errors in development
    if (process.env.NODE_ENV === "development") {
      const parsedError = parseError(error);
      console.error("API Error:", parsedError);
    }

    return Promise.reject(error);
  }
);

/**
 * Process queued requests
 */
function processQueue(token, error) {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });

  failedQueue = [];
}

/**
 * Make a GET request with error handling
 */
export const apiGet = async (url, config = {}) => {
  try {
    const response = await apiClient.get(url, config);
    return response;
  } catch (error) {
    const parsedError = parseError(error);
    console.error(`GET ${url}:`, parsedError);
    throw parsedError;
  }
};

/**
 * Make a POST request with error handling
 */
export const apiPost = async (url, data, config = {}) => {
  try {
    const response = await apiClient.post(url, data, config);
    return response;
  } catch (error) {
    const parsedError = parseError(error);
    console.error(`POST ${url}:`, parsedError);
    throw parsedError;
  }
};

/**
 * Make a PUT request with error handling
 */
export const apiPut = async (url, data, config = {}) => {
  try {
    const response = await apiClient.put(url, data, config);
    return response;
  } catch (error) {
    const parsedError = parseError(error);
    console.error(`PUT ${url}:`, parsedError);
    throw parsedError;
  }
};

/**
 * Make a DELETE request with error handling
 */
export const apiDelete = async (url, config = {}) => {
  try {
    const response = await apiClient.delete(url, config);
    return response;
  } catch (error) {
    const parsedError = parseError(error);
    console.error(`DELETE ${url}:`, parsedError);
    throw parsedError;
  }
};

/**
 * Get raw axios instance for advanced usage
 */
export const getAxiosInstance = () => apiClient;

export default apiClient;
