// import { create } from "zustand";
// import invoiceReturnApiProvider from "../../../network/invoiceReturn-api-provider";

// const useInvoiceReturnStore = create((set, get) => ({
//   invoiceReturns: [],
//   loading: false,
//   currentPage: 1,
//   totalPages: 1,
//   search: "",

//   setSearch: (value) => set({ search: value }),

//   // =====================================================
//   // FETCH INVOICE RETURNS
//   // =====================================================
//   fetchInvoiceReturns: async (page = 1, search = null) => {
//     const currentSearch = search !== null ? search : get().search;

//     set({ loading: true });

//     try {
//       const result = await invoiceReturnApiProvider.fetchInvoiceReturns(
//         page,
//         currentSearch
//       );

//       if (!result) {
//         set({ invoiceReturns: [], currentPage: 1, totalPages: 1 });
//         return;
//       }

//       set({
//         invoiceReturns: Array.isArray(result?.data) ? result.data : [],
//         currentPage: result?.current_page || page,
//         totalPages: result?.totalPages || 1,
//         search: currentSearch,
//       });
//     } finally {
//       set({ loading: false });
//     }
//   },

//   // =====================================================
//   // DELETE INVOICE RETURN
//   // =====================================================
//   deleteInvoiceReturn: async (returnId) => {
//     const success = await invoiceReturnApiProvider.deleteInvoiceReturn(returnId);

//     if (success) {
//       set((state) => ({
//         invoiceReturns: state.invoiceReturns.filter(
//           (inv) => inv.invoice_id !== returnId
//         ),
//       }));
//     }

//     return success;
//   },
// }));

// export default useInvoiceReturnStore;
import { create } from "zustand";
import invoiceReturnApiProvider from "../../../network/invoiceReturn-api-provider";

const useInvoiceReturnStore = create((set, get) => ({
  invoiceReturns: [],
  loading: false,
  currentPage: 1,
  totalPages: 1,
  search: "",

  setSearch: (value) => set({ search: value }),

  // =====================================================
  // FETCH INVOICE RETURNS
  // =====================================================
  fetchInvoiceReturns: async (page = 1, search = null) => {
    const currentSearch = search !== null ? search : get().search;

    set({ loading: true });

    try {
      const res = await invoiceReturnApiProvider.fetchInvoiceReturns(page, currentSearch);

      if (!res) {
        set({ invoiceReturns: [], currentPage: 1, totalPages: 1 });
        return;
      }

      // API shape: { message, data: { from, to, totalCount, totalPages, data: [...] } }
      const pagination = res.data ?? res;

      set({
        invoiceReturns: Array.isArray(pagination.data) ? pagination.data : [],
        currentPage:    pagination.from    ? page          : page,
        totalPages:     pagination.totalPages              ?? 1,
        search:         currentSearch,
      });
    } finally {
      set({ loading: false });
    }
  },

  // =====================================================
  // DELETE INVOICE RETURN
  // =====================================================
  deleteInvoiceReturn: async (returnId) => {
    const success = await invoiceReturnApiProvider.deleteInvoiceReturn(returnId);

    if (success) {
      set((state) => ({
        invoiceReturns: state.invoiceReturns.filter(
          (inv) => inv.id !== returnId && inv.invoice_return_id !== returnId
        ),
      }));
    }

    return success;
  },
}));

export default useInvoiceReturnStore;