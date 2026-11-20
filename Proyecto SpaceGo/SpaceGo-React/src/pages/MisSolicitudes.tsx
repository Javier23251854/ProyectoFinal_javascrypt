
import { useEffect, useMemo, useState } from "react";
import axios from "axios";

import {
  cancelarSolicitud,
  obtenerMisSolicitudes,
  type EstadoSolicitud,
  type Solicitud
} from "../services/solicitudesService";

import "./MisSolicitudes.css";

type FiltroSolicitud = "todas" | EstadoSolicitud;

const nombresEstado: Record<EstadoSolicitud, string> = {
  pendiente: "Pendiente",
  en_revision: "En revisión",
  aceptada: "Aceptada",
  rechazada: "Rechazada",
  cancelada: "Cancelada"
};

function obtenerMensajeError(error: unknown): string {
  if (axios.isAxiosError<{ mensaje?: string }>(error)) {
    return (
      error.response?.data?.mensaje ??
      "No se pudo completar la operación. Inténtalo nuevamente."
    );
  }

  return "Ocurrió un error inesperado.";
}

function mostrarFecha(fecha: string): string {
  const valor = new Date(fecha);

  if (Number.isNaN(valor.getTime())) {
    return "Fecha no disponible";
  }

  return new Intl.DateTimeFormat("es-PE", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(valor);
}

function mostrarPrecio(precio?: number | string): string {
  if (precio === undefined || precio === null || precio === "") {
    return "Consultar precio";
  }

  const valor = Number(precio);

  if (!Number.isFinite(valor)) {
    return "Consultar precio";
  }

  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN"
  }).format(valor) + " / mes";
}

function MisSolicitudes() {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [filtro, setFiltro] = useState<FiltroSolicitud>("todas");
  const [busqueda, setBusqueda] = useState("");
  const [recarga, setRecarga] = useState(0);
  const [cancelandoId, setCancelandoId] = useState<string | null>(null);

  useEffect(() => {
    const controlador = new AbortController();

    setCargando(true);
    setError("");

    obtenerMisSolicitudes(controlador.signal)
      .then(datos => {
        if (!controlador.signal.aborted) {
          setSolicitudes(datos);
        }
      })
      .catch(error => {
        if (!controlador.signal.aborted) {
          setError(obtenerMensajeError(error));
        }
      })
      .finally(() => {
        if (!controlador.signal.aborted) {
          setCargando(false);
        }
      });

    return () => controlador.abort();
  }, [recarga]);

  const solicitudesFiltradas = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();

    return solicitudes.filter(solicitud => {
      const coincideEstado =
        filtro === "todas" || solicitud.estado === filtro;

      const alojamiento = solicitud.alojamiento;

      const texto = [
        alojamiento?.titulo,
        alojamiento?.distrito,
        alojamiento?.provincia,
        alojamiento?.departamento,
        solicitud.mensaje,
        solicitud.tipo,
        solicitud.nombre,
        solicitud.correo,
        solicitud.categoria
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const coincideBusqueda =
        !termino || texto.includes(termino);

      return coincideEstado && coincideBusqueda;
    });
  }, [solicitudes, filtro, busqueda]);

  async function manejarCancelacion(solicitud: Solicitud) {
    if (solicitud.estado !== "pendiente") return;

    const confirmar = window.confirm(
      "¿Estás seguro de que deseas cancelar esta solicitud?"
    );

    if (!confirmar) return;

    setCancelandoId(solicitud.id);
    setError("");

    try {
      const actualizada = await cancelarSolicitud(solicitud.id);

      setSolicitudes(actuales =>
        actuales.map(item =>
          item.id === solicitud.id ? actualizada : item
        )
      );
    } catch (error) {
      setError(obtenerMensajeError(error));
    } finally {
      setCancelandoId(null);
    }
  }

  return (
    <section className="pagina-solicitudes">
      <header className="solicitudes-encabezado">
        <div>
          <span className="solicitudes-etiqueta">
            TU ACTIVIDAD
          </span>

          <h1>Mis solicitudes</h1>

          <p>
            Consulta tus solicitudes de alojamiento y las consultas
            que hayas enviado al Centro de ayuda.
          </p>
        </div>

        <button
          type="button"
          className="solicitudes-actualizar"
          onClick={() => setRecarga(valor => valor + 1)}
          disabled={cargando}
        >
          <i className="fa-solid fa-rotate" aria-hidden="true"></i>
          Actualizar
        </button>
      </header>

      <div className="solicitudes-resumen">
        <div>
          <span>Total de solicitudes</span>
          <strong>{solicitudes.length}</strong>
        </div>

        <div>
          <span>Pendientes</span>
          <strong>
            {solicitudes.filter(item => item.estado === "pendiente").length}
          </strong>
        </div>

        <div>
          <span>Aceptadas</span>
          <strong>
            {solicitudes.filter(item => item.estado === "aceptada").length}
          </strong>
        </div>
      </div>

      <div className="solicitudes-filtros">
        <div className="solicitudes-busqueda">
          <i className="fa-solid fa-magnifying-glass" aria-hidden="true"></i>

          <input
            type="search"
            value={busqueda}
            onChange={event => setBusqueda(event.target.value)}
            placeholder="Buscar por alojamiento, categoría o mensaje..."
            aria-label="Buscar solicitudes"
          />
        </div>

        <select
          value={filtro}
          onChange={event =>
            setFiltro(event.target.value as FiltroSolicitud)
          }
          aria-label="Filtrar por estado"
        >
          <option value="todas">Todos los estados</option>
          <option value="pendiente">Pendientes</option>
          <option value="en_revision">En revisión</option>
          <option value="aceptada">Aceptadas</option>
          <option value="rechazada">Rechazadas</option>
          <option value="cancelada">Canceladas</option>
        </select>
      </div>

      {error && (
        <div className="solicitudes-error" role="alert">
          <i className="fa-solid fa-circle-exclamation" aria-hidden="true"></i>
          {error}
        </div>
      )}

      {cargando ? (
        <div className="solicitudes-estado" role="status">
          <i className="fa-solid fa-spinner fa-spin" aria-hidden="true"></i>
          Cargando tus solicitudes...
        </div>
      ) : solicitudesFiltradas.length === 0 ? (
        <div className="solicitudes-vacio">
          <div className="solicitudes-vacio-icono">
            <i className="fa-regular fa-folder-open" aria-hidden="true"></i>
          </div>

          <h2>
            {solicitudes.length === 0
              ? "Todavía no tienes solicitudes"
              : "No encontramos solicitudes"}
          </h2>

          <p>
            {solicitudes.length === 0
              ? "Cuando contactes a un propietario, solicites un alquiler o envíes una consulta al Centro de ayuda, aparecerá aquí."
              : "Prueba cambiando el filtro o el texto de búsqueda."}
          </p>

          {solicitudes.length === 0 && (
            <a href="/buscar" className="solicitudes-boton-enlace">
              <i className="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
              Buscar alojamientos
            </a>
          )}
        </div>
      ) : (
        <div className="solicitudes-lista">
          {solicitudesFiltradas.map(solicitud => {
            const alojamiento = solicitud.alojamiento;
            const esAyuda = solicitud.tipo === "ayuda";

            const imagen =
              alojamiento?.imagen || "/Imagenes/alojamiento.jpg";

            return (
              <article className="solicitud-card" key={solicitud.id}>
                <div className="solicitud-card-contenido">
                  {!esAyuda && (
                    <img
                      className="solicitud-imagen"
                      src={imagen}
                      alt={alojamiento?.titulo ?? "Alojamiento"}
                      onError={event => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src = "/Imagenes/alojamiento.jpg";
                      }}
                    />
                  )}

                  <div className="solicitud-informacion">
                    <div className="solicitud-superior">
                      <span className={`solicitud-estado estado-${solicitud.estado}`}>
                        {nombresEstado[solicitud.estado]}
                      </span>

                      <span className="solicitud-fecha">
                        {mostrarFecha(solicitud.fecha)}
                      </span>
                    </div>

                    {esAyuda ? (
                      <>
                        <h2>Consulta del Centro de ayuda</h2>

                        <p className="solicitud-ubicacion">
                          <i className="fa-solid fa-circle-question" aria-hidden="true"></i>
                          {solicitud.categoria || "Consulta general"}
                        </p>

                        {solicitud.nombre && (
                          <p className="solicitud-tipo">
                            <strong>Nombre:</strong> {solicitud.nombre}
                          </p>
                        )}

                        {solicitud.correo && (
                          <p className="solicitud-tipo">
                            <strong>Correo:</strong> {solicitud.correo}
                          </p>
                        )}

                        <div className="solicitud-tipo">
                          <strong>Tipo de solicitud:</strong>{" "}
                          Consulta de ayuda
                        </div>
                      </>
                    ) : (
                      <>
                        <h2>
                          {alojamiento?.titulo ?? "Alojamiento no disponible"}
                        </h2>

                        <p className="solicitud-ubicacion">
                          <i className="fa-solid fa-location-dot" aria-hidden="true"></i>
                          {[
                            alojamiento?.distrito,
                            alojamiento?.provincia,
                            alojamiento?.departamento
                          ].filter(Boolean).join(", ") || "Ubicación no disponible"}
                        </p>

                        <p className="solicitud-precio">
                          {mostrarPrecio(alojamiento?.precio)}
                        </p>

                        <div className="solicitud-tipo">
                          <strong>Tipo de solicitud:</strong>{" "}
                          {solicitud.tipo === "alquiler"
                            ? "Interés en alquilar"
                            : "Solicitud de información"}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="solicitud-mensaje">
                  <strong>
                    {esAyuda ? "Tu consulta" : "Tu mensaje"}
                  </strong>
                  <p>{solicitud.mensaje}</p>
                </div>

                <div className="solicitud-card-pie">
                  <span>
                    Código: {solicitud.id.slice(0, 8)}
                  </span>

                  {solicitud.estado === "pendiente" && (
                    <button
                      type="button"
                      className="solicitud-cancelar"
                      onClick={() => manejarCancelacion(solicitud)}
                      disabled={cancelandoId === solicitud.id}
                    >
                      {cancelandoId === solicitud.id
                        ? "Cancelando..."
                        : "Cancelar solicitud"}
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default MisSolicitudes;
