import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/context/auth";

export default function PublicOnlyRoute() {
  const { loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) return null; // o <Spinner/>

  if (isAuthenticated) {
    // Si ya está logueado, volvemos a donde quiso ir antes o al home/app
    const from = location.state?.from || "/app";
    return <Navigate to={from} replace />;
  }

  return <Outlet />;
}
