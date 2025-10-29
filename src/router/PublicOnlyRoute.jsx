import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/context/auth";

export default function PublicOnlyRoute() {
  const { loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="grid min-h-dvh place-items-center">
        <span className="animate-pulse text-sm text-gray-500">Cargando…</span>
      </div>
    );
  }

  if (isAuthenticated) {
    // Si ya está logueado, volvemos a donde quiso ir antes o al home/app
    const from = location.state?.from || "/";
    return <Navigate to={from} replace />;
  }

  return <Outlet />;
}
