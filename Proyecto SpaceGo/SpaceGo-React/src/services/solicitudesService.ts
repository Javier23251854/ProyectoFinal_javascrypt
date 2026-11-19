
import axios from "axios";

export type EstadoSolicitud =
  | "pendiente"
  | "en_revision"
  | "aceptada"
  | "rechazada"
  | "cancelada";

export type TipoSolicitud = "contacto" | "alquiler";

export interface AlojamientoSolicitud {
  id: string | number;
  titulo: string;
  tipo?: string;
  precio?: number | string;
  departamento?: string;
  provincia?: string;
  distrito?: string;
  imagen?: string;
  imagenes?: string[];
}

export interface Solicitud {
  id: string;
  usuarioId: string;
  propietarioId?: string | null;
  alojamientoId: string | number;
  tipo: TipoSolicitud;
  mensaje: string;
  fecha: string;
  actualizadaEn?: string;
  estado: EstadoSolicitud;
  alojamiento?: AlojamientoSolicitud;
}

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json"
  },
  timeout: 10000
});

export async function obtenerMisSolicitudes(
  signal?: AbortSignal
): Promise<Solicitud[]> {
  const { data } = await api.get<Solicitud[]>("/solicitudes", {
    signal
  });

  return data;
}

export async function cancelarSolicitud(
  id: string
): Promise<Solicitud> {
  const { data } = await api.patch<Solicitud>(
    `/solicitudes/${encodeURIComponent(id)}`,
    {
      estado: "cancelada"
    }
  );

  return data;
}
