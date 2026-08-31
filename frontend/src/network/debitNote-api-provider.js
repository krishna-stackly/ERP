import ApiClient from "./api-client";
import { toast } from "react-toastify";

class DebitNoteApiProvider {
  // =====================================================
  // FETCH DEBIT NOTES (paginated + search)
  // =====================================================
  async fetchDebitNotes(page = 1, search = "") {
    try {
      const res = await ApiClient.get("/finance/debit-notes/", {
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

      toast.error("Failed to load debit notes");
      return null;
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Error loading debit notes"
      );
      return null;
    }
  }

  // =====================================================
  // FETCH SINGLE DEBIT NOTE
  // =====================================================
  async fetchSingleDebitNote(id) {
    try {
      const res = await ApiClient.get(`/finance/debit-notes/${id}/`);

      if (res.status === 200) {
        return res.data?.data || res.data;
      }

      toast.error("Failed to load debit note");
      return null;
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Error fetching debit note details"
      );
      return null;
    }
  }

  // =====================================================
  // CREATE DEBIT NOTE
  // =====================================================
  async createDebitNote(data) {
    try {
      const res = await ApiClient.post("/finance/debit-notes/", data);

      if (res.status === 200 || res.status === 201) {
        toast.success("Debit note created successfully");
        return res.data?.data || res.data;
      }

      toast.error("Failed to create debit note");
      return null;
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Error creating debit note"
      );
      return null;
    }
  }

  // =====================================================
  // UPDATE DEBIT NOTE
  // =====================================================
  async updateDebitNote(id, data) {
    try {
      const res = await ApiClient.patch(`/finance/debit-notes/${id}/`, data);

      if (res.status === 200) {
        toast.success("Debit note updated successfully");
        return res.data?.data || res.data;
      }

      toast.error("Failed to update debit note");
      return null;
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Error updating debit note"
      );
      return null;
    }
  }

  // =====================================================
  // DELETE DEBIT NOTE
  // =====================================================
  async deleteDebitNote(id) {
    try {
      const res = await ApiClient.delete(`/finance/debit-notes/${id}/`);

      if (res.status === 200 || res.status === 204) {
        toast.success("Debit note deleted successfully");
        return true;
      }

      toast.error("Failed to delete debit note");
      return false;
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Error deleting debit note"
      );
      return false;
    }
  }

  // =====================================================
  // PERFORM ACTION
  // Actions: save_draft | mark_paid | cancel
  // =====================================================
  async performAction(id, action) {
    try {
      const res = await ApiClient.post(
        `/finance/debit-notes/${id}/action/`,
        { action }
      );

      if (res.status === 200) {
        toast.success(
          res.data?.message || `Action "${action}" performed successfully`
        );
        return res.data?.data || res.data;
      }

      toast.error(`Failed to ${action}`);
      return null;
    } catch (error) {
      toast.error(
        error?.response?.data?.message || `Error performing ${action}`
      );
      return null;
    }
  }

  // =====================================================
  // FETCH COMMENTS
  // =====================================================
  async fetchComments(id) {
    try {
      const res = await ApiClient.get(`/finance/debit-notes/${id}/comments/`);

      if (res.status === 200) {
        return res.data?.data ?? res.data?.results ?? res.data ?? [];
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
        `/finance/debit-notes/${id}/comments/`,
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
        error?.response?.data?.message || "Error adding comment"
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
        `/finance/debit-notes/${id}/attachments/`
      );

      if (res.status === 200) {
        return res.data?.data ?? res.data?.results ?? res.data ?? [];
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
        `/finance/debit-notes/${id}/attachments/`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (res.status === 201 || res.status === 200) {
        toast.success("Attachment uploaded successfully");
        return res.data?.data || res.data;
      }

      toast.error("Failed to upload attachment");
      return null;
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Error uploading attachment"
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
        `/finance/debit-notes/${id}/attachments/${attachmentId}/`
      );

      if (res.status === 200 || res.status === 204) {
        toast.success("Attachment deleted successfully");
        return true;
      }

      toast.error("Failed to delete attachment");
      return false;
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Error deleting attachment"
      );
      return false;
    }
  }

  // =====================================================
  // FETCH HISTORY
  // =====================================================
  async fetchHistory(id) {
    try {
      const res = await ApiClient.get(`/finance/debit-notes/${id}/history/`);

      if (res.status === 200) {
        return res.data?.data ?? res.data?.results ?? res.data ?? [];
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
  async downloadPDF(id, debitNoteNumber) {
    try {
      const res = await ApiClient.get(`/finance/debit-notes/${id}/pdf/`, {
        responseType: "blob",
      });

      if (res.status === 200) {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `DebitNote_${debitNoteNumber || id}.pdf`
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
        error?.response?.data?.message || "Error downloading PDF"
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
        `/finance/debit-notes/${id}/email/`,
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
        error?.response?.data?.message || "Error sending email"
      );
      return false;
    }
  }
}

const debitNoteApiProvider = new DebitNoteApiProvider();

export default debitNoteApiProvider;
