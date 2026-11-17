
import type {
  Mode,
  Workshop,
  Reservation,
  Receipt,
} from '../contract';

// Todas las herramientas REST deberán cumplir este contrato.
export interface Client {
  name: string;

  list(
    mode: Mode,
    signal?: AbortSignal,
  ): Promise<Workshop[]>;

  reserve(
    input: Reservation,
  ): Promise<Receipt>;
}
