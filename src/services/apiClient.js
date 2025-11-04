import axios from "axios";
import { fetchAuthSession } from "aws-amplify/auth";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 15000,
});

api.interceptors.request.use(async (config) => {
  try {
    const session = await fetchAuthSession();
    const accessToken = session.tokens?.accessToken?.toString();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
  } catch {
    // no session; request seguirá sin Authorization (si endpoint público)
  }
  return config;
});

// ⬇️ NUEVO: manejo de respuestas de error
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status;

    if (status === 401 || status === 403) {
      // Opcional: localStorage flag para mostrar toast después del login
      try {
        localStorage.setItem("auth.msg", "Sesión expirada. Por favor, volvé a iniciar sesión.");
      } catch {
        // ignore
      }
      // Redirigir conservando "from" no es trivial desde aquí; hacemos fallback
      window.location.assign("/login");
      return Promise.reject(error);
    }

    // 400/404/409 siguen hacia el caller (store) para UI específica
    return Promise.reject(error);
  },
);

export default api;
