
import { createAlova } from 'alova';
import adapterFetch from 'alova/fetch';

import {
  ApiError,
  listUrl,
  parseWorkshops,
  parseReceipt,
  RESERVATIONS,
  type Mode,
  type Reservation,
} from '../contract';

import type { Client } from './client';

// Configuración de Alova utilizando Fetch como adaptador.
const alova = createAlova({
  baseURL: '',
  requestAdapter: adapterFetch(),

  // Desactiva la caché para consultar siempre la API.
  cacheFor: null,

  // Evita compartir solicitudes simultáneas.
  shareRequest: false,

  // Convierte la respuesta HTTP en JSON.
  responded: (response) => response.json(),
});

// Convierte errores HTTP de Alova al formato común.
function normalizeError(error: unknown): never {
  if (
    error &&
    typeof error === 'object' &&
    'response' in error
  ) {
    const response = (
      error as { response?: Response }
    ).response;

    if (response) {
      throw new ApiError('http', response.status);
    }
  }

  throw error;
}

const alovaClient: Client = {
  name: 'Alova',

  async list(mode: Mode, signal?: AbortSignal) {
    try {
      const data: unknown = await alova
        .Get(listUrl(mode), {
          signal,
        })
        .send();

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
      const data: unknown = await alova
        .Post(RESERVATIONS, input, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .send();

      return parseReceipt(data);
    } catch (error) {
      normalizeError(error);
    }
  },
};

export default alovaClient;
