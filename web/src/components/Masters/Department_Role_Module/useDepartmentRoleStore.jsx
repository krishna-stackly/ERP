// // src/store/useDepartmentStore.js
// import { create } from "zustand";
// import departmentRoleApiProvider from "../../../network/departmentRole-api-provider";
// import { toast } from "react-toastify";

// const useDepartmentStore = create((set, get) => ({
//   departments: [],
//   loading: false,
//   currentPage: 1,
//   totalPages: 1,
//   search: "",

//   setSearch: (value) => set({ search: value }),

//   fetchDepartments: async (page = 1, search = null) => {
//     const currentSearch = search !== null ? search : get().search;

//     set({ loading: true });
//     try {
//       const response = await departmentRoleApiProvider.fetchDepartments(page, currentSearch);

//       const departments = response?.departments || [];
//       const current_page = response?.current_page || page;
//       const total_pages = response?.total_pages || 1;

//       set({
//         departments,
//         currentPage: current_page,
//         totalPages: total_pages,
//         search: currentSearch,
//       });
//     } catch (error) {
//       toast.error("Failed to load departments");
//       set({ departments: [], currentPage: 1, totalPages: 1 });
//     } finally {
//       set({ loading: false });
//     }
//   },

//   deleteDepartment: async (departmentId) => {
//     const okDel = window.confirm("Are you sure you want to delete this department?");
//     if (!okDel) return;

//     const success = await departmentRoleApiProvider.deleteDepartment(departmentId);
//     if (success) {
//       set((state) => ({
//         departments: state.departments.filter((d) => d.id !== departmentId),
//       }));
//     }
//   },
// }));

// export default useDepartmentStore;
// src/store/useDepartmentRoleStore.js
import { create } from "zustand";
import departmentRoleApiProvider from "../../../network/departmentRole-api-provider";
import { toast } from "react-toastify";

const useDepartmentStore = create((set, get) => ({
  departments: [],
  loading: false,
  currentPage: 1,
  totalPages: 1,
  totalCount: 0,
  search: "",

  setSearch: (value) => set({ search: value }),

  fetchDepartments: async (page = 1, search = null) => {
    const currentSearch = search !== null ? search : get().search;

    set({ loading: true });
    try {
      const response = await departmentRoleApiProvider.fetchDepartments(page, currentSearch);

      console.log('API Response:', response);

      // Parse the nested response structure: response.data.data
      if (response && response.data) {
        set({
          departments: response.data.data || [],
          currentPage: page,
          totalPages: response.data.totalPages || 1,
          totalCount: response.data.totalCount || 0,
          search: currentSearch,
        });
      } else {
        set({
          departments: [],
          currentPage: 1,
          totalPages: 1,
          totalCount: 0,
        });
      }
    } catch (error) {
      console.error("Failed to load departments:", error);
      toast.error("Failed to load departments");
      set({ 
        departments: [], 
        currentPage: 1, 
        totalPages: 1,
        totalCount: 0,
      });
    } finally {
      set({ loading: false });
    }
  },

  deleteDepartment: async (departmentId) => {
    const okDel = window.confirm("Are you sure you want to delete this department?");
    if (!okDel) return;

    try {
      const success = await departmentRoleApiProvider.deleteDepartment(departmentId);
      if (success) {
        toast.success("Department deleted successfully");
        
        // Refresh the list
        const { currentPage, search } = get();
        get().fetchDepartments(currentPage, search);
      }
    } catch (error) {
      console.error("Failed to delete department:", error);
      toast.error("Failed to delete department");
    }
  },
}));

export default useDepartmentStore;