// src/services/orderService.js
import apiClient from "@/services/apiClient";

/**
 * Crea un pedido autenticado.
 * @param {Object} payload CreateOrderRequest
 * @returns {Promise<Object>} OrderResponse
 */
async function createOrder(payload) {
  const { data } = await apiClient.post("/orders", payload);
  return data;
}

/**
 * Devuelve los pedidos del usuario autenticado (paginado).
 * @param {Object} params { page, size, sort }  // sort ej: 'createdAt,desc'
 * @returns {Promise<{content: Object[], totalPages:number, totalElements:number, number:number, size:number}>}
 */
async function getMyOrders(params = {}) {
  const { page = 0, size = 10, sort = "createdAt,desc" } = params;
  const { data } = await apiClient.get("/orders/mine", {
    params: { page, size, sort },
  });
  return data;
}

// NUEVO: listado global para admin/chef
async function getAll(params = {}) {
  const { page = 0, size = 20, sort = "createdAt,desc" } = params;
  const { data } = await apiClient.get("/orders", { params: { page, size, sort } });
  return data; // Page<OrderResponse>
}

async function updateStatus(orderId, { status, note }) {
  const { data } = await apiClient.patch(`/orders/${orderId}/status`, { status, note });
  return data; // OrderResponse
}

export const orderService = { createOrder, getMyOrders, getAll, updateStatus };
