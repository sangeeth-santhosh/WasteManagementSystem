import { apiClient } from "./apiClient";

export const notificationService = {
  /**
   * Get notifications for the logged-in user
   * Backend returns plain array or { success, data }
   */
  async getNotifications(limit = 20) {
    const response = await apiClient.get(`/notifications?limit=${limit}`);

    // If backend returns array directly:
    if (Array.isArray(response)) return response;

    // If backend wraps in { success, data }
    if (response.data && Array.isArray(response.data)) {
      return response.data;
    }

    return [];
  },

  /**
   * Get unread notification count
   * Backend returns: { unreadCount: number }
   */
  async getUnreadCount() {
    const response = await apiClient.get('/notifications/unread-count');

    if (typeof response.unreadCount === 'number') {
      return response.unreadCount;
    }
    if (response.data && typeof response.data.unreadCount === 'number') {
      return response.data.unreadCount;
    }
    if (response.data && typeof response.data.count === 'number') {
      return response.data.count;
    }
    return 0;
  },

  /**
   * Mark a notification as read
   * Backend returns updated notification or { message, notification }
   */
  async markAsRead(id) {
    const response = await apiClient.patch(`/notifications/${id}/read`, {});
    return response;
  },

  /**
   * Mark multiple notifications as read (best-effort; resolves when all requests settle)
   */
  async markAllAsRead(ids = []) {
    if (!Array.isArray(ids) || ids.length === 0) return [];
    const tasks = ids.map((id) => this.markAsRead(id).catch(() => null));
    return Promise.all(tasks);
  },
};
