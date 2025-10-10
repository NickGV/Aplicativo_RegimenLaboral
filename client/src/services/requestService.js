const API_URL = "http://localhost:8000/api/solicitudes/";

export async function getRequests() {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error("Error al obtener solicitudes");
  return response.json();
}

export async function createRequest(data) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // Agrega el token si usas autenticación
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Error al crear solicitud");
  return response.json();
}
export async function updateRequest(id, data) {
  const response = await fetch(`${API_URL}${id}/`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Error al actualizar solicitud");
  return response.json();
}

export async function deleteRequest(id) {
  const response = await fetch(`${API_URL}${id}/`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Error al eliminar solicitud");
}