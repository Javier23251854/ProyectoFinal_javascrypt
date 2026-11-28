
import type {
  Initiative,
  InitiativeFilters,
} from '../types/initiative'

export function filterInitiatives(
  initiatives: readonly Initiative[],
  filters: InitiativeFilters,
  favoriteIds: ReadonlySet<number>,
): Initiative[] {
  const normalizedQuery = filters.query.trim().toLowerCase()

  return initiatives.filter((initiative) => {
    const matchesQuery =
      normalizedQuery === '' ||
      [
        initiative.title,
        initiative.description,
        initiative.category,
        ...initiative.skills,
      ]
        .join(' ')
        .toLowerCase()
        .includes(normalizedQuery)

    const matchesCategory =
      filters.category === 'Todas' ||
      initiative.category === filters.category

    const matchesFavorites =
      !filters.onlyFavorites || favoriteIds.has(initiative.id)

    return matchesQuery && matchesCategory && matchesFavorites
  })
}

export function toggleFavorite(
  favoriteIds: ReadonlySet<number>,
  id: number,
): Set<number> {
  const nextFavorites = new Set(favoriteIds)

  if (nextFavorites.has(id)) {
    nextFavorites.delete(id)
  } else {
    nextFavorites.add(id)
  }

  return nextFavorites
}
