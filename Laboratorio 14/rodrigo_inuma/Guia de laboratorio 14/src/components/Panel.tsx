
import type { ReactNode } from 'react';
import { MODES, type Mode } from '../contract';

interface PanelProps {
  mode: Mode;
  onModeChange: (mode: Mode) => void;
  onRefresh: () => void;
  onCancel: () => void;
  loading: boolean;
  children: ReactNode;
}

function Panel({
  mode,
  onModeChange,
  onRefresh,
  onCancel,
  loading,
  children,
}: PanelProps) {
  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <span className="eyebrow">LABORATORIO DE CONSUMO REST</span>
          <h2>Comparador de herramientas</h2>
          <p>
            Prueba diferentes estrategias para consultar la API
            y compara sus resultados.
          </p>
        </div>

        <div className="panel-controls">
          <label htmlFor="modo-api">Escenario de respuesta</label>

          <select
            id="modo-api"
            value={mode}
            onChange={(event) =>
              onModeChange(event.target.value as Mode)
            }
          >
            {MODES.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>

          <div className="panel-actions">
            <button
              type="button"
              onClick={onRefresh}
              disabled={loading}
            >
              {loading ? 'Consultando...' : 'Actualizar'}
            </button>

            <button
              type="button"
              onClick={onCancel}
              disabled={!loading}
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>

      <div className="panel-content">
        {children}
      </div>
    </section>
  );
}

export default Panel;
