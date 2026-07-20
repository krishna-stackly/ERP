import ApiClient from "./api-client";
import { toast } from "react-toastify";

class ProductApiProvider {

  // =====================================================
  // HELPER — handles every response shape the backend sends:
  //   { message, data: { data: [...] } }   ← paginated wrapper  ✓
  //   { data: [...] }                       ← simple nested key
  //   { results: [...] }                    ← DRF pagination
  //   [...]                                 ← flat array
  // =====================================================
  _extractList(responseData) {
    if (Array.isArray(responseData)) return responseData;
    if (Array.isArray(responseData?.data?.data)) return responseData.data.data;
    if (Array.isArray(responseData?.data)) return responseData.data;
    if (Array.isArray(responseData?.results)) return responseData.results;
    return [];
  }

  // =====================================================
  // PRODUCTS
  // =====================================================

  async fetchProducts(page = 1, search = "") {
    try {
      const res = await ApiClient.get("masters/products/", { params: { page, search } });
      if (res.status === 200) return res.data;
      toast.error("Failed to load products");
      return { results: [], count: 0 };
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error loading products");
      return { results: [], count: 0 };
    }
  }

  async fetchSingleProduct(productId) {
    try {
      const res = await ApiClient.get(`masters/products/${productId}/`);
      if (res.status === 200) return res.data;
      toast.error("Failed to load product details");
      return null;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error loading product");
      return null;
    }
  }

  async createProduct(data) {
    try {
      const isFormData = data instanceof FormData;
      const res = await ApiClient.post("masters/products/", data, {
        headers: isFormData
          ? { "Content-Type": "multipart/form-data" }
          : { "Content-Type": "application/json" },
      });
      if (res.status === 200 || res.status === 201) {
        toast.success("Product created successfully");
        return res.data;
      }
      toast.error("Failed to create product");
      return null;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error creating product");
      return null;
    }
  }

  async updateProduct(productId, data) {
    try {
      const isFormData = data instanceof FormData;
      const res = await ApiClient.put(`masters/products/${productId}/`, data, {
        headers: isFormData
          ? { "Content-Type": "multipart/form-data" }
          : { "Content-Type": "application/json" },
      });
      if (res.status === 200) {
        toast.success("Product updated successfully");
        return res.data;
      }
      toast.error("Failed to update product");
      return null;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error updating product");
      return null;
    }
  }

  async deleteProduct(productId) {
    try {
      const res = await ApiClient.delete(`masters/products/${productId}/`);
      if (res.status === 204 || res.status === 200) {
        toast.success("Product deleted successfully");
        return true;
      }
      toast.error("Failed to delete product");
      return false;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error deleting product");
      return false;
    }
  }

  // =====================================================
  // PRODUCT IMPORT
  // =====================================================

  // Step 1 — Validate file
  // POST api/products/import/  (multipart/form-data)
  // Returns: { valid_count, invalid_count, skipped_count, invalid_rows, message, valid_rows }
  async importValidate(file) {
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await ApiClient.post("masters/products/import/", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.status === 200 || res.status === 201) return res.data;
      toast.error("Validation failed. Please try again.");
      return null;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Validation failed. Please try again.");
      return null;
    }
  }

  // Step 2 — Confirm import
  // If backend returned valid_rows → POST JSON { valid_rows }
  // If not (backend skips valid_rows) → re-send file as multipart so backend re-validates & saves
  async importConfirm(validRowsOrFile) {
    try {
      let res;
      if (validRowsOrFile instanceof File) {
        const fd = new FormData();
        fd.append("file", validRowsOrFile);
        res = await ApiClient.post("masters/products/import/confirm/", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        res = await ApiClient.post(
          "masters/products/import/confirm/",
          { valid_rows: validRowsOrFile },
          { headers: { "Content-Type": "application/json" } }
        );
      }
      if (res.status === 200 || res.status === 201) {
        toast.success(res.data?.message || `${res.data?.created_count} product(s) imported successfully.`);
        return res.data;
      }
      toast.error("Import failed. Please try again.");
      return null;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Import failed. Please try again.");
      return null;
    }
  }

  // =====================================================
  // CATEGORIES
  // =====================================================

  async fetchCategories() {
    try {
      const res = await ApiClient.get("masters/categories/");
      if (res.status === 200) return this._extractList(res.data);
      toast.error("Failed to load categories");
      return [];
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error loading categories");
      return [];
    }
  }

  async createCategory(name, parent = null) {
    try {
      const res = await ApiClient.post("masters/categories/", { name, parent });
      if (res.status === 200 || res.status === 201) {
        toast.success("Category created successfully");
        return res.data;
      }
      toast.error("Failed to create category");
      return null;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error creating category");
      return null;
    }
  }

  async updateCategory(categoryId, name) {
    try {
      const res = await ApiClient.put(`masters/categories/${categoryId}/`, { name });
      if (res.status === 200) {
        toast.success("Category updated successfully");
        return res.data;
      }
      toast.error("Failed to update category");
      return null;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error updating category");
      return null;
    }
  }

  async deleteCategory(categoryId) {
    try {
      const res = await ApiClient.delete(`masters/categories/${categoryId}/`);
      if (res.status === 204 || res.status === 200) {
        toast.success("Category deleted successfully");
        return true;
      }
      toast.error("Failed to delete category");
      return false;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error deleting category");
      return false;
    }
  }

  // =====================================================
  // TAX CODES
  // =====================================================

  async fetchTaxCodes() {
    try {
      const res = await ApiClient.get("masters/taxcodes/");
      if (res.status === 200) return this._extractList(res.data);
      toast.error("Failed to load tax codes");
      return [];
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error loading tax codes");
      return [];
    }
  }

  async createTaxCode(data) {
    try {
      const res = await ApiClient.post("masters/taxcodes/", data);
      if (res.status === 200 || res.status === 201) {
        toast.success("Tax code created successfully");
        return res.data;
      }
      toast.error("Failed to create tax code");
      return null;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error creating tax code");
      return null;
    }
  }

  async updateTaxCode(taxCodeId, data) {
    try {
      const res = await ApiClient.put(`masters/taxcodes/${taxCodeId}/`, data);
      if (res.status === 200) {
        toast.success("Tax code updated successfully");
        return res.data;
      }
      toast.error("Failed to update tax code");
      return null;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error updating tax code");
      return null;
    }
  }

  async deleteTaxCode(taxCodeId) {
    try {
      const res = await ApiClient.delete(`masters/taxcodes/${taxCodeId}/`);
      if (res.status === 204 || res.status === 200) {
        toast.success("Tax code deleted successfully");
        return true;
      }
      toast.error("Failed to delete tax code");
      return false;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error deleting tax code");
      return false;
    }
  }

  // =====================================================
  // UOM
  // =====================================================

  async fetchUOMs() {
    try {
      const res = await ApiClient.get("masters/uoms/");
      if (res.status === 200) return this._extractList(res.data);
      toast.error("Failed to load UOMs");
      return [];
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error loading UOMs");
      return [];
    }
  }

  async createUOM(data) {
    try {
      const res = await ApiClient.post("masters/uoms/", data);
      if (res.status === 200 || res.status === 201) {
        toast.success("UOM created successfully");
        return res.data;
      }
      toast.error("Failed to create UOM");
      return null;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error creating UOM");
      return null;
    }
  }

  async updateUOM(uomId, data) {
    try {
      const res = await ApiClient.put(`masters/uoms/${uomId}/`, data);
      if (res.status === 200) {
        toast.success("UOM updated successfully");
        return res.data;
      }
      toast.error("Failed to update UOM");
      return null;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error updating UOM");
      return null;
    }
  }

  async deleteUOM(uomId) {
    try {
      const res = await ApiClient.delete(`masters/uoms/${uomId}/`);
      if (res.status === 204 || res.status === 200) {
        toast.success("UOM deleted successfully");
        return true;
      }
      toast.error("Failed to delete UOM");
      return false;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error deleting UOM");
      return false;
    }
  }

  // =====================================================
  // WAREHOUSE
  // =====================================================

  async fetchWarehouses() {
    try {
      const res = await ApiClient.get("masters/warehouses/");
      if (res.status === 200) return this._extractList(res.data);
      toast.error("Failed to load warehouses");
      return [];
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error loading warehouses");
      return [];
    }
  }

  async createWarehouse(data) {
    try {
      const res = await ApiClient.post("masters/warehouses/", data);
      if (res.status === 200 || res.status === 201) {
        toast.success("Warehouse created successfully");
        return res.data;
      }
      toast.error("Failed to create warehouse");
      return null;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error creating warehouse");
      return null;
    }
  }

  async updateWarehouse(warehouseId, data) {
    try {
      const res = await ApiClient.put(`masters/warehouses/${warehouseId}/`, data);
      if (res.status === 200) {
        toast.success("Warehouse updated successfully");
        return res.data;
      }
      toast.error("Failed to update warehouse");
      return null;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error updating warehouse");
      return null;
    }
  }

  async deleteWarehouse(warehouseId) {
    try {
      const res = await ApiClient.delete(`masters/warehouses/${warehouseId}/`);
      if (res.status === 204 || res.status === 200) {
        toast.success("Warehouse deleted successfully");
        return true;
      }
      toast.error("Failed to delete warehouse");
      return false;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error deleting warehouse");
      return false;
    }
  }

  // =====================================================
  // SIZE
  // =====================================================

  async fetchSizes() {
    try {
      const res = await ApiClient.get("masters/sizes/");
      if (res.status === 200) return this._extractList(res.data);
      toast.error("Failed to load sizes");
      return [];
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error loading sizes");
      return [];
    }
  }

  async createSize(name) {
    try {
      const res = await ApiClient.post("masters/sizes/", { name });
      if (res.status === 200 || res.status === 201) {
        toast.success("Size created successfully");
        return res.data;
      }
      toast.error("Failed to create size");
      return null;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error creating size");
      return null;
    }
  }

  async updateSize(sizeId, name) {
    try {
      const res = await ApiClient.put(`masters/sizes/${sizeId}/`, { name });
      if (res.status === 200) {
        toast.success("Size updated successfully");
        return res.data;
      }
      toast.error("Failed to update size");
      return null;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error updating size");
      return null;
    }
  }

  async deleteSize(sizeId) {
    try {
      const res = await ApiClient.delete(`masters/sizes/${sizeId}/`);
      if (res.status === 204 || res.status === 200) {
        toast.success("Size deleted successfully");
        return true;
      }
      toast.error("Failed to delete size");
      return false;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error deleting size");
      return false;
    }
  }

  // =====================================================
  // COLOR
  // =====================================================

  async fetchColors() {
    try {
      const res = await ApiClient.get("masters/colors/");
      if (res.status === 200) return this._extractList(res.data);
      toast.error("Failed to load colors");
      return [];
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error loading colors");
      return [];
    }
  }

  async createColor(name) {
    try {
      const res = await ApiClient.post("masters/colors/", { name });
      if (res.status === 200 || res.status === 201) {
        toast.success("Color created successfully");
        return res.data;
      }
      toast.error("Failed to create color");
      return null;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error creating color");
      return null;
    }
  }

  async updateColor(colorId, name) {
    try {
      const res = await ApiClient.put(`masters/colors/${colorId}/`, { name });
      if (res.status === 200) {
        toast.success("Color updated successfully");
        return res.data;
      }
      toast.error("Failed to update color");
      return null;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error updating color");
      return null;
    }
  }

  async deleteColor(colorId) {
    try {
      const res = await ApiClient.delete(`masters/colors/${colorId}/`);
      if (res.status === 204 || res.status === 200) {
        toast.success("Color deleted successfully");
        return true;
      }
      toast.error("Failed to delete color");
      return false;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error deleting color");
      return false;
    }
  }

  // =====================================================
  // SUPPLIERS / BRANDS
  // =====================================================

  async fetchBrands() {
    try {
      const res = await ApiClient.get("masters/product-suppliers/");
      if (res.status === 200) return this._extractList(res.data);
      toast.error("Failed to load suppliers");
      return [];
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error loading suppliers");
      return [];
    }
  }

  async createSupplier(data) {
    try {
      const res = await ApiClient.post("masters/product-suppliers/", data);
      if (res.status === 200 || res.status === 201) {
        toast.success("Supplier created successfully");
        return res.data;
      }
      toast.error("Failed to create supplier");
      return null;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error creating supplier");
      return null;
    }
  }

  async updateSupplier(supplierId, data) {
    try {
      const res = await ApiClient.put(`masters/product-suppliers/${supplierId}/`, data);
      if (res.status === 200) {
        toast.success("Supplier updated successfully");
        return res.data;
      }
      toast.error("Failed to update supplier");
      return null;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error updating supplier");
      return null;
    }
  }

  async deleteSupplier(supplierId) {
    try {
      const res = await ApiClient.delete(`masters/product-suppliers/${supplierId}/`);
      if (res.status === 204 || res.status === 200) {
        toast.success("Supplier deleted successfully");
        return true;
      }
      toast.error("Failed to delete supplier");
      return false;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error deleting supplier");
      return false;
    }
  }
}

const productApiProvider = new ProductApiProvider();
export default productApiProvider;