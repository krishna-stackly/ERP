// import { create } from "zustand";
// import quotationApiProvider from "../../../network/quotation-api-provider";
// import { toast } from "react-toastify";

// const useQuotationStore = create((set, get) => ({
//   quotations: [],
//   loading: false,
//   currentPage: 1,
//   totalPages: 1,
//   search: "",

//   setSearch: (value) => set({ search: value }),

//   // =====================================================
//   // FETCH QUOTATIONS
//   // =====================================================
//   fetchQuotations: async (page = 1, search = null) => {
//     const currentSearch = search !== null ? search : get().search;

//     set({ loading: true });

//     try {
//       const response = await quotationApiProvider.fetchQuotations(
//         page,
//         currentSearch
//       );

//       console.log("fetchQuotations response:", response); // debug

//       // ✅ Adjusted for nested response structure
//       const quotations = response?.data?.data || [];
//       const current_page = response?.data?.current_page || page;
//       const total_pages = response?.data?.totalPages || 1;

//       set({
//         quotations,
//         currentPage: current_page,
//         totalPages: total_pages,
//         search: currentSearch,
//       });
//     } catch (error) {
//       console.error("fetchQuotations error:", error);
//       toast.error("Failed to load quotations");
//       set({
//         quotations: [],
//         currentPage: 1,
//         totalPages: 1,
//       });
//     } finally {
//       set({ loading: false });
//     }
//   },

//   // =====================================================
//   // DELETE QUOTATION
//   // =====================================================
//   deleteQuotation: async (quotationId) => {
//     const success = await quotationApiProvider.deleteQuotation(quotationId);

//     if (success) {
//       set({
//         quotations: get().quotations.filter(
//           (q) => q.id !== quotationId
//         ),
//       });
//     }
//   },
// }));

// export default useQuotationStore;
import { create } from "zustand";
import quotationApiProvider from "../../../network/quotation-api-provider";

const useQuotationStore = create((set, get) => ({
  quotations:  [],
  loading:     false,
  currentPage: 1,
  totalPages:  1,
  search:      "",

  setSearch: (value) => set({ search: value }),

 fetchQuotations: async (page = 1, search = null) => {
  const currentSearch = search !== null ? search : get().search;
  set({ loading: true });
  try {
    const result = await quotationApiProvider.fetchQuotations(page, currentSearch);
    if (!result) {
      set({ quotations: [], loading: false });
      return;
    }
    set({
      quotations:  Array.isArray(result.data) ? result.data : [],
      currentPage: result.current_page || page,
      totalPages:  result.totalPages   || 1,
      search:      currentSearch,
      loading:     false,
    });
  } catch {
    set({ loading: false });
  }
},
}));

export default useQuotationStore;
