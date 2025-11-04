// src/pages/orders/MyOrders.jsx
import { useEffect } from "react";
import { useOrderStore } from "@/store/useOrderStore";
import OrderStatusBadge from "@/components/orders/OrderStatusBadge";

export default function MyOrders() {
  const { orders, fetchMyOrders, isLoading, error, page, size, totalPages } = useOrderStore();

  useEffect(() => {
    fetchMyOrders({ page: 0, size: 10 });
  }, [fetchMyOrders]);

  return (
    <div className="mx-auto max-w-3xl p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-color-text font-title text-2xl font-bold">Mis pedidos</h1>
        <a
          href="/orders/new"
          className="bg-color-primary-500 hover:bg-color-primary-600 rounded-lg px-4 py-2 font-semibold text-white"
        >
          Nuevo pedido
        </a>
      </div>

      {isLoading && <p className="text-sm text-gray-500">Cargando…</p>}
      {error && <p className="text-sm text-red-600">{error.message}</p>}

      <ul className="space-y-3">
        {orders.map((o) => (
          <li key={o.id} className="rounded-xl border bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm text-gray-500">Pedido #{o.id}</p>
                <p className="text-color-text font-semibold">
                  Total: {Number(o.totalAmount).toFixed(2)} {o.currency || "UYU"}
                </p>
              </div>
              <OrderStatusBadge status={o.status} />
            </div>

            {/* Snapshot de envío si corresponde */}
            {o.fulfillment === "DELIVERY" && (
              <div className="mt-3 rounded-lg bg-gray-50 p-3 text-sm text-gray-700">
                <p className="font-semibold">Envío</p>
                <p>
                  {o.shipName} · {o.shipPhone}
                </p>
                <p>
                  {o.shipLine1}
                  {o.shipLine2 ? `, ${o.shipLine2}` : ""}
                </p>
                <p>
                  {o.shipCity}
                  {o.shipRegion ? `, ${o.shipRegion}` : ""}
                  {o.shipPostalCode ? ` · ${o.shipPostalCode}` : ""}
                </p>
                {o.shipReference && <p>Ref.: {o.shipReference}</p>}
              </div>
            )}

            {/* Items */}
            <div className="mt-3">
              <p className="text-color-text text-sm font-semibold">Ítems</p>
              <ul className="mt-1 space-y-1 text-sm text-gray-700">
                {o.items?.map((it) => (
                  <li key={it.id || `${it.productId}-${it.productVariantId}`}>
                    {it.productName} — {it.variantName} × {it.quantity}
                    <span className="text-gray-500">
                      {" "}
                      · {Number(it.lineTotal).toFixed(2)} {o.currency || "UYU"}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-3 text-xs text-gray-500">
              <span>Creado: {o.createdAt && new Date(o.createdAt).toLocaleString()}</span>
            </div>
          </li>
        ))}

        {!isLoading && orders.length === 0 && (
          <li className="rounded-xl border bg-white p-6 text-center text-sm text-gray-600">
            Aún no tenés pedidos.{" "}
            <a href="/orders/new" className="text-primary-700 underline">
              Creá tu primer pedido
            </a>
            .
          </li>
        )}
      </ul>

      {/* Paginación simple */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          <button
            onClick={() => fetchMyOrders({ page: Math.max(0, page - 1), size })}
            disabled={page === 0}
            className="rounded-lg border border-gray-300 px-3 py-1 text-sm disabled:opacity-50"
          >
            Anterior
          </button>
          <span className="text-sm text-gray-600">
            Página {page + 1} de {totalPages}
          </span>
          <button
            onClick={() => fetchMyOrders({ page: Math.min(totalPages - 1, page + 1), size })}
            disabled={page >= totalPages - 1}
            className="rounded-lg border border-gray-300 px-3 py-1 text-sm disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}
