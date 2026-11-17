
import { mutate } from 'swr';

import {
  ApiError,
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

// Claves utilizadas para identificar las consultas.
const workshopKey = (mode: Mode) => [
  'talleres',
  mode,
];

const swrClient: Client = {
  name: 'SWR',

  async list(mode: Mode, signal?: AbortSignal) {
    try {
      return await mutate(
        workshopKey(mode),
        async () => {
          return withDeadline(async (combinedSignal) => {
            const response = await fetch(listUrl(mode), {
              signal: combinedSignal,
            });

            const data = await readResponse(response);
            return parseWorkshops(data);
          }, signal);
        },
        {
          revalidate: false,
          populateCache: true,
        },
      ) as Awaited<ReturnType<Client['list']>>;
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
    return withDeadline(async (signal) => {
      const response = await fetch(RESERVATIONS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
        signal,
      });

      const data = await readResponse(response);
      return parseReceipt(data);
    });
  },
};

export default swrClient;
