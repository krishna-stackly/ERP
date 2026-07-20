import { create } from "zustand";
import userApiProvider from "../../../network/user-api-provider";
import { toast } from "react-toastify";

const useUserStore = create((set, get) => ({
  users: [],
  loading: false,
  currentPage: 1,
  totalPages: 1,
  search: "",

  setSearch: (value) => set({ search: value }),

 fetchUsers: async (page = 1, search = null) => {
  const currentSearch = search !== null ? search : get().search;
  set({ loading: true });

  try {
    const response = await userApiProvider.fetchUsers(page, currentSearch);

    console.log("RAW response:", response); // remove after fix confirmed

    const users       = response?.users?.data       || [];  // ✅
    const total_pages = response?.users?.totalPages  || 1;  // ✅ from users object
    const current_page = response?.current_page      || page; // ✅

    set({
      users,
      currentPage: current_page,
      totalPages: total_pages,
      search: currentSearch,
    });
  } catch (error) {
    toast.error("Failed to load users");
    set({ users: [], currentPage: 1, totalPages: 1 });
  } finally {
    set({ loading: false });
  }
},

  deleteUser: async (userId) => {
    const success = await userApiProvider.deleteUser(userId);

    if (success) {
      set({
        users: get().users.filter((u) => u.id !== userId),
      });
    }
  },
}));

export default useUserStore;