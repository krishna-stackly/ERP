// import ApiClient from "./api-client";
// import { toast } from "react-toastify";

// class SalesOrderApiProvider {

//   // =====================================================
//   // FETCH SALES ORDERS
//   // =====================================================
//   async fetchSalesOrders(page = 1, search = "") {
//     try {
//       const res = await ApiClient.get("/crm/sales-orders/", {
//         params: { page, search },
//       });

//       if (res.status === 200) {
//         return res.data;
//       }

//       toast.error("Failed to load sales orders");
//       return null;
//     } catch (error) {
//       console.error("Error fetching sales orders:", error);
//       toast.error(error?.response?.data?.message || "Error loading sales orders");
//       return null;
//     }
//   }

//   async fetchUsers(page = 1, search = "") {
//     try {
//       const res = await ApiClient.get("/masters/users/", {
//         params: { page, search },
//       });

//       if (res.status === 200) {
//         return {
//           users: res.data?.users || res.data?.data || [],
//           total_pages: res.data?.total_pages || 1,
//           current_page: res.data?.current_page || page,
//         };
//       }

//       toast.error("Failed to load users");
//       return { users: [], total_pages: 1, current_page: 1 };
//     } catch (error) {
//       this.handleError(error, "Error loading users");
//       return { users: [], total_pages: 1, current_page: 1 };
//     }
//   }

//   // =====================================================
//   // CREATE SALES ORDER
//   // =====================================================
//   async createSalesOrder(data) {
//     try {
//       const res = await ApiClient.post("/crm/sales-orders/", data);

//       if (res.status === 200 || res.status === 201) {
//         toast.success("Sales order created successfully");
//         return res.data;
//       }

//       toast.error("Failed to create sales order");
//       return null;
//     } catch (error) {
//       console.error("Error creating sales order:", error);
//       toast.error(error?.response?.data?.message || "Error creating sales order");
//       return null;
//     }
//   }

//   // =====================================================
//   // UPDATE SALES ORDER
//   // =====================================================
//   async updateSalesOrder(orderId, data) {
//     try {
//       const res = await ApiClient.put(`/crm/sales-orders/${orderId}/`, data);

//       if (res.status === 200) {
//         toast.success("Sales order updated successfully");
//         return res.data;
//       }

//       toast.error("Failed to update sales order");
//       return null;
//     } catch (error) {
//       console.error("Error updating sales order:", error);
//       toast.error(error?.response?.data?.message || "Error updating sales order");
//       return null;
//     }
//   }

//   // =====================================================
//   // DELETE SALES ORDER
//   // =====================================================
//   async deleteSalesOrder(orderId) {
//     try {
//       const res = await ApiClient.delete(`/crm/sales-orders/${orderId}/`);

//       if (res.status === 200 || res.status === 204) {
//         toast.success("Sales order deleted successfully");
//         return true;
//       }

//       toast.error("Failed to delete sales order");
//       return false;
//     } catch (error) {
//       console.error("Delete sales order error:", error?.response?.data || error);
//       toast.error(error?.response?.data?.message || "Error deleting sales order");
//       return false;
//     }
//   }
// }

// const salesOrderApiProvider = new SalesOrderApiProvider();
// export default salesOrderApiProvider;
import ApiClient from "./api-client";
import { toast } from "react-toastify";

class SalesOrderApiProvider {

  // =====================================================
  // FETCH ALL SALES ORDERS
  // =====================================================
  async fetchSalesOrders(page = 1, search = "") {
    try {
      const res = await ApiClient.get("/crm/sales-orders/", {
        params: { page, search },
      });
      if (res.status === 200) return res.data;
      toast.error("Failed to load sales orders");
      return null;
    } catch (error) {
      console.error("Error fetching sales orders:", error);
      toast.error(error?.response?.data?.message || "Error loading sales orders");
      return null;
    }
  }

  // =====================================================
  // FETCH SINGLE SALES ORDER BY ID
  // =====================================================
  async fetchSalesOrderById(orderId) {
    try {
      const res = await ApiClient.get(`/crm/sales-orders/${orderId}/`);
      if (res.status === 200) return res.data;
      toast.error("Failed to load sales order");
      return null;
    } catch (error) {
      console.error("Error fetching sales order:", error);
      toast.error(error?.response?.data?.message || "Error loading sales order");
      return null;
    }
  }

  // =====================================================
  // CREATE SALES ORDER (Draft or Submitted)
  // POST /crm/sales-orders/
  // =====================================================
  async createSalesOrder(data) {
    try {
      const res = await ApiClient.post("/crm/sales-orders/", data);
      if (res.status === 200 || res.status === 201) {
        toast.success("Sales order created successfully");
        return res.data;
      }
      toast.error("Failed to create sales order");
      return null;
    } catch (error) {
      console.error("Error creating sales order:", error);
      toast.error(error?.response?.data?.message || "Error creating sales order");
      return null;
    }
  }

  // =====================================================
  // UPDATE SALES ORDER
  // PATCH /crm/sales-orders/:id/
  // =====================================================
  async updateSalesOrder(orderId, data) {
    try {
      const res = await ApiClient.patch(`/crm/sales-orders/${orderId}/`, data);
      if (res.status === 200) {
        toast.success("Sales order updated successfully");
        return res.data;
      }
      toast.error("Failed to update sales order");
      return null;
    } catch (error) {
      console.error("Error updating sales order:", error);
      toast.error(error?.response?.data?.message || "Error updating sales order");
      return null;
    }
  }

  // =====================================================
  // ACTION — submit / cancel / save_draft / generate_po
  // POST /crm/sales-orders/:id/action/
  // =====================================================
  async salesOrderAction(orderId, action, extra = {}) {
    try {
      const res = await ApiClient.post(
        `/crm/sales-orders/${orderId}/action/`,
        { action, ...extra }
      );
      if (res.status === 200) return res.data;
      toast.error(`Action "${action}" failed`);
      return null;
    } catch (error) {
      // Return the error response so caller can inspect it
      // (e.g. insufficient_stock with details)
      console.error(`Sales order action "${action}" error:`, error);
      return error?.response?.data || null;
    }
  }

  // =====================================================
  // GENERATE DELIVERY NOTE
  // POST /crm/sales-orders/:id/generate-delivery-note/
  // =====================================================
  async generateDeliveryNote(orderId) {
    try {
      const res = await ApiClient.post(
        `/crm/sales-orders/${orderId}/generate-delivery-note/`
      );
      if (res.status === 200) {
        toast.success("Delivery note generated");
        return res.data;
      }
      toast.error("Failed to generate delivery note");
      return null;
    } catch (error) {
      console.error("Generate delivery note error:", error);
      toast.error(error?.response?.data?.message || "Error generating delivery note");
      return null;
    }
  }

  // =====================================================
  // DELETE SALES ORDER
  // =====================================================
  async deleteSalesOrder(orderId) {
    try {
      const res = await ApiClient.delete(`/crm/sales-orders/${orderId}/`);
      if (res.status === 200 || res.status === 204) {
        toast.success("Sales order deleted successfully");
        return true;
      }
      toast.error("Failed to delete sales order");
      return false;
    } catch (error) {
      console.error("Delete sales order error:", error?.response?.data || error);
      toast.error(error?.response?.data?.message || "Error deleting sales order");
      return false;
    }
  }

  // =====================================================
  // FETCH USERS (Sales Reps)
  // =====================================================
  async fetchUsers(page = 1, search = "") {
    try {
      const res = await ApiClient.get("/masters/users/", {
        params: { page, search },
      });
      if (res.status === 200) {
        return {
          users: res.data?.users || res.data?.data || [],
          total_pages: res.data?.total_pages || 1,
          current_page: res.data?.current_page || page,
        };
      }
      toast.error("Failed to load users");
      return { users: [], total_pages: 1, current_page: 1 };
    } catch (error) {
      console.error("Error loading users:", error);
      return { users: [], total_pages: 1, current_page: 1 };
    }
  }
  // =====================================================
  // FETCH COMMENTS FOR AN ORDER
  // GET /crm/sales-orders/:id/comments/
  // =====================================================
  async fetchComments(orderId) {
    try {
      const res = await ApiClient.get(`/crm/sales-orders/${orderId}/comments/`);
      if (res.status === 200) {
        return res.data?.comments || res.data?.data || res.data || [];
      }
      toast.error("Failed to load comments");
      return [];
    } catch (error) {
      console.error("Error fetching comments:", error);
      return [];
    }
  }

  // =====================================================
  // ADD COMMENT TO AN ORDER
  // POST /crm/sales-orders/:id/comments/
  // =====================================================
  async addComment(orderId, comment) {
    try {
      const res = await ApiClient.post(
        `/crm/sales-orders/${orderId}/comments/`,
        { comment }
      );
      if (res.status === 200 || res.status === 201) {
        return res.data;
      }
      toast.error("Failed to add comment");
      return null;
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error(error?.response?.data?.message || "Error adding comment");
      return null;
    }
  }
}

const salesOrderApiProvider = new SalesOrderApiProvider();
export default salesOrderApiProvider;