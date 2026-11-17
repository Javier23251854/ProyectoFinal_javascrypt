import { createContext, useContext } from "react";

export type TipoNotificacion = "exito" | "error";

export interface NotificacionContextValue {
  notificar: (texto: string, tipo?: TipoNotificacion) => void;
}

export const NotificacionContext = createContext<NotificacionContextValue | null>(null);

// Hook propio para consumir el contexto (useContext)
export function useNotificacion(): NotificacionContextValue {
  const contexto = useContext(NotificacionContext);

  if (!contexto) {
    throw new Error("useNotificacion debe usarse dentro de NotificacionProvider");
  }

  return contexto;
}
