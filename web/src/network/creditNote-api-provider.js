// import ApiClient from "./api-client";
// import { toast } from "react-toastify";

// class CreditNoteApiProvider {

//   // =====================================================
//   // FETCH CREDIT NOTES (paginated + search)
//   // =====================================================
//   async fetchCreditNotes(page = 1, search = "") {
//     try {
//       const res = await ApiClient.get("/finance/credit-notes/", {
//         params: { page, ...(search ? { search } : {}) },
//       });
//       if (res.status === 200) return res.data;
//       toast.error("Failed to load credit notes");
//       return null;
//     } catch (error) {
//       toast.error(error?.response?.data?.message || "Error loading credit notes");
//       return null;
//     }
//   }

//   // =====================================================
//   // FETCH SINGLE CREDIT NOTE
//   // =====================================================
//   async fetchSingleCreditNote(id) {
//     try {
//       const res = await ApiClient.get(`/finance/credit-notes/${id}/`);
//       if (res.status === 200) return res.data?.data || res.data;
//       toast.error("Failed to load credit note");
//       return null;
//     } catch (error) {
//       toast.error("Error fetching credit note details");
//       return null;
//     }
//   }

//   // =====================================================
//   // FETCH SUBMITTED INVOICES (for the Invoice dropdown)
//   // =====================================================
//   async fetchSubmittedInvoices() {
//     try {
//       const res = await ApiClient.get("/finance/invoices/", {
//         params: { status: "Submitted" },
//       });
//       if (res.status === 200) {
//         return (
//           res.data?.data?.data ??
//           res.data?.data      ??
//           res.data?.results   ??
//           []
//         );
//       }
//       return [];
//     } catch (error) {
//       console.error("Error fetching invoices", error);
//       return [];
//     }
//   }

//   // =====================================================
//   // FETCH INVOICE DETAIL (to pre-fill credit note lines)
//   // =====================================================
//   async fetchInvoiceDetail(id) {
//     try {
//       const res = await ApiClient.get(`/finance/invoices/${id}/`);
//       if (res.status === 200) return res.data?.data ?? res.data;
//       return null;
//     } catch (error) {
//       console.error("Error fetching invoice detail", error);
//       return null;
//     }
//   }

//   // =====================================================
//   // CREATE CREDIT NOTE
//   // =====================================================
//   async createCreditNote(data) {
//     try {
//       const res = await ApiClient.post("/finance/credit-notes/", data);
//       if (res.status === 200 || res.status === 201) {
//         toast.success("Credit note created successfully");
//         return res.data?.data || res.data;
//       }
//       toast.error("Failed to create credit note");
//       return null;
//     } catch (error) {
//       toast.error(error?.response?.data?.message || "Error creating credit note");
//       return null;
//     }
//   }

//   // =====================================================
//   // UPDATE CREDIT NOTE
//   // =====================================================
//   async updateCreditNote(id, data) {
//     try {
//       const res = await ApiClient.patch(`/finance/credit-notes/${id}/`, data);
//       if (res.status === 200) {
//         toast.success("Credit note updated successfully");
//         return res.data?.data || res.data;
//       }
//       toast.error("Failed to update credit note");
//       return null;
//     } catch (error) {
//       toast.error(error?.response?.data?.message || "Error updating credit note");
//       return null;
//     }
//   }

//   // =====================================================
//   // DELETE CREDIT NOTE
//   // =====================================================
//   async deleteCreditNote(id) {
//     try {
//       const res = await ApiClient.delete(`/finance/credit-notes/${id}/`);
//       if (res.status === 200 || res.status === 204) {
//         toast.success("Credit note deleted successfully");
//         return true;
//       }
//       toast.error("Failed to delete credit note");
//       return false;
//     } catch (error) {
//       toast.error(error?.response?.data?.message || "Error deleting credit note");
//       return false;
//     }
//   }

//   // =====================================================
//   // PERFORM ACTION (e.g. Submit, Approve, Reject, Cancel)
//   // =====================================================
//   async performAction(id, action) {
//     try {
//       const res = await ApiClient.post(`/finance/credit-notes/${id}/action/`, { action });
//       if (res.status === 200) {
//         toast.success(res.data?.message || `Action "${action}" performed`);
//         return res.data;
//       }
//       toast.error(`Failed: ${action}`);
//       return null;
//     } catch (error) {
//       toast.error(error?.response?.data?.message || `Error: ${action}`);
//       return null;
//     }
//   }

//   // =====================================================
//   // ADD COMMENT
//   // =====================================================
//   async addComment(id, comment) {
//     try {
//       const res = await ApiClient.post(`/finance/credit-notes/${id}/comments/`, { comment });
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

//   // =====================================================
//   // UPLOAD ATTACHMENT
//   // =====================================================
//   async uploadAttachment(id, file, description = "") {
//     try {
//       const formData = new FormData();
//       formData.append("file", file);
//       formData.append("description", description);
//       const res = await ApiClient.post(
//         `/finance/credit-notes/${id}/attachments/`,
//         formData,
//         { headers: { "Content-Type": "multipart/form-data" } }
//       );
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

//   // =====================================================
//   // DELETE ATTACHMENT
//   // =====================================================
//   async deleteAttachment(creditNoteId, attachmentId) {
//     try {
//       const res = await ApiClient.delete(
//         `/finance/credit-notes/${creditNoteId}/attachments/${attachmentId}/`
//       );
//       if (res.status === 200 || res.status === 204) {
//         toast.success("Attachment removed");
//         return true;
//       }
//       toast.error("Failed to remove attachment");
//       return false;
//     } catch (error) {
//       toast.error("Error removing attachment");
//       return false;
//     }
//   }

//   // =====================================================
//   // DOWNLOAD PDF
//   // =====================================================
//   async downloadPDF(id, creditNoteId) {
//     try {
//       const res = await ApiClient.get(`/finance/credit-notes/${id}/pdf/`, {
//         responseType: "blob",
//       });
//       if (res.status === 200) {
//         const url  = window.URL.createObjectURL(new Blob([res.data]));
//         const link = document.createElement("a");
//         link.href  = url;
//         link.setAttribute("download", `CN_${creditNoteId || id}.pdf`);
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

//   // =====================================================
//   // SEND EMAIL
//   // =====================================================
//   async sendEmail(id, email = null) {
//     try {
//       const body = email ? { email } : {};
//       const res  = await ApiClient.post(`/finance/credit-notes/${id}/email/`, body);
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
// }

// const creditNoteApiProvider = new CreditNoteApiProvider();
// export default creditNoteApiProvider;
import ApiClient from "./api-client";
import { toast } from "react-toastify";

class CreditNoteApiProvider {
  // =====================================================
  // FETCH CREDIT NOTES (paginated + search)
  // =====================================================
  async fetchCreditNotes(page = 1, search = "") {
    try {
      const res = await ApiClient.get("/finance/credit-notes/", {
        params: { page, ...(search ? { search } : {}) },
      });

      if (res.status === 200) {
        return (
          res.data?.data?.data ??
          res.data?.data ??
          res.data?.results ??
          res.data
        );
      }

      toast.error("Failed to load credit notes");
      return null;
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Error loading credit notes"
      );
      return null;
    }
  }

  // =====================================================
  // FETCH SINGLE CREDIT NOTE
  // =====================================================
  async fetchSingleCreditNote(id) {
    try {
      const res = await ApiClient.get(`/finance/credit-notes/${id}/`);

      if (res.status === 200) {
        return res.data?.data || res.data;
      }

      toast.error("Failed to load credit note");
      return null;
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Error fetching credit note details"
      );
      return null;
    }
  }

  // =====================================================
  // CREATE CREDIT NOTE
  // =====================================================
  async createCreditNote(data) {
    try {
      const res = await ApiClient.post("/finance/credit-notes/", data);

      if (res.status === 200 || res.status === 201) {
        toast.success("Credit note created successfully");
        return res.data?.data || res.data;
      }

      toast.error("Failed to create credit note");
      return null;
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Error creating credit note"
      );
      return null;
    }
  }

  // =====================================================
  // UPDATE CREDIT NOTE
  // =====================================================
  async updateCreditNote(id, data) {
    try {
      const res = await ApiClient.patch(
        `/finance/credit-notes/${id}/`,
        data
      );

      if (res.status === 200) {
        toast.success("Credit note updated successfully");
        return res.data?.data || res.data;
      }

      toast.error("Failed to update credit note");
      return null;
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Error updating credit note"
      );
      return null;
    }
  }

  // =====================================================
  // DELETE CREDIT NOTE
  // =====================================================
  async deleteCreditNote(id) {
    try {
      const res = await ApiClient.delete(
        `/finance/credit-notes/${id}/`
      );

      if (res.status === 200 || res.status === 204) {
        toast.success("Credit note deleted successfully");
        return true;
      }

      toast.error("Failed to delete credit note");
      return false;
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Error deleting credit note"
      );
      return false;
    }
  }

  // =====================================================
  // PERFORM ACTION
  // Actions:
  // save_draft | mark_paid | cancel
  // =====================================================
  async performAction(id, action) {
    try {
      const res = await ApiClient.post(
        `/finance/credit-notes/${id}/action/`,
        { action }
      );

      if (res.status === 200) {
        toast.success(
          res.data?.message ||
            `Action "${action}" performed successfully`
        );

        return res.data?.data || res.data;
      }

      toast.error(`Failed to ${action}`);
      return null;
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          `Error performing ${action}`
      );

      return null;
    }
  }

  // =====================================================
  // FETCH COMMENTS
  // =====================================================
  async fetchComments(id) {
    try {
      const res = await ApiClient.get(
        `/finance/credit-notes/${id}/comments/`
      );

      if (res.status === 200) {
        return (
          res.data?.data ??
          res.data?.results ??
          res.data ??
          []
        );
      }

      return [];
    } catch (error) {
      console.error("Error fetching comments", error);
      return [];
    }
  }

  // =====================================================
  // ADD COMMENT
  // =====================================================
  async addComment(id, comment) {
    try {
      const res = await ApiClient.post(
        `/finance/credit-notes/${id}/comments/`,
        { comment }
      );

      if (res.status === 201 || res.status === 200) {
        toast.success("Comment added successfully");
        return res.data?.data || res.data;
      }

      toast.error("Failed to add comment");
      return null;
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Error adding comment"
      );

      return null;
    }
  }

  // =====================================================
  // FETCH ATTACHMENTS
  // =====================================================
  async fetchAttachments(id) {
    try {
      const res = await ApiClient.get(
        `/finance/credit-notes/${id}/attachments/`
      );

      if (res.status === 200) {
        return (
          res.data?.data ??
          res.data?.results ??
          res.data ??
          []
        );
      }

      return [];
    } catch (error) {
      console.error("Error fetching attachments", error);
      return [];
    }
  }

  // =====================================================
  // UPLOAD ATTACHMENT
  // =====================================================
  async uploadAttachment(id, file, description = "") {
    try {
      const formData = new FormData();

      formData.append("file", file);
      formData.append("description", description);

      const res = await ApiClient.post(
        `/finance/credit-notes/${id}/attachments/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.status === 201 || res.status === 200) {
        toast.success("Attachment uploaded successfully");
        return res.data?.data || res.data;
      }

      toast.error("Failed to upload attachment");
      return null;
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Error uploading attachment"
      );

      return null;
    }
  }

  // =====================================================
  // DELETE ATTACHMENT
  // =====================================================
  async deleteAttachment(id, attachmentId) {
    try {
      const res = await ApiClient.delete(
        `/finance/credit-notes/${id}/attachments/${attachmentId}/`
      );

      if (res.status === 200 || res.status === 204) {
        toast.success("Attachment deleted successfully");
        return true;
      }

      toast.error("Failed to delete attachment");
      return false;
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Error deleting attachment"
      );

      return false;
    }
  }

  // =====================================================
  // FETCH HISTORY
  // =====================================================
  async fetchHistory(id) {
    try {
      const res = await ApiClient.get(
        `/finance/credit-notes/${id}/history/`
      );

      if (res.status === 200) {
        return (
          res.data?.data ??
          res.data?.results ??
          res.data ??
          []
        );
      }

      return [];
    } catch (error) {
      console.error("Error fetching history", error);
      return [];
    }
  }

  // =====================================================
  // DOWNLOAD PDF
  // =====================================================
  async downloadPDF(id, creditNoteNumber) {
    try {
      const res = await ApiClient.get(
        `/finance/credit-notes/${id}/pdf/`,
        {
          responseType: "blob",
        }
      );

      if (res.status === 200) {
        const url = window.URL.createObjectURL(
          new Blob([res.data])
        );

        const link = document.createElement("a");

        link.href = url;

        link.setAttribute(
          "download",
          `CreditNote_${creditNoteNumber || id}.pdf`
        );

        document.body.appendChild(link);

        link.click();

        link.remove();

        window.URL.revokeObjectURL(url);

        toast.success("PDF downloaded successfully");

        return true;
      }

      toast.error("Failed to download PDF");
      return false;
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Error downloading PDF"
      );

      return false;
    }
  }

  // =====================================================
  // SEND EMAIL
  // =====================================================
  async sendEmail(id, email = null) {
    try {
      const payload = email ? { email } : {};

      const res = await ApiClient.post(
        `/finance/credit-notes/${id}/email/`,
        payload
      );

      if (res.status === 200) {
        toast.success("Email sent successfully");
        return true;
      }

      toast.error("Failed to send email");
      return false;
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Error sending email"
      );

      return false;
    }
  }
}

const creditNoteApiProvider = new CreditNoteApiProvider();

export default creditNoteApiProvider;