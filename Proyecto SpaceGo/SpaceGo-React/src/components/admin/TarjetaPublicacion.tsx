import type { Alojamiento } from "../../models/alojamiento";
import {
  IMAGEN_POR_DEFECTO,
  estaActivo,
  etiquetaTipo,
  formatearPrecio,
  formatearFecha
} from "./utilidades";

interface TarjetaPublicacionProps {
  publicacion: Alojamiento;
  ocupado: boolean;
  onVer: (a: Alojamiento) => void;
  onEditar: (a: Alojamiento) => void;
  onAlternarEstado: (a: Alojamiento) => void;
  onEliminar: (a: Alojamiento) => void;
}

function TarjetaPublicacion({
  publicacion,
  ocupado,
  onVer,
  onEditar,
  onAlternarEstado,
  onEliminar
}: TarjetaPublicacionProps) {
  const activo = estaActivo(publicacion);

  return (
    <article className={`admin-card ${activo ? "" : "admin-card-inactiva"}`}>
      <div className="admin-card-imagen">
        <img
          src={publicacion.imagen || IMAGEN_POR_DEFECTO}
          alt={publicacion.titulo}
          onError={(e) => {
            const img = e.currentTarget;
            if (!img.src.endsWith(IMAGEN_POR_DEFECTO)) img.src = IMAGEN_POR_DEFECTO;
          }}
        />
        <span className={`admin-badge ${activo ? "admin-badge-activa" : "admin-badge-inactiva"}`}>
          {activo ? "Activa" : "Desactivada"}
        </span>
      </div>

      <div className="admin-card-cuerpo">
        <span className="admin-card-tipo">{etiquetaTipo(publicacion.tipo)}</span>
        <h3>{publicacion.titulo}</h3>
        <p className="admin-card-ubicacion">
          {publicacion.distrito}, {publicacion.provincia}
        </p>
        <p className="admin-card-precio">
          {formatearPrecio(publicacion.precio)} <small>/ mes</small>
        </p>
        <p className="admin-card-fecha">Publicado el {formatearFecha(publicacion.fecha)}</p>
      </div>

      <div className="admin-card-acciones">
        <button type="button" className="admin-btn admin-btn-claro" onClick={() => onVer(publicacion)}>
          Ver
        </button>
        <button
          type="button"
          className="admin-btn admin-btn-claro"
          disabled={ocupado}
          onClick={() => onEditar(publicacion)}
        >
          Editar
        </button>
        <button
          type="button"
          className="admin-btn admin-btn-claro"
          disabled={ocupado}
          onClick={() => onAlternarEstado(publicacion)}
        >
          {activo ? "Desactivar" : "Activar"}
        </button>
        <button
          type="button"
          className="admin-btn admin-btn-peligro"
          disabled={ocupado}
          onClick={() => onEliminar(publicacion)}
        >
          Eliminar
        </button>
      </div>
    </article>
  );
}

export default TarjetaPublicacion;
