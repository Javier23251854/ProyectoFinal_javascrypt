import { useMemo, useRef, useState } from "react";
import { ComparacionProvider, useComparacion } from "../context/ComparacionContext";
import { useAlojamientos } from "../hooks/useAlojamientos";
import type { Alojamiento } from "../models/alojamiento";
import "./CompararAlojamientos.css";

const nombresTipo: Record<string, string> = {
  individual: "Habitación individual",
  pareja: "Espacio para pareja",
  minidepa: "Minidepartamento",
  departamento: "Departamento"
};

function formatearPrecio(precio: number) {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    maximumFractionDigits: 0
  }).format(precio);
}

function formatearFecha(fecha: string) {
  if (!fecha) return "No especificada";

  const [anio, mes, dia] = fecha.split("-").map(Number);
  return new Date(anio, mes - 1, dia).toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

function obtenerServicios(alojamiento: Alojamiento) {
  return alojamiento.servicios ?? alojamiento.incluye ?? [];
}

function TarjetaAlojamiento({ alojamiento }: { alojamiento: Alojamiento }) {
  const { idsSeleccionados, alternarAlojamiento } = useComparacion();
  const seleccionado = idsSeleccionados.includes(String(alojamiento.id));
  const limiteAlcanzado = idsSeleccionados.length >= 3 && !seleccionado;
  const servicios = obtenerServicios(alojamiento);

  return (
    <article className={`comparar-tarjeta ${seleccionado ? "seleccionada" : ""}`}>
      <div className="comparar-imagen-contenedor">
        <img
          src={alojamiento.imagen || "/Imagenes/alojamiento.jpg"}
          alt={alojamiento.titulo}
          onError={(evento) => {
            evento.currentTarget.onerror = null;
            evento.currentTarget.src = "/Imagenes/alojamiento.jpg";
          }}
        />
        <span className="comparar-tipo">{nombresTipo[alojamiento.tipo] ?? alojamiento.tipo}</span>
        {seleccionado && <span className="comparar-etiqueta-seleccionada"><i className="fa-solid fa-check" /> Seleccionado</span>}
      </div>

      <div className="comparar-tarjeta-contenido">
        <div className="comparar-ubicacion">
          <i className="fa-solid fa-location-dot" />
          {alojamiento.distrito}, {alojamiento.provincia}
        </div>

        <h3>{alojamiento.titulo}</h3>
        <p className="comparar-descripcion">{alojamiento.descripcion}</p>

        <div className="comparar-servicios">
          {servicios.length > 0 ? servicios.slice(0, 3).map((servicio) => (
            <span key={servicio}>{servicio}</span>
          )) : <span>Servicios no especificados</span>}
        </div>

        <div className="comparar-tarjeta-pie">
          <div className="comparar-precio">
            <strong>{formatearPrecio(alojamiento.precio)}</strong>
            <span>por mes</span>
          </div>
          <button
            type="button"
            className={`comparar-agregar ${seleccionado ? "quitar" : ""}`}
            disabled={limiteAlcanzado}
            onClick={() => alternarAlojamiento(alojamiento)}
          >
            <i className={`fa-solid ${seleccionado ? "fa-check" : "fa-plus"}`} />
            {seleccionado ? "En comparación" : limiteAlcanzado ? "Límite alcanzado" : "Comparar"}
          </button>
        </div>
      </div>
    </article>
  );
}

function TablaComparacion({ alojamientos }: { alojamientos: Alojamiento[] }) {
  const { quitarAlojamiento } = useComparacion();

  const filas = [
    {
      nombre: "Precio mensual",
      valor: (alojamiento: Alojamiento) => formatearPrecio(alojamiento.precio),
      destacada: true
    },
    {
      nombre: "Tipo de alojamiento",
      valor: (alojamiento: Alojamiento) => nombresTipo[alojamiento.tipo] ?? alojamiento.tipo
    },
    {
      nombre: "Ubicación",
      valor: (alojamiento: Alojamiento) => `${alojamiento.distrito}, ${alojamiento.provincia}, ${alojamiento.departamento}`
    },
    {
      nombre: "Servicios mencionados",
      valor: (alojamiento: Alojamiento) => obtenerServicios(alojamiento).join(", ") || "No especificados"
    },
    {
      nombre: "Características",
      valor: (alojamiento: Alojamiento) => alojamiento.caracteristicas?.join(", ") || alojamiento.descripcion || "No especificadas"
    },
    {
      nombre: "Fecha de publicación",
      valor: (alojamiento: Alojamiento) => formatearFecha(alojamiento.fecha)
    }
  ];

  return (
    <div className="comparar-tabla-contenedor">
      <table className="comparar-tabla">
        <thead>
          <tr>
            <th scope="col">Características</th>
            {alojamientos.map((alojamiento) => (
              <th scope="col" key={alojamiento.id}>
                <div className="comparar-columna-titulo">
                  <img src={alojamiento.imagen || "/Imagenes/alojamiento.jpg"} alt="" />
                  <div>
                    <strong>{alojamiento.titulo}</strong>
                    <button type="button" onClick={() => quitarAlojamiento(alojamiento.id)}>
                      <i className="fa-solid fa-xmark" /> Quitar
                    </button>
                  </div>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filas.map((fila) => (
            <tr key={fila.nombre}>
              <th scope="row">{fila.nombre}</th>
              {alojamientos.map((alojamiento) => (
                <td className={"destacada" in fila && fila.destacada ? "valor-destacado" : ""} key={alojamiento.id}>
                  {fila.valor(alojamiento)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ContenidoComparacion({
  alojamientos,
  cargando,
  modoDemostracion,
  error
}: {
  alojamientos: Alojamiento[];
  cargando: boolean;
  modoDemostracion: boolean;
  error: string;
}) {
  const [busqueda, setBusqueda] = useState("");
  const [tipo, setTipo] = useState("todos");
  const [orden, setOrden] = useState("relevancia");
  const campoBusqueda = useRef<HTMLInputElement>(null);
  const {
    idsSeleccionados,
    alojamientosSeleccionados,
    mensaje,
    limpiarComparacion
  } = useComparacion();

  const resultados = useMemo(() => {
    const termino = busqueda.trim().toLocaleLowerCase("es");
    const filtrados = alojamientos.filter((alojamiento) => {
      const coincideTexto = [
        alojamiento.titulo,
        alojamiento.distrito,
        alojamiento.provincia,
        alojamiento.departamento,
        alojamiento.descripcion
      ].join(" ").toLocaleLowerCase("es").includes(termino);
      const coincideTipo = tipo === "todos" || alojamiento.tipo === tipo;

      return coincideTexto && coincideTipo;
    });

    if (orden === "precio-menor") {
      filtrados.sort((a, b) => a.precio - b.precio);
    } else if (orden === "precio-mayor") {
      filtrados.sort((a, b) => b.precio - a.precio);
    } else if (orden === "recientes") {
      filtrados.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
    }

    return filtrados;
  }, [alojamientos, busqueda, tipo, orden]);

  const limpiarFiltros = () => {
    setBusqueda("");
    setTipo("todos");
    setOrden("relevancia");
    campoBusqueda.current?.focus();
  };

  return (
    <section className="comparar-pagina">
      <section className="comparar-hero">
        <div className="comparar-hero-contenido">
          <span className="comparar-sobretitulo"><i className="fa-solid fa-scale-balanced" /> Encuentra tu mejor opción</span>
          <h1>Compara alojamientos</h1>
          <p>Revisa precios, ubicación, servicios y características antes de elegir dónde vivir.</p>
        </div>
        <div className="comparar-contador">
          <strong>{idsSeleccionados.length}<span>/3</span></strong>
          <small>alojamientos seleccionados</small>
        </div>
      </section>

      <section className="comparar-seccion-tabla" aria-live="polite">
        <div className="comparar-seccion-encabezado">
          <div>
            <span className="comparar-seccion-etiqueta">TU SELECCIÓN</span>
            <h2>Comparación lado a lado</h2>
            <p>Selecciona entre 2 y 3 alojamientos para revisar sus diferencias.</p>
          </div>
          {idsSeleccionados.length > 0 && (
            <button type="button" className="comparar-vaciar" onClick={limpiarComparacion}>
              <i className="fa-regular fa-trash-can" /> Limpiar selección
            </button>
          )}
        </div>

        {mensaje && <p className="comparar-mensaje" role="alert">{mensaje}</p>}

        {alojamientosSeleccionados.length >= 2 ? (
          <TablaComparacion alojamientos={alojamientosSeleccionados} />
        ) : (
          <div className="comparar-guia">
            <div className="comparar-guia-icono"><i className="fa-solid fa-scale-balanced" /></div>
            <div>
              <h3>{alojamientosSeleccionados.length === 1 ? "Agrega otro alojamiento" : "Empieza tu comparación"}</h3>
              <p>
                {alojamientosSeleccionados.length === 1
                  ? `Ya seleccionaste “${alojamientosSeleccionados[0].titulo}”. Elige una segunda opción para comparar sus detalles.`
                  : "Agrega dos o tres alojamientos desde las tarjetas para ver sus precios, ubicaciones y servicios en una sola tabla."}
              </p>
            </div>
          </div>
        )}
      </section>

      <section className="comparar-contenido">
        <form className="comparar-filtros" onSubmit={(evento) => evento.preventDefault()}>
          <div className="comparar-campo comparar-campo-busqueda">
            <label htmlFor="buscar-alojamiento">Buscar alojamiento</label>
            <div className="comparar-input-icono">
              <i className="fa-solid fa-magnifying-glass" />
              <input
                ref={campoBusqueda}
                id="buscar-alojamiento"
                type="search"
                value={busqueda}
                onChange={(evento) => setBusqueda(evento.target.value)}
                placeholder="Nombre, distrito o ciudad"
              />
            </div>
          </div>

          <div className="comparar-campo">
            <label htmlFor="filtrar-tipo">Tipo de alojamiento</label>
            <select id="filtrar-tipo" value={tipo} onChange={(evento) => setTipo(evento.target.value)}>
              <option value="todos">Todos los tipos</option>
              <option value="individual">Habitación individual</option>
              <option value="pareja">Espacio para pareja</option>
              <option value="minidepa">Minidepartamento</option>
              <option value="departamento">Departamento</option>
            </select>
          </div>

          <div className="comparar-campo">
            <label htmlFor="ordenar-alojamientos">Ordenar por</label>
            <select id="ordenar-alojamientos" value={orden} onChange={(evento) => setOrden(evento.target.value)}>
              <option value="relevancia">Recomendados</option>
              <option value="precio-menor">Menor precio</option>
              <option value="precio-mayor">Mayor precio</option>
              <option value="recientes">Más recientes</option>
            </select>
          </div>

          <button type="button" className="comparar-limpiar-filtros" onClick={limpiarFiltros}>
            <i className="fa-solid fa-rotate-left" /> Limpiar
          </button>
        </form>

        {modoDemostracion && !cargando && (
          <div className="comparar-aviso" role="status">
            <i className="fa-solid fa-circle-info" />
            No se pudo conectar con el servidor. Se muestran alojamientos de muestra para que puedas probar la comparación.
          </div>
        )}

        {error && <div className="comparar-aviso comparar-aviso-error" role="alert">{error}</div>}

        <section className="comparar-listado">
          <div className="comparar-seccion-encabezado">
            <div>
              <span className="comparar-seccion-etiqueta">SPACEGO</span>
              <h2>Alojamientos disponibles</h2>
            </div>
            <span className="comparar-total">{resultados.length} {resultados.length === 1 ? "resultado" : "resultados"}</span>
          </div>

          {cargando ? (
            <div className="comparar-estado"><i className="fa-solid fa-spinner fa-spin" /> Cargando alojamientos...</div>
          ) : resultados.length > 0 ? (
            <div className="comparar-grid">
              {resultados.map((alojamiento) => (
                <TarjetaAlojamiento key={alojamiento.id} alojamiento={alojamiento} />
              ))}
            </div>
          ) : (
            <div className="comparar-vacio">
              <i className="fa-solid fa-house-circle-exclamation" />
              <h3>No encontramos alojamientos</h3>
              <p>Prueba con otro nombre, ubicación o tipo de espacio.</p>
              <button type="button" onClick={limpiarFiltros}>Ver todos los alojamientos</button>
            </div>
          )}
        </section>


      </section>
    </section>
  );
}

function CompararAlojamientos() {
  const { alojamientos, cargando, modoDemostracion, error } = useAlojamientos();

  return (
    <ComparacionProvider alojamientos={alojamientos}>
      <ContenidoComparacion
        alojamientos={alojamientos}
        cargando={cargando}
        modoDemostracion={modoDemostracion}
        error={error}
      />
    </ComparacionProvider>
  );
}

export default CompararAlojamientos;
