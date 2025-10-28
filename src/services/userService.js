import api from "@/services/apiClient";

export async function registerOrSyncUser(optionalProfile) {
  // optionalProfile = { firstName, lastName, phone }  (todos opcionales)
  const { data } = await api.post("/users/register", optionalProfile || {});
  return data; // { id, email, firstName, lastName, roles: [...] }
}
