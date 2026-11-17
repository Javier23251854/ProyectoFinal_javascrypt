import axios from "axios";
import type { Alojamiento } from "../models/alojamiento";

// Mismo JSON Server que usa Angular (db.json del proyecto Angular)
const api = axios.create({
  baseURL: "http://localhost:3000",
  headers: { "Content-Type": "application/json" },
  timeout: 8000
});

// READ: obtener todos los alojamientos
export const listarAlojamientos = async (
  signal?: AbortSignal
): Promise<Alojamiento[]> => {
  const { data } = await api.get<Alojamiento[]>("/alojamientos", { signal });
  return data;
};

// UPDATE: modificar solo los campos enviados (PATCH)
export const actualizarAlojamiento = async (
  id: string | number,
  cambios: Partial<Alojamiento>
): Promise<Alojamiento> => {
  const { data } = await api.patch<Alojamiento>(
    `/alojamientos/${encodeURIComponent(String(id))}`,
    cambios
  );
  return data;
};

// DELETE: eliminar una publicación
export const eliminarAlojamiento = async (id: string | number): Promise<void> => {
  await api.delete(`/alojamientos/${encodeURIComponent(String(id))}`);
};
