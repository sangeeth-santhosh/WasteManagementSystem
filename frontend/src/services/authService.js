import { apiClient } from "./apiClient";

export const authService = {
  /**
   * Login user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<{user: Object, token: string}>}
   */
  async login(email, password) {
    const response = await apiClient.post("/api/auth/login", {
      email,
      password,
    });
    // Backend returns: { success: true, data: { user, token } }
    return {
      user: response.data.user,
      token: response.data.token,
    };
  },

  /**
   * Register new user
   * @param {Object} userData - User registration data
   * @param {string} userData.name - User name
   * @param {string} userData.email - User email
   * @param {string} userData.password - User password
   * @returns {Promise<{user: Object, token: string}>}
   */
  async register(userData) {
    const response = await apiClient.post("/api/auth/register", userData);
    // Backend returns: { success: true, data: { user, token } }
    return {
      user: response.data.user,
      token: response.data.token,
    };
  },

  /**
   * Logout user
   */
  async logout() {
    try {
      // Call backend logout endpoint if token exists
      const token = localStorage.getItem("token");
      if (token) {
        await apiClient.post("/api/auth/logout");
      }
    } catch (error) {
      // Even if logout fails, continue with client-side cleanup
      console.error("Logout error:", error);
    }
    // Clear token from localStorage (handled in AuthContext)
    return Promise.resolve();
  },

  /**
   * Get current authenticated user
   * @returns {Promise<Object>} User object
   */
  async updateProfile(data) {
    const response = await apiClient.put("/api/auth/me", data);
    return {
      user: response.data.user,
    };
  },

  async changePassword(currentPassword, newPassword) {
    const response = await apiClient.put("/api/auth/change-password", {
      currentPassword,
      newPassword,
    });
    return response;
  },

  async getCurrentUser() {
    const response = await apiClient.get("/api/auth/me");
    // Backend returns: { success: true, data: { user } }
    return response.data.user;
  },
  // forgot/reset password removed for this project scope
};
