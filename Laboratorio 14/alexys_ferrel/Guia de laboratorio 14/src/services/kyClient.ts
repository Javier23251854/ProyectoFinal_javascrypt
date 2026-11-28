
import ky from 'ky';

import {
  ApiError,
  listUrl,
  parseWorkshops,
  parseReceipt,
  RESERVATIONS,
  TIMEOUT,
  type Mode,
  type Reservation,
} from '../contract';

import type { Client } from './client';

// Convierte los errores de Ky a nuestro formato común.
function normalizeError(error: unknown): never {
  if (error instanceof Error && error.name === 'TimeoutError') {
    throw new ApiError('timeout');
  }

  if (
    error instanceof Error &&
    error.name === 'HTTPError'
  ) {
    const status = (
      error as Error & {
        response?: Response;
      }
    ).response?.status;

    throw new ApiError('http', status);
  }

  throw error;
}

const kyClient: Client = {
  name: 'Ky',

  async list(mode: Mode, signal?: AbortSignal) {
    try {
      const data: unknown = await ky
        .get(listUrl(mode), {
          timeout: TIMEOUT,
          signal,
        })
        .json();

      return parseWorkshops(data);
    } catch (error) {
      if (signal?.aborted) {
        throw new DOMException(
          'Consulta cancelada.',
          'AbortError',
        );
      }

      normalizeError(error);
    }
  },

  async reserve(input: Reservation) {
    try {
      const data: unknown = await ky
        .post(RESERVATIONS, {
          timeout: TIMEOUT,
          json: input,
        })
        .json();

      return parseReceipt(data);
    } catch (error) {
      normalizeError(error);
    }
  },
};

export default kyClient;
