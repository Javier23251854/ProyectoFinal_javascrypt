export interface Alojamiento {
  id: string | number;
  titulo: string;
  tipo: string;
  precio: number;
  departamento: string;
  provincia: string;
  distrito: string;
  imagen: string;
  descripcion: string;
  fecha: string;
  imagenes?: string[];
  latitud?: number | string | null;
  longitud?: number | string | null;
  capacidad?: string;
  referencia?: string;
  servicios?: string[];
  incluye?: string[];
  noIncluye?: string[];
  caracteristicas?: string[];
  contacto?: { telefono?: string; correo?: string };
  activo?: boolean;
  propietarioId?: string | number;
}

export type CamposEditables = Pick<
  Alojamiento,
  "titulo" | "tipo" | "precio" | "departamento" | "provincia" | "distrito" | "descripcion"
>;
