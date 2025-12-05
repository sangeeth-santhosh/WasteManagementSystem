import { apiClient } from "./apiClient";

export const wasteService = {
  reportWaste(data) {
    return apiClient.post("/waste/report", data);
  },
  getMyReports() {
    return apiClient.get("/waste/my-reports");
  },
  getPendingCount() {
    return apiClient.get("/waste/pending-count");
  },
  getAllReports() {
    return apiClient.get("/waste/all");
  },
  updateReportStatus(id, newStatus) {
    return apiClient.patch(`/waste/${id}/status`, { newStatus });
  },
  getWeeklySummary() {
    return apiClient.get("/waste/weekly-summary");
  },
  getMonthlySummary() {
    return apiClient.get("/waste/monthly-summary");
  },
  getMonthlyHistory() {
    return apiClient.get("/waste/monthly-history");
  },
};

