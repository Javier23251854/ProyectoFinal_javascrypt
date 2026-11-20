
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

const fetchClient: Client = {
  name: 'Fetch API',

  async list(mode: Mode, signal?: AbortSignal) {
    return withDeadline(async (combinedSignal) => {
      const response = await fetch(listUrl(mode), {
        method: 'GET',
        signal: combinedSignal,
      });

      const data = await readResponse(response);
      return parseWorkshops(data);
    }, signal);
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

export default fetchClient;
