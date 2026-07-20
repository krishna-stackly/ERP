// api/supplier-api-provider.js
import ApiClient from "./api-client";
import { toast } from "react-toastify";

class SupplierApiProvider {
  async fetchSuppliers(params) {
    try {
      console.log("📡 API CALL → /masters/suppliers/", params);

      const res = await ApiClient.get("/masters/suppliers/", { params });

      if (res.status === 200) {
        // ✅ Handle nested response: data.data.data
        const suppliers = res.data?.data?.data || res.data?.data || res.data?.suppliers || [];
        const totalPages = res.data?.data?.totalPages || res.data?.total_pages || 1;
        const currentPage = res.data?.data?.from || params?.page || 1;

        return {
          suppliers: Array.isArray(suppliers) ? suppliers : [],
          total_pages: totalPages,
          current_page: currentPage,
        };
      }

      toast.error("Failed to load suppliers");
      return { suppliers: [], total_pages: 1, current_page: 1 };

    } catch (error) {
      console.error("❌ Error fetching suppliers:", error);
      toast.error(
        error?.response?.data?.message || "Error fetching suppliers"
      );
      return { suppliers: [], total_pages: 1, current_page: 1 };
    }
  }

  async createSupplier(data) {
    try {
      const res = await ApiClient.post("/masters/suppliers/", data);

      if (res.status === 200 || res.status === 201) {
        toast.success("Supplier created successfully!");
        return res.data;
      }

      toast.error("Failed to create supplier");
      return null;
    } catch (error) {
      console.error("❌ Error creating supplier:", error);
      toast.error(error?.response?.data?.message || "Error creating supplier");
      return null;
    }
  }

  async updateSupplier(supplierId, data) {
    try {
      const res = await ApiClient.put(`/masters/suppliers/${supplierId}/`, data);

      if (res.status === 200) {
        toast.success("Supplier updated successfully!");
        return res.data;
      }

      toast.error("Failed to update supplier");
      return null;
    } catch (error) {
      console.error("❌ Error updating supplier:", error);
      toast.error(error?.response?.data?.message || "Error updating supplier");
      return null;
    }
  }

  async deleteSupplier(id) {
    try {
      const res = await ApiClient.delete(`/masters/suppliers/${id}/`);

      if (res.status === 204 || res.status === 200) {
        toast.success("Supplier deleted");
        return true;
      }

      toast.error("Failed to delete supplier");
      return false;

    } catch (error) {
      console.error("❌ Error deleting supplier:", error);
      toast.error("Error deleting supplier");
      return false;
    }
  }

  async fetchSingleSupplier(id) {
    try {
      const res = await ApiClient.get(`/masters/suppliers/${id}/`);

      if (res.status === 200) return res.data;

      toast.error("Failed to load supplier details");
      return null;

    } catch (error) {
      console.error("❌ Error fetching supplier details:", error);
      toast.error("Error fetching supplier details");
      return null;
    }
  }

  // =====================================================
  // FETCH PURCHASING REPRESENTATIVES (if needed)
  // =====================================================
  async fetchPurchasingReps() {
    try {
      let candidates = [];
      let response;

      // Try to fetch with department filter first (assuming Purchasing dept ID is 7)
      try {
        response = await ApiClient.get("/onboarding/?department=7"); // Change ID as needed
      } catch (error) {
        console.warn("Department filter not supported, fetching all candidates:", error);
        response = await ApiClient.get("/onboarding/");
      }

      if (response.status === 200) {
        candidates = response.data;

        // Handle different response structures
        if (!Array.isArray(candidates)) {
          if (response.data.results && Array.isArray(response.data.results)) {
            candidates = response.data.results;
          } else if (response.data.candidates && Array.isArray(response.data.candidates)) {
            candidates = response.data.candidates;
          } else if (response.data.data && Array.isArray(response.data.data)) {
            candidates = response.data.data;
          } else {
            console.error("Unexpected onboarding API response:", response.data);
            candidates = [];
          }
        }

        // Filter for purchasing department (adjust ID as needed)
        const purchasingCandidates = candidates.filter(
          (candidate) =>
            (typeof candidate.department === "object" &&
              candidate.department?.id === 7) || // Change to your purchasing dept ID
            (typeof candidate.department === "number" &&
              candidate.department === 7)
        );

        console.log("Purchasing department candidates:", purchasingCandidates);
        return purchasingCandidates;
      }

      toast.error("Failed to load purchasing representatives");
      return [];

    } catch (error) {
      console.error("Error fetching purchasing reps:", error);
      toast.error("Failed to load purchasing representatives");
      return [];
    }
  }
}

const supplierApiProvider = new SupplierApiProvider();
export default supplierApiProvider;