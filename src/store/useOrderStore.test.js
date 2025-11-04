import { describe, it, expect, vi, beforeEach } from "vitest";
import { act } from "@testing-library/react";
import { useOrderStore } from "./useOrderStore";
import { orderService } from "../services/orderService";

vi.mock("../services/orderService", () => ({
  orderService: {
    createOrder: vi.fn(),
    getMyOrders: vi.fn(),
  },
}));

beforeEach(() => {
  useOrderStore.getState().reset();
  vi.resetAllMocks();
});

describe("useOrderStore", () => {
  it("createOrder actualiza orders e isLoading", async () => {
    const order = { id: 1, status: "CREATED" };
    orderService.createOrder.mockResolvedValueOnce(order);

    await act(async () => {
      await useOrderStore.getState().createOrder({
        fulfillment: "PICKUP",
        items: [{ productId: 1, productVariantId: 10, quantity: 1 }],
      });
    });

    const state = useOrderStore.getState();
    expect(state.orders[0]).toEqual(order);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it("fetchMyOrders setea lista y paginación", async () => {
    const page = { content: [{ id: 2 }], number: 0, size: 10, totalPages: 1, totalElements: 1 };
    orderService.getMyOrders.mockResolvedValueOnce(page);

    await act(async () => {
      await useOrderStore.getState().fetchMyOrders({ page: 0, size: 10 });
    });

    const s = useOrderStore.getState();
    expect(s.orders).toEqual(page.content);
    expect(s.page).toBe(0);
    expect(s.size).toBe(10);
    expect(s.totalPages).toBe(1);
  });
});
