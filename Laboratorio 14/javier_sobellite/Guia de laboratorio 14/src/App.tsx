
import { useState } from 'react';

import './App.css';

import Panel from './components/Panel';
import Station from './components/Station';
import ReservationResult from './components/ReservationResult';

import useStations from './hooks/useStations';

import { clients } from './services';
import { type Mode } from './contract';

function App() {
  const [mode, setMode] = useState<Mode>('normal');

  const {
    stations,
    refresh,
    cancel,
    reserve,
    receipt,
    reservationError,
    reservationLoading,
    reserving,
  } = useStations(mode);

  const loading = stations.some((station) => station.loading);

  return (
    <div className="app">
      <header className="site-header">
        <div className="header-content">
          <div className="brand">
            <span className="brand-mark">T</span>
            <span>TechLab</span>
          </div>

          <span className="header-label">
            Laboratorio de Desarrollo Web
          </span>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="hero-content">
            <span className="eyebrow">
              REACT · SERVICIOS REST
            </span>

            <h1>
              Comparador de herramientas
              <br />
              para consumir APIs REST
            </h1>

            <p>
              Explora y compara siete estrategias para realizar
              solicitudes HTTP, gestionar respuestas y registrar
              reservas.
            </p>

            <div className="hero-tags">
              <span>7 herramientas</span>
              <span>API REST local</span>
              <span>Pruebas en tiempo real</span>
            </div>
          </div>
        </section>

        <div className="main-content">
          <Panel
            mode={mode}
            onModeChange={setMode}
            onRefresh={() => void refresh()}
            onCancel={cancel}
            loading={loading}
          >
            <div className="stations-grid">
              {stations.map((station, index) => (
                <Station
                  key={station.name}
                  name={station.name}
                  loading={station.loading}
                  duration={station.duration}
                  error={station.error}
                  workshops={station.workshops}
                  onReserve={(workshop) =>
                    void reserve(clients[index], workshop)
                  }
                  reserving={reserving}
                />
              ))}
            </div>
          </Panel>

          <ReservationResult
            receipt={receipt}
            error={reservationError}
            loading={reservationLoading}
          />
        </div>
      </main>

      <footer className="site-footer">
        <p>
          TechLab · Consumo de servicios REST con React y TypeScript
        </p>
      </footer>
    </div>
  );
}

export default App;
