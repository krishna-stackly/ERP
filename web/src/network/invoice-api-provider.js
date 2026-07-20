// import ApiClient from "./api-client";
// import { toast } from "react-toastify";

// class InvoiceApiProvider {

//   // =====================================================
//   // FETCH INVOICES
//   // =====================================================
//   async fetchInvoices(page = 1, search = "") {
//     try {
//       const res = await ApiClient.get("/crm/invoices/", {
//         params: { page, search },
//       });

//       if (res.status === 200) {
//         return res.data;
//       }

//       toast.error("Failed to load invoices");
//       return null;
//     } catch (error) {
//       console.error("Error fetching invoices:", error);
//       toast.error(error?.response?.data?.message || "Error loading invoices");
//       return null;
//     }
//   }

//   // =====================================================
//   // CREATE INVOICE
//   // =====================================================
//   async createInvoice(data) {
//     try {
//       const res = await ApiClient.post("/crm/invoices/", data);

//       if (res.status === 200 || res.status === 201) {
//         toast.success("Invoice created successfully");
//         return res.data;
//       }

//       toast.error("Failed to create invoice");
//       return null;
//     } catch (error) {
//       console.error("Error creating invoice:", error);
//       toast.error(error?.response?.data?.message || "Error creating invoice");
//       return null;
//     }
//   }

//   // =====================================================
//   // UPDATE INVOICE
//   // =====================================================
//   async updateInvoice(invoiceId, data) {
//     try {
//       const res = await ApiClient.put(`/crm/invoices/${invoiceId}/`, data);

//       if (res.status === 200) {
//         toast.success("Invoice updated successfully");
//         return res.data;
//       }

//       toast.error("Failed to update invoice");
//       return null;
//     } catch (error) {
//       console.error("Error updating invoice:", error);
//       toast.error(error?.response?.data?.message || "Error updating invoice");
//       return null;
//     }
//   }

//   // =====================================================
//   // DELETE INVOICE
//   // =====================================================
//   async deleteInvoice(invoiceId) {
//     try {
//       const res = await ApiClient.delete(`/crm/invoices/${invoiceId}/`);

//       if (res.status === 200 || res.status === 204) {
//         toast.success("Invoice deleted successfully");
//         return true;
//       }

//       toast.error("Failed to delete invoice");
//       return false;
//     } catch (error) {
//       console.error("Delete invoice error:", error?.response?.data || error);
//       toast.error(error?.response?.data?.message || "Error deleting invoice");
//       return false;
//     }
//   }
// }

// const invoiceApiProvider = new InvoiceApiProvider();
// export default invoiceApiProvider;
import ApiClient from "./api-client";
import { toast } from "react-toastify";

class InvoiceApiProvider {

  _extractList(resData) {
    if (Array.isArray(resData?.data?.data)) return resData.data.data;
    if (Array.isArray(resData?.data))        return resData.data;
    if (Array.isArray(resData?.results))     return resData.results;
    if (Array.isArray(resData))              return resData;
    return [];
  }

  async fetchInvoices(page = 1, search = "") {
    try {
      const res = await ApiClient.get("/crm/invoices/", {
        params: { page, ...(search ? { search } : {}) },
      });
      if (res.status === 200) return res.data;
      toast.error("Failed to load invoices");
      return null;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error loading invoices");
      return null;
    }
  }

  async fetchSingleInvoice(id) {
    try {
      const res = await ApiClient.get(`/crm/invoices/${id}/`);
      if (res.status === 200) return res.data?.data || res.data;
      toast.error("Failed to load invoice");
      return null;
    } catch (error) {
      toast.error("Error fetching invoice details");
      return null;
    }
  }

  // fetch submitted sales orders for the SO dropdown
  async fetchSubmittedSalesOrders() {
    try {
      const res = await ApiClient.get("/crm/sales-orders/", {
        params: { status: "Submitted" },
      });
      if (res.status === 200) {
        return (
          res.data?.data?.data ??
          res.data?.data      ??
          res.data?.results   ??
          []
        );
      }
      return [];
    } catch (error) {
      console.error("Error fetching sales orders", error);
      return [];
    }
  }

  async fetchSalesOrderDetail(id) {
    try {
      const res = await ApiClient.get(`/crm/sales-orders/${id}/`);
      if (res.status === 200) return res.data?.data ?? res.data;
      return null;
    } catch (error) {
      console.error("Error fetching SO detail", error);
      return null;
    }
  }

  async createInvoice(data) {
    try {
      const res = await ApiClient.post("/crm/invoices/", data);
      if (res.status === 200 || res.status === 201) {
        toast.success("Invoice created successfully");
        return res.data?.data || res.data;
      }
      toast.error("Failed to create invoice");
      return null;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error creating invoice");
      return null;
    }
  }

  async updateInvoice(id, data) {
    try {
      const res = await ApiClient.patch(`/crm/invoices/${id}/`, data);
      if (res.status === 200) {
        toast.success("Invoice updated successfully");
        return res.data?.data || res.data;
      }
      toast.error("Failed to update invoice");
      return null;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error updating invoice");
      return null;
    }
  }

  async deleteInvoice(id) {
    try {
      const res = await ApiClient.delete(`/crm/invoices/${id}/`);
      if (res.status === 200 || res.status === 204) {
        toast.success("Invoice deleted successfully");
        return true;
      }
      toast.error("Failed to delete invoice");
      return false;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error deleting invoice");
      return false;
    }
  }

  async performAction(id, action) {
    try {
      const res = await ApiClient.post(`/crm/invoices/${id}/action/`, { action });
      if (res.status === 200) {
        toast.success(res.data?.message || `Action "${action}" performed`);
        return res.data;
      }
      toast.error(`Failed: ${action}`);
      return null;
    } catch (error) {
      toast.error(error?.response?.data?.message || `Error: ${action}`);
      return null;
    }
  }

  async addComment(id, comment) {
    try {
      const res = await ApiClient.post(`/crm/invoices/${id}/comments/`, { comment });
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
        `/crm/invoices/${id}/attachments/`,
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

  async deleteAttachment(invoiceId, attachmentId) {
    try {
      const res = await ApiClient.delete(
        `/crm/invoices/${invoiceId}/attachments/${attachmentId}/`
      );
      if (res.status === 200 || res.status === 204) {
        toast.success("Attachment removed");
        return true;
      }
      toast.error("Failed to remove attachment");
      return false;
    } catch (error) {
      toast.error("Error removing attachment");
      return false;
    }
  }

  async downloadPDF(id, invoiceId) {
    try {
      const res = await ApiClient.get(`/crm/invoices/${id}/pdf/`, {
        responseType: "blob",
      });
      if (res.status === 200) {
        const url  = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href  = url;
        link.setAttribute("download", `INV_${invoiceId || id}.pdf`);
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
      const res  = await ApiClient.post(`/crm/invoices/${id}/email/`, body);
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
}

const invoiceApiProvider = new InvoiceApiProvider();
export default invoiceApiProvider;