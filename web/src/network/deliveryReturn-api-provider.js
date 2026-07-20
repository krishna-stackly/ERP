// // import ApiClient from "./api-client";
// // import { toast } from "react-toastify";

// // class DeliveryReturnApiProvider {

// //   // =====================================================
// //   // FETCH DELIVERY RETURNS
// //   // =====================================================
// //   async fetchDeliveryReturns(page = 1, search = "") {
// //     try {
// //       const res = await ApiClient.get("/crm/delivery-note-returns/", {
// //         params: { page, search },
// //       });

// //       if (res.status === 200) {
// //         return res.data;
// //       }

// //       toast.error("Failed to load delivery returns");
// //       return null;
// //     } catch (error) {
// //       console.error("Error fetching delivery returns:", error);
// //       toast.error(error?.response?.data?.message || "Error loading delivery returns");
// //       return null;
// //     }
// //   }

// //   // =====================================================
// //   // CREATE DELIVERY RETURN
// //   // =====================================================
// //   async createDeliveryReturn(data) {
// //     try {
// //       const res = await ApiClient.post("/crm/delivery-returns/", data);

// //       if (res.status === 200 || res.status === 201) {
// //         toast.success("Delivery Return created successfully");
// //         return res.data;
// //       }

// //       toast.error("Failed to create delivery return");
// //       return null;
// //     } catch (error) {
// //       console.error("Error creating delivery return:", error);
// //       toast.error(error?.response?.data?.message || "Error creating delivery return");
// //       return null;
// //     }
// //   }

// //   // =====================================================
// //   // UPDATE DELIVERY RETURN
// //   // =====================================================
// //   async updateDeliveryReturn(returnId, data) {
// //     try {
// //       const res = await ApiClient.put(`/crm/delivery-returns/${returnId}/`, data);

// //       if (res.status === 200) {
// //         toast.success("Delivery Return updated successfully");
// //         return res.data;
// //       }

// //       toast.error("Failed to update delivery return");
// //       return null;
// //     } catch (error) {
// //       console.error("Error updating delivery return:", error);
// //       toast.error(error?.response?.data?.message || "Error updating delivery return");
// //       return null;
// //     }
// //   }

// //   // =====================================================
// //   // DELETE DELIVERY RETURN
// //   // =====================================================
// //   async deleteDeliveryReturn(returnId) {
// //     try {
// //       const res = await ApiClient.delete(`/crm/delivery-returns/${returnId}/`);

// //       if (res.status === 200 || res.status === 204) {
// //         toast.success("Delivery Return deleted successfully");
// //         return true;
// //       }

// //       toast.error("Failed to delete delivery return");
// //       return false;
// //     } catch (error) {
// //       console.error("Delete delivery return error:", error?.response?.data || error);
// //       toast.error(error?.response?.data?.message || "Error deleting delivery return");
// //       return false;
// //     }
// //   }
// // }

// // const deliveryReturnApiProvider = new DeliveryReturnApiProvider();
// // export default deliveryReturnApiProvider;
// import ApiClient from "./api-client";
// import { toast } from "react-toastify";

// class DeliveryReturnApiProvider {

//   // =====================================================
//   // FETCH DELIVERY RETURNS  →  GET /api/crm/delivery-returns/
//   // =====================================================
//   async fetchDeliveryReturns(page = 1, search = "") {
//     try {
//       const params = { page };
//       if (search) params.search = search;

//       const res = await ApiClient.get("/crm/delivery-note-returns/", { params });

//       if (res.status === 200) {
//         const raw = res.data?.data || res.data;

//         const list = Array.isArray(raw)
//           ? raw
//           : Array.isArray(raw?.data)
//           ? raw.data
//           : Array.isArray(raw?.results)
//           ? raw.results
//           : [];

//         const deliveryReturns = list.map((item) => ({
//           ...item,
//           dn_id: item.dnr_id || item.dn_id || item.id,
//           invoice_return_ref:
//             item.invoice_return_ref || item.invoice_ref || item.sales_order_ref || "—",
//           customer_name:
//             item.customer?.first_name
//               ? `${item.customer.first_name} ${item.customer.last_name || ""}`.trim()
//               : item.customer_name || "—",
//           delivery_date: item.return_date || item.delivery_date
//             ? new Date(item.return_date || item.delivery_date).toLocaleDateString("en-IN", {
//                 day: "2-digit",
//                 month: "short",
//                 year: "numeric",
//               })
//             : "—",
//           status: item.status || "—",
//         }));

//         return {
//           data: deliveryReturns,
//           current_page: raw?.from ? Math.ceil(raw.from / 10) : page,
//           totalPages: raw?.totalPages || raw?.total_pages || 1,
//         };
//       }

//       toast.error("Failed to load delivery returns");
//       return { data: [], current_page: 1, totalPages: 1 };

//     } catch (error) {
//       console.error("❌ fetchDeliveryReturns error:", error);
//       toast.error(error?.response?.data?.message || "Error loading delivery returns");
//       return { data: [], current_page: 1, totalPages: 1 };
//     }
//   }

//   // =====================================================
//   // FETCH SINGLE  →  GET /api/crm/delivery-returns/<id>/
//   // =====================================================
//   async fetchSingleDeliveryReturn(id) {
//     try {
//       const res = await ApiClient.get(`/crm/delivery-returns/${id}/`);
//       if (res.status === 200) return res.data?.data || res.data;
//       toast.error("Failed to load delivery return");
//       return null;
//     } catch (error) {
//       console.error("❌ fetchSingleDeliveryReturn error:", error);
//       toast.error("Error fetching delivery return details");
//       return null;
//     }
//   }

//   // =====================================================
//   // CREATE  →  POST /api/crm/delivery-returns/
//   // =====================================================
//   async createDeliveryReturn(data) {
//     try {
//       const res = await ApiClient.post("/crm/delivery-returns/", data);
//       if (res.status === 201 || res.status === 200) {
//         toast.success("Delivery Return created successfully");
//         return res.data?.data || res.data;
//       }
//       toast.error("Failed to create delivery return");
//       return null;
//     } catch (error) {
//       console.error("❌ createDeliveryReturn error:", error);
//       toast.error(error?.response?.data?.message || "Error creating delivery return");
//       return null;
//     }
//   }

//   // =====================================================
//   // UPDATE  →  PATCH /api/crm/delivery-returns/<id>/
//   // =====================================================
//   async updateDeliveryReturn(id, data) {
//     try {
//       const res = await ApiClient.patch(`/crm/delivery-returns/${id}/`, data);
//       if (res.status === 200) {
//         toast.success("Delivery Return updated successfully");
//         return res.data?.data || res.data;
//       }
//       toast.error("Failed to update delivery return");
//       return null;
//     } catch (error) {
//       console.error("❌ updateDeliveryReturn error:", error);
//       toast.error(error?.response?.data?.message || "Error updating delivery return");
//       return null;
//     }
//   }

//   // =====================================================
//   // DELETE  →  DELETE /api/crm/delivery-returns/<id>/
//   // =====================================================
//   async deleteDeliveryReturn(id) {
//     try {
//       const res = await ApiClient.delete(`/crm/delivery-returns/${id}/`);
//       if (res.status === 204 || res.status === 200) {
//         toast.success("Delivery Return deleted successfully");
//         return true;
//       }
//       toast.error("Failed to delete delivery return");
//       return false;
//     } catch (error) {
//       console.error("❌ deleteDeliveryReturn error:", error);
//       toast.error(error?.response?.data?.message || "Error deleting delivery return");
//       return false;
//     }
//   }

//   // =====================================================
//   // ACTION  →  POST /api/crm/delivery-returns/<id>/action/
//   // =====================================================
//   async performAction(id, action) {
//     try {
//       const res = await ApiClient.post(`/crm/delivery-returns/${id}/action/`, { action });
//       if (res.status === 200) {
//         toast.success(res.data?.message || `Action "${action}" performed`);
//         return res.data;
//       }
//       toast.error(`Failed to perform action: ${action}`);
//       return null;
//     } catch (error) {
//       console.error(`❌ performAction (${action}) error:`, error);
//       toast.error(error?.response?.data?.message || `Error performing action: ${action}`);
//       return null;
//     }
//   }

//   // =====================================================
//   // DOWNLOAD PDF  →  GET /api/crm/delivery-returns/<id>/pdf/
//   // =====================================================
//   async downloadPDF(id) {
//     try {
//       const res = await ApiClient.get(`/crm/delivery-returns/${id}/pdf/`, {
//         responseType: "blob",
//       });
//       if (res.status === 200) {
//         const url = window.URL.createObjectURL(new Blob([res.data]));
//         const link = document.createElement("a");
//         link.href = url;
//         link.setAttribute("download", `DNR-${id}.pdf`);
//         document.body.appendChild(link);
//         link.click();
//         link.remove();
//         window.URL.revokeObjectURL(url);
//         return true;
//       }
//       toast.error("Failed to download PDF");
//       return false;
//     } catch (error) {
//       console.error("❌ downloadPDF error:", error);
//       toast.error("Error downloading PDF");
//       return false;
//     }
//   }
// }

// const deliveryReturnApiProvider = new DeliveryReturnApiProvider();
// export default deliveryReturnApiProvider
import ApiClient from "./api-client";
import { toast } from "react-toastify";

class DeliveryReturnApiProvider {

  async fetchDeliveryReturns(page = 1, search = "") {
    try {
      const res = await ApiClient.get("/crm/delivery-note-returns/", {
        params: { page, ...(search ? { search } : {}) },
      });
      if (res.status === 200) {
        const raw = res.data?.data || res.data;
        const list =
          Array.isArray(raw?.data) ? raw.data :
          Array.isArray(raw)       ? raw       :
          Array.isArray(raw?.results) ? raw.results : [];

        const deliveryReturns = list.map((item) => ({
          ...item,
          dn_id:              item.dnr_id || item.id,
          invoice_return_ref: item.invoice_return_ref || item.invoice_ref || "—",
          customer_name:
            item.customer?.first_name
              ? `${item.customer.first_name} ${item.customer.last_name || ""}`.trim()
              : item.customer_name || "—",
          delivery_date: item.dnr_date || item.delivery_date || "—",
          status:        item.status || "—",
        }));

        return {
          data:         deliveryReturns,
          current_page: raw?.from ? Math.ceil(raw.from / 10) : page,
          totalPages:   raw?.totalPages || raw?.total_pages || 1,
        };
      }
      toast.error("Failed to load delivery returns");
      return { data: [], current_page: 1, totalPages: 1 };
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error loading delivery returns");
      return { data: [], current_page: 1, totalPages: 1 };
    }
  }

  async fetchSingleDeliveryReturn(id) {
    try {
      const res = await ApiClient.get(`/crm/delivery-note-returns/${id}/`);
      if (res.status === 200) return res.data?.data || res.data;
      toast.error("Failed to load delivery return");
      return null;
    } catch (error) {
      toast.error("Error fetching delivery return details");
      return null;
    }
  }

  // fetch submitted invoice returns for the dropdown
  async fetchInvoiceReturns() {
    try {
      const res = await ApiClient.get("/crm/invoice-returns/", {
        params: { status: "Submitted" },
      });
      if (res.status === 200) {
        return (
          res.data?.data?.data ??
          res.data?.data ??
          res.data?.results ??
          []
        );
      }
      return [];
    } catch (error) {
      console.error("Error fetching invoice returns", error);
      return [];
    }
  }

  async createDeliveryReturn(data) {
    try {
      const res = await ApiClient.post("/crm/delivery-note-returns/", data);
      if (res.status === 201 || res.status === 200) {
        toast.success("Delivery Return created successfully");
        return res.data?.data || res.data;
      }
      toast.error("Failed to create delivery return");
      return null;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error creating delivery return");
      return null;
    }
  }

  async updateDeliveryReturn(id, data) {
    try {
      const res = await ApiClient.patch(`/crm/delivery-note-returns/${id}/`, data);
      if (res.status === 200) {
        toast.success("Delivery Return updated successfully");
        return res.data?.data || res.data;
      }
      toast.error("Failed to update delivery return");
      return null;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error updating delivery return");
      return null;
    }
  }

  async deleteDeliveryReturn(id) {
    try {
      const res = await ApiClient.delete(`/crm/delivery-note-returns/${id}/`);
      if (res.status === 204 || res.status === 200) {
        toast.success("Delivery Return deleted successfully");
        return true;
      }
      toast.error("Failed to delete delivery return");
      return false;
    } catch (error) {
      toast.error("Error deleting delivery return");
      return false;
    }
  }

  async performAction(id, action) {
    try {
      const res = await ApiClient.post(`/crm/delivery-note-returns/${id}/action/`, { action });
      if (res.status === 200) {
        toast.success(res.data?.message || `Action "${action}" performed`);
        return res.data;
      }
      toast.error(`Failed to perform action: ${action}`);
      return null;
    } catch (error) {
      toast.error(error?.response?.data?.message || `Error: ${action}`);
      return null;
    }
  }

  async addComment(id, comment) {
    try {
      const res = await ApiClient.post(`/crm/delivery-note-returns/${id}/comments/`, { comment });
      if (res.status === 201 || res.status === 200) {
        toast.success("Comment added");
        return res.data?.data || res.data;
      }
      toast.error("Failed to add comment");
      return null;
    } catch (error) {
      toast.error("Error adding comment");
      return null;
    }
  }

  async uploadAttachment(id, file, description = "") {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("description", description);
      const res = await ApiClient.post(
        `/crm/delivery-note-returns/${id}/attachments/`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      if (res.status === 201 || res.status === 200) {
        toast.success("Attachment uploaded");
        return res.data?.data || res.data;
      }
      toast.error("Failed to upload attachment");
      return null;
    } catch (error) {
      toast.error("Error uploading attachment");
      return null;
    }
  }

  async downloadPDF(id, dnrId) {
    try {
      const res = await ApiClient.get(`/crm/delivery-note-returns/${id}/pdf/`, {
        responseType: "blob",
      });
      if (res.status === 200) {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `DNR_${dnrId || id}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        return true;
      }
      toast.error("Failed to download PDF");
      return false;
    } catch (error) {
      toast.error("Error downloading PDF");
      return false;
    }
  }

  async sendEmail(id, email = null) {
    try {
      const body = email ? { email } : {};
      const res = await ApiClient.post(`/crm/delivery-note-returns/${id}/email/`, body);
      if (res.status === 200) { toast.success("Email sent"); return true; }
      toast.error("Failed to send email");
      return false;
    } catch (error) {
      toast.error("Error sending email");
      return false;
    }
  }
}

const deliveryReturnApiProvider = new DeliveryReturnApiProvider();
export default deliveryReturnApiProvider;