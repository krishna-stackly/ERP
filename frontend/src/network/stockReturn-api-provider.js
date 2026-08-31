import ApiClient from "./api-client";
import { toast } from "react-toastify";

class StockReturnApiProvider {

  // =====================================================
  // FETCH STOCK RETURNS (list)
  // =====================================================
  async fetchStockReturns(page = 1, search = "") {
    try {
      const res = await ApiClient.get("/purchase/stock-returns/", {
        params: { page, search },
      });

      if (res.status === 200) {
        return res.data;
      }

      toast.error("Failed to load stock returns");
      return null;
    } catch (error) {
      console.error("Error fetching stock returns:", error);
      toast.error(error?.response?.data?.message || "Error loading stock returns");
      return null;
    }
  }

  // =====================================================
  // FETCH SINGLE STOCK RETURN
  // =====================================================
  async fetchSingleStockReturn(returnId) {
    try {
      const res = await ApiClient.get(`/purchase/stock-returns/${returnId}/`);

      if (res.status === 200) {
        return res.data;
      }

      toast.error("Failed to load stock return");
      return null;
    } catch (error) {
      console.error("Error fetching stock return:", error);
      toast.error(error?.response?.data?.message || "Error loading stock return");
      return null;
    }
  }

  // =====================================================
  // CREATE STOCK RETURN
  // =====================================================
  async createStockReturn(data) {
    try {
      const res = await ApiClient.post("/purchase/stock-returns/", data);

      if (res.status === 200 || res.status === 201) {
        toast.success("Stock Return created successfully");
        return res.data;
      }

      toast.error("Failed to create stock return");
      return null;
    } catch (error) {
      console.error("Error creating stock return:", error);
      const errData = error?.response?.data;
      const msg = Array.isArray(errData)
        ? errData.join(" ")
        : errData?.message || errData?.detail || "Error creating stock return";
      toast.error(msg);
      return null;
    }
  }

  // =====================================================
  // UPDATE STOCK RETURN
  // =====================================================
  async updateStockReturn(returnId, data) {
    try {
      const res = await ApiClient.put(`/purchase/stock-returns/${returnId}/`, data);

      if (res.status === 200) {
        toast.success("Stock Return updated successfully");
        return res.data;
      }

      toast.error("Failed to update stock return");
      return null;
    } catch (error) {
      console.error("Error updating stock return:", error);
      const errData = error?.response?.data;
      const msg = Array.isArray(errData)
        ? errData.join(" ")
        : errData?.message || errData?.detail || "Error updating stock return";
      toast.error(msg);
      return null;
    }
  }

  // =====================================================
  // ACTION ON STOCK RETURN (save_draft / submit / cancel)
  // =====================================================
  async actionStockReturn(returnId, action) {
    try {
      const res = await ApiClient.post(
        `/purchase/stock-returns/${returnId}/action/`,
        { action }
      );

      if (res.status === 200 || res.status === 201) {
        return res.data;
      }

      toast.error(`Action "${action}" failed`);
      return null;
    } catch (error) {
      console.error("Error performing action on stock return:", error);
      const errData = error?.response?.data;
      const msg = Array.isArray(errData)
        ? errData.join(" ")
        : errData?.message || errData?.detail || `Error performing action "${action}"`;
      toast.error(msg);
      return null;
    }
  }

  // =====================================================
  // DELETE STOCK RETURN
  // =====================================================
  async deleteStockReturn(returnId) {
    try {
      const res = await ApiClient.delete(`/purchase/stock-returns/${returnId}/`);

      if (res.status === 200 || res.status === 204) {
        toast.success("Stock Return deleted successfully");
        return true;
      }

      toast.error("Failed to delete stock return");
      return false;
    } catch (error) {
      console.error("Delete stock return error:", error?.response?.data || error);
      toast.error(error?.response?.data?.message || "Error deleting stock return");
      return false;
    }
  }

  // =====================================================
  // COMMENTS
  // =====================================================
  async fetchComments(returnId) {
    try {
      const res = await ApiClient.get(`/purchase/stock-returns/${returnId}/comments/`);
      return res.status === 200 ? res.data : [];
    } catch (error) {
      console.error("Error fetching comments:", error);
      return [];
    }
  }

  async addComment(returnId, comment) {
    try {
      const res = await ApiClient.post(
        `/purchase/stock-returns/${returnId}/comments/`,
        { comment }
      );
      return res.status === 200 || res.status === 201 ? res.data : null;
    } catch (error) {
      console.error("Error adding comment:", error);
      return null;
    }
  }

  // =====================================================
  // ATTACHMENTS
  // =====================================================
  async fetchAttachments(returnId) {
    try {
      const res = await ApiClient.get(`/purchase/stock-returns/${returnId}/attachments/`);
      return res.status === 200 ? res.data : [];
    } catch (error) {
      console.error("Error fetching attachments:", error);
      return [];
    }
  }

  async uploadAttachment(returnId, file, description = "") {
    try {
      const formData = new FormData();
      formData.append("file", file);
      if (description) formData.append("description", description);

      const res = await ApiClient.post(
        `/purchase/stock-returns/${returnId}/attachments/`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      return res.status === 200 || res.status === 201 ? res.data : null;
    } catch (error) {
      console.error("Error uploading attachment:", error);
      return null;
    }
  }

  async deleteAttachment(returnId, attachmentId) {
    try {
      const res = await ApiClient.delete(
        `/purchase/stock-returns/${returnId}/attachments/${attachmentId}/`
      );
      return res.status === 200 || res.status === 204;
    } catch (error) {
      console.error("Error deleting attachment:", error);
      return false;
    }
  }

  // =====================================================
  // HISTORY
  // =====================================================
  async fetchHistory(returnId) {
    try {
      const res = await ApiClient.get(`/purchase/stock-returns/${returnId}/history/`);
      return res.status === 200 ? res.data : [];
    } catch (error) {
      console.error("Error fetching history:", error);
      return [];
    }
  }
}

const stockReturnApiProvider = new StockReturnApiProvider();
export default stockReturnApiProvider;
