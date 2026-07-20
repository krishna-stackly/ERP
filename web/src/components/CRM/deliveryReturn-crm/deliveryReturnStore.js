// // import { create } from "zustand";
// // import deliveryReturnApiProvider from "../../../network/deliveryReturn-api-provider";

// // const useDeliveryReturnStore = create((set, get) => ({
// //   deliveryReturns: [],
// //   loading: false,
// //   currentPage: 1,
// //   totalPages: 1,
// //   search: "",

// //   setSearch: (value) => set({ search: value }),

// //   // =====================================================
// //   // FETCH DELIVERY RETURNS
// //   // =====================================================
// //   fetchDeliveryReturns: async (page = 1, search = null) => {
// //     const currentSearch = search !== null ? search : get().search;

// //     set({ loading: true });

// //     try {
// //       const result = await deliveryReturnApiProvider.fetchDeliveryReturns(
// //         page,
// //         currentSearch
// //       );

// //       if (!result) {
// //         set({ deliveryReturns: [], currentPage: 1, totalPages: 1 });
// //         return;
// //       }

// //       set({
// //         deliveryReturns: result?.data || [],
// //         currentPage: result?.current_page || page,
// //         totalPages: result?.totalPages || 1,
// //         search: currentSearch,
// //       });
// //     } finally {
// //       set({ loading: false });
// //     }
// //   },

// //   // =====================================================
// //   // DELETE DELIVERY RETURN
// //   // =====================================================
// //   deleteDeliveryReturn: async (returnId) => {
// //     const success = await deliveryReturnApiProvider.deleteDeliveryReturn(returnId);

// //     if (success) {
// //       set((state) => ({
// //         deliveryReturns: state.deliveryReturns.filter(
// //           (dr) => dr.dn_id !== returnId
// //         ),
// //       }));
// //     }

// //     return success;
// //   },
// // }));

// // export default useDeliveryReturnStore;
// import { create } from "zustand";
// import deliveryReturnApiProvider from "../../../network/deliveryReturn-api-provider";

// const useDeliveryReturnStore = create((set, get) => ({
//   deliveryReturns: [],
//   loading: false,
//   currentPage: 1,
//   totalPages: 1,
//   search: "",

//   setSearch: (value) => set({ search: value }),

//   // =====================================================
//   // FETCH DELIVERY RETURNS
//   // =====================================================
//   fetchDeliveryReturns: async (page = 1, search = null) => {
//     const currentSearch = search !== null ? search : get().search;
//     set({ loading: true });

//     try {
//       const result = await deliveryReturnApiProvider.fetchDeliveryReturns(
//         page,
//         currentSearch
//       );

//       set({
//         deliveryReturns: result?.data || [],
//         currentPage: result?.current_page || page,
//         totalPages: result?.totalPages || 1,
//         search: currentSearch,
//       });
//     } catch (error) {
//       console.error("❌ Store fetchDeliveryReturns error:", error);
//       set({ deliveryReturns: [], currentPage: 1, totalPages: 1 });
//     } finally {
//       set({ loading: false });
//     }
//   },

//   // =====================================================
//   // DELETE DELIVERY RETURN
//   // =====================================================
//   deleteDeliveryReturn: async (dnId) => {
//     // Resolve numeric id from local state (API needs integer, we track by dn_id string)
//     const record = get().deliveryReturns.find((dr) => dr.dn_id === dnId);
//     const numericId = record?.id || dnId;

//     const success = await deliveryReturnApiProvider.deleteDeliveryReturn(numericId);

//     if (success) {
//       set((state) => ({
//         deliveryReturns: state.deliveryReturns.filter((dr) => dr.dn_id !== dnId),
//       }));
//     }

//     return success;
//   },

//   // =====================================================
//   // PERFORM ACTION
//   // =====================================================
//   performAction: async (dnId, action) => {
//     const record = get().deliveryReturns.find((dr) => dr.dn_id === dnId);
//     const numericId = record?.id || dnId;

//     const result = await deliveryReturnApiProvider.performAction(numericId, action);

//     if (result) {
//       await get().fetchDeliveryReturns(get().currentPage, get().search);
//     }

//     return result;
//   },
// }));

// export default useDeliveryReturnStore;
import { create } from "zustand";
import deliveryReturnApiProvider from "../../../network/deliveryReturn-api-provider";

const useDeliveryReturnStore = create((set, get) => ({
  deliveryReturns: [],
  loading:         false,
  currentPage:     1,
  totalPages:      1,
  search:          "",

  setSearch: (search) => set({ search }),

  fetchDeliveryReturns: async (page = 1, search = "") => {
    set({ loading: true });
    try {
      const res = await deliveryReturnApiProvider.fetchDeliveryReturns(page, search);
      set({
        deliveryReturns: res.data        || [],
        currentPage:     res.current_page || page,
        totalPages:      res.totalPages   || 1,
        loading:         false,
      });
    } catch {
      set({ loading: false });
    }
  },

  deleteDeliveryReturn: async (id) => {
    await deliveryReturnApiProvider.deleteDeliveryReturn(id);
  },
}));

export default useDeliveryReturnStore;