import ApiClient from "./api-client";
import { toast } from "react-toastify";

class EnquiryApiProvider {

  // =====================================================
  // FETCH ENQUIRIES
  // =====================================================
  async fetchEnquiries(page = 1, search = "") {
    try {
      const res = await ApiClient.get("/crm/enquiries/", {
        params: { page, search },
      });

      if (res.status === 200) {
        // ✅ Return raw res.data so store can read res.data.data, res.data.totalPages etc.
        return res.data;
      }

      toast.error("Failed to load enquiries");
      return null;
    } catch (error) {
      console.error("Error fetching enquiries:", error);
      toast.error(error?.response?.data?.message || "Error loading enquiries");
      return null;
    }
  }

  // =====================================================
  // CREATE ENQUIRY
  // =====================================================
  async createEnquiry(data) {
    try {
      const res = await ApiClient.post("/crm/enquiries/", data);

      if (res.status === 200 || res.status === 201) {
        toast.success("Enquiry created successfully");
        return res.data;
      }

      toast.error("Failed to create enquiry");
      return null;
    } catch (error) {
      console.error("Error creating enquiry:", error);
      toast.error(error?.response?.data?.message || "Error creating enquiry");
      return null;
    }
  }

  // =====================================================
  // UPDATE ENQUIRY
  // =====================================================
  async updateEnquiry(enquiryId, data) {
    try {
      const res = await ApiClient.put(`/crm/enquiries/${enquiryId}/`, data);

      if (res.status === 200) {
        toast.success("Enquiry updated successfully");
        return res.data;
      }

      toast.error("Failed to update enquiry");
      return null;
    } catch (error) {
      console.error("Error updating enquiry:", error);
      toast.error(error?.response?.data?.message || "Error updating enquiry");
      return null;
    }
  }

  // =====================================================
  // DELETE ENQUIRY
  // =====================================================
  async deleteEnquiry(enquiryId) {
    try {
      const res = await ApiClient.delete(`/crm/enquiries/${enquiryId}/`);

      if (res.status === 200 || res.status === 204) {
        toast.success("Enquiry deleted successfully");
        return true;
      }

      toast.error("Failed to delete enquiry");
      return false;
    } catch (error) {
      console.error("Delete enquiry error:", error?.response?.data || error);
      toast.error(error?.response?.data?.message || "Error deleting enquiry");
      return false;
    }
  }
}

const enquiryApiProvider = new EnquiryApiProvider();
export default enquiryApiProvider;