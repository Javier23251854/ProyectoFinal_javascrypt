
import { describe, expect, it } from 'vitest'
import { INITIATIVES } from '../data/initiatives'
import type { InitiativeFilters } from '../types/initiative'
import {
  filterInitiatives,
  toggleFavorite,
} from '../utils/filterInitiatives'

const initialFilters: InitiativeFilters = {
  query: '',
  category: 'Todas',
  onlyFavorites: false,
}

describe('filterInitiatives', () => {
  it('devuelve las seis iniciativas sin filtros', () => {
    expect(
      filterInitiatives(INITIATIVES, initialFilters, new Set()),
    ).toHaveLength(6)
  })

  it('busca iniciativas por habilidad sin distinguir mayúsculas', () => {
    const filters: InitiativeFilters = {
      ...initialFilters,
      query: 'REACT',
    }

    expect(
      filterInitiatives(INITIATIVES, filters, new Set()),
    ).toHaveLength(2)
  })

  it('filtra por categoría', () => {
    const filters: InitiativeFilters = {
      ...initialFilters,
      category: 'Datos',
    }

    expect(
      filterInitiatives(INITIATIVES, filters, new Set()),
    ).toHaveLength(2)
  })

  it('muestra solo las favoritas cuando se activa el filtro', () => {
    const filters: InitiativeFilters = {
      ...initialFilters,
      onlyFavorites: true,
    }

    expect(
      filterInitiatives(INITIATIVES, filters, new Set([1, 3])),
    ).toHaveLength(2)
  })

  it('agrega y quita favoritos sin modificar el conjunto original', () => {
    const original = new Set([1])
    const added = toggleFavorite(original, 2)
    const removed = toggleFavorite(added, 1)

    expect([...original]).toEqual([1])
    expect([...added]).toEqual([1, 2])
    expect([...removed]).toEqual([2])
  })
})
