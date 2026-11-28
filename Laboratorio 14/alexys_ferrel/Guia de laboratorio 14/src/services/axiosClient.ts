
import axios from 'axios';

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

const axiosClient: Client = {
  name: 'Axios',

  async list(mode: Mode, signal?: AbortSignal) {
    try {
      const response = await axios.get(listUrl(mode), {
        signal,
        timeout: TIMEOUT,
      });

      return parseWorkshops(response.data);
    } catch (error) {
      if (signal?.aborted) {
        throw new DOMException('Consulta cancelada.', 'AbortError');
      }

      if (axios.isCancel(error)) {
        throw new DOMException('Consulta cancelada.', 'AbortError');
      }

      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
          throw new ApiError('timeout');
        }

        if (error.response) {
          throw new ApiError('http', error.response.status);
        }
      }

      throw error;
    }
  },

  async reserve(input: Reservation) {
    try {
      const response = await axios.post(RESERVATIONS, input, {
        timeout: TIMEOUT,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return parseReceipt(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
          throw new ApiError('timeout');
        }

        if (error.response) {
          throw new ApiError('http', error.response.status);
        }
      }

      throw error;
    }
  },
};

export default axiosClient;
