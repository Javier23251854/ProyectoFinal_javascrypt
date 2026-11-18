import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import type { Alojamiento, CamposEditables } from "../models/alojamiento";
import {
  listarAlojamientos,
  actualizarAlojamiento,
  eliminarAlojamiento
} from "../services/alojamientoService";

// Hook personalizado: concentra el estado y el CRUD de las publicaciones
export function usePublicaciones() {
  const [publicaciones, setPublicaciones] = useState<Alojamiento[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [intento, setIntento] = useState(0);

  // READ: se vuelve a ejecutar cuando cambia "intento" (botón Reintentar)
  useEffect(() => {
    const controlador = new AbortController();

    listarAlojamientos(controlador.signal)
      .then((datos) => {
        setPublicaciones(datos);
        setError("");
      })
      .catch((e) => {
        if (axios.isCancel(e)) return;
        console.error("Error al cargar publicaciones:", e);
        setError("No se pudieron cargar las publicaciones. Comprueba que SpaceGo esté activo.");
      })
      .finally(() => {
        if (!controlador.signal.aborted) setCargando(false);
      });

    return () => controlador.abort();
  }, [intento]);

  const recargar = useCallback(() => {
    setCargando(true);
    setError("");
    setIntento((n) => n + 1);
  }, []);

  // UPDATE: editar datos
  const editar = useCallback(async (id: string | number, cambios: Partial<CamposEditables>) => {
    const actualizado = await actualizarAlojamiento(id, cambios);
    setPublicaciones((previas) =>
      previas.map((a) => (String(a.id) === String(id) ? { ...a, ...actualizado } : a))
    );
  }, []);

  // UPDATE: activar / desactivar
  const cambiarEstado = useCallback(async (id: string | number, activo: boolean) => {
    const actualizado = await actualizarAlojamiento(id, { activo });
    setPublicaciones((previas) =>
      previas.map((a) => (String(a.id) === String(id) ? { ...a, ...actualizado } : a))
    );
  }, []);

  // DELETE
  const eliminar = useCallback(async (id: string | number) => {
    await eliminarAlojamiento(id);
    setPublicaciones((previas) => previas.filter((a) => String(a.id) !== String(id)));
  }, []);

  return {
    publicaciones,
    cargando,
    error,
    recargar,
    editar,
    cambiarEstado,
    eliminar
  };
}
