// import { create } from "zustand";
// import customerApiProvider from "../../../network/customer-api-provider";
// import { toast } from "react-toastify";

// export const useCustomerStore = create((set, get) => ({
//   customers: [],
//   loading: false,
//   currentPage: 1,
//   totalPages: 1,
//   search: "",

//   filters: {
//     page: 1,              // ✅ Add page to filters
//     per_page: 10,
//     status: "",
//     customer_type: "",
//     assigned_sales_rep: "",
//   },

//   // Set filter (including page)
//   setFilter: (key, value) =>
//     set((state) => ({
//       filters: {
//         ...state.filters,
//         [key]: value,
//       },
//     })),

//   // Fetch customers - no parameters needed
//   fetchCustomers: async () => {
//     const { filters } = get();
//     set({ loading: true });

//     console.log("🔹 Fetching customers with filters:", filters);

//     try {
//       const response = await customerApiProvider.fetchCustomers(filters);

//       const customers = Array.isArray(response?.customers)
//         ? response.customers.map((c) => ({
//             id: c.id,
//             customer_id: c.customer_id,
//             first_name: c.first_name,
//             company_name: c.company_name || "N/A",
//             customer_type: c.customer_type,
//             email: c.email,
//             status: c.status,
//             credit_limit: c.credit_limit?.toString(),
//             city: c.city,
//           }))
//         : [];

//       set({
//         customers,
//         currentPage: response?.current_page || filters.page,
//         totalPages: response?.total_pages || 1,
//       });
//     } catch (error) {
//       console.error("❌ Error fetching customers:", error);
//       toast.error("Failed to load customers");
//       set({
//         customers: [],
//         currentPage: 1,
//         totalPages: 1,
//       });
//     } finally {
//       set({ loading: false });
//     }
//   },

//   // Delete customer
//   deleteCustomer: async (id) => {
//     const success = await customerApiProvider.deleteCustomer(id);

//     if (success) {
//       set({
//         customers: get().customers.filter((c) => c.id !== id),
//       });
//       // Optionally refresh the list
//       await get().fetchCustomers();
//     }
//   },
// }));
import { create } from 'zustand';
import customerApiProvider from '../../../network/customer-api-provider'; // Adjust path as needed

export const useCustomerStore = create((set, get) => ({
  customers: [],
  totalPages: 1,
  totalCount: 0,
  loading: false,
  filters: {
    page: 1,
    per_page: 10,
    status: '',
    customer_type: '',
    assigned_sales_rep: '',
    search: '',
  },

  setFilter: (key, value) => {
    set((state) => ({
      filters: { ...state.filters, [key]: value },
    }));
  },

  fetchCustomers: async () => {
    set({ loading: true });
    try {
      const { filters } = get();
      
      // Build query parameters
      const params = {};
      if (filters.page) params.page = filters.page;
      if (filters.per_page) params.per_page = filters.per_page;
      if (filters.status) params.status = filters.status;
      if (filters.customer_type) params.customer_type = filters.customer_type;
      if (filters.assigned_sales_rep) params.assigned_sales_rep = filters.assigned_sales_rep;
      if (filters.search) params.search = filters.search;

      const response = await customerApiProvider.fetchCustomers(params);
      
      console.log('API Response:', response);

      // Parse the nested response structure
      if (response && response.data) {
        set({
          customers: response.data.data || [], // Get data from data.data
          totalPages: response.data.totalPages || 1,
          totalCount: response.data.totalCount || 0,
          loading: false,
        });
      } else {
        set({
          customers: [],
          totalPages: 1,
          totalCount: 0,
          loading: false,
        });
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
      set({ 
        customers: [], 
        totalPages: 1,
        totalCount: 0,
        loading: false 
      });
    }
  },

  deleteCustomer: async (id) => {
    try {
      await customerApiProvider.deleteCustomer(id);
      // Refresh the list after deletion
      get().fetchCustomers();
    } catch (error) {
      console.error('Error deleting customer:', error);
    }
  },
}));