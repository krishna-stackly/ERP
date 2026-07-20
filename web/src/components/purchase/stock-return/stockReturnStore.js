// import { create } from "zustand";
// import stockReturnApiProvider from "../../../network/stockReturnApiProvider";
// import { toast } from "react-toastify";

// const useStockReturnStore = create((set, get) => ({
//   stockReturns: [],
//   loading: false,
//   currentPage: 1,
//   totalPages: 1,
//   search: "",

//   setSearch: (value) => set({ search: value }),

//   // =====================================================
//   // FETCH STOCK RETURNS
//   // =====================================================
//   fetchStockReturns: async (page = 1, search = null) => {
//     const currentSearch = search !== null ? search : get().search;

//     set({ loading: true });

//     try {
//       const response = await stockReturnApiProvider.fetchStockReturns(page, currentSearch);

//       const stockReturns = response?.data?.data || [];
//       const current_page = response?.data?.current_page || page;
//       const total_pages = response?.data?.totalPages || 1;

//       set({
//         stockReturns,
//         currentPage: current_page,
//         totalPages: total_pages,
//         search: currentSearch,
//       });
//     } catch (error) {
//       console.error("fetchStockReturns error:", error);
//       toast.error("Failed to load stock returns");
//       set({
//         stockReturns: [],
//         currentPage: 1,
//         totalPages: 1,
//       });
//     } finally {
//       set({ loading: false });
//     }
//   },

//   // =====================================================
//   // DELETE STOCK RETURN
//   // =====================================================
//   deleteStockReturn: async (returnId) => {
//     const success = await stockReturnApiProvider.deleteStockReturn(returnId);

//     if (success) {
//       set({
//         stockReturns: get().stockReturns.filter(
//           (sr) => sr.id !== returnId
//         ),
//       });
//     }
//   },
// }));

// export default useStockReturnStore;
import { create } from "zustand";
import stockReturnApiProvider from "../../../network/stockReturn-api-provider";

const useStockReturnStore = create((set, get) => ({
  stockReturns: [],
  loading: false,
  currentPage: 1,
  totalPages: 1,
  search: "",

  setSearch: (value) => set({ search: value }),

  // =====================================================
  // FETCH STOCK RETURNS
  // =====================================================
  fetchStockReturns: async (page = 1, search = null) => {
    const currentSearch = search !== null ? search : get().search;

    set({ loading: true });

    try {
      const result = await stockReturnApiProvider.fetchStockReturns(
        page,
        currentSearch
      );

      if (!result) {
        set({ stockReturns: [], currentPage: 1, totalPages: 1 });
        return;
      }

      // API shape: { message, data: { from, to, totalCount, totalPages, data: [...] } }
      set({
        stockReturns: result?.data?.data || [],
        currentPage: result?.data?.from   || page,
        totalPages:  result?.data?.totalPages || 1,
        search: currentSearch,
      });
    } finally {
      set({ loading: false });
    }
  },

  // =====================================================
  // DELETE STOCK RETURN
  // =====================================================
  deleteStockReturn: async (returnId) => {
    const success = await stockReturnApiProvider.deleteStockReturn(returnId);

    if (success) {
      set((state) => ({
        stockReturns: state.stockReturns.filter((sr) => sr.id !== returnId),
      }));
    }

    return success;
  },
}));

export default useStockReturnStore;