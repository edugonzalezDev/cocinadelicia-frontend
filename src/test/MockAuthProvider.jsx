import { AuthContext } from "@/context/auth/AuthContext";
import { vi } from "vitest";

/**
 * MockAuthProvider: simula el contexto de Auth.
 * Props:
 *  - isAuthenticated: bool
 *  - roles: string[] (e.g. ["ADMIN"])
 *  - user: objeto user simulado
 *  - loading: false por defecto
 */
export default function MockAuthProvider({
  children,
  isAuthenticated = false,
  roles = [],
  user = { name: "Tester", email: "tester@example.com" },
  loading = false,
}) {
  const value = {
    loading,
    isAuthenticated,
    user,
    roles,
    login: vi.fn(),
    loginWithGoogle: vi.fn(),
    logout: vi.fn(),
    refresh: vi.fn(),
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
