// src/services/adminOrderService.js
import apiClient from "@/services/apiClient";

/**
 * Mapea OrderResponse (backend) a un modelo plano para la tabla.
 * @param {import("@/types").OrderResponse} o
 */
function mapOrder(o) {
  return {
    id: o.id,
    status: o.status,
    fulfillment: o.fulfillment,
    currency: o.currency || "UYU",
    subtotalAmount: o.subtotalAmount,
    taxAmount: o.taxAmount,
    discountAmount: o.discountAmount,
    totalAmount: o.totalAmount,
    createdAt: o.createdAt,
    shipName: o.shipName,
    shipPhone: o.shipPhone,
    shipLine1: o.shipLine1,
    shipLine2: o.shipLine2,
    shipCity: o.shipCity,
    shipRegion: o.shipRegion,
    shipPostalCode: o.shipPostalCode,
    shipReference: o.shipReference,
    notes: o.notes,
  };
}

/**
 * Convierte array de estados a CSV (BACKEND espera CSV).
 * @param {string[]|undefined} arr
 */
function toCsv(arr) {
  if (!arr || arr.length === 0) return undefined;
  return arr.filter(Boolean).join(",");
}

/**
 * GET /api/orders/ops (ADMIN/CHEF)
 * @param {{status?: string[], from?: string, to?: string, page?: number, size?: number}} params
 * @returns {Promise<{ data: any[], pagination: { page:number, size:number, totalElements:number, totalPages:number } }>}
 */
export async function fetchOrders(params = {}) {
  const { status = [], from, to, page = 0, size = 20 } = params;

  const { data } = await apiClient.get("/orders/ops", {
    params: {
      status: toCsv(status),
      from: from || undefined,
      to: to || undefined,
      page,
      size,
      sort: "createdAt,desc",
    },
  });

  // data = OrderPageResponse<OrderResponse>
  return {
    data: (data?.content || []).map(mapOrder),
    pagination: {
      page: data?.page ?? page,
      size: data?.size ?? size,
      totalElements: data?.totalElements ?? 0,
      totalPages: data?.totalPages ?? 0,
    },
  };
}

export const adminOrderService = { fetchOrders };
