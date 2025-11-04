// src/components/orders/OrderStatusBadge.jsx
export default function OrderStatusBadge({ status }) {
  const s = (status || "").toUpperCase();
  const map = {
    CREATED: "bg-yellow-100 text-yellow-800 ring-yellow-200",
    CONFIRMED: "bg-blue-100 text-blue-800 ring-blue-200",
    PREPARING: "bg-indigo-100 text-indigo-800 ring-indigo-200",
    READY: "bg-emerald-100 text-emerald-800 ring-emerald-200",
    OUT_FOR_DELIVERY: "bg-teal-100 text-teal-800 ring-teal-200",
    DELIVERED: "bg-green-100 text-green-800 ring-green-200",
    CANCELED: "bg-red-100 text-red-800 ring-red-200",
  };
  const cls = map[s] || "bg-gray-100 text-gray-800 ring-gray-200";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${cls}`}
    >
      {s}
    </span>
  );
}
