import api from "@/services/apiClient";

export async function registerOrSyncUser(optionalProfile) {
  const { data } = await api.post("/users/register", optionalProfile || {});
  return data;
}
