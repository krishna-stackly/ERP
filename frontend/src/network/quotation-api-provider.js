// // import ApiClient from "./api-client";
// // import { toast } from "react-toastify";

// // class QuotationApiProvider {

// //   // =====================================================
// //   // FETCH ALL QUOTATIONS
// //   // =====================================================
// //   async fetchQuotations(page = 1, search = "") {
// //     try {
// //       const res = await ApiClient.get("/crm/quotations/", {
// //         params: { page, search },
// //       });
// //       if (res.status === 200) return res.data;
// //       toast.error("Failed to load quotations");
// //       return null;
// //     } catch (error) {
// //       console.error("Error fetching quotations:", error);
// //       toast.error(error?.response?.data?.message || "Error loading quotations");
// //       return null;
// //     }
// //   }

// //   // =====================================================
// //   // FETCH SINGLE QUOTATION
// //   // =====================================================
// //   async fetchSingleQuotation(quotationId) {
// //     try {
// //       const res = await ApiClient.get(`/crm/quotations/${quotationId}/`);
// //       if (res.status === 200) return res.data;
// //       toast.error("Failed to load quotation");
// //       return null;
// //     } catch (error) {
// //       console.error("Error fetching quotation:", error);
// //       toast.error(error?.response?.data?.message || "Error loading quotation");
// //       return null;
// //     }
// //   }

// //   // =====================================================
// //   // FETCH DROPDOWN OPTIONS (customers, sales reps, etc.)
// //   // =====================================================
// //   async fetchDropdownOptions() {
// //     try {
// //       const res = await ApiClient.get("/crm/quotations/options/");
// //       if (res.status === 200) return res.data;
// //       return null;
// //     } catch (error) {
// //       console.error("Error fetching dropdown options:", error);
// //       return null;
// //     }
// //   }

// //   // =====================================================
// //   // CREATE QUOTATION
// //   // =====================================================
// //   async createQuotation(data) {
// //     try {
// //       const res = await ApiClient.post("/crm/quotations/", data);
// //       if (res.status === 200 || res.status === 201) {
// //         toast.success("Quotation created successfully");
// //         return res.data;
// //       }
// //       toast.error("Failed to create quotation");
// //       return null;
// //     } catch (error) {
// //       console.error("Error creating quotation:", error);
// //       toast.error(error?.response?.data?.message || "Error creating quotation");
// //       return null;
// //     }
// //   }

// //   // =====================================================
// //   // UPDATE QUOTATION
// //   // =====================================================
// //   async updateQuotation(quotationId, data) {
// //     try {
// //       const res = await ApiClient.put(`/crm/quotations/${quotationId}/`, data);
// //       if (res.status === 200) {
// //         toast.success("Quotation updated successfully");
// //         return res.data;
// //       }
// //       toast.error("Failed to update quotation");
// //       return null;
// //     } catch (error) {
// //       console.error("Error updating quotation:", error);
// //       toast.error(error?.response?.data?.message || "Error updating quotation");
// //       return null;
// //     }
// //   }

// //   // =====================================================
// //   // PERFORM ACTION (submit / approve / reject / convert)
// //   // =====================================================
// //   async performAction(quotationId, action) {
// //     try {
// //       const res = await ApiClient.post(
// //         `/crm/quotations/${quotationId}/action/`,
// //         { action }
// //       );
// //       if (res.status === 200) {
// //         toast.success(`Quotation ${action} successful`);
// //         return res.data;
// //       }
// //       toast.error(`Failed to ${action} quotation`);
// //       return null;
// //     } catch (error) {
// //       console.error(`Error performing action "${action}":`, error);
// //       toast.error(error?.response?.data?.message || `Error: ${action} failed`);
// //       return null;
// //     }
// //   }

// //   // =====================================================
// //   // DELETE QUOTATION
// //   // =====================================================
// //   async deleteQuotation(quotationId) {
// //     try {
// //       const res = await ApiClient.delete(`/crm/quotations/${quotationId}/`);
// //       if (res.status === 200 || res.status === 204) {
// //         toast.success("Quotation deleted successfully");
// //         return true;
// //       }
// //       toast.error("Failed to delete quotation");
// //       return false;
// //     } catch (error) {
// //       console.error("Delete quotation error:", error?.response?.data || error);
// //       toast.error(error?.response?.data?.message || "Error deleting quotation");
// //       return false;
// //     }
// //   }

// //   // =====================================================
// //   // GENERATE PDF
// //   // =====================================================
// //   async generatePdf(quotationId) {
// //     try {
// //       const res = await ApiClient.get(`/crm/quotations/${quotationId}/pdf/`, {
// //         responseType: "blob",
// //       });
// //       if (res.status === 200) {
// //         const url = URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
// //         const link = document.createElement("a");
// //         link.href = url;
// //         link.download = `quotation_${quotationId}.pdf`;
// //         link.click();
// //         URL.revokeObjectURL(url);
// //         return true;
// //       }
// //       toast.error("Failed to generate PDF");
// //       return false;
// //     } catch (error) {
// //       console.error("PDF generation error:", error);
// //       toast.error("Error generating PDF");
// //       return false;
// //     }
// //   }

// //   // =====================================================
// //   // SEND EMAIL
// //   // =====================================================
// //   async sendEmail(quotationId) {
// //     try {
// //       const res = await ApiClient.post(`/crm/quotations/${quotationId}/send-email/`);
// //       if (res.status === 200) {
// //         toast.success("Email sent successfully");
// //         return true;
// //       }
// //       toast.error("Failed to send email");
// //       return false;
// //     } catch (error) {
// //       console.error("Send email error:", error);
// //       toast.error("Error sending email");
// //       return false;
// //     }
// //   }

// //   // =====================================================
// //   // FETCH REVISION HISTORY
// //   // =====================================================
// //   async fetchRevisionHistory(quotationId) {
// //     try {
// //       const res = await ApiClient.get(`/crm/quotations/${quotationId}/revisions/`);
// //       if (res.status === 200) return res.data;
// //       return null;
// //     } catch (error) {
// //       console.error("Error fetching revision history:", error);
// //       return null;
// //     }
// //   }

// //   // =====================================================
// //   // ADD COMMENT
// //   // =====================================================
// //   async addComment(quotationId, comment) {
// //     try {
// //       const res = await ApiClient.post(
// //         `/crm/quotations/${quotationId}/comments/`,
// //         { comment }
// //       );
// //       if (res.status === 200 || res.status === 201) return res.data;
// //       return null;
// //     } catch (error) {
// //       console.error("Error adding comment:", error);
// //       return null;
// //     }
// //   }

// //   // =====================================================
// //   // FETCH COMMENTS
// //   // =====================================================
// //   async fetchComments(quotationId) {
// //     try {
// //       const res = await ApiClient.get(`/crm/quotations/${quotationId}/comments/`);
// //       if (res.status === 200) return res.data;
// //       return null;
// //     } catch (error) {
// //       console.error("Error fetching comments:", error);
// //       return null;
// //     }
// //   }

// //   // =====================================================
// //   // UPLOAD ATTACHMENT
// //   // =====================================================
// //   async uploadAttachment(quotationId, file) {
// //     try {
// //       const formData = new FormData();
// //       formData.append("file", file);
// //       const res = await ApiClient.post(
// //         `/crm/quotations/${quotationId}/attachments/`,
// //         formData,
// //         { headers: { "Content-Type": "multipart/form-data" } }
// //       );
// //       if (res.status === 200 || res.status === 201) return res.data;
// //       return null;
// //     } catch (error) {
// //       console.error("Error uploading attachment:", error);
// //       return null;
// //     }
// //   }

// //   // =====================================================
// //   // DELETE ATTACHMENT
// //   // =====================================================
// //   async deleteAttachment(quotationId, attachmentId) {
// //     try {
// //       const res = await ApiClient.delete(
// //         `/crm/quotations/${quotationId}/attachments/${attachmentId}/`
// //       );
// //       if (res.status === 200 || res.status === 204) return true;
// //       return false;
// //     } catch (error) {
// //       console.error("Error deleting attachment:", error);
// //       return false;
// //     }
// //   }
// // }

// // const quotationApiProvider = new QuotationApiProvider();
// // export default quotationApiProvider;
// import ApiClient from "./api-client";
// import { toast } from "react-toastify";

// class QuotationApiProvider {

//   // =====================================================
//   // FETCH ALL QUOTATIONS
//   // =====================================================
//   async fetchQuotations(page = 1, search = "") {
//     try {
//       const res = await ApiClient.get("/crm/quotations/", {
//         params: { page, search },
//       });
//       if (res.status === 200) return res.data;
//       toast.error("Failed to load quotations");
//       return null;
//     } catch (error) {
//       console.error("Error fetching quotations:", error);
//       toast.error(error?.response?.data?.message || "Error loading quotations");
//       return null;
//     }
//   }

//   // =====================================================
//   // FETCH SINGLE QUOTATION
//   // =====================================================
//   async fetchSingleQuotation(quotationId) {
//     try {
//       const res = await ApiClient.get(`/crm/quotations/${quotationId}/`);
//       if (res.status === 200) return res.data;
//       toast.error("Failed to load quotation");
//       return null;
//     } catch (error) {
//       console.error("Error fetching quotation:", error);
//       toast.error(error?.response?.data?.message || "Error loading quotation");
//       return null;
//     }
//   }

//   // =====================================================
//   // FETCH DROPDOWN OPTIONS (customers, sales reps, etc.)
//   // =====================================================
//   async fetchDropdownOptions() {
//     try {
//       const res = await ApiClient.get("/crm/quotations/options/");
//       if (res.status === 200) return res.data;
//       return null;
//     } catch (error) {
//       console.error("Error fetching dropdown options:", error);
//       return null;
//     }
//   }

//   // =====================================================
//   // CREATE QUOTATION
//   // =====================================================
//   async createQuotation(data) {
//     try {
//       const res = await ApiClient.post("/crm/quotations/", data);
//       if (res.status === 200 || res.status === 201) {
//         toast.success("Quotation created successfully");
//         return res.data;
//       }
//       toast.error("Failed to create quotation");
//       return null;
//     } catch (error) {
//       console.error("Error creating quotation:", error);
//       toast.error(error?.response?.data?.message || "Error creating quotation");
//       return null;
//     }
//   }

//   // =====================================================
//   // UPDATE QUOTATION
//   // =====================================================
//   async updateQuotation(quotationId, data) {
//     try {
//       const res = await ApiClient.put(`/crm/quotations/${quotationId}/`, data);
//       if (res.status === 200) {
//         toast.success("Quotation updated successfully");
//         return res.data;
//       }
//       toast.error("Failed to update quotation");
//       return null;
//     } catch (error) {
//       console.error("Error updating quotation:", error);
//       toast.error(error?.response?.data?.message || "Error updating quotation");
//       return null;
//     }
//   }

//   // =====================================================
//   // PERFORM ACTION (submit / approve / reject / convert)
//   // =====================================================
//   async performAction(quotationId, action) {
//     try {
//       const res = await ApiClient.post(
//         `/crm/quotations/${quotationId}/action/`,
//         { action }
//       );
//       if (res.status === 200) {
//         toast.success(`Quotation ${action} successful`);
//         return res.data;
//       }
//       toast.error(`Failed to ${action} quotation`);
//       return null;
//     } catch (error) {
//       console.error(`Error performing action "${action}":`, error);
//       toast.error(error?.response?.data?.message || `Error: ${action} failed`);
//       return null;
//     }
//   }

//   // =====================================================
//   // DELETE QUOTATION
//   // =====================================================
//   async deleteQuotation(quotationId) {
//     try {
//       const res = await ApiClient.delete(`/crm/quotations/${quotationId}/`);
//       if (res.status === 200 || res.status === 204) {
//         toast.success("Quotation deleted successfully");
//         return true;
//       }
//       toast.error("Failed to delete quotation");
//       return false;
//     } catch (error) {
//       console.error("Delete quotation error:", error?.response?.data || error);
//       toast.error(error?.response?.data?.message || "Error deleting quotation");
//       return false;
//     }
//   }

//   // =====================================================
//   // GENERATE PDF
//   // =====================================================
//   async generatePdf(quotationId) {
//     try {
//       const res = await ApiClient.get(`/crm/quotations/${quotationId}/pdf/`, {
//         responseType: "blob",
//       });
//       if (res.status === 200) {
//         const url = URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
//         const link = document.createElement("a");
//         link.href = url;
//         link.download = `quotation_${quotationId}.pdf`;
//         link.click();
//         URL.revokeObjectURL(url);
//         return true;
//       }
//       toast.error("Failed to generate PDF");
//       return false;
//     } catch (error) {
//       console.error("PDF generation error:", error);
//       toast.error("Error generating PDF");
//       return false;
//     }
//   }

//   // =====================================================
//   // SEND EMAIL
//   // =====================================================
//   async sendEmail(quotationId) {
//     try {
//       const res = await ApiClient.post(`/crm/quotations/${quotationId}/send-email/`);
//       if (res.status === 200) {
//         toast.success("Email sent successfully");
//         return true;
//       }
//       toast.error("Failed to send email");
//       return false;
//     } catch (error) {
//       console.error("Send email error:", error);
//       toast.error("Error sending email");
//       return false;
//     }
//   }

//   // =====================================================
//   // FETCH REVISION HISTORY
//   // =====================================================
//   async fetchRevisionHistory(quotationId) {
//     try {
//       const res = await ApiClient.get(`/crm/quotations/${quotationId}/revisions/`);
//       if (res.status === 200) return res.data;
//       return null;
//     } catch (error) {
//       console.error("Error fetching revision history:", error);
//       return null;
//     }
//   }

//   // =====================================================
//   // ADD COMMENT
//   // =====================================================
//   async addComment(quotationId, comment) {
//     try {
//       const res = await ApiClient.post(
//         `/crm/quotations/${quotationId}/comments/`,
//         { comment }
//       );
//       if (res.status === 200 || res.status === 201) return res.data;
//       return null;
//     } catch (error) {
//       console.error("Error adding comment:", error);
//       return null;
//     }
//   }

//   // =====================================================
//   // FETCH COMMENTS
//   // =====================================================
//   async fetchComments(quotationId) {
//     try {
//       const res = await ApiClient.get(`/crm/quotations/${quotationId}/comments/`);
//       if (res.status === 200) return res.data;
//       return null;
//     } catch (error) {
//       console.error("Error fetching comments:", error);
//       return null;
//     }
//   }

//   // =====================================================
//   // UPLOAD ATTACHMENT
//   // =====================================================
//   async uploadAttachment(quotationId, file) {
//     try {
//       const formData = new FormData();
//       formData.append("file", file);
//       const res = await ApiClient.post(
//         `/crm/quotations/${quotationId}/attachments/`,
//         formData,
//         { headers: { "Content-Type": "multipart/form-data" } }
//       );
//       if (res.status === 200 || res.status === 201) return res.data;
//       return null;
//     } catch (error) {
//       console.error("Error uploading attachment:", error);
//       return null;
//     }
//   }

//   // =====================================================
//   // DELETE ATTACHMENT
//   // =====================================================
//   async deleteAttachment(quotationId, attachmentId) {
//     try {
//       const res = await ApiClient.delete(
//         `/crm/quotations/${quotationId}/attachments/${attachmentId}/`
//       );
//       if (res.status === 200 || res.status === 204) return true;
//       return false;
//     } catch (error) {
//       console.error("Error deleting attachment:", error);
//       return false;
//     }
//   }
// }

// const quotationApiProvider = new QuotationApiProvider();
// export default quotationApiProvider;
import ApiClient from "./api-client";
import { toast } from "react-toastify";

class QuotationApiProvider {

  // =====================================================
  // FETCH ALL QUOTATIONS
  // =====================================================
  async fetchQuotations(page = 1, search = "") {
  try {
    const res = await ApiClient.get("/crm/quotations/", {
      params: { page, ...(search ? { search } : {}) },
    });
    if (res.status === 200) {
      // ✅ actual shape: { message, data: { from, to, totalCount, totalPages, data: [...] } }
      const raw  = res.data?.data;
      const list = Array.isArray(raw?.data) ? raw.data : [];

      return {
        data:         list,
        current_page: raw?.from ? Math.ceil(raw.from / 10) : page,
        totalPages:   raw?.totalPages || 1,
      };
    }
    toast.error("Failed to load quotations");
    return { data: [], current_page: 1, totalPages: 1 };
  } catch (error) {
    console.error("Error fetching quotations:", error);
    toast.error(error?.response?.data?.message || "Error loading quotations");
    return { data: [], current_page: 1, totalPages: 1 };
  }
}
  // =====================================================
  // FETCH SINGLE QUOTATION
  // =====================================================
  async fetchSingleQuotation(quotationId) {
    try {
      const res = await ApiClient.get(`/crm/quotations/${quotationId}/`);
      if (res.status === 200) return res.data?.data || res.data;
      toast.error("Failed to load quotation");
      return null;
    } catch (error) {
      console.error("Error fetching quotation:", error);
      toast.error(error?.response?.data?.message || "Error loading quotation");
      return null;
    }
  }

  // =====================================================
  // CREATE QUOTATION
  // =====================================================
  async createQuotation(data) {
    try {
      const res = await ApiClient.post("/crm/quotations/", data);
      if (res.status === 200 || res.status === 201) {
        toast.success("Quotation created successfully");
        return res.data?.data || res.data;
      }
      toast.error("Failed to create quotation");
      return null;
    } catch (error) {
      console.error("Error creating quotation:", error);
      toast.error(error?.response?.data?.message || "Error creating quotation");
      return null;
    }
  }

  // =====================================================
  // UPDATE QUOTATION  ✅ PATCH (not PUT)
  // =====================================================
  async updateQuotation(quotationId, data) {
    try {
      const res = await ApiClient.patch(`/crm/quotations/${quotationId}/`, data);
      if (res.status === 200) {
        toast.success("Quotation updated successfully");
        return res.data?.data || res.data;
      }
      toast.error("Failed to update quotation");
      return null;
    } catch (error) {
      console.error("Error updating quotation:", error);
      toast.error(error?.response?.data?.message || "Error updating quotation");
      return null;
    }
  }

  // =====================================================
  // PERFORM ACTION (submit / approve / reject / convert / revise)
  // =====================================================
  async performAction(quotationId, action, extra = {}) {
    try {
      const res = await ApiClient.post(
        `/crm/quotations/${quotationId}/action/`,
        { action, ...extra }
      );
      if (res.status === 200) {
        toast.success(res.data?.message || `Action "${action}" successful`);
        return res.data?.data || res.data;
      }
      toast.error(`Failed to perform: ${action}`);
      return null;
    } catch (error) {
      console.error(`Error performing action "${action}":`, error);
      toast.error(error?.response?.data?.message || `Error: ${action} failed`);
      return null;
    }
  }

  // =====================================================
  // DELETE QUOTATION
  // =====================================================
  async deleteQuotation(quotationId) {
    try {
      const res = await ApiClient.delete(`/crm/quotations/${quotationId}/`);
      if (res.status === 200 || res.status === 204) {
        toast.success("Quotation deleted successfully");
        return true;
      }
      toast.error("Failed to delete quotation");
      return false;
    } catch (error) {
      console.error("Delete quotation error:", error?.response?.data || error);
      toast.error(error?.response?.data?.message || "Error deleting quotation");
      return false;
    }
  }

  // =====================================================
  // GENERATE PDF
  // =====================================================
  async generatePdf(quotationId, quotationDisplayId) {
    try {
      const res = await ApiClient.get(`/crm/quotations/${quotationId}/pdf/`, {
        responseType: "blob",
      });
      if (res.status === 200) {
        const url  = URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
        const link = document.createElement("a");
        link.href  = url;
        link.download = `QUO_${quotationDisplayId || quotationId}.pdf`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
        return true;
      }
      toast.error("Failed to generate PDF");
      return false;
    } catch (error) {
      console.error("PDF generation error:", error);
      toast.error("Error generating PDF");
      return false;
    }
  }

  // =====================================================
  // SEND EMAIL  ✅ /email/ (not /send-email/)
  // =====================================================
  async sendEmail(quotationId, email = null) {
    try {
      const body = email ? { email } : {};
      const res  = await ApiClient.post(
        `/crm/quotations/${quotationId}/email/`,
        body
      );
      if (res.status === 200) {
        toast.success("Email sent successfully");
        return true;
      }
      toast.error("Failed to send email");
      return false;
    } catch (error) {
      console.error("Send email error:", error);
      toast.error("Error sending email");
      return false;
    }
  }

  // =====================================================
  // UPLOAD ATTACHMENT
  // =====================================================
  async uploadAttachment(quotationId, file, description = "") {
    try {
      const formData = new FormData();
      formData.append("file", file);
      if (description) formData.append("description", description);
      const res = await ApiClient.post(
        `/crm/quotations/${quotationId}/attachments/`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      if (res.status === 200 || res.status === 201) {
        toast.success("Attachment uploaded");
        return res.data?.data || res.data;
      }
      toast.error("Failed to upload attachment");
      return null;
    } catch (error) {
      console.error("Error uploading attachment:", error);
      toast.error("Error uploading attachment");
      return null;
    }
  }

  // =====================================================
  // DELETE ATTACHMENT  ✅ /attachments/<id>/delete/ per your API docs
  // =====================================================
  async deleteAttachment(quotationId, attachmentId) {
    try {
      const res = await ApiClient.delete(
        `/crm/attachments/${attachmentId}/delete/`
      );
      if (res.status === 200 || res.status === 204) {
        toast.success("Attachment removed");
        return true;
      }
      toast.error("Failed to remove attachment");
      return false;
    } catch (error) {
      console.error("Error deleting attachment:", error);
      toast.error("Error removing attachment");
      return false;
    }
  }

  // =====================================================
  // ADD COMMENT
  // =====================================================
  async addComment(quotationId, comment) {
    try {
      const res = await ApiClient.post(
        `/crm/quotations/${quotationId}/comments/`,
        { comment }
      );
      if (res.status === 200 || res.status === 201) {
        toast.success("Comment added");
        return res.data?.data || res.data;
      }
      toast.error("Failed to add comment");
      return null;
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Error adding comment");
      return null;
    }
  }

  // =====================================================
  // FETCH REVISION HISTORY
  // =====================================================
  async fetchRevisionHistory(quotationId) {
    try {
      const res = await ApiClient.get(`/crm/quotations/${quotationId}/revisions/`);
      if (res.status === 200) return res.data?.data || res.data;
      return null;
    } catch (error) {
      console.error("Error fetching revision history:", error);
      return null;
    }
  }
}

const quotationApiProvider = new QuotationApiProvider();
export default quotationApiProvider;