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
  getZoneTotals(params = {}) {
    const query = new URLSearchParams(params).toString();
    return adminClient.get(`/analytics/zone-totals${query ? `?${query}` : ''}`);
  },
  getCategoryByZone(params = {}) {
    const query = new URLSearchParams(params).toString();
    return adminClient.get(`/analytics/category-by-zone${query ? `?${query}` : ''}`);
  },
  getTopZones(params = {}) {
    const query = new URLSearchParams(params).toString();
    return adminClient.get(`/analytics/top-zones${query ? `?${query}` : ''}`);
  },
  getCategoryHighLow(params = {}) {
    const query = new URLSearchParams(params).toString();
    return adminClient.get(`/analytics/category-high-low${query ? `?${query}` : ''}`);
  },
  getEcoPointsDistribution() {
    return adminClient.get('/summary/eco-points-distribution');
  },
  getTopWasteCategories() {
    return adminClient.get('/summary/top-categories');
  },
  getZones() {
    return adminClient.get('/zones');
  },
  createZone(data) {
    return adminClient.post('/zones', data);
  },
  updateZone(id, data) {
    return adminClient.put(`/zones/${id}`, data);
  },
  deleteZone(id) {
    return adminClient.delete(`/zones/${id}`);
  },
};

