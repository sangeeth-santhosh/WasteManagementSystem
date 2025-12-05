import { apiClient } from "./apiClient";

export const feedbackService = {
  sendFeedback(data) {
    return apiClient.post("/feedback", data);
  },
  getMyFeedback() {
    return apiClient.get("/feedback/my");
  },
};

