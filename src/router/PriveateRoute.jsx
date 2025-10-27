import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function PrivateRoute({ allowedRoles }) {
  const { loading, isAuthenticated, roles } = useAuth();

  if (loading) return null; // o un spinner

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const hasRole = roles.some((r) => allowedRoles.includes(r));
    if (!hasRole) return <Navigate to="/forbidden" replace />;
  }

  return <Outlet />;
}
