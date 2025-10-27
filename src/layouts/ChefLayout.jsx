import AppNav from "@/components/shared/AppNav";
import { Outlet } from "react-router-dom";

export default function ChefLayout() {
  return (
    <div className="min-h-screen">
      <AppNav />
      <main className="mx-auto max-w-6xl p-4">
        <h1 className="mb-4 text-xl font-semibold">Panel de Cocina</h1>
        <Outlet />
      </main>
    </div>
  );
}
