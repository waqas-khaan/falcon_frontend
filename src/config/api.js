// API Configuration with Axios
import axios from "axios";
import Cookies from "js-cookie";

// API Base URL Configuration
// In production (Docker), use relative URLs (empty string) to use same origin
// For local development: use http://localhost:3000
// Set VUE_APP_API_URL in .env file or vue.config.js
const API_BASE_URL =
  process.env.VUE_APP_API_URL ||
  (process.env.NODE_ENV === "production" ? "" : "http://localhost:3000");

// Connection status state
let connectionStatus = {
  isConnected: false,
  serverHealth: "unknown",
  databaseHealth: "unknown",
  lastChecked: null,
};

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important for cookies
});

// Request interceptor to add auth token from cookies
api.interceptors.request.use(
  (config) => {
    // Get token from cookies (preferred) or localStorage (fallback)
    const token = Cookies.get("token") || localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Server responded with error status
      if (error.response.status === 401) {
        // Check if we're already on the login page - if so, don't redirect
        // This prevents page refresh when login credentials are incorrect
        const currentPath = window.location.pathname;
        const isLoginPage = currentPath === "/login" || currentPath.endsWith("/login");
        
        // Only redirect if we're NOT already on the login page
        if (!isLoginPage) {
          // Unauthorized - clear auth and redirect to login
          // Set explicit logout flag to prevent auto-login
          localStorage.setItem("isExplicitlyLoggedOut", "true");
          // Clear cookies
          Cookies.remove("token");
          Cookies.remove("userRole");
          Cookies.remove("user");
          // Clear localStorage
          localStorage.removeItem("token");
          localStorage.removeItem("userRole");
          localStorage.removeItem("user");
          // Clear Vuex store if available
          if (window.$store) {
            window.$store.commit("clearUser");
          }
          window.location.href = "/login";
        }
        // If we're already on login page, let the component handle the error
        // This allows the login form to display the error without refreshing
      }
    } else if (error.request) {
      // Request made but no response received
      console.error("Network error: No response from server");
    } else {
      // Error setting up request
      console.error("Error:", error.message);
    }
    return Promise.reject(error);
  }
);

/**
 * Get the current connection status
 * @returns {Object} Connection status object with isConnected, serverHealth, and databaseHealth
 */
export function getConnectionStatus() {
  return { ...connectionStatus };
}

/**
 * Check server health by calling the /api/health endpoint
 * Updates the connection status state
 * @returns {Promise<Object>} Promise that resolves with the health check result
 */
export async function checkServerHealth() {
  try {
    const response = await api.get("/api/health");

    // Extract database status from response
    const dbStatus = response.data?.database?.status || "unknown";
    const dbConnected = response.data?.database?.connected || false;

    // Update connection status based on response
    connectionStatus = {
      isConnected: response.status === 200 && response.data?.status === "ok",
      serverHealth: response.status === 200 ? "connected" : "disconnected",
      databaseHealth: dbConnected
        ? "connected"
        : dbStatus === "disconnected"
        ? "disconnected"
        : "unknown",
      lastChecked: new Date().toISOString(),
    };

    return {
      success: true,
      status: connectionStatus,
      data: response.data,
    };
  } catch (error) {
    // Update connection status to disconnected
    connectionStatus = {
      isConnected: false,
      serverHealth: "disconnected",
      databaseHealth: "unknown",
      lastChecked: new Date().toISOString(),
    };

    return {
      success: false,
      status: connectionStatus,
      error: error.message || "Failed to connect to server",
    };
  }
}

export default api;
