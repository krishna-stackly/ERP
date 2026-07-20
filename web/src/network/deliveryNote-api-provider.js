// // // import ApiClient from "./api-client";
// // // import { toast } from "react-toastify";

// // // class DeliveryNoteApiProvider {

// // //   // =====================================================
// // //   // FETCH DELIVERY NOTES
// // //   // =====================================================
// // //   async fetchDeliveryNotes(page = 1, search = "") {
// // //     try {
// // //       const res = await ApiClient.get("/crm/delivery-notes/", {
// // //         params: { page, search },
// // //       });

// // //       if (res.status === 200) {
// // //         return res.data;
// // //       }

// // //       toast.error("Failed to load delivery notes");
// // //       return null;
// // //     } catch (error) {
// // //       console.error("Error fetching delivery notes:", error);
// // //       toast.error(error?.response?.data?.message || "Error loading delivery notes");
// // //       return null;
// // //     }
// // //   }

// // //   // =====================================================
// // //   // CREATE DELIVERY NOTE
// // //   // =====================================================
// // //   async createDeliveryNote(data) {
// // //     try {
// // //       const res = await ApiClient.post("/crm/delivery-notes/", data);

// // //       if (res.status === 200 || res.status === 201) {
// // //         toast.success("Delivery Note created successfully");
// // //         return res.data;
// // //       }

// // //       toast.error("Failed to create delivery note");
// // //       return null;
// // //     } catch (error) {
// // //       console.error("Error creating delivery note:", error);
// // //       toast.error(error?.response?.data?.message || "Error creating delivery note");
// // //       return null;
// // //     }
// // //   }

// // //   // =====================================================
// // //   // UPDATE DELIVERY NOTE
// // //   // =====================================================
// // //   async updateDeliveryNote(noteId, data) {
// // //     try {
// // //       const res = await ApiClient.put(`/crm/delivery-notes/${noteId}/`, data);

// // //       if (res.status === 200) {
// // //         toast.success("Delivery Note updated successfully");
// // //         return res.data;
// // //       }

// // //       toast.error("Failed to update delivery note");
// // //       return null;
// // //     } catch (error) {
// // //       console.error("Error updating delivery note:", error);
// // //       toast.error(error?.response?.data?.message || "Error updating delivery note");
// // //       return null;
// // //     }
// // //   }

// // //   // =====================================================
// // //   // DELETE DELIVERY NOTE
// // //   // =====================================================
// // //   async deleteDeliveryNote(noteId) {
// // //     try {
// // //       const res = await ApiClient.delete(`/crm/delivery-notes/${noteId}/`);

// // //       if (res.status === 200 || res.status === 204) {
// // //         toast.success("Delivery Note deleted successfully");
// // //         return true;
// // //       }

// // //       toast.error("Failed to delete delivery note");
// // //       return false;
// // //     } catch (error) {
// // //       console.error("Delete delivery note error:", error?.response?.data || error);
// // //       toast.error(error?.response?.data?.message || "Error deleting delivery note");
// // //       return false;
// // //     }
// // //   }
// // // }

// // // const deliveryNoteApiProvider = new DeliveryNoteApiProvider();
// // // export default deliveryNoteApiProvider;
// // // network/deliveryNote-api-provider.js
// // import ApiClient from "./api-client";
// // import { toast } from "react-toastify";

// // class DeliveryNoteApiProvider {

// //   // =====================================================
// //   // FETCH ALL DELIVERY NOTES  →  GET /api/delivery-notes/
// //   // =====================================================
// //   async fetchDeliveryNotes(page = 1, search = "") {
// //     try {
// //       const params = { page };
// //       if (search) params.search = search;

// //       const res = await ApiClient.get("/crm/delivery-notes/", { params });

// //       if (res.status === 200) {
// //         const raw = res.data?.data || res.data;

// //         // API returns paginated wrapper OR plain array
// //         const list = Array.isArray(raw)
// //           ? raw
// //           : Array.isArray(raw?.data)
// //           ? raw.data
// //           : Array.isArray(raw?.results)
// //           ? raw.results
// //           : [];

// //         // Normalize each row to what the table expects
// //         const deliveryNotes = list.map((item) => ({
// //           ...item,
// //           dn_id: item.dn_id || item.id,
// //           sales_order_ref: item.sales_order || item.sales_order_ref || "—",
// //           customer_name:
// //             item.customer?.first_name
// //               ? `${item.customer.first_name} ${item.customer.last_name || ""}`.trim()
// //               : item.customer_name || "—",
// //           delivery_type: item.delivery_type || "—",
// //           delivery_date: item.delivery_date
// //             ? new Date(item.delivery_date).toLocaleDateString("en-IN", {
// //                 day: "2-digit",
// //                 month: "short",
// //                 year: "numeric",
// //               })
// //             : "—",
// //           status: item.status || "—",
// //         }));

// //         return {
// //           data: deliveryNotes,
// //           current_page: raw?.from ? Math.ceil(raw.from / 10) : page,
// //           totalPages: raw?.totalPages || raw?.total_pages || 1,
// //         };
// //       }

// //       toast.error("Failed to load delivery notes");
// //       return { data: [], current_page: 1, totalPages: 1 };

// //     } catch (error) {
// //       console.error("❌ fetchDeliveryNotes error:", error);
// //       toast.error(
// //         error?.response?.data?.message || "Error fetching delivery notes"
// //       );
// //       return { data: [], current_page: 1, totalPages: 1 };
// //     }
// //   }

// //   // =====================================================
// //   // FETCH SINGLE  →  GET /api/delivery-notes/<id>/
// //   // =====================================================
// //   async fetchSingleDeliveryNote(id) {
// //     try {
// //       const res = await ApiClient.get(`/delivery-notes/${id}/`);
// //       if (res.status === 200) return res.data?.data || res.data;
// //       toast.error("Failed to load delivery note");
// //       return null;
// //     } catch (error) {
// //       console.error("❌ fetchSingleDeliveryNote error:", error);
// //       toast.error("Error fetching delivery note details");
// //       return null;
// //     }
// //   }

// //   // =====================================================
// //   // CREATE  →  POST /api/delivery-notes/
// //   // =====================================================
// //   async createDeliveryNote(data) {
// //     try {
// //       const res = await ApiClient.post("/delivery-notes/", data);
// //       if (res.status === 201 || res.status === 200) {
// //         toast.success("Delivery note created successfully!");
// //         return res.data?.data || res.data;
// //       }
// //       toast.error("Failed to create delivery note");
// //       return null;
// //     } catch (error) {
// //       console.error("❌ createDeliveryNote error:", error);
// //       toast.error(
// //         error?.response?.data?.message || "Error creating delivery note"
// //       );
// //       return null;
// //     }
// //   }

// //   // =====================================================
// //   // UPDATE  →  PATCH /api/delivery-notes/<id>/
// //   // =====================================================
// //   async updateDeliveryNote(id, data) {
// //     try {
// //       const res = await ApiClient.patch(`/delivery-notes/${id}/`, data);
// //       if (res.status === 200) {
// //         toast.success("Delivery note updated successfully!");
// //         return res.data?.data || res.data;
// //       }
// //       toast.error("Failed to update delivery note");
// //       return null;
// //     } catch (error) {
// //       console.error("❌ updateDeliveryNote error:", error);
// //       toast.error(
// //         error?.response?.data?.message || "Error updating delivery note"
// //       );
// //       return null;
// //     }
// //   }

// //   // =====================================================
// //   // DELETE  →  DELETE /api/delivery-notes/<id>/
// //   // =====================================================
// //   async deleteDeliveryNote(id) {
// //     try {
// //       const res = await ApiClient.delete(`/delivery-notes/${id}/`);
// //       if (res.status === 204 || res.status === 200) {
// //         toast.success("Delivery note deleted successfully");
// //         return true;
// //       }
// //       toast.error("Failed to delete delivery note");
// //       return false;
// //     } catch (error) {
// //       console.error("❌ deleteDeliveryNote error:", error);
// //       toast.error("Error deleting delivery note");
// //       return false;
// //     }
// //   }

// //   // =====================================================
// //   // ACTION  →  POST /api/delivery-notes/<id>/action/
// //   // e.g. submit, cancel_dn
// //   // =====================================================
// //   async performAction(id, action) {
// //     try {
// //       const res = await ApiClient.post(`/delivery-notes/${id}/action/`, {
// //         action,
// //       });
// //       if (res.status === 200) {
// //         toast.success(res.data?.message || `Action "${action}" performed`);
// //         return res.data;
// //       }
// //       toast.error(`Failed to perform action: ${action}`);
// //       return null;
// //     } catch (error) {
// //       console.error(`❌ performAction (${action}) error:`, error);
// //       toast.error(
// //         error?.response?.data?.message || `Error performing action: ${action}`
// //       );
// //       return null;
// //     }
// //   }

// //   // =====================================================
// //   // ADD COMMENT  →  POST /api/delivery-notes/<id>/comments/
// //   // =====================================================
// //   async addComment(id, comment) {
// //     try {
// //       const res = await ApiClient.post(`/delivery-notes/${id}/comments/`, {
// //         comment,
// //       });
// //       if (res.status === 201 || res.status === 200) {
// //         toast.success("Comment added");
// //         return res.data?.data || res.data;
// //       }
// //       toast.error("Failed to add comment");
// //       return null;
// //     } catch (error) {
// //       console.error("❌ addComment error:", error);
// //       toast.error("Error adding comment");
// //       return null;
// //     }
// //   }

// //   // =====================================================
// //   // UPLOAD ATTACHMENT  →  POST /api/delivery-notes/<id>/attachments/
// //   // =====================================================
// //   async uploadAttachment(id, file, description = "") {
// //     try {
// //       const formData = new FormData();
// //       formData.append("file", file);
// //       formData.append("description", description);

// //       const res = await ApiClient.post(
// //         `/delivery-notes/${id}/attachments/`,
// //         formData,
// //         { headers: { "Content-Type": "multipart/form-data" } }
// //       );

// //       if (res.status === 201 || res.status === 200) {
// //         toast.success("Attachment uploaded");
// //         return res.data?.data || res.data;
// //       }
// //       toast.error("Failed to upload attachment");
// //       return null;
// //     } catch (error) {
// //       console.error("❌ uploadAttachment error:", error);
// //       toast.error("Error uploading attachment");
// //       return null;
// //     }
// //   }

// //   // =====================================================
// //   // DOWNLOAD PDF  →  GET /api/delivery-notes/<id>/pdf/
// //   // =====================================================
// //   async downloadPDF(id) {
// //     try {
// //       const res = await ApiClient.get(`/delivery-notes/${id}/pdf/`, {
// //         responseType: "blob",
// //       });
// //       if (res.status === 200) {
// //         const url = window.URL.createObjectURL(new Blob([res.data]));
// //         const link = document.createElement("a");
// //         link.href = url;
// //         link.setAttribute("download", `DN-${id}.pdf`);
// //         document.body.appendChild(link);
// //         link.click();
// //         link.remove();
// //         window.URL.revokeObjectURL(url);
// //         return true;
// //       }
// //       toast.error("Failed to download PDF");
// //       return false;
// //     } catch (error) {
// //       console.error("❌ downloadPDF error:", error);
// //       toast.error("Error downloading PDF");
// //       return false;
// //     }
// //   }

// //   // =====================================================
// //   // SEND EMAIL  →  POST /api/delivery-notes/<id>/email/
// //   // =====================================================
// //   async sendEmail(id, email = null) {
// //     try {
// //       const body = email ? { email } : {};
// //       const res = await ApiClient.post(`/delivery-notes/${id}/email/`, body);
// //       if (res.status === 200) {
// //         toast.success("Email sent successfully");
// //         return true;
// //       }
// //       toast.error("Failed to send email");
// //       return false;
// //     } catch (error) {
// //       console.error("❌ sendEmail error:", error);
// //       toast.error("Error sending email");
// //       return false;
// //     }
// //   }
// // }

// // const deliveryNoteApiProvider = new DeliveryNoteApiProvider();
// // export default deliveryNoteApiProvider;
// import ApiClient from "./api-client";
// import { toast } from "react-toastify";

// class DeliveryNoteApiProvider {

//   _extractList(raw) {
//     if (Array.isArray(raw)) return raw;
//     if (Array.isArray(raw?.data?.data)) return raw.data.data;
//     if (Array.isArray(raw?.data)) return raw.data;
//     if (Array.isArray(raw?.results)) return raw.results;
//     return [];
//   }

//   async fetchDeliveryNotes(page = 1, search = "") {
//     try {
//       const res = await ApiClient.get("/crm/delivery-notes/", {
//         params: { page, search },
//       });
//       if (res.status === 200) {
//         const raw = res.data?.data || res.data;
//         const list = this._extractList(res.data);
//         const deliveryNotes = list.map((item) => ({
//           ...item,
//           dn_id:           item.dn_id || item.id,
//           sales_order_ref: item.sales_order || item.sales_order_ref || "—",
//           customer_name:   item.customer?.first_name
//             ? `${item.customer.first_name} ${item.customer.last_name || ""}`.trim()
//             : item.customer_name || "—",
//           delivery_type:   item.delivery_type  || "—",
//           delivery_date:   item.delivery_date  || "—",
//           status:          item.status         || "—",
//         }));
//         return {
//           data:         deliveryNotes,
//           current_page: raw?.from ? Math.ceil(raw.from / 10) : page,
//           totalPages:   raw?.totalPages || raw?.total_pages || 1,
//         };
//       }
//       toast.error("Failed to load delivery notes");
//       return { data: [], current_page: 1, totalPages: 1 };
//     } catch (error) {
//       toast.error(error?.response?.data?.message || "Error fetching delivery notes");
//       return { data: [], current_page: 1, totalPages: 1 };
//     }
//   }

//   async fetchSingleDeliveryNote(id) {
//     try {
//       const res = await ApiClient.get(`/crm/delivery-notes/${id}/`);
//       if (res.status === 200) return res.data?.data || res.data;
//       toast.error("Failed to load delivery note");
//       return null;
//     } catch (error) {
//       toast.error("Error fetching delivery note details");
//       return null;
//     }
//   }

//   // fetch submitted sales orders for the dropdown
//   async fetchSubmittedSalesOrders() {
//     try {
//       const res = await ApiClient.get("/crm/sales-orders/", {
//         params: { status: "Submitted" },
//       });
//       if (res.status === 200) {
//         const list =
//           res.data?.data?.data ??
//           res.data?.data ??
//           res.data?.results ??
//           [];
//         return list;
//       }
//       return [];
//     } catch (error) {
//       console.error("Error fetching sales orders", error);
//       return [];
//     }
//   }

//   async createDeliveryNote(data) {
//     try {
//       const res = await ApiClient.post("/crm/delivery-notes/", data);
//       if (res.status === 201 || res.status === 200) {
//         toast.success("Delivery note created successfully!");
//         return res.data?.data || res.data;
//       }
//       toast.error("Failed to create delivery note");
//       return null;
//     } catch (error) {
//       toast.error(error?.response?.data?.message || "Error creating delivery note");
//       return null;
//     }
//   }

//   async updateDeliveryNote(id, data) {
//     try {
//       const res = await ApiClient.patch(`/crm/delivery-notes/${id}/`, data);
//       if (res.status === 200) {
//         toast.success("Delivery note updated successfully!");
//         return res.data?.data || res.data;
//       }
//       toast.error("Failed to update delivery note");
//       return null;
//     } catch (error) {
//       toast.error(error?.response?.data?.message || "Error updating delivery note");
//       return null;
//     }
//   }

//   async deleteDeliveryNote(id) {
//     try {
//       const res = await ApiClient.delete(`/crm/delivery-notes/${id}/`);
//       if (res.status === 204 || res.status === 200) {
//         toast.success("Delivery note deleted successfully");
//         return true;
//       }
//       toast.error("Failed to delete delivery note");
//       return false;
//     } catch (error) {
//       toast.error("Error deleting delivery note");
//       return false;
//     }
//   }

//   async performAction(id, action) {
//     try {
//       const res = await ApiClient.post(`/crm/delivery-notes/${id}/action/`, { action });
//       if (res.status === 200) {
//         toast.success(res.data?.message || `Action "${action}" performed`);
//         return res.data;
//       }
//       toast.error(`Failed to perform action: ${action}`);
//       return null;
//     } catch (error) {
//       toast.error(error?.response?.data?.message || `Error performing action: ${action}`);
//       return null;
//     }
//   }

//   async addComment(id, comment) {
//     try {
//       const res = await ApiClient.post(`/crm/delivery-notes/${id}/comments/`, { comment });
//       if (res.status === 201 || res.status === 200) {
//         toast.success("Comment added");
//         return res.data?.data || res.data;
//       }
//       toast.error("Failed to add comment");
//       return null;
//     } catch (error) {
//       toast.error("Error adding comment");
//       return null;
//     }
//   }

//   async uploadAttachment(id, file, description = "") {
//     try {
//       const formData = new FormData();
//       formData.append("file", file);
//       formData.append("description", description);
//       const res = await ApiClient.post(`/crm/delivery-notes/${id}/attachments/`, formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       if (res.status === 201 || res.status === 200) {
//         toast.success("Attachment uploaded");
//         return res.data?.data || res.data;
//       }
//       toast.error("Failed to upload attachment");
//       return null;
//     } catch (error) {
//       toast.error("Error uploading attachment");
//       return null;
//     }
//   }

//   async downloadPDF(id, dnId) {
//     try {
//       const res = await ApiClient.get(`/crm/delivery-notes/${id}/pdf/`, {
//         responseType: "blob",
//       });
//       if (res.status === 200) {
//         const url = window.URL.createObjectURL(new Blob([res.data]));
//         const link = document.createElement("a");
//         link.href = url;
//         link.setAttribute("download", `DN_${dnId || id}.pdf`);
//         document.body.appendChild(link);
//         link.click();
//         link.remove();
//         window.URL.revokeObjectURL(url);
//         return true;
//       }
//       toast.error("Failed to download PDF");
//       return false;
//     } catch (error) {
//       toast.error("Error downloading PDF");
//       return false;
//     }
//   }

//   async sendEmail(id, email = null) {
//     try {
//       const body = email ? { email } : {};
//       const res = await ApiClient.post(`/crm/delivery-notes/${id}/email/`, body);
//       if (res.status === 200) {
//         toast.success("Email sent successfully");
//         return true;
//       }
//       toast.error("Failed to send email");
//       return false;
//     } catch (error) {
//       toast.error("Error sending email");
//       return false;
//     }
//   }

//   async updateAcknowledgement(id, data) {
//     try {
//       const res = await ApiClient.patch(`/crm/delivery-notes/${id}/`, data);
//       if (res.status === 200) {
//         toast.success("Acknowledgement saved");
//         return res.data?.data || res.data;
//       }
//       toast.error("Failed to save acknowledgement");
//       return null;
//     } catch (error) {
//       toast.error("Error saving acknowledgement");
//       return null;
//     }
//   }
// }

// const deliveryNoteApiProvider = new DeliveryNoteApiProvider();
// export default deliveryNoteApiProvider;
import ApiClient from "./api-client";
import { toast } from "react-toastify";

class DeliveryNoteApiProvider {

  _extractList(raw) {
    if (Array.isArray(raw)) return raw;
    if (Array.isArray(raw?.data?.data)) return raw.data.data;
    if (Array.isArray(raw?.data)) return raw.data;
    if (Array.isArray(raw?.results)) return raw.results;
    return [];
  }

  async fetchDeliveryNotes(page = 1, search = "") {
    try {
      const res = await ApiClient.get("/crm/delivery-notes/", {
        params: { page, search },
      });
      if (res.status === 200) {
        const raw = res.data?.data || res.data;
        const list = this._extractList(res.data);
        const deliveryNotes = list.map((item) => ({
          ...item,
          dn_id:           item.dn_id || item.id,
          sales_order_ref: item.sales_order || item.sales_order_ref || "—",
          customer_name:   item.customer?.first_name
            ? `${item.customer.first_name} ${item.customer.last_name || ""}`.trim()
            : item.customer_name || "—",
          delivery_type:   item.delivery_type  || "—",
          delivery_date:   item.delivery_date  || "—",
          status:          item.status         || "—",
        }));
        return {
          data:         deliveryNotes,
          current_page: raw?.from ? Math.ceil(raw.from / 10) : page,
          totalPages:   raw?.totalPages || raw?.total_pages || 1,
        };
      }
      toast.error("Failed to load delivery notes");
      return { data: [], current_page: 1, totalPages: 1 };
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error fetching delivery notes");
      return { data: [], current_page: 1, totalPages: 1 };
    }
  }

  async fetchSingleDeliveryNote(id) {
    try {
      const res = await ApiClient.get(`/crm/delivery-notes/${id}/`);
      if (res.status === 200) return res.data?.data || res.data;
      toast.error("Failed to load delivery note");
      return null;
    } catch (error) {
      toast.error("Error fetching delivery note details");
      return null;
    }
  }

  // fetch submitted sales orders for the dropdown
  async fetchSubmittedSalesOrders() {
    try {
      const res = await ApiClient.get("/crm/sales-orders/", {
        params: { status: "Submitted" },
      });
      if (res.status === 200) {
        const list =
          res.data?.data?.data ??
          res.data?.data ??
          res.data?.results ??
          [];
        return list;
      }
      return [];
    } catch (error) {
      console.error("Error fetching sales orders", error);
      return [];
    }
  }

  async createDeliveryNote(data) {
    try {
      const res = await ApiClient.post("/crm/delivery-notes/", data);
      if (res.status === 201 || res.status === 200) {
        toast.success("Delivery note created successfully!");
        return res.data?.data || res.data;
      }
      toast.error("Failed to create delivery note");
      return null;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error creating delivery note");
      return null;
    }
  }

  async updateDeliveryNote(id, data) {
    try {
      const res = await ApiClient.patch(`/crm/delivery-notes/${id}/`, data);
      if (res.status === 200) {
        toast.success("Delivery note updated successfully!");
        return res.data?.data || res.data;
      }
      toast.error("Failed to update delivery note");
      return null;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error updating delivery note");
      return null;
    }
  }

  async deleteDeliveryNote(id) {
    try {
      const res = await ApiClient.delete(`/crm/delivery-notes/${id}/`);
      if (res.status === 204 || res.status === 200) {
        toast.success("Delivery note deleted successfully");
        return true;
      }
      toast.error("Failed to delete delivery note");
      return false;
    } catch (error) {
      toast.error("Error deleting delivery note");
      return false;
    }
  }

  async performAction(id, action) {
    try {
      const res = await ApiClient.post(`/crm/delivery-notes/${id}/action/`, { action });
      if (res.status === 200) {
        toast.success(res.data?.message || `Action "${action}" performed`);
        return res.data;
      }
      toast.error(`Failed to perform action: ${action}`);
      return null;
    } catch (error) {
      toast.error(error?.response?.data?.message || `Error performing action: ${action}`);
      return null;
    }
  }

  async addComment(id, comment) {
    try {
      const res = await ApiClient.post(`/crm/delivery-notes/${id}/comments/`, { comment });
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
      const res = await ApiClient.post(`/crm/delivery-notes/${id}/attachments/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
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

  async downloadPDF(id, dnId) {
    try {
      const res = await ApiClient.get(`/crm/delivery-notes/${id}/pdf/`, {
        responseType: "blob",
      });
      if (res.status === 200) {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `DN_${dnId || id}.pdf`);
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
      const res = await ApiClient.post(`/crm/delivery-notes/${id}/email/`, body);
      if (res.status === 200) {
        toast.success("Email sent successfully");
        return true;
      }
      toast.error("Failed to send email");
      return false;
    } catch (error) {
      toast.error("Error sending email");
      return false;
    }
  }

  async updateAcknowledgement(id, data) {
    try {
      const res = await ApiClient.patch(`/crm/delivery-notes/${id}/`, data);
      if (res.status === 200) {
        toast.success("Acknowledgement saved");
        return res.data?.data || res.data;
      }
      toast.error("Failed to save acknowledgement");
      return null;
    } catch (error) {
      toast.error("Error saving acknowledgement");
      return null;
    }
  }
}

const deliveryNoteApiProvider = new DeliveryNoteApiProvider();
export default deliveryNoteApiProvider;