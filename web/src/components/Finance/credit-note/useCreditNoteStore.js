// import { create } from "zustand";
// import salesOrderApiProvider from "../../../network/salesOrder-api-provider";

// const useSalesOrderStore = create((set, get) => ({
//   salesOrders: [],
//   loading: false,
//   currentPage: 1,
//   totalPages: 1,
//   search: "",

//   setSearch: (value) => set({ search: value }),

//   // =====================================================
//   // FETCH SALES ORDERS
//   // =====================================================
//   fetchSalesOrders: async (page = 1, search = null) => {
//   const currentSearch = search !== null ? search : get().search;
//   set({ loading: true });

//   try {
//     const result = await salesOrderApiProvider.fetchSalesOrders(page, currentSearch);

//     if (!result) {
//       set({ salesOrders: [], currentPage: 1, totalPages: 1 });
//       return;
//     }

//     // Map API response to flat structure the component expects
//     const rawData = Array.isArray(result?.data?.data) ? result.data.data : [];
//     const mappedOrders = rawData.map((order) => ({
//       sales_order_id: order.sales_order_id,
//       order_type: order.order_type,
//       customer_name:
//         `${order.customer?.first_name || ""} ${order.customer?.last_name || ""}`.trim(),
//       sales_rep: order.sales_rep || "",
//       order_date: order.order_date,
//       status: order.status,
//       grand_total: order.grand_total,
//       purchase_order: order.purchase_order || null,   // not in API yet, default null
//       stock_status: order.stock_status || null,       // not in API yet, default null
//       // keep id for delete
//       id: order.id,
//     }));

//     set({
//       salesOrders: mappedOrders,
//       currentPage: result?.data?.from || page,
//       totalPages: result?.data?.totalPages || 1,
//       search: currentSearch,
//     });
//   } finally {
//     set({ loading: false });
//   }
// },

// // Fix delete filter — use sales_order_id not order_id
// deleteSalesOrder: async (orderId) => {
//   const success = await salesOrderApiProvider.deleteSalesOrder(orderId);
//   if (success) {
//     set((state) => ({
//       salesOrders: state.salesOrders.filter(
//         (order) => order.sales_order_id !== orderId
//       ),
//     }));
//   }
//   return success;
// },

//   // =====================================================
//   // DELETE SALES ORDER
//   // =====================================================
//   deleteSalesOrder: async (orderId) => {
//     const success = await salesOrderApiProvider.deleteSalesOrder(orderId);

//     if (success) {
//       set((state) => ({
//         salesOrders: state.salesOrders.filter(
//           (order) => order.order_id !== orderId
//         ),
//       }));
//     }

//     return success;
//   },
// }));

// export default useSalesOrderStore;
import { create } from "zustand";
import creditNoteApiProvider from "../../../network/creditNote-api-provider";

const useCreditNoteStore = create((set, get) => ({
  creditNotes: [],
  loading: false,
  currentPage: 1,
  totalPages: 1,
  search: "",

  setSearch: (value) => set({ search: value }),

  // =====================================================
  // FETCH CREDIT NOTES
  // =====================================================
  fetchCreditNotes: async (page = 1, search = null) => {
    const currentSearch = search !== null ? search : get().search;
    set({ loading: true });

    try {
      const result = await creditNoteApiProvider.fetchCreditNotes(
        page,
        currentSearch
      );

      if (!result) {
        set({ creditNotes: [], currentPage: 1, totalPages: 1 });
        return;
      }

      // Normalize raw API data to flat structure the component expects
      const rawData = Array.isArray(result?.data?.data)
        ? result.data.data
        : Array.isArray(result?.data)
        ? result.data
        : Array.isArray(result)
        ? result
        : [];

      const mappedCreditNotes = rawData.map((cn) => ({
        // internal DB id (used for API calls)
        id: cn.id,

        // display fields
        creditNote_id:   cn.CRN_ID          || cn.crn_id          || "",
        invoice_ref:     cn.invoice_ref      || cn.invoice         || "",
        customer_name:
          cn.customer_name ||
          `${cn.customer?.first_name || ""} ${cn.customer?.last_name || ""}`.trim(),
        creditNote_date: cn.credit_note_date || cn.creditNote_date || "",
        due_date:        cn.due_date                               || "",
        status:          cn.status                                 || "",
        payment_status:  cn.payment_status                         || "",
        grand_total:     cn.grand_total      || cn.total           || 0,

        // keep raw for any other usage
        _raw: cn,
      }));

      set({
        creditNotes: mappedCreditNotes,
        currentPage: result?.data?.from    || result?.from    || page,
        totalPages:  result?.data?.totalPages || result?.totalPages || 1,
        search:      currentSearch,
      });
    } finally {
      set({ loading: false });
    }
  },

  // =====================================================
  // DELETE CREDIT NOTE
  // =====================================================
  deleteCreditNote: async (id) => {
    const success = await creditNoteApiProvider.deleteCreditNote(id);

    if (success) {
      set((state) => ({
        creditNotes: state.creditNotes.filter((cn) => cn.id !== id),
      }));
    }

    return success;
  },
}));

export default useCreditNoteStore;