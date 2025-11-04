import { describe, it, expect, vi, beforeEach } from "vitest";
import { orderService } from "./orderService";
import { apiClient } from "./apiClient";

vi.mock("./apiClient", () => ({
  apiClient: {
    post: vi.fn(),
    get: vi.fn(),
  },
}));

beforeEach(() => {
  vi.resetAllMocks();
});

describe("orderService", () => {
  it("createOrder hace POST /api/orders", async () => {
    const mockResp = { id: 123, status: "CREATED" };
    apiClient.post.mockResolvedValueOnce({ data: mockResp });

    const payload = {
      fulfillment: "PICKUP",
      items: [{ productId: 1, productVariantId: 10, quantity: 1 }],
    };
    const res = await orderService.createOrder(payload);

    expect(apiClient.post).toHaveBeenCalledWith("/api/orders", payload);
    expect(res).toEqual(mockResp);
  });

  it("getMyOrders hace GET /api/orders/mine con params", async () => {
    const mockPage = { content: [], number: 0, size: 10, totalPages: 0, totalElements: 0 };
    apiClient.get.mockResolvedValueOnce({ data: mockPage });

    const res = await orderService.getMyOrders({ page: 0, size: 10, sort: "createdAt,desc" });

    expect(apiClient.get).toHaveBeenCalledWith("/api/orders/mine", {
      params: { page: 0, size: 10, sort: "createdAt,desc" },
    });
    expect(res).toEqual(mockPage);
  });
});
