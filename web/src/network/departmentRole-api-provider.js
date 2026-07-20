// // src/network/department-api-provider.js
// import ApiClient from "./api-client";
// import { toast } from "react-toastify";

// class DepartmentRoleApiProvider {
//   // =====================================================
//   // FETCH DEPARTMENTS
//   // =====================================================
//   async fetchDepartments(page = 1, search = "") {
//     try {
//       console.log("Fetching departments with page:", page, "search:", search);

//       const res = await ApiClient.get("/masters/departments/", {
//         params: { page, search },
//       });

//       if (res.status === 200) return res.data;

//       toast.error("Failed to load departments");
//       return { departments: [], total_pages: 1, current_page: 1 };
//     } catch (error) {
//       toast.error(error?.response?.data?.message || "Error loading departments");
//       return { departments: [], total_pages: 1, current_page: 1 };
//     }
//   }

//   // =====================================================
//   // CREATE DEPARTMENT
//   // =====================================================
//   async createDepartment(data) {
//     try {
//       const res = await ApiClient.post("/masters/departments/create/",data);
//       if (res.status === 200 || res.status === 201) {
//         toast.success("Department created successfully");
//         return res.data;
//       }

//       toast.error("Failed to create department");
//       return null;
//     } catch (error) {
//       toast.error(error?.response?.data?.message || "Error creating department");
//       return null;
//     }
//   }

//   // =====================================================
//   // UPDATE DEPARTMENT
//   // =====================================================
//   async updateDepartment(departmentId, data) {
//     try {
//       const res = await ApiClient.put(`/masters/departments/${departmentId}/`, data);
//       if (res.status === 200) {
//         toast.success("Department updated successfully");
//         return res.data;
//       }

//       toast.error("Failed to update department");
//       return null;
//     } catch (error) {
//       toast.error(error?.response?.data?.message || "Error updating department");
//       return null;
//     }
//   }

//   // =====================================================
//   // DELETE DEPARTMENT
//   // =====================================================
//   async deleteDepartment(departmentId) {
//     try {
//       const res = await ApiClient.delete(`/masters/departments/${departmentId}/`);
//       if (res.status === 200 || res.status === 204) {
//         toast.success("Department deleted successfully");
//         return true;
//       }

//       toast.error("Failed to delete department");
//       return false;
//     } catch (error) {
//       toast.error(error?.response?.data?.message || "Error deleting department");
//       return false;
//     }
//   }

//   //  async fetchRoles(departmentId = null) {
//   //   try {
//   //     const url = departmentId
//   //       ? `/masters/departments/${departmentId}/`
//   //       : `/masters/departments/`;

//   //     const res = await ApiClient.get(url);

//   //     if (res.status === 200) return res.data.roles ?? res.data;

//   //     toast.error("Failed to load roles");
//   //     return [];
//   //   } catch (error) {
//   //     toast.error(error?.response?.data?.message || "Error loading roles");
//   //     return [];
//   //   }
//   // }
//   const fetchRoles = async (id) => {
//   setRolesLoading(true);
//   try {
//     const res = await departmentRoleApiProvider.fetchRoles(id);

//     // Adjust based on your API response shape — try these in order:
//     const data = res?.data?.roles      // { data: { roles: [...] } }
//                || res?.data?.data      // { data: { data: [...] } }
//                || res?.data           // { data: [...] }
//                || res?.roles          // { roles: [...] }
//                || res;                // already an array

//     setRoles(Array.isArray(data) ? data : []);
//   } catch {
//     toast.error("Failed to load roles");
//   } finally {
//     setRolesLoading(false);
//   }
// };


//    async fetchBranches() {
//     try {
//       console.log("Fetching branches with page:");

//       const res = await ApiClient.get("/masters/branches/");

//       if (res.status === 200) return res.data;

//       toast.error("Failed to load branches");
//       return { branches: [] };
//     } catch (error) {
//       toast.error(error?.response?.data?.message || "Error loading branches");
//       return { branches: [] };
//     }
//   }
// }

// const departmentRoleApiProvider = new DepartmentRoleApiProvider();
// export default departmentRoleApiProvider;
import ApiClient from "./api-client";
import { toast } from "react-toastify";

class DepartmentRoleApiProvider {

  async fetchDepartments(page = 1, search = "") {
    try {
      console.log("Fetching departments with page:", page, "search:", search);
      const res = await ApiClient.get("/masters/departments/", {
        params: { page, search },
      });
      if (res.status === 200) return res.data;
      toast.error("Failed to load departments");
      return { departments: [], total_pages: 1, current_page: 1 };
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error loading departments");
      return { departments: [], total_pages: 1, current_page: 1 };
    }
  }

  async fetchDepartmentById(departmentId) {
    try {
      const res = await ApiClient.get(`/masters/departments/${departmentId}/`);
      if (res.status === 200) return res.data;
      toast.error("Failed to load department");
      return null;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error loading department");
      return null;
    }
  }

  async fetchRolesByDepartment(departmentId) {
    try {
      const res = await ApiClient.get("/masters/roles/", {
        params: { department: departmentId },
      });
      if (res.status === 200) {
        return Array.isArray(res.data) ? res.data : res.data.roles || [];
      }
      toast.error("Failed to load roles");
      return [];
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error loading roles");
      return [];
    }
  }

  async fetchRoleById(roleId) {
    try {
      const res = await ApiClient.get(`/masters/roles/${roleId}/`);
      if (res.status === 200) return res.data;
      toast.error("Failed to load role");
      return null;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error loading role");
      return null;
    }
  }

  async createDepartment(data) {
    try {
      const res = await ApiClient.post("/masters/departments/create/", data);
      if (res.status === 200 || res.status === 201) return res.data;
      toast.error("Failed to create department");
      return null;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error creating department");
      return null;
    }
  }

  async updateDepartment(departmentId, data) {
    try {
      const res = await ApiClient.put(`/masters/departments/${departmentId}/`, data);
      if (res.status === 200) return res.data;
      toast.error("Failed to update department");
      return null;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error updating department");
      return null;
    }
  }

  async deleteDepartment(departmentId) {
    try {
      const res = await ApiClient.delete(`/masters/departments/${departmentId}/`);
      if (res.status === 200 || res.status === 204) return true;
      toast.error("Failed to delete department");
      return false;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error deleting department");
      return false;
    }
  }

  async fetchBranches() {
    try {
      console.log("Fetching branches with page:");
      const res = await ApiClient.get("/masters/branches/");
      if (res.status === 200) return res.data;
      toast.error("Failed to load branches");
      return { branches: [] };
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error loading branches");
      return { branches: [] };
    }
  }
}

const departmentRoleApiProvider = new DepartmentRoleApiProvider();
export default departmentRoleApiProvider;