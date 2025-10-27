import AppNav from "@/components/shared/AppNav";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="min-h-screen">
      <AppNav />
      <main className="mx-auto max-w-7xl p-4">
        <h1 className="mb-4 text-xl font-semibold">Administración</h1>
        <Outlet />
      </main>
    </div>
  );
}
