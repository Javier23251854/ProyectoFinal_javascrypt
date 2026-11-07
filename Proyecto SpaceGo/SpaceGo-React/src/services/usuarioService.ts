import type { Usuario } from "../models/usuario";

const API_URL = "http://localhost:3001/usuarios";

// Obtener los datos del usuario
export const obtenerUsuario = async (): Promise<Usuario[]> => {
  const respuesta = await fetch(API_URL);

  if (!respuesta.ok) {
    throw new Error("Error al obtener los datos del usuario");
  }

  return await respuesta.json();
};

// Actualizar los datos del usuario
export const actualizarUsuario = async (
  usuario: Usuario
): Promise<Usuario> => {
  const respuesta = await fetch(`${API_URL}/${usuario.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(usuario)
  });

  if (!respuesta.ok) {
    throw new Error("Error al actualizar el usuario");
  }

  return await respuesta.json();
};