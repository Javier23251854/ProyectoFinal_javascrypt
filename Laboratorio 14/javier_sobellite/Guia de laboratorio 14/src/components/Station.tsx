
import type { Workshop } from '../contract';

interface StationProps {
  name: string;
  loading: boolean;
  duration: number | null;
  error: string | null;
  workshops: Workshop[];
  onReserve: (workshop: Workshop) => void;
  reserving: string | null;
}

function Station({
  name,
  loading,
  duration,
  error,
  workshops,
  onReserve,
  reserving,
}: StationProps) {
  return (
    <article className="station-card">
      <div className="station-header">
        <h3>{name}</h3>

        <span className={`station-status ${
          loading ? 'loading' : error ? 'error' : 'success'
        }`}>
          {loading
            ? 'Consultando'
            : error
              ? 'Error'
              : 'Finalizado'}
        </span>
      </div>

      <div className="station-metrics">
        <span>Tiempo de respuesta</span>
        <strong>
          {duration !== null
            ? `${duration.toFixed(0)} ms`
            : '—'}
        </strong>
      </div>

      {loading && (
        <p className="station-message">
          Consultando la API REST...
        </p>
      )}

      {!loading && error && (
        <p className="station-error">
          {error}
        </p>
      )}

      {!loading && !error && workshops.length === 0 && (
        <p className="station-message">
          No hay talleres disponibles.
        </p>
      )}

      {!loading && !error && workshops.length > 0 && (
        <div className="station-workshops">
          {workshops.map((workshop) => (
            <div
              className="station-workshop"
              key={workshop.id}
            >
              <div>
                <strong>{workshop.title}</strong>
                <span>
                  {workshop.seats} cupos disponibles
                </span>
              </div>

              <button
                type="button"
                onClick={() => onReserve(workshop)}
                disabled={
                  workshop.seats === 0 ||
                  reserving === workshop.id
                }
              >
                {reserving === workshop.id
                  ? 'Reservando...'
                  : 'Reservar'}
              </button>
            </div>
          ))}
        </div>
      )}
    </article>
  );
}

export default Station;
