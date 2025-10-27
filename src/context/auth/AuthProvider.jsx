// src/context/auth/AuthProvider.jsx
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { getCurrentUser, fetchAuthSession, signInWithRedirect, signOut } from "aws-amplify/auth";
import { AuthContext } from "./AuthContext";

export default function AuthProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null); // { sub, email, name, roles: [] }

  const loadSession = useCallback(async () => {
    try {
      // Intenta obtener usuario actual (lanza si no hay sesión)
      await getCurrentUser();

      if (import.meta.env.DEV) {
        // console.debug('[Auth] current user', current);
      }

      // Obtener tokens y claims
      const session = await fetchAuthSession();
      const idToken = session.tokens?.idToken;
      const accessToken = session.tokens?.accessToken;

      // Claims comunes
      const email = idToken?.payload?.email || accessToken?.payload?.username || null;
      const sub = idToken?.payload?.sub || accessToken?.payload?.sub;
      const name = idToken?.payload?.name || null;

      // Roles desde cognito:groups (puede venir en id o access token)
      const groups =
        idToken?.payload?.["cognito:groups"] || accessToken?.payload?.["cognito:groups"] || [];

      setUser({
        sub,
        email,
        name,
        roles: Array.isArray(groups) ? groups.map((g) => g.toUpperCase()) : [],
      });
      setIsAuthenticated(true);
    } catch {
      // no hay sesión
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  // Hosted UI (email/contraseña o proveedor federado configurado)
  const login = useCallback(async () => {
    await signInWithRedirect();
  }, []);

  // Google explícito (si ya configuraste IdP Google en el User Pool)
  const loginWithGoogle = useCallback(async () => {
    await signInWithRedirect({ provider: "Google" });
  }, []);

  const logout = useCallback(async () => {
    await signOut({ global: true });
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const value = useMemo(
    () => ({
      loading,
      isAuthenticated,
      user, // { sub, email, name, roles: ['ADMIN','CHEF',...] }
      roles: user?.roles || [],
      login,
      loginWithGoogle,
      logout,
      refresh: loadSession,
    }),
    [loading, isAuthenticated, user, login, loginWithGoogle, logout, loadSession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
