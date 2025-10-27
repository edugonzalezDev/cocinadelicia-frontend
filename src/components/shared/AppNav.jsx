import { Link } from "react-router-dom";
import { useAuth } from "@/context/auth";
import { useRole } from "@/hooks/useRole";

export default function AppNav() {
  const { isAuthenticated, user, logout } = useAuth();
  const { has, hasAny } = useRole();

  return (
    <nav className="flex w-full items-center justify-between border-b p-3">
      <Link to="/" className="font-bold">
        Cocina DeLicia
      </Link>

      <div className="flex items-center gap-3">
        <Link to="/">Home</Link>

        {isAuthenticated && <Link to="/app">Mi área</Link>}

        {hasAny(["CHEF", "ADMIN"]) && <Link to="/chef">Chef</Link>}
        {has("ADMIN") && <Link to="/admin">Admin</Link>}

        {!isAuthenticated ? (
          <Link to="/login" className="rounded bg-black px-3 py-1 text-white">
            Ingresar
          </Link>
        ) : (
          <button onClick={logout} className="rounded border px-3 py-1">
            Salir {user?.name ? `(${user.name})` : ""}
          </button>
        )}
      </div>
    </nav>
  );
}
