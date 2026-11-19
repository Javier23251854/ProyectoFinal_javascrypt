import axios from "axios";
import type { Alojamiento } from "../models/alojamiento";

const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
  timeout: 8000
});

export async function obtenerAlojamientos(): Promise<{
  alojamientos: Alojamiento[];
  modoDemostracion: boolean;
}> {
  const { data } = await api.get<Alojamiento[]>("/alojamientos");
  return { alojamientos: data, modoDemostracion: false };
}

export const listarAlojamientos = async (
  signal?: AbortSignal
): Promise<Alojamiento[]> => {
  const { data } = await api.get<Alojamiento[]>("/alojamientos/mios", { signal });
  return data;
};

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

export const eliminarAlojamiento = async (id: string | number): Promise<void> => {
  await api.delete(`/alojamientos/${encodeURIComponent(String(id))}`);
};
