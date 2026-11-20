
import type { Initiative } from '../types/initiative'

interface InitiativeCardProps {
  initiative: Initiative
  isFavorite: boolean
  onToggleFavorite: (id: number) => void
}

export function InitiativeCard({
  initiative,
  isFavorite,
  onToggleFavorite,
}: InitiativeCardProps) {
  return (
    <article className="card h-100 shadow-sm">
      <div className="card-body d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start gap-2 mb-3">
          <span className="badge text-bg-primary">
            {initiative.category}
          </span>

          <span className="badge text-bg-light">
            {initiative.level}
          </span>
        </div>

        <h2 className="card-title h5">
          {initiative.title}
        </h2>

        <p className="card-text text-secondary">
          {initiative.description}
        </p>

        <p className="small mb-2">
          <strong>Duración:</strong> {initiative.durationHours} horas
        </p>

        <div className="d-flex flex-wrap gap-2 mb-4">
          {initiative.skills.map((skill) => (
            <span key={skill} className="badge rounded-pill text-bg-light border">
              {skill}
            </span>
          ))}
        </div>

        <div className="mt-auto">
          <button
            type="button"
            className={`btn w-100 ${isFavorite ? 'btn-danger' : 'btn-outline-primary'}`}
            aria-pressed={isFavorite}
            aria-label={
              isFavorite
                ? `Quitar de favoritas: ${initiative.title}`
                : `Agregar a favoritas: ${initiative.title}`
            }
            onClick={() => onToggleFavorite(initiative.id)}
          >
            {isFavorite ? 'Quitar de favoritas' : 'Agregar a favoritas'}
          </button>
        </div>
      </div>
    </article>
  )
}
