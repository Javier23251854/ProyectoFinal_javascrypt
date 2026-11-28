
import { useCallback, useEffect, useRef, useState } from 'react';

import {
  failureText,
  type Mode,
  type Workshop,
  type Receipt,
} from '../contract';

import { clients } from '../services';
import type { Client } from '../services/client';

// Información que mostrará cada estación.
export interface StationData {
  name: string;
  loading: boolean;
  duration: number | null;
  error: string | null;
  workshops: Workshop[];
}

const initialStations: StationData[] = clients.map((client) => ({
  name: client.name,
  loading: false,
  duration: null,
  error: null,
  workshops: [],
}));

function useStations(mode: Mode) {
  const [stations, setStations] = useState(initialStations);

  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [reservationError, setReservationError] = useState<string | null>(null);
  const [reservationLoading, setReservationLoading] = useState(false);
  const [reserving, setReserving] = useState<string | null>(null);

  const controllers = useRef<Map<string, AbortController>>(new Map());

  // Identifica la consulta más reciente.
  const requestVersion = useRef(0);

  // Cancela las consultas que estén en ejecución.
  const cancel = useCallback(() => {
    requestVersion.current += 1;

    controllers.current.forEach((controller) => controller.abort());
    controllers.current.clear();
  }, []);

  // Consulta los talleres utilizando las siete herramientas.
  const refresh = useCallback(async () => {
    cancel();

    const currentVersion = requestVersion.current;
    const newControllers = new Map<string, AbortController>();

    clients.forEach((client) => {
      newControllers.set(client.name, new AbortController());
    });

    controllers.current = newControllers;

    setStations((current) =>
      current.map((station) => ({
        ...station,
        loading: true,
        duration: null,
        error: null,
      })),
    );

    await Promise.all(
      clients.map(async (client) => {
        const controller = newControllers.get(client.name)!;
        const start = performance.now();

        try {
          const workshops = await client.list(mode, controller.signal);

          // Ignora resultados de consultas anteriores.
          if (requestVersion.current !== currentVersion) return;

          setStations((current) =>
            current.map((station) =>
              station.name === client.name
                ? {
                    ...station,
                    workshops,
                    loading: false,
                    duration: performance.now() - start,
                    error: null,
                  }
                : station,
            ),
          );
        } catch (error) {
          // Ignora respuestas de consultas anteriores.
          if (requestVersion.current !== currentVersion) return;

          setStations((current) =>
            current.map((station) =>
              station.name === client.name
                ? {
                    ...station,
                    loading: false,
                    duration: performance.now() - start,
                    error: failureText(error),
                  }
                : station,
            ),
          );
        } finally {
          if (
            requestVersion.current === currentVersion &&
            controllers.current.get(client.name) === controller
          ) {
            controllers.current.delete(client.name);
          }
        }
      }),
    );
  }, [mode, cancel]);

  // Carga los datos al iniciar y cuando cambia el escenario.
  useEffect(() => {
    void refresh();

    return () => {
      cancel();
    };
  }, [refresh, cancel]);

  // Registra una reserva con la herramienta seleccionada.
  const reserve = useCallback(
    async (client: Client, workshop: Workshop) => {
      setReceipt(null);
      setReservationError(null);
      setReservationLoading(true);
      setReserving(workshop.id);

      try {
        const result = await client.reserve({
          workshopId: workshop.id,
          seats: 1,
        });

        setReceipt(result);

        // Actualiza los cupos después de reservar.
        await refresh();
      } catch (error) {
        setReservationError(failureText(error));
      } finally {
        setReservationLoading(false);
        setReserving(null);
      }
    },
    [refresh],
  );

  return {
    stations,
    refresh,
    cancel,
    reserve,
    receipt,
    reservationError,
    reservationLoading,
    reserving,
  };
}

export default useStations;
