import React, { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { getCurrentUser, fetchAuthSession, signInWithRedirect, signOut } from "aws-amplify/auth";
import { AuthContext } from "./AuthContext";
import api from "@/services/apiClient";

export default function AuthProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // Guard para no re-sincronizar múltiples veces en la misma sesión/app load.
  const syncedOnceRef = useRef(false);

  const loadSession = useCallback(async () => {
    try {
      // Si no hay sesión, lanza excepción
      await getCurrentUser();

      const session = await fetchAuthSession();
      const idToken = session.tokens?.idToken;
      const accessToken = session.tokens?.accessToken;

      const email = idToken?.payload?.email || accessToken?.payload?.username || null;
      const sub = idToken?.payload?.sub || accessToken?.payload?.sub;
      const name = idToken?.payload?.name || null;
      const givenName = idToken?.payload?.given_name;
      const familyName = idToken?.payload?.family_name;
      const phone = idToken?.payload?.phone_number;

      // Roles del token (id o access)
      const groups =
        idToken?.payload?.["cognito:groups"] || accessToken?.payload?.["cognito:groups"] || [];

      const userData = {
        sub,
        email,
        name: name || `${givenName || ""} ${familyName || ""}`.trim(),
        roles: Array.isArray(groups) ? groups.map((g) => g.toUpperCase()) : [],
      };

      setUser(userData);
      setIsAuthenticated(true);

      // ====== Sincronización idempotente con backend ======
      if (!syncedOnceRef.current) {
        syncedOnceRef.current = true; // marcamos que ya hicimos el intento en esta sesión

        // El backend toma sub/email/roles del JWT.
        // Enviamos first/last/phone solo como "complemento opcional".
        // (Si no vienen en el token, mandamos lo que podamos derivar del name)
        const firstName = givenName || (name ? name.split(" ")[0] : "");
        const lastName = familyName || (name ? name.split(" ").slice(1).join(" ") : "");

        try {
          await api.post("/users/register", {
            firstName: firstName || undefined,
            lastName: lastName || undefined,
            phone: phone || undefined,
          });
          if (import.meta.env.DEV) console.log("[Auth] Usuario sincronizado en backend");
        } catch (syncError) {
          // Manejo de conflicto 409 y otros
          if (syncError?.response?.status === 409) {
            console.warn("[Auth] Email en uso por otro usuario (409). Verificar en BD & Cognito.");
          } else {
            console.error("[Auth] Error sincronizando usuario:", syncError?.message || syncError);
          }
        }
      }
      // ====== Fin sincronización ======
    } catch {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  const login = useCallback(async () => {
    await signInWithRedirect();
  }, []);

  const loginWithGoogle = useCallback(async () => {
    await signInWithRedirect({ provider: "Google" });
  }, []);

  const logout = useCallback(async () => {
    await signOut({ global: true });
    setUser(null);
    setIsAuthenticated(false);
    syncedOnceRef.current = false; // por si el usuario cambia de cuenta
  }, []);

  const value = useMemo(
    () => ({
      loading,
      isAuthenticated,
      user,
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
