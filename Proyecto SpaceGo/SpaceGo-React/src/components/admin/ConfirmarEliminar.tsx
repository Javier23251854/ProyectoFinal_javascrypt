import type { Alojamiento } from "../../models/alojamiento";
import Modal from "./Modal";

interface ConfirmarEliminarProps {
  publicacion: Alojamiento;
  eliminando: boolean;
  onConfirmar: () => void;
  onCancelar: () => void;
}

function ConfirmarEliminar({
  publicacion,
  eliminando,
  onConfirmar,
  onCancelar
}: ConfirmarEliminarProps) {
  return (
    <Modal titulo="Eliminar publicación" onCerrar={onCancelar}>
      <p className="admin-confirmar-texto">
        ¿Seguro que deseas eliminar <strong>{publicacion.titulo}</strong>? Esta acción no se puede
        deshacer.
      </p>

      <div className="admin-modal-pie">
        <button
          type="button"
          className="admin-btn admin-btn-claro"
          onClick={onCancelar}
          disabled={eliminando}
        >
          Cancelar
        </button>
        <button
          type="button"
          className="admin-btn admin-btn-peligro-solido"
          onClick={onConfirmar}
          disabled={eliminando}
        >
          {eliminando ? "Eliminando..." : "Sí, eliminar"}
        </button>
      </div>
    </Modal>
  );
}

export default ConfirmarEliminar;
