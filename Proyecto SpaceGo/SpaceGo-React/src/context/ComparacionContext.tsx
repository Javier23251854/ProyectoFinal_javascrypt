import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { Alojamiento } from "../models/alojamiento";

interface ComparacionContexto {
  idsSeleccionados: string[];
  alojamientosSeleccionados: Alojamiento[];
  mensaje: string;
  alternarAlojamiento: (alojamiento: Alojamiento) => void;
  quitarAlojamiento: (id: string | number) => void;
  limpiarComparacion: () => void;
}

const ContextoComparacion = createContext<ComparacionContexto | null>(null);

interface ComparacionProviderProps {
  alojamientos: Alojamiento[];
  children: ReactNode;
}

export function ComparacionProvider({ alojamientos, children }: ComparacionProviderProps) {
  const [idsSeleccionados, setIdsSeleccionados] = useState<string[]>([]);
  const [mensaje, setMensaje] = useState("");

  const alojamientosSeleccionados = useMemo(
    () => idsSeleccionados
      .map((id) => alojamientos.find((alojamiento) => String(alojamiento.id) === id))
      .filter((alojamiento): alojamiento is Alojamiento => Boolean(alojamiento)),
    [alojamientos, idsSeleccionados]
  );

  const quitarAlojamiento = useCallback((id: string | number) => {
    setIdsSeleccionados((actuales) => actuales.filter((seleccionado) => seleccionado !== String(id)));
    setMensaje("");
  }, []);

  const alternarAlojamiento = useCallback((alojamiento: Alojamiento) => {
    const id = String(alojamiento.id);

    if (idsSeleccionados.includes(id)) {
      quitarAlojamiento(id);
      return;
    }

    if (idsSeleccionados.length >= 3) {
      setMensaje("Puedes comparar hasta 3 alojamientos a la vez.");
      return;
    }

    setIdsSeleccionados((actuales) => [...actuales, id]);
    setMensaje("");
  }, [idsSeleccionados, quitarAlojamiento]);

  const limpiarComparacion = useCallback(() => {
    setIdsSeleccionados([]);
    setMensaje("");
  }, []);

  const valor = useMemo(
    () => ({
      idsSeleccionados,
      alojamientosSeleccionados,
      mensaje,
      alternarAlojamiento,
      quitarAlojamiento,
      limpiarComparacion
    }),
    [idsSeleccionados, alojamientosSeleccionados, mensaje, alternarAlojamiento, quitarAlojamiento, limpiarComparacion]
  );

  return (
    <ContextoComparacion.Provider value={valor}>
      {children}
    </ContextoComparacion.Provider>
  );
}

export function useComparacion() {
  const contexto = useContext(ContextoComparacion);

  if (!contexto) {
    throw new Error("useComparacion debe utilizarse dentro de ComparacionProvider.");
  }

  return contexto;
}
