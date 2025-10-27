import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/context/auth";

export default function PrivateRoute({ allowedRoles }) {
  const { loading, isAuthenticated, roles } = useAuth();
  const location = useLocation();

  if (loading) return null;

  if (!isAuthenticated) {
    // guardamos a dónde quería ir para redirigir después del login
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const hasRole = roles.some((r) => allowedRoles.includes(r));
    if (!hasRole) return <Navigate to="/forbidden" replace />;
  }

  return <Outlet />;
}
