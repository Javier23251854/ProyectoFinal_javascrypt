import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { NotificacionContext } from "./NotificacionContext";
import type { TipoNotificacion } from "./NotificacionContext";

interface Aviso {
  texto: string;
  tipo: TipoNotificacion;
}

function NotificacionProvider({ children }: { children: ReactNode }) {
  const [aviso, setAviso] = useState<Aviso | null>(null);
  const temporizador = useRef<number | undefined>(undefined);

  const notificar = useCallback(
    (texto: string, tipo: TipoNotificacion = "exito") => {
      window.clearTimeout(temporizador.current);
      setAviso({ texto, tipo });
      temporizador.current = window.setTimeout(() => setAviso(null), 3500);
    },
    []
  );

  // Limpiar el temporizador al desmontar
  useEffect(() => {
    return () => window.clearTimeout(temporizador.current);
  }, []);

  const valor = useMemo(() => ({ notificar }), [notificar]);

  return (
    <NotificacionContext.Provider value={valor}>
      {children}

      {aviso && (
        <div
          className={`admin-toast admin-toast-${aviso.tipo}`}
          role="status"
          aria-live="polite"
        >
          {aviso.texto}
        </div>
      )}
    </NotificacionContext.Provider>
  );
}

export default NotificacionProvider;
