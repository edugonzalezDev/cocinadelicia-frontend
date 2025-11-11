// src/store/useAdminOrdersStore.js
import { create } from "zustand";
import { adminOrderService } from "@/services/adminOrderService";

/** Normaliza errores API (compat con tu GlobalExceptionHandler) */
function normalizeApiError(err) {
  const status = err?.response?.status;
  const data = err?.response?.data;
  if (data?.message) {
    return { message: data.message, fields: data.fields || null, status };
  }
  return { message: err?.message || "Error inesperado", status };
}

const initialFilters = {
  status: [], // múltiple
  from: "", // YYYY-MM-DD
  to: "", // YYYY-MM-DD
};

const initialPagination = {
  page: 0,
  size: 20,
  totalElements: 0,
  totalPages: 0,
};

export const useAdminOrdersStore = create((set, get) => ({
  orders: [],
  filters: { ...initialFilters },
  pagination: { ...initialPagination },
  isLoading: false,
  error: null,

  reset: () =>
    set({
      orders: [],
      filters: { ...initialFilters },
      pagination: { ...initialPagination },
      isLoading: false,
      error: null,
    }),

  clearError: () => set({ error: null }),

  /** Cambia filtros sin cargar */
  setFilters: (partial) =>
    set((state) => ({
      filters: { ...state.filters, ...partial },
    })),

  /** Cambia página (no carga) */
  setPage: (page) =>
    set((state) => ({
      pagination: { ...state.pagination, page },
    })),

  /** Carga desde backend con los filtros/paginación actuales (o overrides) */
  loadOrders: async (overrides = {}) => {
    const { filters, pagination } = get();
    const params = {
      status: overrides.status ?? filters.status,
      from: (overrides.from ?? filters.from) || undefined,
      to: (overrides.to ?? filters.to) || undefined,
      page: overrides.page ?? pagination.page,
      size: overrides.size ?? pagination.size,
    };

    set({ isLoading: true, error: null });
    try {
      const res = await adminOrderService.fetchOrders(params);
      set({
        orders: res.data ?? [],
        pagination: {
          page: res.pagination.page,
          size: res.pagination.size,
          totalElements: res.pagination.totalElements,
          totalPages: res.pagination.totalPages,
        },
        // Si caller cambió filtros, los persistimos también
        filters: {
          status: Array.isArray(params.status) ? params.status : [],
          from: params.from || "",
          to: params.to || "",
        },
        isLoading: false,
      });
      return res;
    } catch (err) {
      const normalized = normalizeApiError(err);
      set({ error: normalized, isLoading: false, orders: [] });
      throw normalized;
    }
  },
}));
