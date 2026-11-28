
import {
  QueryClient,
  MutationObserver,
} from '@tanstack/react-query';

import {
  listUrl,
  parseWorkshops,
  parseReceipt,
  readResponse,
  withDeadline,
  RESERVATIONS,
  type Mode,
  type Reservation,
} from '../contract';

import type { Client } from './client';

// Administrador de consultas y caché.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: 0,
    },
    mutations: {
      retry: false,
    },
  },
});

// Identificador para distinguir cada solicitud.
let requestId = 0;

const tanstackClient: Client = {
  name: 'TanStack Query',

  async list(mode: Mode, signal?: AbortSignal) {
    try {
      const currentRequest = ++requestId;

      return await queryClient.fetchQuery({
        // Cada consulta tiene una clave independiente.
        queryKey: ['talleres', mode, currentRequest],

        queryFn: async () => {
          return withDeadline(async (deadlineSignal) => {
            const combinedSignal = signal
              ? AbortSignal.any([deadlineSignal, signal])
              : deadlineSignal;

            const response = await fetch(listUrl(mode), {
              signal: combinedSignal,
            });

            const data = await readResponse(response);

            return parseWorkshops(data);
          });
        },
      });
    } catch (error) {
      if (signal?.aborted) {
        throw new DOMException(
          'Consulta cancelada.',
          'AbortError',
        );
      }

      throw error;
    }
  },

  async reserve(input: Reservation) {
    const mutation = new MutationObserver(queryClient, {
      mutationFn: async (reservation: Reservation) => {
        return withDeadline(async (signal) => {
          const response = await fetch(RESERVATIONS, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(reservation),
            signal,
          });

          const data = await readResponse(response);

          return parseReceipt(data);
        });
      },
    });

    return mutation.mutate(input);
  },
};

export default tanstackClient;
