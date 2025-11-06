// src/pages/admin/AdminDashboard.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  return (
    <div>
      <header className="mb-4">
        <h1 className="text-color-text font-title text-xl font-bold">Panel de Administración</h1>
        <p className="text-sm text-gray-600">
          Gestioná pedidos, productos y usuarios. Todo en un solo lugar.
        </p>
      </header>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Link to="/admin/orders" className="rounded-xl border p-4 shadow-sm hover:bg-gray-50">
          <p className="text-sm text-gray-500">Gestión</p>
          <h3 className="text-color-text mt-1 font-semibold">Pedidos</h3>
          <p className="text-xs text-gray-500">Cambiar estados, revisar tiempos y notas.</p>
        </Link>
        <div className="rounded-xl border p-4 opacity-70">
          <p className="text-sm text-gray-500">Catálogo</p>
          <h3 className="text-color-text mt-1 font-semibold">Productos</h3>
          <p className="text-xs text-gray-500">Próximamente</p>
        </div>
        <div className="rounded-xl border p-4 opacity-70">
          <p className="text-sm text-gray-500">Usuarios</p>
          <h3 className="text-color-text mt-1 font-semibold">Clientes y Roles</h3>
          <p className="text-xs text-gray-500">Próximamente</p>
        </div>
      </section>
    </div>
  );
}
