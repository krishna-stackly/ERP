// import { create } from "zustand";
// import purchaseOrderApiProvider from "../../../network/purchaseOrder-api-provider";
// import { toast } from "react-toastify";

// const usePurchaseOrderStore = create((set, get) => ({
//   purchaseOrders: [],
//   loading: false,
//   currentPage: 1,
//   totalPages: 1,
//   search: "",

//   setSearch: (value) => set({ search: value }),

//   // =====================================================
//   // FETCH PURCHASE ORDERS
//   // =====================================================
//   fetchPurchaseOrders: async (page = 1, search = null) => {
//     const currentSearch = search !== null ? search : get().search;

//     set({ loading: true });

//     try {
//       const response = await purchaseOrderApiProvider.fetchPurchaseOrders(page, currentSearch);

//       const purchaseOrders = response?.data?.data || [];
//       const current_page = response?.data?.current_page || page;
//       const total_pages = response?.data?.totalPages || 1;

//       set({
//         purchaseOrders,
//         currentPage: current_page,
//         totalPages: total_pages,
//         search: currentSearch,
//       });
//     } catch (error) {
//       console.error("fetchPurchaseOrders error:", error);
//       toast.error("Failed to load purchase orders");
//       set({
//         purchaseOrders: [],
//         currentPage: 1,
//         totalPages: 1,
//       });
//     } finally {
//       set({ loading: false });
//     }
//   },

//   // =====================================================
//   // DELETE PURCHASE ORDER
//   // =====================================================
//   deletePurchaseOrder: async (purchaseOrderId) => {
//     const success = await purchaseOrderApiProvider.deletePurchaseOrder(purchaseOrderId);

//     if (success) {
//       set({
//         purchaseOrders: get().purchaseOrders.filter(
//           (po) => po.id !== purchaseOrderId
//         ),
//       });
//     }
//   },
// }));

// export default usePurchaseOrderStore;
import { create } from "zustand";
import purchaseOrderApiProvider from "../../../network/purchaseOrder-api-provider";

const usePurchaseOrderStore = create((set, get) => ({
  purchaseOrders: [],
  loading: false,
  currentPage: 1,
  totalPages: 1,
  search: "",

  setSearch: (value) => set({ search: value }),

  // =====================================================
  // FETCH PURCHASE ORDERS
  // =====================================================
  fetchPurchaseOrders: async (page = 1, search = null) => {
    const currentSearch = search !== null ? search : get().search;

    set({ loading: true });

    try {
      const result = await purchaseOrderApiProvider.fetchPurchaseOrders(
        page,
        currentSearch
      );

      if (!result) {
        set({ purchaseOrders: [], currentPage: 1, totalPages: 1 });
        return;
      }

      set({
        purchaseOrders: result?.data?.data || [],
        currentPage: result?.current_page || page,
        totalPages: result?.totalPages || 1,
        search: currentSearch,
      });
    } finally {
      set({ loading: false });
    }
  },

  // =====================================================
  // DELETE PURCHASE ORDER
  // =====================================================
  deletePurchaseOrder: async (purchaseOrderId) => {
    const success = await purchaseOrderApiProvider.deletePurchaseOrder(
      purchaseOrderId
    );

    if (success) {
      set((state) => ({
        purchaseOrders: state.purchaseOrders.filter(
          (po) => po.po_id !== purchaseOrderId
        ),
      }));
    }

    return success;
  },
}));

export default usePurchaseOrderStore;