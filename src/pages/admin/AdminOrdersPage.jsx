// src/pages/admin/AdminOrdersPage.jsx
import OrderStatusBadge from "@/components/orders/OrderStatusBadge";
import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAdminOrdersStore } from "@/store/useAdminOrdersStore";
import { orderService } from "@/services/orderService"; // para updateStatus

const ORDER_STATUSES = [
  "CREATED",
  "CONFIRMED",
  "PREPARING",
  "READY",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELED",
];

const NEXT_STATUS = {
  CREATED: ["PREPARING", "CANCELED"],
  CONFIRMED: ["PREPARING", "CANCELED"],
  PREPARING: ["READY", "CANCELED"],
  READY: ["DELIVERED"],
  OUT_FOR_DELIVERY: ["DELIVERED"],
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
  const options = useMemo(() => (order ? (NEXT_STATUS[order.status] ?? []) : []), [order]);
  const [value, setValue] = useState(options[0] || "");
  const [note, setNote] = useState("");

  useEffect(() => {
    setValue(options[0] || "");
    setNote("");
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
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-lg border px-3 py-1.5 text-sm">
            Cancelar
          </button>
          <button
            onClick={() => onConfirm({ next: value, note })}
            className="bg-color-primary-500 hover:bg-color-primary-600 rounded-lg px-3 py-1.5 text-sm font-semibold text-white"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}

function useOrdersQuerySync() {
  const [searchParams, setSearchParams] = useSearchParams();

  const read = () => {
    const statusCsv = searchParams.get("status") || "";
    const status = statusCsv
      ? statusCsv
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];
    const from = searchParams.get("from") || "";
    const to = searchParams.get("to") || "";
    const page = Number(searchParams.get("page") || 0);
    const size = Number(searchParams.get("size") || 20);
    return { status, from, to, page, size };
  };

  const write = (state) => {
    const sp = new URLSearchParams();
    if (state.status?.length) sp.set("status", state.status.join(","));
    if (state.from) sp.set("from", state.from);
    if (state.to) sp.set("to", state.to);
    sp.set("page", String(state.page ?? 0));
    sp.set("size", String(state.size ?? 20));
    setSearchParams(sp, { replace: true });
  };

  return { read, write };
}

export default function AdminOrdersPage() {
  const {
    orders,
    filters,
    pagination,
    isLoading,
    error,
    setFilters,
    setPage,
    loadOrders,
    clearError,
  } = useAdminOrdersStore();

  const { read, write } = useOrdersQuerySync();
  const [toast, setToast] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  // 1) Cargar desde URL al entrar
  useEffect(() => {
    const q = read();
    setFilters({ status: q.status, from: q.from, to: q.to });
    setPage(q.page);
    loadOrders(q).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2) Escribir a URL cuando cambien filtros/paginación
  useEffect(() => {
    write({
      status: filters.status,
      from: filters.from,
      to: filters.to,
      page: pagination.page,
      size: pagination.size,
    });
  }, [filters, pagination.page, pagination.size]); // eslint-disable-line

  useEffect(() => {
    if (error?.message) setToast(error.message);
  }, [error]);

  const onChangeStatus = (e) => {
    const values = Array.from(e.target.selectedOptions).map((opt) => opt.value);
    setFilters({ status: values });
    setPage(0);
  };

  const onChangeFrom = (e) => {
    setFilters({ from: e.target.value });
    setPage(0);
  };
  const onChangeTo = (e) => {
    setFilters({ to: e.target.value });
    setPage(0);
  };

  const onApplyFilters = () => {
    loadOrders({ page: 0 }).catch(() => {});
  };

  const goFirst = () => {
    if (pagination.page > 0) loadOrders({ page: 0 }).catch(() => {});
  };
  const goPrev = () => {
    if (pagination.page > 0) loadOrders({ page: pagination.page - 1 }).catch(() => {});
  };
  const goNext = () => {
    if (pagination.page + 1 < pagination.totalPages)
      loadOrders({ page: pagination.page + 1 }).catch(() => {});
  };
  const goLast = () => {
    if (pagination.totalPages > 0) loadOrders({ page: pagination.totalPages - 1 }).catch(() => {});
  };

  const openModal = (order) => {
    setSelected(order);
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
    setSelected(null);
  };

  const handleConfirm = async ({ next, note }) => {
    if (!selected) return;
    try {
      await orderService.updateStatus(selected.id, { status: next, note: note || "Cambio manual" });
      setToast(`Pedido #${selected.id} → ${next}`);
      closeModal();
      // refrescar la página actual con filtros vigentes
      await loadOrders({ page: pagination.page });
    } catch {
      // el store ya setea error; mostramos toast de error si hace falta
    }
  };

  const pageLabel = useMemo(() => {
    const cur = (pagination.page ?? 0) + 1;
    const total = pagination.totalPages ?? 0;
    return `${cur} / ${total || 1}`;
  }, [pagination.page, pagination.totalPages]);

  const totalLabel = useMemo(() => {
    return `${pagination.totalElements} resultado${(pagination.totalElements || 0) === 1 ? "" : "s"}`;
  }, [pagination.totalElements]);

  return (
    <div className="space-y-4">
      <header className="mb-2">
        <h1 className="text-color-text font-title text-xl font-bold">Pedidos</h1>
        <p className="text-sm text-gray-600">Filtrá por estado y fecha. Resultados paginados.</p>
      </header>

      {/* Filtros */}
      <section className="rounded-xl border bg-white p-3 shadow-sm">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {/* Estado (multi) */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Estado (múltiple)
            </label>
            <select
              multiple
              value={filters.status}
              onChange={onChangeStatus}
              className="h-[120px] w-full rounded-lg border px-3 py-2 text-sm"
            >
              {ORDER_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* From */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Desde</label>
            <input
              type="date"
              value={filters.from}
              onChange={onChangeFrom}
              className="w-full rounded-lg border px-3 py-2 text-sm"
            />
          </div>

          {/* To */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Hasta</label>
            <input
              type="date"
              value={filters.to}
              onChange={onChangeTo}
              className="w-full rounded-lg border px-3 py-2 text-sm"
            />
          </div>

          {/* Botones */}
          <div className="flex items-end gap-2">
            <button
              onClick={onApplyFilters}
              className="bg-color-primary-500 hover:bg-color-primary-600 rounded-lg px-4 py-2 text-sm font-semibold text-white"
            >
              Aplicar filtros
            </button>
            <button
              onClick={() => {
                setFilters({ status: [], from: "", to: "" });
                setPage(0);
                loadOrders({ status: [], from: "", to: "", page: 0 }).catch(() => {});
              }}
              className="rounded-lg border px-4 py-2 text-sm"
            >
              Limpiar
            </button>
          </div>
        </div>
      </section>

      {/* Tabla */}
      <section className="rounded-xl border bg-white p-0 shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs text-gray-600 uppercase">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Cliente</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Fecha</th>
                <th className="px-4 py-3">Envío</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-t">
                  <td className="px-4 py-3 font-medium text-gray-800">#{o.id}</td>
                  <td className="px-4 py-3">
                    {o.shipName || "-"} {o.shipPhone ? `· ${o.shipPhone}` : ""}
                  </td>
                  <td className="px-4 py-3">
                    <OrderStatusBadge status={o.status} />
                  </td>
                  <td className="px-4 py-3">
                    {Number(o.totalAmount ?? 0).toFixed(2)} {o.currency || "UYU"}
                  </td>
                  <td className="px-4 py-3">
                    {o.createdAt ? new Date(o.createdAt).toLocaleString() : "-"}
                  </td>
                  <td className="px-4 py-3">
                    {o.fulfillment === "DELIVERY"
                      ? `${o.shipLine1 || ""}${o.shipLine2 ? `, ${o.shipLine2}` : ""} — ${o.shipCity || ""}`
                      : "RETIRA"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {(NEXT_STATUS[o.status] ?? []).length > 0 && (
                      <button
                        onClick={() => openModal(o)}
                        className="rounded-lg border px-3 py-1.5 text-xs"
                      >
                        Cambiar estado
                      </button>
                    )}
                  </td>
                </tr>
              ))}

              {!isLoading && orders.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    No hay pedidos para mostrar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {isLoading && <div className="px-4 py-3 text-sm text-gray-500">Cargando…</div>}

        {error && (
          <div className="border-t border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error.message}
          </div>
        )}
      </section>

      {/* Paginación + indicador total */}
      <section className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-gray-600">
          Página {pageLabel} — {totalLabel}
        </div>
        <div className="flex gap-2">
          <button
            onClick={goFirst}
            disabled={pagination.page <= 0 || isLoading}
            className="rounded-lg border px-3 py-1.5 text-sm disabled:opacity-50"
          >
            « Primero
          </button>
          <button
            onClick={goPrev}
            disabled={pagination.page <= 0 || isLoading}
            className="rounded-lg border px-3 py-1.5 text-sm disabled:opacity-50"
          >
            ‹ Anterior
          </button>
          <button
            onClick={goNext}
            disabled={pagination.page + 1 >= pagination.totalPages || isLoading}
            className="rounded-lg border px-3 py-1.5 text-sm disabled:opacity-50"
          >
            Siguiente ›
          </button>
          <button
            onClick={goLast}
            disabled={pagination.page + 1 >= pagination.totalPages || isLoading}
            className="rounded-lg border px-3 py-1.5 text-sm disabled:opacity-50"
          >
            Última »
          </button>
        </div>
      </section>

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
