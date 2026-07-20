// import { create } from "zustand";
// import invoiceApiProvider from "../../../network/invoice-api-provider";

// const useInvoiceStore = create((set, get) => ({
//   invoices: [],
//   loading: false,
//   currentPage: 1,
//   totalPages: 1,
//   search: "",

//   setSearch: (value) => set({ search: value }),

//   // =====================================================
//   // FETCH INVOICES
//   // =====================================================
//   fetchInvoices: async (page = 1, search = null) => {
//   const currentSearch = search !== null ? search : get().search;
//   set({ loading: true });

//   try {
//     const result = await invoiceApiProvider.fetchInvoices(page, currentSearch);

//     if (!result) {
//       set({ invoices: [], currentPage: 1, totalPages: 1 });
//       return;
//     }

//     // API shape: { message, data: { from, to, totalCount, totalPages, data: [...] } }
//     set({
//       invoices: Array.isArray(result?.data?.data) ? result.data.data : [],
//       currentPage: result?.data?.from || page,
//       totalPages: result?.data?.totalPages || 1,
//       search: currentSearch,
//     });
//   } finally {
//     set({ loading: false });
//   }
// },

//   // =====================================================
//   // DELETE INVOICE
//   // =====================================================
//   deleteInvoice: async (invoiceId) => {
//     const success = await invoiceApiProvider.deleteInvoice(invoiceId);

//     if (success) {
//       set((state) => ({
//         invoices: state.invoices.filter(
//           (inv) => inv.invoice_id !== invoiceId
//         ),
//       }));
//     }

//     return success;
//   },
// }));

// export default useInvoiceStore;
import { create } from "zustand";
import invoiceApiProvider from "../../../network/invoice-api-provider";

const useInvoiceStore = create((set, get) => ({
  invoices:    [],
  loading:     false,
  currentPage: 1,
  totalPages:  1,
  search:      "",

  setSearch: (value) => set({ search: value }),

  fetchInvoices: async (page = 1, search = null) => {
    const currentSearch = search !== null ? search : get().search;
    set({ loading: true });
    try {
      const result = await invoiceApiProvider.fetchInvoices(page, currentSearch);
      if (!result) {
        set({ invoices: [], currentPage: 1, totalPages: 1, loading: false });
        return;
      }
      set({
        invoices:    Array.isArray(result?.data?.data) ? result.data.data : [],
        currentPage: result?.data?.from || page,
        totalPages:  result?.data?.totalPages || 1,
        search:      currentSearch,
        loading:     false,
      });
    } catch {
      set({ loading: false });
    }
  },

  deleteInvoice: async (id) => {
    const success = await invoiceApiProvider.deleteInvoice(id);
    if (success) {
      set((state) => ({
        invoices: state.invoices.filter((inv) => inv.id !== id && inv.invoice_id !== id),
      }));
    }
    return success;
  },
}));

export default useInvoiceStore;