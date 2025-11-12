// src/services/orderService.js
import apiClient from "@/services/apiClient";

/**
 * Crea un pedido autenticado.
 * @param {Object} payload CreateOrderRequest
 * @returns {Promise<Object>} OrderResponse
 */
async function createOrder(payload) {
  // Backend: POST /api/orders
  const { data } = await apiClient.post("/api/orders", payload);
  return data;
}

/**
 * Devuelve los pedidos del usuario autenticado (paginado).
 * @param {Object} params { page, size, sort }  // sort ej: 'createdAt,desc'
 * @returns {Promise<{content: Object[], totalPages:number, totalElements:number, number:number, size:number}>}
 */
async function getMyOrders(params = {}) {
  const {
    page = 0,
    size = 10,
    sort = "createdAt,desc", // coincide con PageableDefault del backend
  } = params;

  // Backend: GET /api/orders/mine?page=&size=&sort=
  const { data } = await apiClient.get("/api/orders/mine", {
    params: { page, size, sort },
  });
  return data;
}

/**
 * Obtiene un pedido propio por id (protege contra acceso cruzado en backend).
 * @param {number} orderId
 * @returns {Promise<Object>} OrderResponse
 */
async function getOrderById(orderId) {
  const { data } = await apiClient.get(`/api/orders/${orderId}`);
  return data;
}

/**
 * Cambia el estado de un pedido (ADMIN o CHEF)
 * @param {number} orderId
 * @param {{ status: string, note?: string }} body
 * @returns {Promise<Object>} OrderResponse
 */
async function updateStatus(orderId, { status, note }) {
  // Backend: PATCH /api/orders/{id}/status
  const { data } = await apiClient.patch(`/api/orders/${orderId}/status`, { status, note });
  return data;
}

export const orderService = {
  createOrder,
  getMyOrders,
  getOrderById, // opcional pero útil para detalle
  updateStatus,
};
