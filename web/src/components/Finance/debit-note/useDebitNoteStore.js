import { create } from "zustand";
import debitNoteApiProvider from "../../../network/debitNote-api-provider";

const useDebitNoteStore = create((set, get) => ({
  debitNotes: [],
  loading: false,
  currentPage: 1,
  totalPages: 1,
  search: "",

  setSearch: (value) => set({ search: value }),

  // =====================================================
  // FETCH DEBIT NOTES
  // =====================================================
  fetchDebitNotes: async (page = 1, search = null) => {
    const currentSearch = search !== null ? search : get().search;
    set({ loading: true });

    try {
      const result = await debitNoteApiProvider.fetchDebitNotes(
        page,
        currentSearch
      );

      if (!result) {
        set({ debitNotes: [], currentPage: 1, totalPages: 1 });
        return;
      }

      const rawData = Array.isArray(result?.data?.data)
        ? result.data.data
        : Array.isArray(result?.data)
        ? result.data
        : Array.isArray(result)
        ? result
        : [];

      const mappedDebitNotes = rawData.map((dn) => ({
        id: dn.id,
        debitNote_id:   dn.DBN_ID          || dn.dbn_id          || "",
        purchase_order_ref: dn.purchase_order_ref || dn.po_ref   || "",
        supplier_name:
          dn.supplier_name ||
          `${dn.supplier?.first_name || ""} ${dn.supplier?.last_name || ""}`.trim(),
        debitNote_date: dn.debit_note_date  || dn.debitNote_date  || "",
        due_date:       dn.due_date                               || "",
        status:         dn.status                                 || "",
        payment_status: dn.payment_status                         || "",
        grand_total:    dn.grand_total      || dn.total           || 0,
        _raw: dn,
      }));

      set({
        debitNotes: mappedDebitNotes,
        currentPage: result?.data?.from    || result?.from    || page,
        totalPages:  result?.data?.totalPages || result?.totalPages || 1,
        search:      currentSearch,
      });
    } finally {
      set({ loading: false });
    }
  },

  // =====================================================
  // DELETE DEBIT NOTE
  // =====================================================
  deleteDebitNote: async (id) => {
    const success = await debitNoteApiProvider.deleteDebitNote(id);

    if (success) {
      set((state) => ({
        debitNotes: state.debitNotes.filter((dn) => dn.id !== id),
      }));
    }

    return success;
  },
}));

export default useDebitNoteStore;
