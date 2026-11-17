import type { Alojamiento } from "../../models/alojamiento";
import Modal from "./Modal";
import {
  IMAGEN_POR_DEFECTO,
  estaActivo,
  etiquetaTipo,
  formatearPrecio,
  formatearFecha
} from "./utilidades";

interface DetallePublicacionProps {
  publicacion: Alojamiento;
  onCerrar: () => void;
}

function DetallePublicacion({ publicacion, onCerrar }: DetallePublicacionProps) {
  const activo = estaActivo(publicacion);

  return (
    <Modal titulo="Detalle de la publicación" onCerrar={onCerrar}>
      <img
        className="admin-detalle-imagen"
        src={publicacion.imagen || IMAGEN_POR_DEFECTO}
        alt={publicacion.titulo}
        onError={(e) => {
          const img = e.currentTarget;
          if (!img.src.endsWith(IMAGEN_POR_DEFECTO)) img.src = IMAGEN_POR_DEFECTO;
        }}
      />

      <h3 className="admin-detalle-titulo">{publicacion.titulo}</h3>

      <dl className="admin-detalle-datos">
        <div><dt>Tipo</dt><dd>{etiquetaTipo(publicacion.tipo)}</dd></div>
        <div><dt>Precio</dt><dd>{formatearPrecio(publicacion.precio)} / mes</dd></div>
        <div><dt>Departamento</dt><dd>{publicacion.departamento}</dd></div>
        <div><dt>Provincia</dt><dd>{publicacion.provincia}</dd></div>
        <div><dt>Distrito</dt><dd>{publicacion.distrito}</dd></div>
        <div><dt>Publicado</dt><dd>{formatearFecha(publicacion.fecha)}</dd></div>
        <div><dt>Estado</dt><dd>{activo ? "Activa" : "Desactivada"}</dd></div>
      </dl>

      <p className="admin-detalle-descripcion">{publicacion.descripcion}</p>

      <div className="admin-modal-pie">
        <button type="button" className="admin-btn admin-btn-claro" onClick={onCerrar}>
          Cerrar
        </button>
      </div>
    </Modal>
  );
}

export default DetallePublicacion;
