
interface SummaryPanelProps {
  totalInitiatives: number
  visibleInitiatives: number
  totalFavorites: number
}

export function SummaryPanel({
  totalInitiatives,
  visibleInitiatives,
  totalFavorites,
}: SummaryPanelProps) {
  return (
    <section className="row g-3 mb-4" aria-label="Resumen de iniciativas">
      <div className="col-12 col-md-4">
        <div className="card h-100 border-0 bg-light">
          <div className="card-body">
            <p className="text-secondary mb-1">Iniciativas registradas</p>
            <p className="display-6 fw-bold mb-0">{totalInitiatives}</p>
          </div>
        </div>
      </div>

      <div className="col-12 col-md-4">
        <div className="card h-100 border-0 bg-light">
          <div className="card-body">
            <p className="text-secondary mb-1">Resultados visibles</p>
            <p className="display-6 fw-bold mb-0">{visibleInitiatives}</p>
          </div>
        </div>
      </div>

      <div className="col-12 col-md-4">
        <div className="card h-100 border-0 bg-light">
          <div className="card-body">
            <p className="text-secondary mb-1">Favoritas guardadas</p>
            <p className="display-6 fw-bold mb-0">{totalFavorites}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
