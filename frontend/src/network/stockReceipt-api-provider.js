// // // import ApiClient from "./api-client";
// // // import { toast } from "react-toastify";

// // // class StockReceiptApiProvider {

// // //   // =====================================================
// // //   // FETCH STOCK RECEIPTS purchases
// // //   // =====================================================
// // //   async fetchStockReceipts(page = 1, search = "") {
// // //     try {
// // //       const res = await ApiClient.get("/purchases/stock-receipts/", {
// // //         params: { page, search },
// // //       });

// // //       if (res.status === 200) {
// // //         return res.data;
// // //       }

// // //       toast.error("Failed to load stock receipts");
// // //       return null;
// // //     } catch (error) {
// // //       console.error("Error fetching stock receipts:", error);
// // //       toast.error(error?.response?.data?.message || "Error loading stock receipts");
// // //       return null;
// // //     }
// // //   }

// // //   // =====================================================
// // //   // CREATE STOCK RECEIPT
// // //   // =====================================================
// // //   async createStockReceipt(data) {
// // //     try {
// // //       const res = await ApiClient.post("/purchases/stock-receipts/", data);

// // //       if (res.status === 200 || res.status === 201) {
// // //         toast.success("Stock Receipt created successfully");
// // //         return res.data;
// // //       }

// // //       toast.error("Failed to create stock receipt");
// // //       return null;
// // //     } catch (error) {
// // //       console.error("Error creating stock receipt:", error);
// // //       toast.error(error?.response?.data?.message || "Error creating stock receipt");
// // //       return null;
// // //     }
// // //   }

// // //   // =====================================================
// // //   // UPDATE STOCK RECEIPT
// // //   // =====================================================
// // //   async updateStockReceipt(receiptId, data) {
// // //     try {
// // //       const res = await ApiClient.put(`/purchases/stock-receipts/${receiptId}/`, data);

// // //       if (res.status === 200) {
// // //         toast.success("Stock Receipt updated successfully");
// // //         return res.data;
// // //       }

// // //       toast.error("Failed to update stock receipt");
// // //       return null;
// // //     } catch (error) {
// // //       console.error("Error updating stock receipt:", error);
// // //       toast.error(error?.response?.data?.message || "Error updating stock receipt");
// // //       return null;
// // //     }
// // //   }

// // //   // =====================================================
// // //   // DELETE STOCK RECEIPT
// // //   // =====================================================
// // //   async deleteStockReceipt(receiptId) {
// // //     try {
// // //       const res = await ApiClient.delete(`/purchases/stock-receipts/${receiptId}/`)

// // //       if (res.status === 200 || res.status === 204) {
// // //         toast.success("Stock Receipt deleted successfully");
// // //         return true;
// // //       }

// // //       toast.error("Failed to delete stock receipt");
// // //       return false;
// // //     } catch (error) {
// // //       console.error("Delete stock receipt error:", error?.response?.data || error);
// // //       toast.error(error?.response?.data?.message || "Error deleting stock receipt");
// // //       return false;
// // //     }
// // //   }
// // // }

// // // const stockReceiptApiProvider = new StockReceiptApiProvider();
// // // export default stockReceiptApiProvider;
// // // import ApiClient from "./api-client";
// // // import { toast } from "react-toastify";

// // // class StockReceiptApiProvider {

// // //   // =====================================================
// // //   // FETCH STOCK RECEIPTS
// // //   // GET /purchases/stock-receipts/
// // //   // =====================================================
// // //   async fetchStockReceipts(page = 1, search = "") {
// // //     try {
// // //       const res = await ApiClient.get("/purchase/stock-receipts/", {
// // //         params: { page, search },
// // //       });
// // //       if (res.status === 200) return res.data;
// // //       toast.error("Failed to load stock receipts");
// // //       return null;
// // //     } catch (error) {
// // //       toast.error(error?.response?.data?.message || "Error loading stock receipts");
// // //       return null;
// // //     }
// // //   }

// // //   // =====================================================
// // //   // CREATE STOCK RECEIPT  →  Save as Draft
// // //   // POST /purchases/stock-receipts/
// // //   // payload shape:
// // //   // {
// // //   //   po_reference:      <number>,
// // //   //   received_date:     "YYYY-MM-DD",
// // //   //   supplier_dn_no:    "...",
// // //   //   supplier_invoice_no: "...",
// // //   //   received_by:       "...",
// // //   //   qc_done_by:        "...",
// // //   //   items: [
// // //   //     {
// // //   //       product:         <number>,
// // //   //       uom:             "...",
// // //   //       qty_ordered:     <number>,
// // //   //       qty_received:    <number>,
// // //   //       accepted_qty:    <number>,
// // //   //       rejected_qty:    <number>,
// // //   //       qty_returned:    <number>,
// // //   //       stock_dim:       "Serial" | "Batch" | "None",
// // //   //       warehouse:       "...",
// // //   //       unit_price:      <number>,
// // //   //       tax_rate:        <number>,
// // //   //       discount_rate:   <number>,
// // //   //     }
// // //   //   ]
// // //   // }
// // //   // =====================================================
// // //   async createStockReceipt(data) {
// // //     try {
// // //       const res = await ApiClient.post("/purchase/stock-receipts/", data);
// // //       if (res.status === 200 || res.status === 201) {
// // //         toast.success("Stock Receipt saved as draft");
// // //         return res.data;
// // //       }
// // //       toast.error("Failed to create stock receipt");
// // //       return null;
// // //     } catch (error) {
// // //       toast.error(error?.response?.data?.message || "Error creating stock receipt");
// // //       return null;
// // //     }
// // //   }

// // //   // =====================================================
// // //   // UPDATE STOCK RECEIPT
// // //   // PUT /purchases/stock-receipts/{id}/
// // //   // =====================================================
// // //   async updateStockReceipt(receiptId, data) {
// // //     try {
// // //       const res = await ApiClient.put(`/purchases/stock-receipts/${receiptId}/`, data);
// // //       if (res.status === 200) {
// // //         toast.success("Stock Receipt updated successfully");
// // //         return res.data;
// // //       }
// // //       toast.error("Failed to update stock receipt");
// // //       return null;
// // //     } catch (error) {
// // //       toast.error(error?.response?.data?.message || "Error updating stock receipt");
// // //       return null;
// // //     }
// // //   }

// // //   // =====================================================
// // //   // DELETE STOCK RECEIPT
// // //   // DELETE /purchases/stock-receipts/{id}/
// // //   // =====================================================
// // //   async deleteStockReceipt(receiptId) {
// // //     try {
// // //       const res = await ApiClient.delete(`/purchases/stock-receipts/${receiptId}/`);
// // //       if (res.status === 200 || res.status === 204) {
// // //         toast.success("Stock Receipt deleted successfully");
// // //         return true;
// // //       }
// // //       toast.error("Failed to delete stock receipt");
// // //       return false;
// // //     } catch (error) {
// // //       toast.error(error?.response?.data?.message || "Error deleting stock receipt");
// // //       return false;
// // //     }
// // //   }

// // //   // =====================================================
// // //   // PERFORM ACTION  →  submit / cancel
// // //   // POST /purchases/stock-receipts/{id}/action/
// // //   // payload: { action: "submit" } | { action: "cancel" }
// // //   // =====================================================
// // //   async performAction(receiptId, action) {
// // //     try {
// // //       const res = await ApiClient.post(
// // //         `/purchases/stock-receipts/${receiptId}/action/`,
// // //         { action }
// // //       );
// // //       if (res.status === 200 || res.status === 201) return res.data;
// // //       toast.error(`Failed to perform action: ${action}`);
// // //       return null;
// // //     } catch (error) {
// // //       toast.error(error?.response?.data?.message || `Error performing action: ${action}`);
// // //       return null;
// // //     }
// // //   }

// // //   // =====================================================
// // //   // ADD SERIAL NUMBERS
// // //   // POST /purchases/stock-receipts/{receiptId}/items/{itemId}/serial-numbers/
// // //   // payload: { serial_nos: ["UKB-001", "UKB-002", ...] }
// // //   //   OR     { serial_nos: "UKB-001,UKB-002,UKB-003" }
// // //   // =====================================================
// // //   async addSerialNumbers(receiptId, itemId, serialList) {
// // //     try {
// // //       const res = await ApiClient.post(
// // //         `/purchases/stock-receipts/${receiptId}/items/${itemId}/serial-numbers/`,
// // //         { serial_nos: serialList }   // send as array
// // //       );
// // //       if (res.status === 200 || res.status === 201) {
// // //         toast.success("Serial numbers saved");
// // //         return res.data;
// // //       }
// // //       toast.error("Failed to save serial numbers");
// // //       return null;
// // //     } catch (error) {
// // //       toast.error(error?.response?.data?.message || "Error saving serial numbers");
// // //       return null;
// // //     }
// // //   }

// // //   // =====================================================
// // //   // ADD BATCH NUMBERS
// // //   // POST /purchases/stock-receipts/{receiptId}/items/{itemId}/batch-numbers/
// // //   // payload:
// // //   // {
// // //   //   batches: [
// // //   //     { batch_no: "B001", batch_qty: 25, mfg_date: "2025-01-01", expiry_date: "2026-01-01" }
// // //   //   ]
// // //   // }
// // //   // =====================================================
// // //   async addBatchNumbers(receiptId, itemId, batchList) {
// // //     try {
// // //       const payload = {
// // //         batches: batchList.map((b) => ({
// // //           batch_no:    b.batch_no,
// // //           batch_qty:   b.batch_qty,
// // //           mfg_date:    b.mfg_date    || null,
// // //           expiry_date: b.expiry_date || null,
// // //         })),
// // //       };
// // //       const res = await ApiClient.post(
// // //         `/purchases/stock-receipts/${receiptId}/items/${itemId}/batch-numbers/`,
// // //         payload
// // //       );
// // //       if (res.status === 200 || res.status === 201) {
// // //         toast.success("Batch numbers saved");
// // //         return res.data;
// // //       }
// // //       toast.error("Failed to save batch numbers");
// // //       return null;
// // //     } catch (error) {
// // //       toast.error(error?.response?.data?.message || "Error saving batch numbers");
// // //       return null;
// // //     }
// // //   }

// // //   // =====================================================
// // //   // GET PDF
// // //   // GET /purchases/stock-receipts/{id}/pdf/
// // //   // =====================================================
// // //   async getPdf(receiptId) {
// // //     try {
// // //       const res = await ApiClient.get(
// // //         `/purchases/stock-receipts/${receiptId}/pdf/`,
// // //         { responseType: "blob" }
// // //       );
// // //       if (res.status === 200) return res.data;
// // //       toast.error("Failed to generate PDF");
// // //       return null;
// // //     } catch (error) {
// // //       toast.error(error?.response?.data?.message || "Error generating PDF");
// // //       return null;
// // //     }
// // //   }

// // //   // =====================================================
// // //   // SEND EMAIL
// // //   // GET /purchases/stock-receipts/{id}/email/
// // //   // =====================================================
// // //   async sendEmail(receiptId, email) {
// // //     try {
// // //       const res = await ApiClient.get(
// // //         `/purchase/stock-receipts/${receiptId}/email/`,
// // //         { params: { email } }
// // //       );
// // //       if (res.status === 200) {
// // //         toast.success("Email sent successfully");
// // //         return res.data;
// // //       }
// // //       toast.error("Failed to send email");
// // //       return null;
// // //     } catch (error) {
// // //       toast.error(error?.response?.data?.message || "Error sending email");
// // //       return null;
// // //     }
// // //   }
// // // }

// // // const stockReceiptApiProvider = new StockReceiptApiProvider();
// // // export default stockReceiptApiProvider;
// // import ApiClient from "./api-client";
// // import { toast } from "react-toastify";

// // class StockReceiptApiProvider {

// //  async fetchStockReceipts(page = 1, search = "") {
// //   try {
// //     const res = await ApiClient.get("/purchases/stock-receipts/", {
// //       params: { page, ...(search ? { search } : {}) },
// //     });
// //     if (res.status === 200) {
// //       // ✅ actual shape: { message, data: { from, to, totalCount, totalPages, data: [...] } }
// //       const wrapper = res.data?.data;
// //       const list    = Array.isArray(wrapper?.data) ? wrapper.data : [];

// //       return {
// //         data:         list,
// //         current_page: wrapper?.from ? Math.ceil(wrapper.from / (wrapper.to || 10)) : page,
// //         totalPages:   wrapper?.totalPages || 1,
// //       };
// //     }
// //     toast.error("Failed to load stock receipts");
// //     return { data: [], current_page: 1, totalPages: 1 };
// //   } catch (error) {
// //     toast.error(error?.response?.data?.message || "Error loading stock receipts");
// //     return { data: [], current_page: 1, totalPages: 1 };
// //   }
// // }
// //   async fetchSingleStockReceipt(id) {
// //     try {
// //       const res = await ApiClient.get(`/purchases/stock-receipts/${id}/`);
// //       if (res.status === 200) return res.data?.data || res.data;
// //       toast.error("Failed to load stock receipt");
// //       return null;
// //     } catch (error) {
// //       toast.error("Error fetching stock receipt");
// //       return null;
// //     }
// //   }

// //   async createStockReceipt(data) {
// //     try {
// //       const res = await ApiClient.post("/purchases/stock-receipts/", data);
// //       if (res.status === 200 || res.status === 201) {
// //         toast.success("Stock Receipt saved as draft");
// //         return res.data?.data || res.data;
// //       }
// //       toast.error("Failed to create stock receipt");
// //       return null;
// //     } catch (error) {
// //       toast.error(error?.response?.data?.message || "Error creating stock receipt");
// //       return null;
// //     }
// //   }

// //   async updateStockReceipt(id, data) {
// //     try {
// //       const res = await ApiClient.patch(`/purchases/stock-receipts/${id}/`, data);
// //       if (res.status === 200) {
// //         toast.success("Stock Receipt updated successfully");
// //         return res.data?.data || res.data;
// //       }
// //       toast.error("Failed to update stock receipt");
// //       return null;
// //     } catch (error) {
// //       toast.error(error?.response?.data?.message || "Error updating stock receipt");
// //       return null;
// //     }
// //   }

// //   async deleteStockReceipt(id) {
// //     try {
// //       const res = await ApiClient.delete(`/purchases/stock-receipts/${id}/`);
// //       if (res.status === 200 || res.status === 204) {
// //         toast.success("Stock Receipt deleted");
// //         return true;
// //       }
// //       toast.error("Failed to delete stock receipt");
// //       return false;
// //     } catch (error) {
// //       toast.error("Error deleting stock receipt");
// //       return false;
// //     }
// //   }

// //   async performAction(id, action) {
// //     try {
// //       const res = await ApiClient.post(
// //         `/purchases/stock-receipts/${id}/action/`,
// //         { action }
// //       );
// //       if (res.status === 200 || res.status === 201) {
// //         toast.success(res.data?.message || `Action "${action}" successful`);
// //         return res.data?.data || res.data;
// //       }
// //       toast.error(`Failed: ${action}`);
// //       return null;
// //     } catch (error) {
// //       toast.error(error?.response?.data?.message || `Error: ${action}`);
// //       return null;
// //     }
// //   }

// //   async addComment(id, comment) {
// //     try {
// //       const res = await ApiClient.post(
// //         `/purchases/stock-receipts/${id}/comments/`,
// //         { comment }
// //       );
// //       if (res.status === 200 || res.status === 201) {
// //         toast.success("Comment added");
// //         return res.data?.data || res.data;
// //       }
// //       toast.error("Failed to add comment");
// //       return null;
// //     } catch (error) {
// //       toast.error("Error adding comment");
// //       return null;
// //     }
// //   }

// //   async uploadAttachment(id, file, description = "") {
// //     try {
// //       const formData = new FormData();
// //       formData.append("file", file);
// //       if (description) formData.append("description", description);
// //       const res = await ApiClient.post(
// //         `/purchases/stock-receipts/${id}/attachments/`,
// //         formData,
// //         { headers: { "Content-Type": "multipart/form-data" } }
// //       );
// //       if (res.status === 200 || res.status === 201) {
// //         toast.success("Attachment uploaded");
// //         return res.data?.data || res.data;
// //       }
// //       toast.error("Failed to upload attachment");
// //       return null;
// //     } catch (error) {
// //       toast.error("Error uploading attachment");
// //       return null;
// //     }
// //   }

// //   // serial_nos can be array or comma-separated string
// //   async addSerialNumbers(receiptId, itemId, serialList) {
// //     try {
// //       const res = await ApiClient.post(
// //         `/purchases/stock-receipts/${receiptId}/items/${itemId}/serial-numbers/`,
// //         { serial_nos: serialList }
// //       );
// //       if (res.status === 200 || res.status === 201) {
// //         toast.success("Serial numbers saved");
// //         return res.data?.data || res.data;
// //       }
// //       toast.error("Failed to save serial numbers");
// //       return null;
// //     } catch (error) {
// //       toast.error(error?.response?.data?.message || "Error saving serial numbers");
// //       return null;
// //     }
// //   }

// //   async addBatchNumbers(receiptId, itemId, batchList) {
// //     try {
// //       // API accepts one batch at a time
// //       const results = [];
// //       for (const b of batchList) {
// //         const res = await ApiClient.post(
// //           `/purchases/stock-receipts/${receiptId}/items/${itemId}/batch-numbers/`,
// //           {
// //             batch_no:    b.batch_no,
// //             batch_qty:   b.batch_qty,
// //             mfg_date:    b.mfg_date    || null,
// //             expiry_date: b.expiry_date || null,
// //           }
// //         );
// //         if (res.status === 200 || res.status === 201) results.push(res.data?.data || res.data);
// //       }
// //       if (results.length > 0) toast.success("Batch numbers saved");
// //       return results;
// //     } catch (error) {
// //       toast.error(error?.response?.data?.message || "Error saving batch numbers");
// //       return null;
// //     }
// //   }

// //   async downloadPDF(id, grnId) {
// //     try {
// //       const res = await ApiClient.get(
// //         `/purchases/stock-receipts/${id}/pdf/`,
// //         { responseType: "blob" }
// //       );
// //       if (res.status === 200) {
// //         const url  = window.URL.createObjectURL(new Blob([res.data]));
// //         const link = document.createElement("a");
// //         link.href  = url;
// //         link.setAttribute("download", `GRN_${grnId || id}.pdf`);
// //         document.body.appendChild(link);
// //         link.click();
// //         link.remove();
// //         window.URL.revokeObjectURL(url);
// //         return true;
// //       }
// //       toast.error("Failed to download PDF");
// //       return false;
// //     } catch (error) {
// //       toast.error("Error downloading PDF");
// //       return false;
// //     }
// //   }

// //   async sendEmail(id, email = null) {
// //     try {
// //       const body = email ? { email } : {};
// //       const res  = await ApiClient.post(
// //         `/purchases/stock-receipts/${id}/email/`,
// //         body
// //       );
// //       if (res.status === 200) { toast.success("Email sent"); return true; }
// //       toast.error("Failed to send email");
// //       return false;
// //     } catch (error) {
// //       toast.error("Error sending email");
// //       return false;
// //     }
// //   }
// // }

// // const stockReceiptApiProvider = new StockReceiptApiProvider();
// // export default stockReceiptApiProvider;
// // import ApiClient from "./api-client";
// // import { toast } from "react-toastify";

// // class StockReceiptApiProvider {

// //   async fetchStockReceipts(page = 1, search = "") {
// //     try {
// //       const res = await ApiClient.get("/purchase/stock-receipts/", {
// //         params: { page, ...(search ? { search } : {}) },
// //       });
// //       if (res.status === 200) {
// //         const wrapper = res.data?.data;
// //         const list    = Array.isArray(wrapper?.data) ? wrapper.data : [];
// //         return {
// //           data:         list,
// //           current_page: page,
// //           totalPages:   wrapper?.totalPages || 1,
// //         };
// //       }
// //       toast.error("Failed to load stock receipts");
// //       return { data: [], current_page: 1, totalPages: 1 };
// //     } catch (error) {
// //       toast.error(error?.response?.data?.message || "Error loading stock receipts");
// //       return { data: [], current_page: 1, totalPages: 1 };
// //     }
// //   }

// //   async fetchSingleStockReceipt(id) {
// //     try {
// //       const res = await ApiClient.get(`/purchase/stock-receipts/${id}/`);
// //       if (res.status === 200) return res.data?.data || res.data;
// //       toast.error("Failed to load stock receipt");
// //       return null;
// //     } catch (error) {
// //       toast.error("Error fetching stock receipt");
// //       return null;
// //     }
// //   }

// //   async createStockReceipt(data) {
// //     try {
// //       const res = await ApiClient.post("/purchase/stock-receipts/", data);
// //       if (res.status === 200 || res.status === 201) {
// //         toast.success("Stock Receipt saved as draft");
// //         return res.data?.data || res.data;
// //       }
// //       toast.error("Failed to create stock receipt");
// //       return null;
// //     } catch (error) {
// //       toast.error(error?.response?.data?.message || "Error creating stock receipt");
// //       return null;
// //     }
// //   }

// //   async updateStockReceipt(id, data) {
// //     try {
// //       const res = await ApiClient.patch(`/purchase/stock-receipts/${id}/`, data);
// //       if (res.status === 200) {
// //         toast.success("Stock Receipt updated successfully");
// //         return res.data?.data || res.data;
// //       }
// //       toast.error("Failed to update stock receipt");
// //       return null;
// //     } catch (error) {
// //       toast.error(error?.response?.data?.message || "Error updating stock receipt");
// //       return null;
// //     }
// //   }

// //   async deleteStockReceipt(id) {
// //     try {
// //       const res = await ApiClient.delete(`/purchase/stock-receipts/${id}/`);
// //       if (res.status === 200 || res.status === 204) {
// //         toast.success("Stock Receipt deleted");
// //         return true;
// //       }
// //       toast.error("Failed to delete stock receipt");
// //       return false;
// //     } catch (error) {
// //       toast.error("Error deleting stock receipt");
// //       return false;
// //     }
// //   }

// //   async performAction(id, action) {
// //     try {
// //       const res = await ApiClient.post(
// //         `/purchase/stock-receipts/${id}/action/`,
// //         { action }
// //       );
// //       if (res.status === 200 || res.status === 201) {
// //         toast.success(res.data?.message || `Action "${action}" successful`);
// //         return res.data?.data || res.data;
// //       }
// //       toast.error(`Failed: ${action}`);
// //       return null;
// //     } catch (error) {
// //       toast.error(error?.response?.data?.message || `Error: ${action}`);
// //       return null;
// //     }
// //   }

// //   async addComment(id, comment) {
// //     try {
// //       const res = await ApiClient.post(
// //         `/purchase/stock-receipts/${id}/comments/`,
// //         { comment }
// //       );
// //       if (res.status === 200 || res.status === 201) {
// //         toast.success("Comment added");
// //         return res.data?.data || res.data;
// //       }
// //       toast.error("Failed to add comment");
// //       return null;
// //     } catch (error) {
// //       toast.error("Error adding comment");
// //       return null;
// //     }
// //   }

// //   async uploadAttachment(id, file, description = "") {
// //     try {
// //       const formData = new FormData();
// //       formData.append("file", file);
// //       if (description) formData.append("description", description);
// //       const res = await ApiClient.post(
// //         `/purchase/stock-receipts/${id}/attachments/`,
// //         formData,
// //         { headers: { "Content-Type": "multipart/form-data" } }
// //       );
// //       if (res.status === 200 || res.status === 201) {
// //         toast.success("Attachment uploaded");
// //         return res.data?.data || res.data;
// //       }
// //       toast.error("Failed to upload attachment");
// //       return null;
// //     } catch (error) {
// //       toast.error("Error uploading attachment");
// //       return null;
// //     }
// //   }

// //   async addSerialNumbers(receiptId, itemId, serialList) {
// //     try {
// //       const res = await ApiClient.post(
// //         `/purchase/stock-receipts/${receiptId}/items/${itemId}/serial-numbers/`,
// //         { serial_nos: serialList }
// //       );
// //       if (res.status === 200 || res.status === 201) {
// //         toast.success("Serial numbers saved");
// //         return res.data?.data || res.data;
// //       }
// //       toast.error("Failed to save serial numbers");
// //       return null;
// //     } catch (error) {
// //       toast.error(error?.response?.data?.message || "Error saving serial numbers");
// //       return null;
// //     }
// //   }

// //   async addBatchNumbers(receiptId, itemId, batchList) {
// //     try {
// //       const results = [];
// //       for (const b of batchList) {
// //         const res = await ApiClient.post(
// //           `/purchase/stock-receipts/${receiptId}/items/${itemId}/batch-numbers/`,
// //           {
// //             batch_no:    b.batch_no,
// //             batch_qty:   b.batch_qty,
// //             mfg_date:    b.mfg_date    || null,
// //             expiry_date: b.expiry_date || null,
// //           }
// //         );
// //         if (res.status === 200 || res.status === 201) {
// //           results.push(res.data?.data || res.data);
// //         }
// //       }
// //       if (results.length > 0) toast.success("Batch numbers saved");
// //       return results;
// //     } catch (error) {
// //       toast.error(error?.response?.data?.message || "Error saving batch numbers");
// //       return null;
// //     }
// //   }

// //   async downloadPDF(id, grnId) {
// //     try {
// //       const res = await ApiClient.get(
// //         `/purchase/stock-receipts/${id}/pdf/`,
// //         { responseType: "blob" }
// //       );
// //       if (res.status === 200) {
// //         const url  = window.URL.createObjectURL(new Blob([res.data]));
// //         const link = document.createElement("a");
// //         link.href  = url;
// //         link.setAttribute("download", `GRN_${grnId || id}.pdf`);
// //         document.body.appendChild(link);
// //         link.click();
// //         link.remove();
// //         window.URL.revokeObjectURL(url);
// //         return true;
// //       }
// //       toast.error("Failed to download PDF");
// //       return false;
// //     } catch (error) {
// //       toast.error("Error downloading PDF");
// //       return false;
// //     }
// //   }

// //   async sendEmail(id, email = null) {
// //     try {
// //       const body = email ? { email } : {};
// //       const res  = await ApiClient.post(
// //         `/purchase/stock-receipts/${id}/email/`,
// //         body
// //       );
// //       if (res.status === 200) {
// //         toast.success("Email sent");
// //         return true;
// //       }
// //       toast.error("Failed to send email");
// //       return false;
// //     } catch (error) {
// //       toast.error("Error sending email");
// //       return false;
// //     }
// //   }
// // }

// // const stockReceiptApiProvider = new StockReceiptApiProvider();
// // export default stockReceiptApiProvider;
// import ApiClient from "./api-client";
// import { toast } from "react-toastify";

// class StockReceiptApiProvider {

//   async fetchStockReceipts(page = 1, search = "") {
//     try {
//       const res = await ApiClient.get("/purchase/stock-receipts/", {
//         params: { page, ...(search ? { search } : {}) },
//       });
//       if (res.status === 200) {
//         const wrapper = res.data?.data;
//         const list    = Array.isArray(wrapper?.data) ? wrapper.data : [];
//         return { data: list, current_page: page, totalPages: wrapper?.totalPages || 1 };
//       }
//       toast.error("Failed to load stock receipts");
//       return { data: [], current_page: 1, totalPages: 1 };
//     } catch (error) {
//       toast.error(error?.response?.data?.message || "Error loading stock receipts");
//       return { data: [], current_page: 1, totalPages: 1 };
//     }
//   }

//   async fetchSingleStockReceipt(id) {
//     try {
//       const res = await ApiClient.get(`/purchase/stock-receipts/${id}/`);
//       if (res.status === 200) return res.data?.data || res.data;
//       toast.error("Failed to load stock receipt");
//       return null;
//     } catch (error) {
//       toast.error("Error fetching stock receipt");
//       return null;
//     }
//   }

//   async createStockReceipt(data) {
//     try {
//       const res = await ApiClient.post("/purchase/stock-receipts/", data);
//       if (res.status === 200 || res.status === 201) {
//         toast.success("Stock Receipt saved as draft");
//         return res.data?.data || res.data;
//       }
//       toast.error("Failed to create stock receipt");
//       return null;
//     } catch (error) {
//       toast.error(error?.response?.data?.message || "Error creating stock receipt");
//       return null;
//     }
//   }

//   async updateStockReceipt(id, data) {
//     try {
//       const res = await ApiClient.patch(`/purchase/stock-receipts/${id}/`, data);
//       if (res.status === 200) {
//         toast.success("Stock Receipt updated successfully");
//         return res.data?.data || res.data;
//       }
//       toast.error("Failed to update stock receipt");
//       return null;
//     } catch (error) {
//       toast.error(error?.response?.data?.message || "Error updating stock receipt");
//       return null;
//     }
//   }

//   async deleteStockReceipt(id) {
//     try {
//       const res = await ApiClient.delete(`/purchase/stock-receipts/${id}/`);
//       if (res.status === 200 || res.status === 204) {
//         toast.success("Stock Receipt deleted");
//         return true;
//       }
//       toast.error("Failed to delete stock receipt");
//       return false;
//     } catch (error) {
//       toast.error("Error deleting stock receipt");
//       return false;
//     }
//   }

//   async performAction(id, action) {
//     try {
//       const res = await ApiClient.post(`/purchase/stock-receipts/${id}/action/`, { action });
//       if (res.status === 200 || res.status === 201) {
//         toast.success(res.data?.message || `Action "${action}" successful`);
//         return res.data?.data || res.data;
//       }
//       toast.error(`Failed: ${action}`);
//       return null;
//     } catch (error) {
//       toast.error(error?.response?.data?.message || `Error: ${action}`);
//       return null;
//     }
//   }

//   async addComment(id, comment) {
//     try {
//       const res = await ApiClient.post(`/purchase/stock-receipts/${id}/comments/`, { comment });
//       if (res.status === 200 || res.status === 201) {
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
//       if (description) formData.append("description", description);
//       const res = await ApiClient.post(
//         `/purchase/stock-receipts/${id}/attachments/`,
//         formData,
//         { headers: { "Content-Type": "multipart/form-data" } }
//       );
//       if (res.status === 200 || res.status === 201) {
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

//   // POST /stock-receipts/{receiptId}/items/{itemId}/serial-numbers/
//   // Body: { serial_nos: ["UKB-001", ...] }
//   async addSerialNumbers(receiptId, itemId, serialList) {
//     try {
//       const res = await ApiClient.post(
//         `/purchase/stock-receipts/${receiptId}/items/${itemId}/serial-numbers/`,
//         { serial_nos: serialList }
//       );
//       if (res.status === 200 || res.status === 201) {
//         toast.success("Serial numbers saved");
//         return res.data?.data || res.data;
//       }
//       toast.error("Failed to save serial numbers");
//       return null;
//     } catch (error) {
//       toast.error(error?.response?.data?.message || "Error saving serial numbers");
//       return null;
//     }
//   }

//   // POST /stock-receipts/{receiptId}/items/{itemId}/batch-numbers/  (one per batch)
//   // Body: { batch_no, batch_qty, mfg_date, expiry_date }
//   async addBatchNumbers(receiptId, itemId, batchList) {
//     try {
//       const results = [];
//       for (const b of batchList) {
//         const res = await ApiClient.post(
//           `/purchase/stock-receipts/${receiptId}/items/${itemId}/batch-numbers/`,
//           {
//             batch_no:    b.batch_no,
//             batch_qty:   b.batch_qty,
//             mfg_date:    b.mfg_date    || null,
//             expiry_date: b.expiry_date || null,
//           }
//         );
//         if (res.status === 200 || res.status === 201) {
//           results.push(res.data?.data || res.data);
//         }
//       }
//       if (results.length > 0) toast.success("Batch numbers saved");
//       return results;
//     } catch (error) {
//       toast.error(error?.response?.data?.message || "Error saving batch numbers");
//       return null;
//     }
//   }

//   // POST /stock-receipts/{receiptId}/items/{itemId}/batch-numbers/{batchId}/serials/
//   // Body: { serial_nos: "SR-001,SR-002,..." }  OR  { serial_nos: ["SR-001", ...] }
//   async addBatchSerialNumbers(receiptId, itemId, batchId, serialList) {
//     try {
//       const res = await ApiClient.post(
//         `/purchase/stock-receipts/${receiptId}/items/${itemId}/batch-numbers/${batchId}/serials/`,
//         { serial_nos: serialList }
//       );
//       if (res.status === 200 || res.status === 201) {
//         toast.success(`${serialList.length} serial number(s) generated for batch`);
//         return res.data?.data || res.data;
//       }
//       toast.error("Failed to save batch serial numbers");
//       return null;
//     } catch (error) {
//       toast.error(error?.response?.data?.message || "Error saving batch serial numbers");
//       return null;
//     }
//   }

//   async downloadPDF(id, grnId) {
//     try {
//       const res = await ApiClient.get(`/purchase/stock-receipts/${id}/pdf/`, { responseType: "blob" });
//       if (res.status === 200) {
//         const url  = window.URL.createObjectURL(new Blob([res.data]));
//         const link = document.createElement("a");
//         link.href  = url;
//         link.setAttribute("download", `GRN_${grnId || id}.pdf`);
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
//       const res  = await ApiClient.post(`/purchase/stock-receipts/${id}/email/`, body);
//       if (res.status === 200) {
//         toast.success("Email sent");
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

// const stockReceiptApiProvider = new StockReceiptApiProvider();
// export default stockReceiptApiProvider;
import ApiClient from "./api-client";
import { toast } from "react-toastify";

class StockReceiptApiProvider {

  async fetchStockReceipts(page = 1, search = "") {
    try {
      const res = await ApiClient.get("/purchase/stock-receipts/", {
        params: { page, ...(search ? { search } : {}) },
      });
      if (res.status === 200) {
        const wrapper = res.data?.data;
        const list    = Array.isArray(wrapper?.data) ? wrapper.data : [];
        return { data: list, current_page: page, totalPages: wrapper?.totalPages || 1 };
      }
      toast.error("Failed to load stock receipts");
      return { data: [], current_page: 1, totalPages: 1 };
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error loading stock receipts");
      return { data: [], current_page: 1, totalPages: 1 };
    }
  }

  async fetchSingleStockReceipt(id) {
    try {
      const res = await ApiClient.get(`/purchase/stock-receipts/${id}/`);
      if (res.status === 200) return res.data?.data || res.data;
      toast.error("Failed to load stock receipt");
      return null;
    } catch (error) {
      toast.error("Error fetching stock receipt");
      return null;
    }
  }

  async createStockReceipt(data) {
    try {
      const res = await ApiClient.post("/purchase/stock-receipts/", data);
      if (res.status === 200 || res.status === 201) {
        toast.success("Stock Receipt saved as draft");
        return res.data?.data || res.data;
      }
      toast.error("Failed to create stock receipt");
      return null;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error creating stock receipt");
      return null;
    }
  }

  async updateStockReceipt(id, data) {
    try {
      const res = await ApiClient.patch(`/purchase/stock-receipts/${id}/`, data);
      if (res.status === 200) {
        toast.success("Stock Receipt updated successfully");
        return res.data?.data || res.data;
      }
      toast.error("Failed to update stock receipt");
      return null;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error updating stock receipt");
      return null;
    }
  }

  async deleteStockReceipt(id) {
    try {
      const res = await ApiClient.delete(`/purchase/stock-receipts/${id}/`);
      if (res.status === 200 || res.status === 204) {
        toast.success("Stock Receipt deleted");
        return true;
      }
      toast.error("Failed to delete stock receipt");
      return false;
    } catch (error) {
      toast.error("Error deleting stock receipt");
      return false;
    }
  }

  async performAction(id, action) {
    try {
      const res = await ApiClient.post(`/purchase/stock-receipts/${id}/action/`, { action });
      if (res.status === 200 || res.status === 201) {
        toast.success(res.data?.message || `Action "${action}" successful`);
        return res.data?.data || res.data;
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
      const res = await ApiClient.post(`/purchase/stock-receipts/${id}/comments/`, { comment });
      if (res.status === 200 || res.status === 201) {
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
      if (description) formData.append("description", description);
      const res = await ApiClient.post(
        `/purchase/stock-receipts/${id}/attachments/`,
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
      toast.error("Error uploading attachment");
      return null;
    }
  }

  // POST /stock-receipts/{receiptId}/items/{itemId}/serial-numbers/
  // Body: { serial_nos: ["UKB-001", ...] }
  async addSerialNumbers(receiptId, itemId, serialList) {
    try {
      const res = await ApiClient.post(
        `/purchase/stock-receipts/${receiptId}/items/${itemId}/serial-numbers/`,
        { serial_nos: serialList }
      );
      if (res.status === 200 || res.status === 201) {
        toast.success("Serial numbers saved");
        return res.data?.data || res.data;
      }
      toast.error("Failed to save serial numbers");
      return null;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error saving serial numbers");
      return null;
    }
  }

  // POST /stock-receipts/{receiptId}/items/{itemId}/batch-numbers/  (one per batch)
  // Body: { batch_no, batch_qty, mfg_date, expiry_date }
  async addBatchNumbers(receiptId, itemId, batchList) {
    try {
      const results = [];
      for (const b of batchList) {
        const res = await ApiClient.post(
          `/purchase/stock-receipts/${receiptId}/items/${itemId}/batch-numbers/`,
          {
            batch_no:    b.batch_no,
            batch_qty:   b.batch_qty,
            mfg_date:    b.mfg_date    || null,
            expiry_date: b.expiry_date || null,
          }
        );
        if (res.status === 200 || res.status === 201) {
          results.push(res.data?.data || res.data);
        }
      }
      if (results.length > 0) toast.success("Batch numbers saved");
      return results;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error saving batch numbers");
      return null;
    }
  }

  // POST /stock-receipts/{receiptId}/items/{itemId}/batch-numbers/{batchId}/serials/
  // Body: { serial_nos: "SR-001,SR-002,..." }  OR  { serial_nos: ["SR-001", ...] }
  async addBatchSerialNumbers(receiptId, itemId, batchId, serialList) {
    try {
      const res = await ApiClient.post(
        `/purchase/stock-receipts/${receiptId}/items/${itemId}/batch-numbers/${batchId}/serials/`,
        { serial_nos: serialList }
      );
      if (res.status === 200 || res.status === 201) {
        toast.success(`${serialList.length} serial number(s) generated for batch`);
        return res.data?.data || res.data;
      }
      toast.error("Failed to save batch serial numbers");
      return null;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error saving batch serial numbers");
      return null;
    }
  }

  async downloadPDF(id, grnId) {
    try {
      const res = await ApiClient.get(`/purchase/stock-receipts/${id}/pdf/`, { responseType: "blob" });
      if (res.status === 200) {
        const url  = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href  = url;
        link.setAttribute("download", `GRN_${grnId || id}.pdf`);
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
      const res  = await ApiClient.post(`/purchase/stock-receipts/${id}/email/`, body);
      if (res.status === 200) {
        toast.success("Email sent");
        return true;
      }
      toast.error("Failed to send email");
      return false;
    } catch (error) {
      toast.error("Error sending email");
      return false;
    }
  }

  // POST /purchase/stock-receipts/{id}/generate-return/
  async generateReturn(id) {
    try {
      const res = await ApiClient.post(`/purchase/stock-receipts/${id}/generate-return/`);
      if (res.status === 200 || res.status === 201) {
        toast.success(res.data?.message || "Stock return generated successfully");
        return res.data?.data || res.data;
      }
      toast.error("Failed to generate stock return");
      return null;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error generating stock return");
      return null;
    }
  }
}

const stockReceiptApiProvider = new StockReceiptApiProvider();
export default stockReceiptApiProvider;