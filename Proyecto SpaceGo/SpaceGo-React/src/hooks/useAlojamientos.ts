import { useEffect, useState } from "react";
import { obtenerAlojamientos } from "../services/alojamientoService";
import type { Alojamiento } from "../models/alojamiento";

export function useAlojamientos() {
  const [alojamientos, setAlojamientos] = useState<Alojamiento[]>([]);
  const [cargando, setCargando] = useState(true);
  const [modoDemostracion, setModoDemostracion] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let componenteActivo = true;

    const cargar = async () => {
      try {
        const resultado = await obtenerAlojamientos();

        if (componenteActivo) {
          setAlojamientos(resultado.alojamientos);
          setModoDemostracion(resultado.modoDemostracion);
        }
      } catch {
        if (componenteActivo) {
          setError("No se pudieron cargar los alojamientos.");
        }
      } finally {
        if (componenteActivo) {
          setCargando(false);
        }
      }
    };

    cargar();

    return () => {
      componenteActivo = false;
    };
  }, []);

  return { alojamientos, cargando, modoDemostracion, error };
}
