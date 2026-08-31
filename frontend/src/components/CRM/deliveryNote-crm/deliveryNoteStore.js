// // import { create } from "zustand";
// // import deliveryNoteApiProvider from "../../../network/deliveryNote-api-provider";

// // const useDeliveryNoteStore = create((set, get) => ({
// //   deliveryNotes: [],
// //   loading: false,
// //   currentPage: 1,
// //   totalPages: 1,
// //   search: "",

// //   setSearch: (value) => set({ search: value }),

// //   // =====================================================
// //   // FETCH DELIVERY NOTES
// //   // =====================================================
// //   fetchDeliveryNotes: async (page = 1, search = null) => {
// //     const currentSearch = search !== null ? search : get().search;

// //     set({ loading: true });

// //     try {
// //       const result = await deliveryNoteApiProvider.fetchDeliveryNotes(
// //         page,
// //         currentSearch
// //       );

// //       if (!result) {
// //         set({ deliveryNotes: [], currentPage: 1, totalPages: 1 });
// //         return;
// //       }

// //       set({
// //         deliveryNotes: result?.data || [],
// //         currentPage: result?.current_page || page,
// //         totalPages: result?.totalPages || 1,
// //         search: currentSearch,
// //       });
// //     } finally {
// //       set({ loading: false });
// //     }
// //   },

// //   // =====================================================
// //   // DELETE DELIVERY NOTE
// //   // =====================================================
// //   deleteDeliveryNote: async (noteId) => {
// //     const success = await deliveryNoteApiProvider.deleteDeliveryNote(noteId);

// //     if (success) {
// //       set((state) => ({
// //         deliveryNotes: state.deliveryNotes.filter(
// //           (dn) => dn.dn_id !== noteId
// //         ),
// //       }));
// //     }

// //     return success;
// //   },
// // }));

// // export default useDeliveryNoteStore;
// import { create } from "zustand";
// import deliveryNoteApiProvider from "../../../network/deliveryNote-api-provider";

// const useDeliveryNoteStore = create((set, get) => ({
//   deliveryNotes: [],
//   loading: false,
//   currentPage: 1,
//   totalPages: 1,
//   search: "",

//   setSearch: (value) => set({ search: value }),

//   // =====================================================
//   // FETCH DELIVERY NOTES
//   // =====================================================
//   fetchDeliveryNotes: async (page = 1, search = null) => {
//     const currentSearch = search !== null ? search : get().search;
//     set({ loading: true });

//     try {
//       const result = await deliveryNoteApiProvider.fetchDeliveryNotes(
//         page,
//         currentSearch
//       );

//       set({
//         deliveryNotes: result?.data || [],
//         currentPage: result?.current_page || page,
//         totalPages: result?.totalPages || 1,
//         search: currentSearch,
//       });
//     } catch (error) {
//       console.error("❌ Store fetchDeliveryNotes error:", error);
//       set({ deliveryNotes: [], currentPage: 1, totalPages: 1 });
//     } finally {
//       set({ loading: false });
//     }
//   },

//   // =====================================================
//   // DELETE DELIVERY NOTE
//   // =====================================================
//   deleteDeliveryNote: async (dnId) => {
//     // dnId here is the dn_id string (DN-0001) but API needs numeric id
//     // We find the numeric id from local state first
//     const note = get().deliveryNotes.find((dn) => dn.dn_id === dnId);
//     const numericId = note?.id || dnId;

//     const success = await deliveryNoteApiProvider.deleteDeliveryNote(numericId);

//     if (success) {
//       set((state) => ({
//         deliveryNotes: state.deliveryNotes.filter(
//           (dn) => dn.dn_id !== dnId
//         ),
//       }));
//     }

//     return success;
//   },

//   // =====================================================
//   // PERFORM ACTION (submit, cancel_dn, etc.)
//   // =====================================================
//   performAction: async (dnId, action) => {
//     const note = get().deliveryNotes.find((dn) => dn.dn_id === dnId);
//     const numericId = note?.id || dnId;

//     const result = await deliveryNoteApiProvider.performAction(numericId, action);

//     if (result) {
//       // Refresh the list after action
//       await get().fetchDeliveryNotes(get().currentPage, get().search);
//     }
//     return result;
//   },
// }));

// export default useDeliveryNoteStore;
import { create } from "zustand";
import deliveryNoteApiProvider from "../../../network/deliveryNote-api-provider";

const useDeliveryNoteStore = create((set, get) => ({
  deliveryNotes: [],
  loading:       false,
  currentPage:   1,
  totalPages:    1,
  search:        "",

  setSearch: (search) => set({ search }),

  fetchDeliveryNotes: async (page = 1, search = "") => {
    set({ loading: true });
    try {
      const res = await deliveryNoteApiProvider.fetchDeliveryNotes(page, search);
      set({
        deliveryNotes: res.data       || [],
        currentPage:   res.current_page || page,
        totalPages:    res.totalPages  || 1,
        loading:       false,
      });
    } catch {
      set({ loading: false });
    }
  },

  deleteDeliveryNote: async (id) => {
    await deliveryNoteApiProvider.deleteDeliveryNote(id);
  },
}));

export default useDeliveryNoteStore;