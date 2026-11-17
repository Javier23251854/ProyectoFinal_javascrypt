
import type { Receipt } from '../contract';

interface ReservationResultProps {
  receipt: Receipt | null;
  error: string | null;
  loading: boolean;
}

function ReservationResult({
  receipt,
  error,
  loading,
}: ReservationResultProps) {
  return (
    <section className="reservation-result">
      <div className="reservation-heading">
        <div>
          <span className="eyebrow">GESTIÓN DE RESERVAS</span>
          <h2>Resultado de la operación</h2>
        </div>

        <span className="reservation-indicator">
          {loading
            ? 'Procesando'
            : receipt
              ? 'Confirmada'
              : error
                ? 'Rechazada'
                : 'Sin operaciones'}
        </span>
      </div>

      {loading && (
        <p className="reservation-message">
          Registrando tu reserva...
        </p>
      )}

      {!loading && receipt && (
        <div className="reservation-success">
          <h3>¡Reserva registrada correctamente!</h3>

          <p>
            <strong>Código:</strong> {receipt.id}
          </p>

          <p>
            <strong>Taller:</strong> {receipt.workshopId}
          </p>

          <p>
            <strong>Cupos reservados:</strong> {receipt.seats}
          </p>

          <p>
            <strong>Cupos restantes:</strong> {receipt.remaining}
          </p>
        </div>
      )}

      {!loading && error && (
        <p className="reservation-error">
          {error}
        </p>
      )}

      {!loading && !receipt && !error && (
        <p className="reservation-message">
          Todavía no se ha realizado ninguna reserva.
        </p>
      )}
    </section>
  );
}

export default ReservationResult;
