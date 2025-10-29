// src/context/auth/AuthProvider.jsx
import React, { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { getCurrentUser, fetchAuthSession, signInWithRedirect, signOut } from "aws-amplify/auth";
import { AuthContext } from "./AuthContext";
import api from "@/services/apiClient";

export default function AuthProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // Evita re-sincronizar múltiples veces en un mismo ciclo de vida de la app
  const syncedOnceRef = useRef(false);

  const loadSession = useCallback(async () => {
    setLoading(true);
    try {
      // Si NO hay usuario autenticado, getCurrentUser lanza excepción
      await getCurrentUser();

      const session = await fetchAuthSession();
      const idToken = session.tokens?.idToken;
      const accessToken = session.tokens?.accessToken;

      // Preferimos ID Token para claims de perfil, y fallback a Access Token si hace falta
      const email =
        idToken?.payload?.email ||
        accessToken?.payload?.username || // algunos IdPs ponen el username aquí
        null;

      const sub = idToken?.payload?.sub || accessToken?.payload?.sub || null;
      const name = idToken?.payload?.name || null;
      const givenName = idToken?.payload?.given_name || null;
      const familyName = idToken?.payload?.family_name || null;
      const phone = idToken?.payload?.phone_number || null;

      // Roles desde "cognito:groups" en cualquiera de los dos tokens
      const groupsFromId = idToken?.payload?.["cognito:groups"] ?? [];
      const groupsFromAccess = accessToken?.payload?.["cognito:groups"] ?? [];
      const rolesSet = new Set(
        [...groupsFromId, ...groupsFromAccess].map((g) => String(g).toUpperCase()),
      );

      const userData = {
        sub,
        email,
        name: name || `${givenName || ""} ${familyName || ""}`.trim() || null,
        roles: Array.from(rolesSet), // exponer como array
      };

      setUser(userData);
      setIsAuthenticated(true);

      if (import.meta.env.DEV) {
        console.debug("[Auth] Session OK:", {
          sub: userData.sub,
          email: userData.email,
          roles: userData.roles,
        });
      }

      // ====== Sincronización idempotente con backend ======
      if (!syncedOnceRef.current) {
        syncedOnceRef.current = true;

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
          if (syncError?.response?.status === 409) {
            console.warn("[Auth] 409: Email ya asociado a otro usuario. Revisar BD/Cognito.");
          } else {
            console.error("[Auth] Error sincronizando usuario:", syncError?.message || syncError);
          }
        }
      }
      // ====== Fin sincronización ======
    } catch (e) {
      // Sin sesión o error → limpiar estado
      if (import.meta.env.DEV) console.debug("[Auth] Sin sesión activa:", e?.name || e);
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
    await signInWithRedirect(); // requiere Amplify.configure con OAuth
  }, []);

  const loginWithGoogle = useCallback(async () => {
    await signInWithRedirect({ provider: "Google" });
  }, []);

  const logout = useCallback(async () => {
    await signOut({ global: true });
    setUser(null);
    setIsAuthenticated(false);
    syncedOnceRef.current = false; // si cambia de cuenta luego
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

  // Opcional: pantalla mínima de carga si el provider está muy arriba
  if (loading) {
    return (
      <AuthContext.Provider value={value}>
        <div className="grid min-h-dvh place-items-center">
          <span className="animate-pulse text-sm text-gray-500">Cargando sesión…</span>
        </div>
      </AuthContext.Provider>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
