import { create } from "zustand";
import enquiryApiProvider from "../../../network/enquiry-api-provider";
import { toast } from "react-toastify";

const useEnquiryStore = create((set, get) => ({
  enquiries: [],
  loading: false,
  currentPage: 1,
  totalPages: 1,
  search: "",

  setSearch: (value) => set({ search: value }),

  // =====================================================
  // FETCH ENQUIRIES
  // =====================================================
  fetchEnquiries: async (page = 1, search = null) => {
    const currentSearch = search !== null ? search : get().search;

    set({ loading: true });

    try {
      const response = await enquiryApiProvider.fetchEnquiries(page, currentSearch);

      console.log("fetchEnquiries response:", response); // 👈 debug

      // ✅ FIX: API returns { data: { data: [...], totalPages, ... } }
      const enquiries = response?.data?.data || [];
      const current_page = response?.data?.current_page || page;
      const total_pages = response?.data?.totalPages || 1;

      set({
        enquiries,
        currentPage: current_page,
        totalPages: total_pages,
        search: currentSearch,
      });
    } catch (error) {
      console.error("fetchEnquiries error:", error);
      toast.error("Failed to load enquiries");
      set({
        enquiries: [],
        currentPage: 1,
        totalPages: 1,
      });
    } finally {
      set({ loading: false });
    }
  },

  // =====================================================
  // DELETE ENQUIRY
  // =====================================================
  deleteEnquiry: async (enquiryId) => {
    const success = await enquiryApiProvider.deleteEnquiry(enquiryId);

    if (success) {
      set({
        enquiries: get().enquiries.filter((e) => e.id !== enquiryId),
      });
    }
  },
}));

export default useEnquiryStore;