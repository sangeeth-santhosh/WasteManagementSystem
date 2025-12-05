import { adminClient } from './adminClient';

export const adminService = {
  login(credentials) {
    return adminClient.post('/login', credentials);
  },
  getSummary() {
    return adminClient.get('/summary');
  },
  getReports() {
    return adminClient.get('/reports');
  },
  updateReportStatus(id, status) {
    return adminClient.patch(`/reports/${id}/status`, { status });
  },
  getUsers() {
    return adminClient.get('/users');
  },
  updateUserStatus(id, body) {
    return adminClient.patch(`/users/${id}/status`, body);
  },
  getFeedback() {
    return adminClient.get('/feedback');
  },
  resolveFeedback(id) {
    return adminClient.patch(`/feedback/${id}/resolve`, {});
  },
};

