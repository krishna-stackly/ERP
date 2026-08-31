// import { create } from "zustand";
// import stockReceiptApiProvider from "../../../network/stockReceipt-api-provider";

// const useStockReceiptStore = create((set, get) => ({
//   stockReceipts: [],
//   loading: false,
//   currentPage: 1,
//   totalPages: 1,
//   search: "",

//   setSearch: (value) => set({ search: value }),

//   // =====================================================
//   // FETCH STOCK RECEIPTS
//   // =====================================================
//   fetchStockReceipts: async (page = 1, search = null) => {
//     const currentSearch = search !== null ? search : get().search;

//     set({ loading: true });

//     try {
//       const result = await stockReceiptApiProvider.fetchStockReceipts(
//         page,
//         currentSearch
//       );

//       if (!result) {
//         set({ stockReceipts: [], currentPage: 1, totalPages: 1 });
//         return;
//       }

//       set({
//         stockReceipts: result?.data?.data || [],
//         currentPage: result?.current_page || page,
//         totalPages: result?.totalPages || 1,
//         search: currentSearch,
//       });
//     } finally {
//       set({ loading: false });
//     }
//   },

//   // =====================================================
//   // DELETE STOCK RECEIPT
//   // =====================================================
//   deleteStockReceipt: async (receiptId) => {
//     const success = await stockReceiptApiProvider.deleteStockReceipt(receiptId);

//     if (success) {
//       set((state) => ({
//         stockReceipts: state.stockReceipts.filter(
//           (sr) => sr.grn_id !== receiptId
//         ),
//       }));
//     }

//     return success;
//   },
// }));

// export default useStockReceiptStore;
import { create } from "zustand";
import stockReceiptApiProvider from "../../../network/stockReceipt-api-provider";

const useStockReceiptStore = create((set, get) => ({
  stockReceipts: [],
  loading:       false,
  currentPage:   1,
  totalPages:    1,
  search:        "",

  setSearch: (value) => set({ search: value }),

  fetchStockReceipts: async (page = 1, search = null) => {
    const currentSearch = search !== null ? search : get().search;
    set({ loading: true });
    try {
      const result = await stockReceiptApiProvider.fetchStockReceipts(
        page,
        currentSearch
      );

      if (!result) {
        set({ stockReceipts: [], loading: false });
        return;
      }

      // ✅ result.data is already the flat array — NOT result.data.data
      set({
        stockReceipts: Array.isArray(result.data) ? result.data : [],
        currentPage:   result.current_page || page,
        totalPages:    result.totalPages   || 1,
        search:        currentSearch,
        loading:       false,
      });
    } catch {
      set({ loading: false });
    }
  },

  deleteStockReceipt: async (id) => {
    const success = await stockReceiptApiProvider.deleteStockReceipt(id);
    if (success) {
      set((state) => ({
        // ✅ filter by numeric id, not grn_id string
        stockReceipts: state.stockReceipts.filter((sr) => sr.id !== id),
      }));
    }
    return success;
  },
}));

export default useStockReceiptStore;