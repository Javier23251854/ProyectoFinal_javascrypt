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
  // Campos que usa la administración de publicaciones.
  // Si no existen en el registro se asume: activo = true.
  activo?: boolean;
  propietarioId?: string | number;
}

// Campos que el propietario puede editar desde el panel
export type CamposEditables = Pick<
  Alojamiento,
  "titulo" | "tipo" | "precio" | "departamento" | "provincia" | "distrito" | "descripcion"
>;
