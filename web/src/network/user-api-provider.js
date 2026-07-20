import ApiClient from "./api-client";
import { toast } from "react-toastify";

class UserApiProvider {
  // =====================================================
  // UNIVERSAL ERROR HANDLER
  // =====================================================
  handleError(error, defaultMessage) {
    console.error("API Error:", error?.response?.data || error);

    const errorData = error?.response?.data;

    let errorMessage = defaultMessage;

    if (errorData?.error) {
      errorMessage = errorData.error;
    } else if (errorData?.message) {
      errorMessage = errorData.message;
    } else if (typeof errorData === "object") {
      errorMessage = Object.values(errorData).flat().join(" ");
    }

    toast.error(errorMessage);
  }

  // =====================================================
  // FETCH BRANCHES
  // =====================================================
  async fetchBranches() {
    try {
      const res = await ApiClient.get("/masters/branches/");

      if (res.status === 200) {
        const branches =
          res.data?.data?.data || res.data?.data || res.data || [];
        return Array.isArray(branches) ? branches : [];
      }

      toast.error("Failed to load branches");
      return [];
    } catch (error) {
      this.handleError(error, "Error loading branches");
      return [];
    }
  }

  // =====================================================
  // FETCH DEPARTMENTS
  // =====================================================
  async fetchDepartments(branchId = null) {
    try {
      const url = branchId
        ? `/masters/departments/?branch=${branchId}`
        : `/masters/departments/`;

      const res = await ApiClient.get(url);

      if (res.status === 200) {
        const departments =
          res.data?.departments ||
          res.data?.data?.data ||
          res.data?.data ||
          res.data ||
          [];
        return Array.isArray(departments) ? departments : [];
      }

      toast.error("Failed to load departments");
      return [];
    } catch (error) {
      this.handleError(error, "Error loading departments");
      return [];
    }
  }

  // =====================================================
  // FETCH ROLES
  // =====================================================
  async fetchRoles(departmentId = null) {
    try {
      const url = departmentId
        ? `/masters/roles/?department=${departmentId}`
        : `/masters/roles/`;

      const res = await ApiClient.get(url);

      if (res.status === 200) {
        const roles =
          res.data?.roles ||
          res.data?.data?.data ||
          res.data?.data ||
          res.data ||
          [];
        return Array.isArray(roles) ? roles : [];
      }

      toast.error("Failed to load roles");
      return [];
    } catch (error) {
      this.handleError(error, "Error loading roles");
      return [];
    }
  }

  // =====================================================
  // FETCH USERS
  // =====================================================
  async fetchUsers(page = 1, search = "") {
    try {
      const res = await ApiClient.get("/masters/users/", {
        params: { page, search, ordering: "-id" },
      });

      if (res.status === 200) {
        return {
          users: res.data?.users || res.data?.data || [],
          total_pages: res.data?.total_pages || 1,
          current_page: res.data?.current_page || page,
        };
      }

      toast.error("Failed to load users");
      return { users: [], total_pages: 1, current_page: 1 };
    } catch (error) {
      this.handleError(error, "Error loading users");
      return { users: [], total_pages: 1, current_page: 1 };
    }
  }

  // =====================================================
// FETCH ALL USERS (for dropdowns — no pagination)
// =====================================================
async fetchAllUsers() {
  try {
    const res = await ApiClient.get("/masters/users/");

    if (res.status === 200) {
      // shape: { message, data: { from, to, totalCount, totalPages, data: [...] } }
      const users =
        res.data?.data?.data ??
        res.data?.users ??
        res.data?.data ??
        [];
      return Array.isArray(users) ? users : [];
    }

    toast.error("Failed to load users");
    return [];
  } catch (error) {
    this.handleError(error, "Error loading users");
    return [];
  }
}

  // =====================================================
  // CREATE USER
  // =====================================================
  async createUser(data) {
    try {
      const res = await ApiClient.post("/masters/users/", data);

      if (res.status === 200 || res.status === 201) {
        toast.success("User created successfully");
        return res.data;
      }

      toast.error("Failed to create user");
      return null;
    } catch (error) {
      this.handleError(error, "Error creating user");
      return null;
    }
  }

  // =====================================================
  // UPDATE USER
  // =====================================================
  async updateUser(userId, data) {
    try {
      const res = await ApiClient.put(
        `/masters/users/${userId}/`,
        data
      );

      if (res.status === 200) {
        toast.success("User updated successfully");
        return res.data;
      }

      toast.error("Failed to update user");
      return null;
    } catch (error) {
      this.handleError(error, "Error updating user");
      return null;
    }
  }

  // =====================================================
  // DELETE USER
  // =====================================================
  async deleteUser(userId) {
    try {
      const res = await ApiClient.delete(
        `/masters/users/${userId}/`
      );

      if (res.status === 200 || res.status === 204) {
        toast.success("User deleted successfully");
        return true;
      }

      toast.error("Failed to delete user");
      return false;
    } catch (error) {
      this.handleError(error, "Error deleting user");
      return false;
    }
  }
}

const userApiProvider = new UserApiProvider();
export default userApiProvider;
