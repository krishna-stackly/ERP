// // api/customer-api-provider.js
// import ApiClient from "./api-client";
// import { toast } from "react-toastify";

// class CustomerApiProvider {
//   async fetchCustomers(params) {
//     try {
//       console.log("API CALL → /customers/", params);

//       const res = await ApiClient.get("/masters/customers/", { params });

//       if (res.status === 200) return res.data;

//       toast.error("Failed to load customers");
//       return { customers: [], total_pages: 1 };

//     } catch (error) {
//       toast.error(
//         error?.response?.data?.message || "Error fetching customers"
//       );
//       return { customers: [], total_pages: 1 };
//     }
//   }

//   async createCustomer(data) {
//     try {
//       const res = await ApiClient.post("/masters/customers/", data);

//       if (res.status === 200 || res.status === 201) {
//         toast.success("Customer created successfully!");
//         return res.data;
//       }

//       toast.error("Failed to create customer");
//       return null;
//     } catch (error) {
//       toast.error(error?.response?.data?.message || "Error creating customer");
//       return null;
//     }
//   }

//   async updateCustomer(customerId, data) {
//     try {
//       const res = await ApiClient.put(`/masters/customers/${customerId}/`, data);

//       if (res.status === 200) {
//         toast.success("Customer updated successfully!");
//         return res.data;
//       }

//       toast.error("Failed to update customer");
//       return null;
//     } catch (error) {
//       toast.error(error?.response?.data?.message || "Error updating customer");
//       return null;
//     }
//   }

//   async deleteCustomer(id) {
//     try {
//       const res = await ApiClient.delete(`/masters/customers/${id}/`);

//       if (res.status === 204 || res.status === 200) {
//         toast.success("Customer deleted");
//         return true;
//       }

//       toast.error("Failed to delete customer");
//       return false;

//     } catch (error) {
//       toast.error("Error deleting customer");
//       return false;
//     }
//   }

//   async fetchSingleCustomer(id) {
//     try {
//       const res = await ApiClient.get(`/masters/customers/${id}/`);

//       if (res.status === 200) return res.data;

//       toast.error("Failed to load customer details");
//       return null;

//     } catch (error) {
//       toast.error("Error fetching customer details");
//       return null;
//     }
//   }

//   // =====================================================
//   // FETCH SALES REPRESENTATIVES
//   // =====================================================
//   async fetchSalesReps() {
//     try {
//       let candidates = [];
//       let response;

//       // Try to fetch with department filter first
//       try {
//         response = await ApiClient.get("/onboarding/?department=6");
//       } catch (error) {
//         console.warn("Department filter not supported, fetching all candidates:", error);
//         response = await ApiClient.get("/onboarding/");
//       }

//       if (response.status === 200) {
//         candidates = response.data;

//         // Handle different response structures
//         if (!Array.isArray(candidates)) {
//           if (response.data.results && Array.isArray(response.data.results)) {
//             candidates = response.data.results;
//           } else if (response.data.candidates && Array.isArray(response.data.candidates)) {
//             candidates = response.data.candidates;
//           } else {
//             console.error("Unexpected onboarding API response:", response.data);
//             candidates = [];
//           }
//         }

//         // Filter for sales department (ID: 6)
//         const salesCandidates = candidates.filter(
//           (candidate) =>
//             (typeof candidate.department === "object" &&
//               candidate.department?.id === 6) ||
//             (typeof candidate.department === "number" &&
//               candidate.department === 6)
//         );

//         console.log("Sales department candidates:", salesCandidates);
//         return salesCandidates;
//       }

//       toast.error("Failed to load sales representatives");
//       return [];

//     } catch (error) {
//       console.error("Error fetching sales reps:", error);
//       toast.error("Failed to load sales representatives");
//       return [];
//     }
//   }
// }

// const customerApiProvider = new CustomerApiProvider();
// export default customerApiProvider;
// api/customer-api-provider.js
import ApiClient from "./api-client";
import { toast } from "react-toastify";

class CustomerApiProvider {
  async fetchCustomers(params) {
    try {
      const res = await ApiClient.get("/masters/customers/", { params });
      if (res.status === 200) return res.data;
      toast.error("Failed to load customers");
      return { customers: [], total_pages: 1 };
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error fetching customers");
      return { customers: [], total_pages: 1 };
    }
  }

  async createCustomer(data) {
    try {
      const res = await ApiClient.post("/masters/customers/", data);
      if (res.status === 200 || res.status === 201) {
        toast.success("Customer created successfully!");
        return res.data;
      }
      toast.error("Failed to create customer");
      return null;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error creating customer");
      return null;
    }
  }

  async updateCustomer(customerId, data) {
    try {
      const res = await ApiClient.put(`/masters/customers/${customerId}/`, data);
      if (res.status === 200) {
        toast.success("Customer updated successfully!");
        return res.data;
      }
      toast.error("Failed to update customer");
      return null;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error updating customer");
      return null;
    }
  }

  async deleteCustomer(id) {
    try {
      const res = await ApiClient.delete(`/masters/customers/${id}/`);
      if (res.status === 204 || res.status === 200) {
        toast.success("Customer deleted");
        return true;
      }
      toast.error("Failed to delete customer");
      return false;
    } catch (error) {
      toast.error("Error deleting customer");
      return false;
    }
  }

  async fetchSingleCustomer(id) {
    try {
      const res = await ApiClient.get(`/masters/customers/${id}/`);
      if (res.status === 200) return res.data;
      toast.error("Failed to load customer details");
      return null;
    } catch (error) {
      toast.error("Error fetching customer details");
      return null;
    }
  }

  async fetchSalesReps() {
    try {
      let candidates = [];
      let response;
      try {
        response = await ApiClient.get("/onboarding/?department=6");
      } catch (error) {
        response = await ApiClient.get("/onboarding/");
      }
      if (response.status === 200) {
        candidates = response.data;
        if (!Array.isArray(candidates)) {
          if (response.data.results && Array.isArray(response.data.results)) {
            candidates = response.data.results;
          } else if (response.data.candidates && Array.isArray(response.data.candidates)) {
            candidates = response.data.candidates;
          } else {
            candidates = [];
          }
        }
        return candidates.filter(
          (c) =>
            (typeof c.department === "object" && c.department?.id === 6) ||
            (typeof c.department === "number" && c.department === 6)
        );
      }
      toast.error("Failed to load sales representatives");
      return [];
    } catch (error) {
      toast.error("Failed to load sales representatives");
      return [];
    }
  }

  // =====================================================
  // CUSTOMER IMPORT
  // =====================================================

  // Step 1 — Validate file
  // POST /customers/import/  (multipart/form-data)
  // Returns: { valid_count, invalid_count, skipped_count, invalid_rows, message, valid_rows }
  async importValidate(file) {
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await ApiClient.post("masters/customers/import/",
        fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.status === 200 || res.status === 201) return res.data;
      toast.error("Validation failed. Please try again.");
      return null;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Validation failed. Please try again.");
      return null;
    }
  }

  // Step 2 — Confirm import of valid rows
  // POST /customers/import/confirm/  (application/json)
  // Body:    { valid_rows: [...] }
  // Returns: created customers list
  async importConfirm(validRows) {
    try {
      const res = await ApiClient.post(
        "/masters/customers/import/confirm/",
        { valid_rows: validRows },
        { headers: { "Content-Type": "application/json" } }
      );
      if (res.status === 200 || res.status === 201) {
        toast.success("Customers imported successfully.");
        return res.data;
      }
      toast.error("Import failed. Please try again.");
      return null;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Import failed. Please try again.");
      return null;
    }
  }

  // =====================================================
  // DUPLICATES & MERGE
  // =====================================================

  // List potential duplicates
  // GET /customers/duplicates/
  // Returns: { duplicate_groups: [...], total_groups, message }
  async fetchDuplicates() {
    try {
      const res = await ApiClient.get("/masters/customers/duplicates/");
      if (res.status === 200) return res.data;
      toast.error("Failed to load duplicates.");
      return { duplicate_groups: [], total_groups: 0 };
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load duplicates.");
      return { duplicate_groups: [], total_groups: 0 };
    }
  }

  // Side-by-side comparison before merging
  // POST /customers/merge/review/
  // Body:    { primary_id, duplicate_ids }
  // Returns: { primary, duplicates, comparison: [{ field, primary_value, duplicate_values, conflict }] }
  async mergeReview(primaryId, duplicateIds) {
    try {
      const res = await ApiClient.post(
        "/masters/customers/merge/review/",
        { primary_id: primaryId, duplicate_ids: duplicateIds },
        { headers: { "Content-Type": "application/json" } }
      );
      if (res.status === 200) return res.data;
      toast.error("Failed to load merge comparison.");
      return null;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load merge comparison.");
      return null;
    }
  }

  // Confirm merge with field-level choices
  // POST /customers/merge/confirm/
  // Body:    { primary_id, duplicate_ids, field_choices: { field: "left"|"right" } }
  // Returns: { message, primary }
  async mergeConfirm(primaryId, duplicateIds, fieldChoices) {
    try {
      const res = await ApiClient.post(
        "/masters/customers/merge/confirm/",
        { primary_id: primaryId, duplicate_ids: duplicateIds, field_choices: fieldChoices },
        { headers: { "Content-Type": "application/json" } }
      );
      if (res.status === 200) {
        toast.success(res.data?.message || "Merge successful.");
        return res.data;
      }
      toast.error("Merge failed. Please try again.");
      return null;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Merge failed. Please try again.");
      return null;
    }
  }
}

const customerApiProvider = new CustomerApiProvider();
export default customerApiProvider;