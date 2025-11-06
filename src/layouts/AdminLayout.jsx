// src/layouts/AdminLayout.jsx
import { NavLink, Outlet } from "react-router-dom";

const link =
  "block rounded-lg px-3 py-2 text-sm font-medium text-color-text hover:bg-primary-100/40 hover:text-primary-900";
const active = "bg-primary-100/60 text-primary-900";

export default function AdminLayout() {
  return (
    <div className="mx-auto grid min-h-[calc(100dvh-4rem)] max-w-7xl grid-cols-1 gap-6 p-4 md:grid-cols-[220px_1fr] md:gap-8">
      {/* Sidebar */}
      <aside className="rounded-xl border bg-white p-3 shadow-sm md:sticky md:top-20 md:h-[calc(100vh-6rem)]">
        <h2 className="mb-3 font-title text-sm font-semibold text-gray-600">Admin</h2>
        <nav className="space-y-1">
          <NavLink
            end
            to="/admin"
            className={({ isActive }) => `${link} ${isActive ? active : ""}`}
          >
            Resumen
          </NavLink>
          <NavLink
            to="/admin/orders"
            className={({ isActive }) => `${link} ${isActive ? active : ""}`}
          >
            Pedidos
          </NavLink>
          <NavLink
            to="/admin/products"
            className={({ isActive }) => `${link} ${isActive ? active : ""}`}
          >
            Productos
          </NavLink>
          <NavLink
            to="/admin/users"
            className={({ isActive }) => `${link} ${isActive ? active : ""}`}
          >
            Usuarios
          </NavLink>
          <NavLink
            to="/admin/settings"
            className={({ isActive }) => `${link} ${isActive ? active : ""}`}
          >
            Configuración
          </NavLink>
        </nav>
      </aside>

      {/* Main */}
      <main className="rounded-xl border bg-white p-4 shadow-sm">
        <Outlet />
      </main>
    </div>
  );
}
