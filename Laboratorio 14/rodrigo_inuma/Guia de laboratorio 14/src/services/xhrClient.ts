
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

// Realiza una petición HTTP utilizando XMLHttpRequest.
function request(
  method: 'GET' | 'POST',
  url: string,
  body?: Reservation,
  signal?: AbortSignal,
): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    let settled = false;

    const cleanup = () => {
      signal?.removeEventListener('abort', handleAbort);
    };

    const finish = (
      callback: (value: any) => void,
      value: unknown,
    ) => {
      if (settled) return;

      settled = true;
      cleanup();
      callback(value);
    };

    const handleAbort = () => {
      xhr.abort();
      finish(
        reject,
        new DOMException('Consulta cancelada.', 'AbortError'),
      );
    };

    if (signal?.aborted) {
      reject(new DOMException('Consulta cancelada.', 'AbortError'));
      return;
    }

    xhr.open(method, url);
    xhr.timeout = TIMEOUT;

    if (body) {
      xhr.setRequestHeader(
        'Content-Type',
        'application/json',
      );
    }

    xhr.onload = () => {
      if (xhr.status < 200 || xhr.status >= 300) {
        finish(
          reject,
          new ApiError('http', xhr.status),
        );
        return;
      }

      try {
        const data: unknown = JSON.parse(xhr.responseText);
        finish(resolve, data);
      } catch {
        finish(reject, new ApiError('format'));
      }
    };

    xhr.onerror = () => {
      finish(reject, new ApiError('network'));
    };

    xhr.ontimeout = () => {
      finish(reject, new ApiError('timeout'));
    };

    xhr.onabort = () => {
      finish(
        reject,
        new DOMException('Consulta cancelada.', 'AbortError'),
      );
    };

    signal?.addEventListener('abort', handleAbort, {
      once: true,
    });

    xhr.send(body ? JSON.stringify(body) : null);
  });
}

const xhrClient: Client = {
  name: 'XMLHttpRequest',

  async list(mode: Mode, signal?: AbortSignal) {
    const data = await request(
      'GET',
      listUrl(mode),
      undefined,
      signal,
    );

    return parseWorkshops(data);
  },

  async reserve(input: Reservation) {
    const data = await request(
      'POST',
      RESERVATIONS,
      input,
    );

    return parseReceipt(data);
  },
};

export default xhrClient;
