// // store/supplierStore.js
// import { create } from "zustand";
// import supplierApiProvider from "../../../network/supplier-api-provider";
// import { toast } from "react-toastify";

// export const useSupplierStore = create((set, get) => ({
//   suppliers: [],
//   loading: false,
//   currentPage: 1,
//   totalPages: 1,
//   search: "",

//   filters: {
//     page: 1,
//     per_page: 10,
//     status: "",
//     supplier_type: "",
//     supplier_tier: "",
//     search: "",
//   },

//   // Set filter
//   setFilter: (key, value) =>
//     set((state) => ({
//       filters: {
//         ...state.filters,
//         [key]: value,
//       },
//     })),

//   // Fetch suppliers
//   fetchSuppliers: async () => {
//     const { filters } = get();
//     set({ loading: true });

//     console.log("🔹 Fetching suppliers with filters:", filters);

//     try {
//       const response = await supplierApiProvider.fetchSuppliers(filters);

//       console.log("📦 Received response:", response);

//       // ✅ Handle response properly
//       const suppliers = Array.isArray(response?.suppliers)
//         ? response.suppliers.map((s) => ({
//             id: s.id,
//             supplier_id: s.supplier_id,
//             supplier_name: s.supplier_name,
//             created_date: s.created_date,
//             status: s.status,
//             supplier_type: s.supplier_type,
//             supplier_tier: s.supplier_tier,
//             // ✅ Store ALL fields for editing
//             ...s,
//           }))
//         : [];

//       set({
//         suppliers,
//         currentPage: response?.current_page || filters.page,
//         totalPages: response?.total_pages || 1,
//       });

//       console.log("✅ Suppliers loaded:", suppliers.length);

//     } catch (error) {
//       console.error("❌ Error fetching suppliers:", error);
//       toast.error("Failed to load suppliers");
//       set({
//         suppliers: [],
//         currentPage: 1,
//         totalPages: 1,
//       });
//     } finally {
//       set({ loading: false });
//     }
//   },

//   // Delete supplier
//   deleteSupplier: async (id) => {
//     const confirmed = window.confirm("Are you sure you want to delete this supplier?");
//     if (!confirmed) return;

//     const success = await supplierApiProvider.deleteSupplier(id);

//     if (success) {
//       // Remove from local state
//       set({
//         suppliers: get().suppliers.filter((s) => s.id !== id),
//       });
//       // Refresh list
//       await get().fetchSuppliers();
//     }
//   },
// }));
import { create } from "zustand";
import supplierApiProvider from "../../../network/supplier-api-provider";
import { toast } from "react-toastify";

export const useSupplierStore = create((set, get) => ({
  suppliers: [],
  loading: false,
  currentPage: 1,
  totalPages: 1,
  search: "",

  filters: {
    page: 1,
    per_page: 10,
    status: "",
    supplier_type: "",
    supplier_tier: "",
    search: "",
  },

  // Set filter
  setFilter: (key, value) =>
    set((state) => ({
      filters: {
        ...state.filters,
        [key]: value,
      },
    })),

  // Fetch suppliers
  fetchSuppliers: async () => {
    const { filters } = get();
    set({ loading: true });

    console.log("🔹 Fetching suppliers with filters:", filters);

    try {
      const response = await supplierApiProvider.fetchSuppliers(filters);

      console.log("📦 Received response:", response);

      const suppliers = Array.isArray(response?.suppliers)
        ? response.suppliers.map((s) => ({
            ...s,
            id: s.id,
            supplier_id: s.supplier_id,
            supplier_name: s.supplier_name,
            // ✅ Map created_at from API → formatted created_date for table
            created_date: s.created_at
              ? new Date(s.created_at).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
              : "—",
            status: s.status || "—",
            supplier_type: s.supplier_type || "—",
            supplier_tier: s.supplier_tier || "—",
          }))
        : [];

      set({
        suppliers,
        currentPage: response?.current_page || filters.page,
        totalPages: response?.total_pages || 1,
      });

      console.log("✅ Suppliers loaded:", suppliers.length);
    } catch (error) {
      console.error("❌ Error fetching suppliers:", error);
      toast.error("Failed to load suppliers");
      set({
        suppliers: [],
        currentPage: 1,
        totalPages: 1,
      });
    } finally {
      set({ loading: false });
    }
  },

  // Delete supplier
  deleteSupplier: async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this supplier?"
    );
    if (!confirmed) return;

    const success = await supplierApiProvider.deleteSupplier(id);

    if (success) {
      set({
        suppliers: get().suppliers.filter((s) => s.id !== id),
      });
      await get().fetchSuppliers();
    }
  },
}));