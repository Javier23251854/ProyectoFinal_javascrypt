
import { useState } from 'react'
import { Hero } from './components/Hero'
import { FilterBar } from './components/FilterBar'
import { InitiativeCard } from './components/InitiativeCard'
import { SummaryPanel } from './components/SummaryPanel'
import { EmptyState } from './components/EmptyState'
import { INITIATIVES } from './data/initiatives'
import type {
  CategoryFilter,
  InitiativeFilters,
} from './types/initiative'
import { filterInitiatives, toggleFavorite } from './utils/filterInitiatives'

const INITIAL_FILTERS: InitiativeFilters = {
  query: '',
  category: 'Todas',
  onlyFavorites: false,
}

function App() {
  const [filters, setFilters] = useState<InitiativeFilters>(INITIAL_FILTERS)
  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(
    () => new Set<number>(),
  )

  const visibleInitiatives = filterInitiatives(
    INITIATIVES,
    filters,
    favoriteIds,
  )

  function clearFilters() {
    setFilters(INITIAL_FILTERS)
  }

  function handleCategoryChange(category: CategoryFilter) {
    setFilters((current) => ({ ...current, category }))
  }

  function handleToggleFavorite(id: number) {
    setFavoriteIds((current) => toggleFavorite(current, id))
  }

  return (
    <>
      <Hero />

      <main className="container py-4">
        <SummaryPanel
          totalInitiatives={INITIATIVES.length}
          visibleInitiatives={visibleInitiatives.length}
          totalFavorites={favoriteIds.size}
        />

        <FilterBar
          query={filters.query}
          category={filters.category}
          onlyFavorites={filters.onlyFavorites}
          onQueryChange={(query) =>
            setFilters((current) => ({ ...current, query }))
          }
          onCategoryChange={handleCategoryChange}
          onOnlyFavoritesChange={(onlyFavorites) =>
            setFilters((current) => ({ ...current, onlyFavorites }))
          }
        />

        {visibleInitiatives.length > 0 ? (
          <section
            className="row g-4"
            aria-label="Listado de iniciativas"
            aria-live="polite"
          >
            {visibleInitiatives.map((initiative) => (
              <div className="col-12 col-md-6 col-lg-4" key={initiative.id}>
                <InitiativeCard
                  initiative={initiative}
                  isFavorite={favoriteIds.has(initiative.id)}
                  onToggleFavorite={handleToggleFavorite}
                />
              </div>
            ))}
          </section>
        ) : (
          <EmptyState onClearFilters={clearFilters} />
        )}
      </main>

      <footer className="border-top py-3 mt-5">
        <div className="container text-secondary small">
          Explorador de iniciativas · Laboratorio de JavaScript Avanzado
        </div>
      </footer>
    </>
  )
}

export default App
