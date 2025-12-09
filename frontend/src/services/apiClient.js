// API client configuration for making HTTP requests
// Note: set VITE_API_BASE_URL (or REACT_APP_API_URL) in env for production (https://your-api) to avoid mixed content.
// Backend must allow CORS from dev origin (http://localhost:5173 or your dev port) and deployed frontend domains (Vercel/Render URLs).
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || import.meta.env.REACT_APP_API_URL || ""; // fallback to same-origin relative /api

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = localStorage.getItem("token");

    const config = {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        // Backend returns: { success: false, message: '...' }
        const errorMessage = data.message || data.error || "An error occurred";
        const error = new Error(errorMessage);
        error.status = response.status;
        error.data = data;
        throw error;
      }

      return data;
    } catch (error) {
      // Re-throw if it's already our custom error
      if (error.message && error.status) {
        throw error;
      }
      // Handle network errors or JSON parsing errors
      throw new Error(error.message || "Network error. Please try again.");
    }
  }

  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: "GET" });
  }

  post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  patch(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: "DELETE" });
  }
}

export const apiClient = new ApiClient();
