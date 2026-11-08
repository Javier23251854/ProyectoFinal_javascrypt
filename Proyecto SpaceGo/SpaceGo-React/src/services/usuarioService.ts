import type { Usuario } from "../models/usuario";

const API_URL = "http://localhost:3000/usuarios";

interface UsuarioAPI {
  id: string;
  name: string;
  email: string;
  telefono?: string;
  distrito?: string;
}

// Obtener el usuario registrado en Angular
export const obtenerUsuario = async (id: string): Promise<Usuario> => {

  const respuesta = await fetch(`${API_URL}/${id}`);

  if (!respuesta.ok) {
    throw new Error("Error al obtener los datos del usuario");
  }

  const datos: UsuarioAPI = await respuesta.json();

  return {
    id: datos.id,
    nombre: datos.name,
    correo: datos.email,
    telefono: datos.telefono ?? "",
    distrito: datos.distrito ?? ""
  };
};

// Actualizar los datos del usuario
export const actualizarUsuario = async (
  usuario: Usuario
): Promise<Usuario> => {

  const respuesta = await fetch(`${API_URL}/${usuario.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: usuario.nombre,
      email: usuario.correo,
      telefono: usuario.telefono ?? "",
      distrito: usuario.distrito ?? ""
    })
  });

  if (!respuesta.ok) {
    throw new Error("Error al actualizar el usuario");
  }

  const datos: UsuarioAPI = await respuesta.json();

  return {
    id: datos.id,
    nombre: datos.name,
    correo: datos.email,
    telefono: datos.telefono ?? "",
    distrito: datos.distrito ?? ""
  };
};