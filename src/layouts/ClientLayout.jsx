import AppNav from "@/components/shared/AppNav";
import { Outlet } from "react-router-dom";

export default function ClientLayout() {
  return (
    <div className="min-h-screen">
      <AppNav />
      <main className="mx-auto max-w-5xl p-4">
        <Outlet />
      </main>
    </div>
  );
}
