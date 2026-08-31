// // import { create } from "zustand";
// // import productApiProvider from "../../../network/product-api-provider";

// // const useProductStore = create((set, get) => ({
// //   products: [],
// //   loading: false,

// //   // ============================
// //   // FETCH PRODUCTS
// //   // ============================
// //  fetchProducts: async () => {
// //   set({ loading: true });
// //   try {
// //     const data = await productApiProvider.fetchProducts();

// //      console.log("RAW API RESPONSE:", data);           // 👈 add this
// //     console.log("typeof data:", typeof data);          // 👈 and this
// //     console.log("data?.data:", data?.data);            // 👈 and this
// //     console.log("data?.data?.data:", data?.data?.data); // 👈 and this

// //     // API returns: { data: { data: [...], totalCount, totalPages, ... } }
// //     // So the actual array is at data?.data?.data
// //     const productArray = data?.data?.data ?? data?.data ?? data ?? [];

// //     set({ products: Array.isArray(productArray) ? productArray : [] });
// //   } finally {
// //     set({ loading: false });
// //   }
// // },

// //   // ============================
// //   // DELETE PRODUCT
// //   // ============================
// //   deleteProduct: async (id) => {
// //     const success = await productApiProvider.deleteProduct(id);
// //     if (success) {
// //       set({
// //         products: get().products.filter((item) => item.id !== id),
// //       });
// //     }
// //   },
// // }));

// // export default useProductStore;
// import { create } from "zustand";
// import productApiProvider from "../../../network/product-api-provider";

// const useProductStore = create((set, get) => ({
//   products: [],
//   loading: false,

//   fetchProducts: async () => {
//     set({ loading: true });
//     try {
//       const data = await productApiProvider.fetchProducts();
//       // fetchProducts returns res.data = { products: [...], total_pages, current_page }
//       const productArray = data?.products ?? [];
//       set({ products: Array.isArray(productArray) ? productArray : [] });
//     } finally {
//       set({ loading: false });
//     }
//   },

//   deleteProduct: async (id) => {
//     const success = await productApiProvider.deleteProduct(id);
//     if (success) {
//       set({
//         products: get().products.filter((item) => item.id !== id),
//       });
//     }
//   },
// }));

// export default useProductStore;
import { create } from "zustand";
import productApiProvider from "../../../network/product-api-provider";

const useProductStore = create((set, get) => ({
  products: [],
  loading: false,
  currentPage: 1,
  totalPages: 1,
  totalCount: 0,

  fetchProducts: async (page = 1, search = "") => {
    set({ loading: true });
    try {
      const res = await productApiProvider.fetchProducts(page, search);
      // Response: { message, data: { from, to, totalCount, totalPages, data: [...] } }
      const inner        = res?.data ?? {};
      const productArray = inner?.data ?? [];
      set({
        products:    Array.isArray(productArray) ? productArray : [],
        totalPages:  inner?.totalPages ?? 1,
        totalCount:  inner?.totalCount ?? 0,
        currentPage: page,
      });
    } finally {
      set({ loading: false });
    }
  },

  deleteProduct: async (id) => {
    const success = await productApiProvider.deleteProduct(id);
    if (success) {
      // Refresh current page after delete
      const { currentPage, fetchProducts } = get();
      await fetchProducts(currentPage, "");
    }
    return success;
  },
}));

export default useProductStore;