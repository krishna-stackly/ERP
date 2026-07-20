import ApiClient from "./api-client";
import { toast } from "react-toastify";

class ApiProvider {
  async fetchDashboard() {
    try {
      const result = await ApiClient.get("/dashboard/");

      const statusCode = result.status ?? 0;
      const message = result.data?.message ?? "Something went wrong";

      if (statusCode === 200 || statusCode === 201) {
        return result;
      } else {
        toast.error(message); // ❌ Show error toast
        return null;
      }
    } catch (error) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "An unexpected error occurred";
        toast.error(errorMessage);
        return null;
      }
    }
}

const apiProvider = new ApiProvider();

export default apiProvider;
