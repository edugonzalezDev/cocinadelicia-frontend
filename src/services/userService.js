// src/services/userService.js
import api from "@/services/apiClient";

/**
 * Devuelve el perfil del usuario autenticado desde app_user.
 * Si no existía, el backend lo crea en el momento.
 * @returns {Promise<{
 *   id:number, cognitoUserId:string, email:string,
 *   firstName?:string, lastName?:string, phone?:string, roles?:string[]
 * }>}
 */
export async function getMyProfile() {
  const { data } = await api.get("/api/users/me");
  return data;
}

/**
 * (Opcional / legado) Fuerza registro/actualización del usuario en app_user,
 * usando datos adicionales si los pasás. Normalmente NO la necesitas si usás getMyProfile().
 * @param {Object} [optionalProfile] { firstName?, lastName?, phone? }
 * @returns {Promise<Object>} UserResponseDTO
 */
export async function registerOrSyncUser(optionalProfile) {
  const { data } = await api.post("/api/users/register", optionalProfile || {});
  return data;
}
