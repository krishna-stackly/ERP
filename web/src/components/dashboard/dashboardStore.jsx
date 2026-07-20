import { create } from "zustand";
import apiProvider from "../../network/api-provider";

const useDashboardStore = create((set) => ({
  dashboardData: null,
  loading: false,

  fetchDashboard: async () => {
    set({ loading: true });
    try {
      console.log("Fetching dashboard, token:", localStorage.getItem("token"));
      const response = await apiProvider.fetchDashboard();

      if (response?.data) {
        // API returns { tasks, attendance }
        set({ dashboardData: response.data });
      } else {
        console.error("Unexpected API format:", response);
      }
    } catch (error) {
      console.log("Error fetching dashboard:", error);
    } finally {
      set({ loading: false });
    }
  },
}));

export default useDashboardStore;

