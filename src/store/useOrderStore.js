// src/store/useOrderStore.js
import { create } from "zustand";
import { orderService } from "../services/orderService";

const initialState = {
  orders: [],
  page: 0,
  size: 10,
  totalPages: 0,
  totalElements: 0,
  isLoading: false,
  error: null, // { message, fields?, status? }
};

/**
 * Normalizes API errors returned by the backend GlobalExceptionHandler.
 * @param {any} err AxiosError
 * @returns {{ message: string, fields?: object, status?: number }}
 */
function normalizeApiError(err) {
  const status = err?.response?.status;
  const data = err?.response?.data;
  if (data?.message) {
    return { message: data.message, fields: data.fields || null, status };
  }
  return { message: err?.message || "Unexpected error", status };
}

export const useOrderStore = create((set, get) => ({
  ...initialState,

  reset: () => set({ ...initialState }),

  clearError: () => set({ error: null }),

  /**
   * Creates a new order and prepends it to the local list.
   * Returns the created OrderResponse object.
   * @param {Object} payload CreateOrderRequest
   */
  createOrder: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const order = await orderService.createOrder(payload);
      set((state) => ({
        orders: [order, ...state.orders],
        isLoading: false,
      }));
      return order;
    } catch (err) {
      const normalized = normalizeApiError(err);
      set({ error: normalized, isLoading: false });
      throw normalized;
    }
  },

  /**
   * Fetches orders for the authenticated user (paginated).
   * @param {Object} [params]
   */
  fetchMyOrders: async (params = {}) => {
    const { page = get().page, size = get().size, sort = "createdAt,desc" } = params;
    set({ isLoading: true, error: null });

    try {
      const pageData = await orderService.getMyOrders({ page, size, sort });
      set({
        orders: pageData.content ?? [],
        page: pageData.number ?? page,
        size: pageData.size ?? size,
        totalPages: pageData.totalPages ?? 0,
        totalElements: pageData.totalElements ?? 0,
        isLoading: false,
      });
      return pageData;
    } catch (err) {
      const normalized = normalizeApiError(err);
      set({ error: normalized, isLoading: false });
      throw normalized;
    }
  },
  fetchAllOrders: async (params = {}) => {
    const { page = get().page, size = get().size, sort = "createdAt,desc" } = params;
    set({ isLoading: true, error: null });
    try {
      const pageData = await orderService.getAll({ page, size, sort });
      set({
        orders: pageData.content ?? [],
        page: pageData.number ?? page,
        size: pageData.size ?? size,
        totalPages: pageData.totalPages ?? 0,
        totalElements: pageData.totalElements ?? 0,
        isLoading: false,
      });
      return pageData;
    } catch (err) {
      const normalized = normalizeApiError(err);
      set({ error: normalized, isLoading: false });
      throw normalized;
    }
  },
  updateOrderStatus: async (orderId, nextStatus, note) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await orderService.updateStatus(orderId, { status: nextStatus, note });

      // Actualizar en memoria sin recargar
      set((state) => ({
        orders: state.orders.map((o) => (o.id === updated.id ? updated : o)),
        isLoading: false,
      }));
      return updated;
    } catch (err) {
      const normalized = normalizeApiError(err);
      set({ error: normalized, isLoading: false });
      throw normalized;
    }
  },

  /**
   * Adds an order to the top of the list (used after creation).
   */
  addLocalOrder: (order) => set((state) => ({ orders: [order, ...state.orders] })),
}));
