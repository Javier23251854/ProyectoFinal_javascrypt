
import { CATEGORIES } from '../types/initiative'
import type { CategoryFilter } from '../types/initiative'

interface FilterBarProps {
  query: string
  category: CategoryFilter
  onlyFavorites: boolean
  onQueryChange: (query: string) => void
  onCategoryChange: (category: CategoryFilter) => void
  onOnlyFavoritesChange: (onlyFavorites: boolean) => void
}

export function FilterBar({
  query,
  category,
  onlyFavorites,
  onQueryChange,
  onCategoryChange,
  onOnlyFavoritesChange,
}: FilterBarProps) {
  return (
    <section className="card shadow-sm mb-4" aria-label="Filtros de iniciativas">
      <div className="card-body">
        <div className="row g-3 align-items-end">
          <div className="col-12 col-md-5">
            <label htmlFor="search" className="form-label">
              Buscar iniciativas
            </label>
            <input
              id="search"
              type="search"
              className="form-control"
              placeholder="Título, descripción o habilidad..."
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
            />
          </div>

          <div className="col-12 col-md-4">
            <label htmlFor="category" className="form-label">
              Categoría
            </label>
            <select
              id="category"
              className="form-select"
              value={category}
              onChange={(event) =>
                onCategoryChange(event.target.value as CategoryFilter)
              }
            >
              <option value="Todas">Todas las categorías</option>
              {CATEGORIES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="col-12 col-md-3">
            <div className="form-check mb-2">
              <input
                id="onlyFavorites"
                type="checkbox"
                className="form-check-input"
                checked={onlyFavorites}
                onChange={(event) =>
                  onOnlyFavoritesChange(event.target.checked)
                }
              />
              <label htmlFor="onlyFavorites" className="form-check-label">
                Solo favoritas
              </label>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
