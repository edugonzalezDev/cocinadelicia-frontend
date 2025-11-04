// src/pages/orders/NewOrder.jsx
import { useState } from "react";
import { useOrderStore } from "@/store/useOrderStore";
import Modal from "@/components/ui/Modal";

// === Helper: leer error de campo ===
function getFieldError(fields, key) {
  if (!fields) return null;
  return fields[key] || fields[`shipping.${key}`] || null;
}

const initial = {
  fulfillment: "PICKUP",
  notes: "",
  items: [{ productId: 1, productVariantId: 1, quantity: 1 }], // TODO: integrar carrito real
  shipping: {
    name: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    region: "",
    postalCode: "",
    reference: "",
  },
};

export default function NewOrder() {
  const [form, setForm] = useState(initial);
  const [successOpen, setSuccessOpen] = useState(false);
  const [created, setCreated] = useState(null);

  const createOrder = useOrderStore((s) => s.createOrder);
  const isLoading = useOrderStore((s) => s.isLoading);
  const error = useOrderStore((s) => s.error);
  const clearError = useOrderStore((s) => s.clearError);

  const onChange = (field, value) => setForm((f) => ({ ...f, [field]: value }));
  const onShipping = (field, value) =>
    setForm((f) => ({ ...f, shipping: { ...f.shipping, [field]: value } }));

  const validate = () => {
    if (!form.items || form.items.length === 0) return "Debe agregar al menos un ítem.";
    for (const it of form.items) {
      if (!it.productId || !it.productVariantId || !it.quantity || it.quantity < 1) {
        return "Ítems inválidos (productId, productVariantId y quantity >= 1).";
      }
    }
    if (form.fulfillment === "DELIVERY") {
      const s = form.shipping || {};
      if (!s.name || !s.phone || !s.line1 || !s.city) {
        return "Complete los datos de envío (nombre, teléfono, dirección y ciudad).";
      }
    }
    return null;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    clearError?.();
    const msg = validate();
    if (msg) return alert(msg);

    const payload =
      form.fulfillment === "DELIVERY"
        ? form
        : { fulfillment: form.fulfillment, notes: form.notes, items: form.items };

    try {
      const order = await createOrder(payload);
      setCreated(order);
      setSuccessOpen(true);
    } catch {
      /* el store ya setea error */
    }
  };

  return (
    <div className="mx-auto max-w-2xl p-4">
      <h1 className="text-color-text font-title text-2xl font-bold">Nuevo pedido</h1>
      <p className="mt-1 text-sm text-gray-600">Completá los datos y confirmá tu pedido.</p>

      {/* aria-busy para accesibilidad */}
      <form onSubmit={onSubmit} className="mt-6 space-y-4" aria-busy={isLoading}>
        {/* Fulfillment */}
        <div>
          <label className="text-color-text block text-sm font-semibold">Modalidad</label>
          <select
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-primary-300 focus:outline-none"
            value={form.fulfillment}
            onChange={(e) => onChange("fulfillment", e.target.value)}
            disabled={isLoading}
          >
            <option value="PICKUP">Retiro en local</option>
            <option value="DELIVERY">Delivery</option>
          </select>
        </div>

        {/* Shipping (solo si DELIVERY) */}
        {form.fulfillment === "DELIVERY" && (
          <div className="rounded-xl border bg-white p-4 shadow-sm">
            <h3 className="text-color-text font-title text-lg font-semibold">Datos de envío</h3>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {/* Nombre */}
              <div>
                <input
                  className="input"
                  placeholder="Nombre"
                  value={form.shipping.name}
                  onChange={(e) => onShipping("name", e.target.value)}
                  disabled={isLoading}
                />
                {error?.fields && (
                  <p className="mt-1 text-xs text-red-600" role="alert" aria-live="polite">
                    {getFieldError(error.fields, "name")}
                  </p>
                )}
              </div>

              {/* Teléfono */}
              <div>
                <input
                  className="input"
                  placeholder="Teléfono"
                  value={form.shipping.phone}
                  onChange={(e) => onShipping("phone", e.target.value)}
                  disabled={isLoading}
                />
                {error?.fields && (
                  <p className="mt-1 text-xs text-red-600" role="alert" aria-live="polite">
                    {getFieldError(error.fields, "phone")}
                  </p>
                )}
              </div>

              {/* Dirección 1 */}
              <div className="sm:col-span-2">
                <input
                  className="input"
                  placeholder="Dirección (línea 1)"
                  value={form.shipping.line1}
                  onChange={(e) => onShipping("line1", e.target.value)}
                  disabled={isLoading}
                />
                {error?.fields && (
                  <p className="mt-1 text-xs text-red-600" role="alert" aria-live="polite">
                    {getFieldError(error.fields, "line1")}
                  </p>
                )}
              </div>

              {/* Ciudad */}
              <div>
                <input
                  className="input"
                  placeholder="Ciudad"
                  value={form.shipping.city}
                  onChange={(e) => onShipping("city", e.target.value)}
                  disabled={isLoading}
                />
                {error?.fields && (
                  <p className="mt-1 text-xs text-red-600" role="alert" aria-live="polite">
                    {getFieldError(error.fields, "city")}
                  </p>
                )}
              </div>

              {/* Resto de campos (sin errores específicos todavía) */}
              <input
                className="input"
                placeholder="Departamento/Región"
                value={form.shipping.region}
                onChange={(e) => onShipping("region", e.target.value)}
                disabled={isLoading}
              />
              <input
                className="input"
                placeholder="Código Postal"
                value={form.shipping.postalCode}
                onChange={(e) => onShipping("postalCode", e.target.value)}
                disabled={isLoading}
              />
              <input
                className="input sm:col-span-2"
                placeholder="Referencia"
                value={form.shipping.reference}
                onChange={(e) => onShipping("reference", e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>
        )}

        {/* Notes */}
        <div>
          <label className="text-color-text block text-sm font-semibold">Notas</label>
          <textarea
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-primary-300 focus:outline-none"
            rows={3}
            placeholder="Ej.: sin cebolla"
            value={form.notes}
            onChange={(e) => onChange("notes", e.target.value)}
            disabled={isLoading}
          />
        </div>

        {/* Items */}
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-color-text font-title text-lg font-semibold">Ítems</h3>
          </div>

          {/* Error de items */}
          {error?.fields?.items && (
            <p className="mb-2 text-sm text-red-600" role="alert" aria-live="polite">
              {error.fields.items}
            </p>
          )}

          <ul className="space-y-2">
            {form.items.map((it, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  Producto #{it.productId} · Variante #{it.productVariantId}
                </span>
                <input
                  type="number"
                  min={1}
                  className="w-20 rounded-lg border border-gray-300 px-3 py-2"
                  value={it.quantity}
                  onChange={(e) => {
                    const q = Number(e.target.value) || 1;
                    setForm((f) => {
                      const items = [...f.items];
                      items[idx] = { ...items[idx], quantity: q };
                      return { ...f, items };
                    });
                  }}
                  disabled={isLoading}
                />
              </li>
            ))}
          </ul>
        </div>

        {/* Submit */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-color-primary-500 hover:bg-color-primary-600 rounded-lg px-5 py-2.5 font-semibold text-white disabled:opacity-60"
          >
            {isLoading ? "Creando…" : "Confirmar pedido"}
          </button>

          {/* Mensaje de error general */}
          {error?.message && (
            <span className="text-sm text-red-600" role="alert" aria-live="polite">
              {error.message}
            </span>
          )}
        </div>
      </form>

      {/* Success modal */}
      <Modal
        open={successOpen}
        onClose={() => setSuccessOpen(false)}
        title="¡Pedido creado!"
        footer={null}
      >
        <p className="text-sm text-gray-700">
          Tu pedido <span className="font-semibold">#{created?.id}</span> fue creado correctamente.
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <a
            href="/orders/mine"
            className="rounded-lg border border-gray-300 px-4 py-2 font-semibold text-gray-700 hover:bg-gray-50"
          >
            Ver mis pedidos
          </a>
          <button
            onClick={() => setSuccessOpen(false)}
            className="bg-color-primary-500 hover:bg-color-primary-600 rounded-lg px-4 py-2 font-semibold text-white"
          >
            Seguir comprando
          </button>
        </div>
      </Modal>
    </div>
  );
}
