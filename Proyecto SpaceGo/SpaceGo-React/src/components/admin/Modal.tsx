import { useEffect } from "react";
import type { ReactNode } from "react";

interface ModalProps {
  titulo: string;
  onCerrar: () => void;
  children: ReactNode;
}

function Modal({ titulo, onCerrar, children }: ModalProps) {
  // Cerrar con la tecla Escape
  useEffect(() => {
    const alPresionar = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCerrar();
    };

    document.addEventListener("keydown", alPresionar);
    return () => document.removeEventListener("keydown", alPresionar);
  }, [onCerrar]);

  return (
    <div className="admin-overlay" onClick={onCerrar}>
      <div
        className="admin-modal"
        role="dialog"
        aria-modal="true"
        aria-label={titulo}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="admin-modal-header">
          <h2>{titulo}</h2>
          <button
            type="button"
            className="admin-modal-cerrar"
            aria-label="Cerrar"
            onClick={onCerrar}
          >
            &times;
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}

export default Modal;
