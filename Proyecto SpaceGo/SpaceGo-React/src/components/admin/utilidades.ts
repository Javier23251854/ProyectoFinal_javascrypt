import type { Alojamiento } from "../../models/alojamiento";

export const IMAGEN_POR_DEFECTO = "/Imagenes/logo-cuarto.png";

export const TIPOS = [
  { valor: "individual", etiqueta: "Habitación individual" },
  { valor: "pareja", etiqueta: "Para pareja" },
  { valor: "minidepa", etiqueta: "Minidepartamento" },
  { valor: "departamento", etiqueta: "Departamento" }
];

export const etiquetaTipo = (tipo: string): string =>
  TIPOS.find((t) => t.valor === tipo)?.etiqueta ?? tipo;

export const estaActivo = (a: Alojamiento): boolean => a.activo !== false;

export const formatearPrecio = (precio: number): string =>
  `S/ ${Number(precio).toLocaleString("es-PE")}`;

export const formatearFecha = (fecha: string): string => {
  const f = new Date(`${fecha}T00:00:00`);
  return Number.isNaN(f.getTime()) ? fecha : f.toLocaleDateString("es-PE");
};
