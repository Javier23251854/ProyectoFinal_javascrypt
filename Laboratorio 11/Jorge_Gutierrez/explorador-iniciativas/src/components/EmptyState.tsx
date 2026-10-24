
interface EmptyStateProps {
  onClearFilters: () => void
}

export function EmptyState({ onClearFilters }: EmptyStateProps) {
  return (
    <div className="text-center py-5" role="status">
      <h2 className="h4">No se encontraron iniciativas</h2>

      <p className="text-secondary">
        Prueba con otra búsqueda o modifica los filtros seleccionados.
      </p>

      <button
        type="button"
        className="btn btn-outline-primary"
        onClick={onClearFilters}
      >
        Limpiar filtros
      </button>
    </div>
  )
}
