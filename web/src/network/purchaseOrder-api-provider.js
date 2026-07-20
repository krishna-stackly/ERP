// import ApiClient from "./api-client";
// import { toast } from "react-toastify";

// class PurchaseOrderApiProvider {

//   // =====================================================
//   // FETCH PURCHASE ORDERS
//   // =====================================================
//   async fetchPurchaseOrders(page = 1, search = "") {
//     try {
//       const res = await ApiClient.get("/purchase/purchase-orders/", {
//         params: { page, search },
//       });

//       if (res.status === 200) {
//         return res.data;
//       }

//       toast.error("Failed to load purchase orders");
//       return null;
//     } catch (error) {
//       console.error("Error fetching purchase orders:", error);
//       toast.error(error?.response?.data?.message || "Error loading purchase orders");
//       return null;
//     }
//   }

//   // =====================================================
//   // CREATE PURCHASE ORDER
//   // =====================================================
//   async createPurchaseOrder(data) {
//     try {
//       const res = await ApiClient.post("/purchase/purchase-orders/",data);

//       if (res.status === 200 || res.status === 201) {
//         toast.success("Purchase Order created successfully");
//         return res.data;
//       }

//       toast.error("Failed to create purchase order");
//       return null;
//     } catch (error) {
//       console.error("Error creating purchase order:", error);
//       toast.error(error?.response?.data?.message || "Error creating purchase order");
//       return null;
//     }
//   }

//   // =====================================================
//   // UPDATE PURCHASE ORDER
//   // =====================================================
//   async updatePurchaseOrder(purchaseOrderId, data) {
//     try {
//       const res = await ApiClient.put(`/purchase//purchase-orders/${purchaseOrderId}/`,data);

//       if (res.status === 200) {
//         toast.success("Purchase Order updated successfully");
//         return res.data;
//       }

//       toast.error("Failed to update purchase order");
//       return null;
//     } catch (error) {
//       console.error("Error updating purchase order:", error);
//       toast.error(error?.response?.data?.message || "Error updating purchase order");
//       return null;
//     }
//   }

//   // =====================================================
//   // DELETE PURCHASE ORDER
//   // =====================================================
//   async deletePurchaseOrder(purchaseOrderId) {
//     try {
//       const res = await ApiClient.delete(`/inventory/purchase-orders/${purchaseOrderId}/`);

//       if (res.status === 200 || res.status === 204) {
//         toast.success("Purchase Order deleted successfully");
//         return true;
//       }

//       toast.error("Failed to delete purchase order");
//       return false;
//     } catch (error) {
//       console.error("Delete purchase order error:", error?.response?.data || error);
//       toast.error(error?.response?.data?.message || "Error deleting purchase order");
//       return false;
//     }
//   }
// }

// const purchaseOrderApiProvider = new PurchaseOrderApiProvider();
// export default purchaseOrderApiProvider;
import ApiClient from "./api-client";
import { toast } from "react-toastify";

class PurchaseOrderApiProvider {

  // =====================================================
  // FETCH PURCHASE ORDERS
  // GET /purchase/purchase-orders/
  // =====================================================
  async fetchPurchaseOrders(page = 1, search = "") {
    try {
      const res = await ApiClient.get("/purchase/purchase-orders/", {
        params: { page, search },
      });
      if (res.status === 200) return res.data;
      toast.error("Failed to load purchase orders");
      return null;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error loading purchase orders");
      return null;
    }
  }

  // =====================================================
  // FETCH SINGLE PURCHASE ORDER
  // GET /purchase/purchase-orders/{id}/
  // =====================================================
  async fetchSinglePurchaseOrder(purchaseOrderId) {
    try {
      const res = await ApiClient.get(`/purchase/purchase-orders/${purchaseOrderId}/`);
      if (res.status === 200) return res.data;
      toast.error("Failed to load purchase order");
      return null;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error loading purchase order");
      return null;
    }
  }

  // =====================================================
  // CREATE PURCHASE ORDER  →  Save as Draft (first time)
  // POST /purchase/purchase-orders/
  // payload shape:
  // {
  //   po_date, delivery_date, supplier_id, supplier_name,
  //   payment_terms, inco_terms, currency, notes_comments,
  //   global_discount, shipping_charges,
  //   line_items: [
  //     { product_id, uom, qty_ordered, unit_price, tax, discount }
  //   ]
  // }
  // =====================================================
  async createPurchaseOrder(data) {
    try {
      const res = await ApiClient.post("/purchase/purchase-orders/", data);
      if (res.status === 200 || res.status === 201) {
        toast.success("Purchase Order saved as draft");
        return res.data;
      }
      toast.error("Failed to create purchase order");
      return null;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error creating purchase order");
      return null;
    }
  }

  // =====================================================
  // UPDATE PURCHASE ORDER
  // PUT /purchase/purchase-orders/{id}/
  // =====================================================
  async updatePurchaseOrder(purchaseOrderId, data) {
    try {
      const res = await ApiClient.put(
        `/purchase/purchase-orders/${purchaseOrderId}/`,
        data
      );
      if (res.status === 200) {
        toast.success("Purchase Order updated successfully");
        return res.data;
      }
      toast.error("Failed to update purchase order");
      return null;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error updating purchase order");
      return null;
    }
  }

  // =====================================================
  // DELETE PURCHASE ORDER
  // DELETE /purchase/purchase-orders/{id}/
  // =====================================================
  async deletePurchaseOrder(purchaseOrderId) {
    try {
      const res = await ApiClient.delete(
        `/purchase/purchase-orders/${purchaseOrderId}/`
      );
      if (res.status === 200 || res.status === 204) {
        toast.success("Purchase Order deleted successfully");
        return true;
      }
      toast.error("Failed to delete purchase order");
      return false;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error deleting purchase order");
      return false;
    }
  }

  // =====================================================
  // PERFORM ACTION  →  submit / cancel
  // POST /purchase/purchase-orders/{id}/action/
  // payload: { action: "submit" }  |  { action: "cancel" }
  // =====================================================
  async performAction(purchaseOrderId, action) {
    try {
      const res = await ApiClient.post(
        `/purchase/purchase-orders/${purchaseOrderId}/action/`,
        { action }
      );
      if (res.status === 200 || res.status === 201) return res.data;
      toast.error(`Failed to perform action: ${action}`);
      return null;
    } catch (error) {
      toast.error(
        error?.response?.data?.message || `Error performing action: ${action}`
      );
      return null;
    }
  }

  // =====================================================
  // ADD COMMENT
  // POST /purchase/purchase-orders/{id}/comments/
  // payload: { comment: "..." }
  // =====================================================
  async addComment(purchaseOrderId, comment) {
    try {
      const res = await ApiClient.post(
        `/purchase/purchase-orders/${purchaseOrderId}/comments/`,
        { comment }
      );
      if (res.status === 200 || res.status === 201) {
        toast.success("Comment added");
        return res.data;
      }
      toast.error("Failed to add comment");
      return null;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error adding comment");
      return null;
    }
  }

  // =====================================================
  // FETCH COMMENTS
  // GET /purchase/purchase-orders/{id}/comments/
  // =====================================================
  async fetchComments(purchaseOrderId) {
    try {
      const res = await ApiClient.get(
        `/purchase/purchase-orders/${purchaseOrderId}/comments/`
      );
      if (res.status === 200) return res.data;
      toast.error("Failed to fetch comments");
      return [];
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error fetching comments");
      return [];
    }
  }

  // =====================================================
  // ADD ATTACHMENT
  // POST /purchase/purchase-orders/{id}/attachments/
  // payload: FormData  (key: "file")
  // =====================================================
  async addAttachment(purchaseOrderId, formData) {
    try {
      const res = await ApiClient.post(
        `/purchase/purchase-orders/${purchaseOrderId}/attachments/`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      if (res.status === 200 || res.status === 201) {
        toast.success("Attachment uploaded");
        return res.data;
      }
      toast.error("Failed to upload attachment");
      return null;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error uploading attachment");
      return null;
    }
  }

  // =====================================================
  // FETCH ATTACHMENTS
  // GET /purchase/purchase-orders/{id}/attachments/
  // =====================================================
  async fetchAttachments(purchaseOrderId) {
    try {
      const res = await ApiClient.get(
        `/purchase/purchase-orders/${purchaseOrderId}/attachments/`
      );
      if (res.status === 200) return res.data;
      toast.error("Failed to fetch attachments");
      return [];
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error fetching attachments");
      return [];
    }
  }

  // =====================================================
  // FETCH HISTORY
  // GET /purchase/purchase-orders/{id}/history/
  // =====================================================
  async fetchHistory(purchaseOrderId) {
    try {
      const res = await ApiClient.get(
        `/purchase/purchase-orders/${purchaseOrderId}/history/`
      );
      if (res.status === 200) return res.data;
      toast.error("Failed to fetch history");
      return [];
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error fetching history");
      return [];
    }
  }

  // =====================================================
  // GET PDF
  // GET /purchase/purchase-orders/{id}/pdf/
  // Returns a Blob — use URL.createObjectURL(blob) to open
  // =====================================================
  async getPdf(purchaseOrderId) {
    try {
      const res = await ApiClient.get(
        `/purchase/purchase-orders/${purchaseOrderId}/pdf/`,
        { responseType: "blob" }
      );
      if (res.status === 200) return res.data;
      toast.error("Failed to generate PDF");
      return null;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error generating PDF");
      return null;
    }
  }

  // =====================================================
  // SEND EMAIL
  // GET /purchase/purchase-orders/{id}/email/
  // payload: { email: "supplier@example.com" }
  // =====================================================
  async sendEmail(purchaseOrderId, email) {
    try {
      const res = await ApiClient.get(
        `/purchase/purchase-orders/${purchaseOrderId}/email/`,
        { params: { email } }
      );
      if (res.status === 200) {
        toast.success("Email sent successfully");
        return res.data;
      }
      toast.error("Failed to send email");
      return null;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error sending email");
      return null;
    }
  }

  // =====================================================
  // GENERATE STOCK RECEIPT
  // POST /purchase/purchase-orders/{id}/stock-receipt/
  // =====================================================
  async generateStockReceipt(purchaseOrderId) {
    try {
      const res = await ApiClient.post(
        `/purchase/purchase-orders/${purchaseOrderId}/stock-receipt/`
      );
      if (res.status === 200 || res.status === 201) {
        toast.success("Stock receipt generated");
        return res.data;
      }
      toast.error("Failed to generate stock receipt");
      return null;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error generating stock receipt");
      return null;
    }
  }
}

const purchaseOrderApiProvider = new PurchaseOrderApiProvider();
export default purchaseOrderApiProvider;