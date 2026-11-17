import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import type { Alojamiento, CamposEditables } from "../models/alojamiento";
import {
  listarAlojamientos,
  actualizarAlojamiento,
  eliminarAlojamiento
} from "../services/alojamientoService";

// Hook personalizado: concentra el estado y el CRUD de las publicaciones
export function usePublicaciones(usuarioId: string | null) {
  const [todas, setTodas] = useState<Alojamiento[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [intento, setIntento] = useState(0);

  // READ: se vuelve a ejecutar cuando cambia "intento" (botón Reintentar)
  useEffect(() => {
    const controlador = new AbortController();

    listarAlojamientos(controlador.signal)
      .then((datos) => {
        setTodas(datos);
        setError("");
      })
      .catch((e) => {
        if (axios.isCancel(e)) return;
        console.error("Error al cargar publicaciones:", e);
        setError("No se pudieron cargar las publicaciones. Verifica que JSON Server esté activo.");
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

  // Solo las publicaciones del propietario. Si ningún registro tiene
  // propietarioId todavía (datos antiguos), se muestran todas como demostración.
  const hayPropietarios = useMemo(
    () => todas.some((a) => a.propietarioId !== undefined),
    [todas]
  );

  const publicaciones = useMemo(() => {
    if (!hayPropietarios) return todas;
    return todas.filter((a) => String(a.propietarioId) === String(usuarioId));
  }, [todas, hayPropietarios, usuarioId]);

  const modoDemostracion = !hayPropietarios && todas.length > 0;

  // UPDATE: editar datos
  const editar = useCallback(async (id: string | number, cambios: Partial<CamposEditables>) => {
    const actualizado = await actualizarAlojamiento(id, cambios);
    setTodas((previas) =>
      previas.map((a) => (String(a.id) === String(id) ? { ...a, ...actualizado } : a))
    );
  }, []);

  // UPDATE: activar / desactivar
  const cambiarEstado = useCallback(async (id: string | number, activo: boolean) => {
    const actualizado = await actualizarAlojamiento(id, { activo });
    setTodas((previas) =>
      previas.map((a) => (String(a.id) === String(id) ? { ...a, ...actualizado } : a))
    );
  }, []);

  // DELETE
  const eliminar = useCallback(async (id: string | number) => {
    await eliminarAlojamiento(id);
    setTodas((previas) => previas.filter((a) => String(a.id) !== String(id)));
  }, []);

  return {
    publicaciones,
    cargando,
    error,
    modoDemostracion,
    recargar,
    editar,
    cambiarEstado,
    eliminar
  };
}
