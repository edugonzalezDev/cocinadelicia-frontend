import { useAuth } from "@/context/auth";

export function useRole() {
  const { roles = [], isAuthenticated } = useAuth();

  const has = (role) => roles.includes(role.toUpperCase());
  const hasAny = (list = []) => list.some((r) => roles.includes(r.toUpperCase()));
  const hasAll = (list = []) => list.every((r) => roles.includes(r.toUpperCase()));

  return { isAuthenticated, roles, has, hasAny, hasAll };
}
