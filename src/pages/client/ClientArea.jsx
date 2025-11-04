// src/pages/client/ClientArea.jsx
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useOrderStore } from "@/store/useOrderStore";
import OrderStatusBadge from "@/components/orders/OrderStatusBadge";

export default function ClientArea() {
  const { orders, fetchMyOrders, isLoading, error, totalPages } = useOrderStore();

  useEffect(() => {
    // Trae la primera página de pedidos del usuario (5 recientes)
    fetchMyOrders({ page: 0, size: 5, sort: "createdAt,desc" });
  }, [fetchMyOrders]);

  return (
    <div data-testid="client-area" className="mx-auto max-w-4xl p-4">
      <header className="mb-6">
        <h2 className="text-color-text font-title text-2xl font-bold">Área del Cliente</h2>
        <p className="mt-1 text-sm text-gray-600">
          Bienvenido. Desde aquí podés crear nuevos pedidos y revisar tu historial.
        </p>
      </header>

      {/* Acciones rápidas */}
      <section className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Link
          to="/orders/new"
          className="bg-color-primary-500 hover:bg-color-primary-600 block rounded-xl px-5 py-4 font-semibold text-white shadow-sm"
        >
          + Nuevo pedido
        </Link>
        <Link
          to="/orders/mine"
          className="text-color-text rounded-xl border border-gray-300 bg-white px-5 py-4 font-semibold hover:bg-gray-50"
        >
          Ver mis pedidos
        </Link>
      </section>

      {/* Pedidos recientes */}
      <section className="rounded-xl border bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-color-text font-title text-lg font-semibold">Pedidos recientes</h3>
          <Link
            to="/orders/mine"
            className="text-sm font-semibold text-primary-700 hover:text-primary-900"
          >
            Ver todos →
          </Link>
        </div>

        {isLoading && <p className="text-sm text-gray-500">Cargando…</p>}
        {error && <p className="text-sm text-red-600">{error.message}</p>}

        <ul className="space-y-3">
          {orders.map((o) => (
            <li key={o.id} className="rounded-lg border px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-gray-500">Pedido #{o.id}</p>
                  <p className="text-color-text font-semibold">
                    Total: {Number(o.totalAmount).toFixed(2)} {o.currency || "UYU"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {o.createdAt && new Date(o.createdAt).toLocaleString()}
                  </p>
                </div>
                <OrderStatusBadge status={o.status} />
              </div>

              {/* Envío (si corresponde) */}
              {o.fulfillment === "DELIVERY" && (
                <div className="mt-2 rounded-md bg-gray-50 p-2 text-xs text-gray-700">
                  <p className="font-semibold">Envío</p>
                  <p>
                    {o.shipName} · {o.shipPhone}
                  </p>
                  <p>
                    {o.shipLine1}
                    {o.shipLine2 ? `, ${o.shipLine2}` : ""}
                    {" — "}
                    {o.shipCity}
                    {o.shipRegion ? `, ${o.shipRegion}` : ""}
                  </p>
                </div>
              )}
            </li>
          ))}

          {!isLoading && orders.length === 0 && (
            <li className="rounded-lg border px-4 py-6 text-center text-sm text-gray-600">
              Aún no tenés pedidos.
              <Link to="/orders/new" className="ml-1 text-primary-700 underline">
                Crear mi primer pedido
              </Link>
            </li>
          )}
        </ul>

        {/* Atajo a paginación completa */}
        {totalPages > 1 && (
          <div className="mt-3 text-center">
            <Link
              to="/orders/mine"
              className="rounded-lg border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50"
            >
              Ver más
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
