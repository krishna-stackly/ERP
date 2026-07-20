import { create } from "zustand";
import salesOrderApiProvider from "../../../network/salesOrder-api-provider";

const useSalesOrderStore = create((set, get) => ({
  salesOrders: [],
  loading: false,
  currentPage: 1,
  totalPages: 1,
  search: "",

  setSearch: (value) => set({ search: value }),

  // =====================================================
  // FETCH SALES ORDERS
  // =====================================================
  fetchSalesOrders: async (page = 1, search = null) => {
  const currentSearch = search !== null ? search : get().search;
  set({ loading: true });

  try {
    const result = await salesOrderApiProvider.fetchSalesOrders(page, currentSearch);

    if (!result) {
      set({ salesOrders: [], currentPage: 1, totalPages: 1 });
      return;
    }

    // Map API response to flat structure the component expects
    const rawData = Array.isArray(result?.data?.data) ? result.data.data : [];
    const mappedOrders = rawData.map((order) => ({
      sales_order_id: order.sales_order_id,
      order_type: order.order_type,
      customer_name:
        `${order.customer?.first_name || ""} ${order.customer?.last_name || ""}`.trim(),
      sales_rep: order.sales_rep || "",
      order_date: order.order_date,
      status: order.status,
      grand_total: order.grand_total,
      purchase_order: order.purchase_order || null,   // not in API yet, default null
      stock_status: order.stock_status || null,       // not in API yet, default null
      // keep id for delete
      id: order.id,
    }));

    set({
      salesOrders: mappedOrders,
      currentPage: result?.data?.from || page,
      totalPages: result?.data?.totalPages || 1,
      search: currentSearch,
    });
  } finally {
    set({ loading: false });
  }
},

// Fix delete filter — use sales_order_id not order_id
deleteSalesOrder: async (orderId) => {
  const success = await salesOrderApiProvider.deleteSalesOrder(orderId);
  if (success) {
    set((state) => ({
      salesOrders: state.salesOrders.filter(
        (order) => order.sales_order_id !== orderId
      ),
    }));
  }
  return success;
},

  // =====================================================
  // DELETE SALES ORDER
  // =====================================================
  deleteSalesOrder: async (orderId) => {
    const success = await salesOrderApiProvider.deleteSalesOrder(orderId);

    if (success) {
      set((state) => ({
        salesOrders: state.salesOrders.filter(
          (order) => order.order_id !== orderId
        ),
      }));
    }

    return success;
  },
}));

export default useSalesOrderStore;