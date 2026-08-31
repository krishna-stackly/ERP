// import ApiClient from "./api-client";
// import { toast } from "react-toastify";

// class InvoiceReturnApiProvider {

//   // =====================================================
//   // FETCH INVOICE RETURNS
//   // =====================================================
//   async fetchInvoiceReturns(page = 1, search = "") {
//     try {
//       const res = await ApiClient.get("/crm/invoice-returns/", {
//         params: { page, search },
//       });

//       if (res.status === 200) {
//         return res.data;
//       }

//       toast.error("Failed to load invoice returns");
//       return null;
//     } catch (error) {
//       console.error("Error fetching invoice returns:", error);
//       toast.error(error?.response?.data?.message || "Error loading invoice returns");
//       return null;
//     }
//   }

//   // =====================================================
//   // CREATE INVOICE RETURN
//   // =====================================================
//   async createInvoiceReturn(data) {
//     try {
//       const res = await ApiClient.post("/crm/invoice-returns/", data);

//       if (res.status === 200 || res.status === 201) {
//         toast.success("Invoice Return created successfully");
//         return res.data;
//       }

//       toast.error("Failed to create invoice return");
//       return null;
//     } catch (error) {
//       console.error("Error creating invoice return:", error);
//       toast.error(error?.response?.data?.message || "Error creating invoice return");
//       return null;
//     }
//   }

//   // =====================================================
//   // UPDATE INVOICE RETURN
//   // =====================================================
//   async updateInvoiceReturn(returnId, data) {
//     try {
//       const res = await ApiClient.put(`/crm/invoice-returns/${returnId}/`, data);

//       if (res.status === 200) {
//         toast.success("Invoice Return updated successfully");
//         return res.data;
//       }

//       toast.error("Failed to update invoice return");
//       return null;
//     } catch (error) {
//       console.error("Error updating invoice return:", error);
//       toast.error(error?.response?.data?.message || "Error updating invoice return");
//       return null;
//     }
//   }

//   // =====================================================
//   // DELETE INVOICE RETURN
//   // =====================================================
//   async deleteInvoiceReturn(returnId) {
//     try {
//       const res = await ApiClient.delete(`/crm/invoice-returns/${returnId}/`);

//       if (res.status === 200 || res.status === 204) {
//         toast.success("Invoice Return deleted successfully");
//         return true;
//       }

//       toast.error("Failed to delete invoice return");
//       return false;
//     } catch (error) {
//       console.error("Delete invoice return error:", error?.response?.data || error);
//       toast.error(error?.response?.data?.message || "Error deleting invoice return");
//       return false;
//     }
//   }
// }

// const invoiceReturnApiProvider = new InvoiceReturnApiProvider();
// export default invoiceReturnApiProvider;
import ApiClient from "./api-client";
import { toast } from "react-toastify";

class InvoiceReturnApiProvider {

  // =====================================================
  // FETCH INVOICE RETURNS
  // =====================================================
  async fetchInvoiceReturns(page = 1, search = "") {
    try {
      const res = await ApiClient.get("/crm/invoice-returns/", {
        params: { page, search },
      });
      if (res.status === 200) return res.data;
      toast.error("Failed to load invoice returns");
      return null;
    } catch (error) {
      console.error("Error fetching invoice returns:", error);
      toast.error(error?.response?.data?.message || "Error loading invoice returns");
      return null;
    }
  }

  // =====================================================
  // CREATE INVOICE RETURN
  // =====================================================
  async createInvoiceReturn(data) {
    try {
      const res = await ApiClient.post("/crm/invoice-returns/", data);
      if (res.status === 200 || res.status === 201) {
        toast.success("Invoice Return created successfully");
        return res.data;
      }
      toast.error("Failed to create invoice return");
      return null;
    } catch (error) {
      console.error("Error creating invoice return:", error);
      toast.error(error?.response?.data?.message || "Error creating invoice return");
      return null;
    }
  }

  // =====================================================
  // UPDATE INVOICE RETURN
  // =====================================================
  async updateInvoiceReturn(returnId, data) {
    try {
      const res = await ApiClient.put(`/crm/invoice-returns/${returnId}/`, data);
      if (res.status === 200) {
        toast.success("Invoice Return updated successfully");
        return res.data;
      }
      toast.error("Failed to update invoice return");
      return null;
    } catch (error) {
      console.error("Error updating invoice return:", error);
      toast.error(error?.response?.data?.message || "Error updating invoice return");
      return null;
    }
  }

  // =====================================================
  // DELETE INVOICE RETURN
  // =====================================================
  async deleteInvoiceReturn(returnId) {
    try {
      const res = await ApiClient.delete(`/crm/invoice-returns/${returnId}/`);
      if (res.status === 200 || res.status === 204) {
        toast.success("Invoice Return deleted successfully");
        return true;
      }
      toast.error("Failed to delete invoice return");
      return false;
    } catch (error) {
      console.error("Delete invoice return error:", error?.response?.data || error);
      toast.error(error?.response?.data?.message || "Error deleting invoice return");
      return false;
    }
  }

  // =====================================================
  // DOWNLOAD PDF  —  GET /crm/invoice-returns/{id}/pdf/
  // =====================================================
  async downloadPDF(returnId, invoiceReturnId = "draft") {
    try {
      const res = await ApiClient.get(`/crm/invoice-returns/${returnId}/pdf/`, {
        responseType: "blob",
      });
      const url  = window.URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href  = url;
      link.setAttribute("download", `InvoiceReturn_${invoiceReturnId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("PDF downloaded successfully");
    } catch (error) {
      console.error("Error downloading PDF:", error);
      toast.error(error?.response?.data?.message || "Failed to download PDF");
    }
  }

  // =====================================================
  // SEND EMAIL  —  POST /crm/invoice-returns/{id}/email/
  // Body: { "email": "customer@example.com" }
  // =====================================================
  async sendEmail(returnId, email) {
    try {
      const res = await ApiClient.post(`/crm/invoice-returns/${returnId}/email/`, { email });
      if (res.status === 200 || res.status === 201) {
        toast.success("Email sent successfully");
        return res.data;
      }
      toast.error("Failed to send email");
      return null;
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error(error?.response?.data?.message || "Failed to send email");
      return null;
    }
  }
}

const invoiceReturnApiProvider = new InvoiceReturnApiProvider();
export default invoiceReturnApiProvider;