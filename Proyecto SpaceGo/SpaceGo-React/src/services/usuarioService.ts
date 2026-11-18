import type { Usuario } from "../models/usuario";

interface UsuarioAPI {
  id: string;
  name: string;
  email: string;
  telefono?: string;
  distrito?: string;
}

function convertir(datos: UsuarioAPI): Usuario {
  return {
    id: datos.id,
    nombre: datos.name,
    correo: datos.email,
    telefono: datos.telefono ?? "",
    distrito: datos.distrito ?? "",
  };
}

export async function obtenerSesion(signal: AbortSignal): Promise<Usuario | null> {
  const respuesta = await fetch("/api/auth/sesion", { signal });
  if (!respuesta.ok) throw new Error("No se pudo comprobar la sesión.");
  const { usuario }: { usuario: UsuarioAPI | null } = await respuesta.json();
  return usuario ? convertir(usuario) : null;
}

export async function cerrarSesion(): Promise<void> {
  const respuesta = await fetch("/api/auth/salir", { method: "POST" });
  if (!respuesta.ok) throw new Error("No se pudo cerrar la sesión.");
}

export async function actualizarUsuario(usuario: Usuario): Promise<Usuario> {
  const respuesta = await fetch("/api/auth/perfil", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: usuario.nombre,
      email: usuario.correo,
      telefono: usuario.telefono ?? "",
      distrito: usuario.distrito ?? "",
    }),
  });
  if (!respuesta.ok) {
    const { mensaje } = await respuesta.json();
    throw new Error(mensaje ?? "No se pudo guardar el perfil.");
  }
  return convertir(await respuesta.json());
}
