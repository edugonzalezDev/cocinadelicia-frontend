// src/pages/admin/AdminOrdersPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useOrderStore } from "@/store/useOrderStore";
import OrderStatusBadge from "@/components/orders/OrderStatusBadge";

const NEXT_STATUS = {
  CREATED: ["PREPARING", "CANCELED"],
  PREPARING: ["READY", "CANCELED"],
  READY: ["DELIVERED"], // MVP
  DELIVERED: [],
  CANCELED: [],
};

function Toast({ open, message, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded bg-gray-900/90 px-3 py-2 text-sm text-white shadow">
      <span>{message}</span>
      <button className="ml-3 underline" onClick={onClose}>
        Cerrar
      </button>
    </div>
  );
}

function StatusModal({ open, onClose, order, onConfirm }) {
  const options = useMemo(() => NEXT_STATUS[order?.status] ?? [], [order]);
  const [value, setValue] = useState(options[0] || "");

  useEffect(() => {
    setValue(options[0] || "");
  }, [options, open]);

  if (!open || !order) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4">
      <div className="w-full max-w-sm rounded-xl border bg-white p-4 shadow-lg">
        <h3 className="text-color-text font-title text-lg font-semibold">
          Cambiar estado #{order.id}
        </h3>
        <p className="mt-1 text-sm text-gray-600">Estado actual: {order.status}</p>

        <div className="mt-4 space-y-2">
          <label className="text-sm font-medium text-gray-700">Nuevo estado</label>
          <select
            className="w-full rounded-lg border px-3 py-2 text-sm"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          >
            {options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>

          <label className="mt-2 text-sm font-medium text-gray-700">Nota (opcional)</label>
          <input
            type="text"
            className="w-full rounded-lg border px-3 py-2 text-sm"
            placeholder="Ej.: Prioridad por horario del cliente"
            onChange={() => {}}
          />
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-lg border px-3 py-1.5 text-sm">
            Cancelar
          </button>
          <button
            onClick={() => onConfirm(value)}
            className="bg-color-primary-500 hover:bg-color-primary-600 rounded-lg px-3 py-1.5 text-sm font-semibold text-white"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminOrdersPage() {
  const { orders, fetchAllOrders, updateOrderStatus, isLoading, error, clearError } =
    useOrderStore();
  const [toast, setToast] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetchAllOrders({ page: 0, size: 20, sort: "createdAt,desc" }).catch(() => {});
  }, [fetchAllOrders]);

  useEffect(() => {
    if (error?.message) setToast(error.message);
  }, [error]);

  const openModal = (order) => {
    setSelected(order);
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
    setSelected(null);
  };

  const handleConfirm = async (next) => {
    if (!selected) return;
    try {
      await updateOrderStatus(selected.id, next, "Cambio manual desde Admin");
      setToast(`Pedido #${selected.id} → ${next}`);
      closeModal();
    } catch {
      // El toast de error ya lo maneja el store → state.error
    }
  };

  return (
    <div>
      <header className="mb-4">
        <h1 className="text-color-text font-title text-xl font-bold">Pedidos</h1>
        <p className="text-sm text-gray-600">Cambiá el estado sin recargar la página.</p>
      </header>

      {isLoading && <p className="text-sm text-gray-500">Cargando…</p>}
      {error && (
        <p className="rounded-md border border-red-200 bg-red-50 p-2 text-sm text-red-700">
          {error.message}
        </p>
      )}

      <ul className="space-y-3">
        {orders.map((o) => (
          <li key={o.id} className="rounded-xl border bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm text-gray-500">Pedido #{o.id}</p>
                <p className="text-color-text font-semibold">
                  Total: {Number(o.totalAmount).toFixed(2)} {o.currency || "UYU"}
                </p>
                <p className="text-xs text-gray-500">
                  {o.createdAt && new Date(o.createdAt).toLocaleString()}
                </p>

                {o.fulfillment === "DELIVERY" && (
                  <div className="mt-2 rounded-md bg-gray-50 p-2 text-xs text-gray-700">
                    <p className="font-semibold">Envío</p>
                    <p>
                      {o.shipName} · {o.shipPhone}
                    </p>
                    <p>
                      {o.shipLine1}
                      {o.shipLine2 ? `, ${o.shipLine2}` : ""} — {o.shipCity}
                      {o.shipRegion ? `, ${o.shipRegion}` : ""}
                    </p>
                  </div>
                )}
              </div>

              <div className="text-right">
                <OrderStatusBadge status={o.status} />
                {(NEXT_STATUS[o.status] ?? []).length > 0 && (
                  <button
                    onClick={() => openModal(o)}
                    className="mt-2 rounded-lg border px-3 py-1.5 text-sm"
                  >
                    Cambiar estado
                  </button>
                )}
              </div>
            </div>
          </li>
        ))}

        {!isLoading && orders.length === 0 && (
          <li className="rounded-xl border bg-white p-6 text-center text-sm text-gray-600">
            No hay pedidos para mostrar.
          </li>
        )}
      </ul>

      <StatusModal
        open={modalOpen}
        onClose={closeModal}
        order={selected}
        onConfirm={handleConfirm}
      />
      <Toast
        open={!!toast}
        message={toast}
        onClose={() => {
          setToast("");
          clearError();
        }}
      />
    </div>
  );
}
