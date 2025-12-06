import { apiClient } from "./apiClient";

export const zoneService = {
  getZones() {
    return apiClient.get("/zones");
  },
};




