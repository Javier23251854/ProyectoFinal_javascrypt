
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('Aplicación Explorador de iniciativas', () => {
  it('muestra el título principal', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Explorador de iniciativas' })).toBeInTheDocument()
  })

  it('muestra las seis iniciativas inicialmente', () => {
    render(<App />)
    expect(screen.getAllByRole('article')).toHaveLength(6)
  })

  it('permite buscar por texto', () => {
    render(<App />)
    fireEvent.change(screen.getByLabelText('Buscar iniciativas'), {
      target: { value: 'bienestar' },
    })
    expect(screen.getAllByRole('article')).toHaveLength(1)
  })

  it('permite filtrar por categoría', () => {
    render(<App />)
    fireEvent.change(screen.getByLabelText('Categoría'), {
      target: { value: 'Datos' },
    })
    expect(screen.getAllByRole('article')).toHaveLength(2)
  })

  it('permite agregar una iniciativa a favoritas', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', {
      name: 'Agregar a favoritas: Portal de bienestar estudiantil',
    }))
    expect(screen.getByText('Favoritas guardadas').parentElement)
      .toHaveTextContent('1')
  })

  it('permite mostrar solo las favoritas', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', {
      name: 'Agregar a favoritas: Portal de bienestar estudiantil',
    }))
    fireEvent.click(screen.getByLabelText('Solo favoritas'))
    expect(screen.getAllByRole('article')).toHaveLength(1)
  })

  it('muestra un mensaje si no hay resultados', () => {
    render(<App />)
    fireEvent.change(screen.getByLabelText('Buscar iniciativas'), {
      target: { value: 'xyz-no-existe' },
    })
    expect(screen.getByRole('status')).toHaveTextContent(
      'No se encontraron iniciativas',
    )
  })

  it('permite limpiar los filtros', () => {
    render(<App />)
    fireEvent.change(screen.getByLabelText('Buscar iniciativas'), {
      target: { value: 'xyz-no-existe' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Limpiar filtros' }))
    expect(screen.getAllByRole('article')).toHaveLength(6)
  })
})
