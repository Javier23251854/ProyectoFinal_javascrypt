import { useEffect, useState, useRef } from "react";

import ProfileHeader from "../components/ProfileHeader";
import ProfileForm from "../components/ProfileForm";

import {
  obtenerUsuario,
  actualizarUsuario
} from "../services/usuarioService";

import type { Usuario } from "../models/usuario";

function MiPerfil() {

  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [usuarioOriginal, setUsuarioOriginal] = useState<Usuario | null>(null);
  const [editando, setEditando] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState("");

  const nombreInputRef = useRef<HTMLInputElement>(null);

  // Recuperar el usuario y mantener su sesión
  useEffect(() => {

    const cargarDatos = async () => {

      try {

        const parametros = new URLSearchParams(window.location.search);
        const idRecibido = parametros.get("usuarioId");

        // Si Angular envía un ID, guardarlo
        if (idRecibido) {
          localStorage.setItem("spacego_usuario_id", idRecibido);

          window.dispatchEvent(new Event("spacego-auth-change"));
        }

        // Recuperar el ID guardado si no viene en la URL
        const usuarioId = idRecibido ||
          localStorage.getItem("spacego_usuario_id");

        if (!usuarioId) {
          throw new Error("No existe una sesión iniciada.");
        }

        const datos = await obtenerUsuario(usuarioId);

        setUsuario(datos);
        setUsuarioOriginal(datos);

      } catch (error) {
        console.error("Error al cargar el perfil:", error);
      } finally {
        setCargando(false);
      }

    };

    cargarDatos();

  }, []);

  // Enfocar el campo nombre al editar
  useEffect(() => {
    if (editando) {
      nombreInputRef.current?.focus();
    }
  }, [editando]);

  // Detectar cambios en los campos
  const manejarCambio = (e: React.ChangeEvent<HTMLInputElement>) => {

    if (!usuario) return;

    setUsuario({
      ...usuario,
      [e.target.name]: e.target.value
    });

  };

  // Guardar información
  const guardarCambios = async () => {

    if (!usuario) return;

    try {

      const actualizado = await actualizarUsuario(usuario);

      setUsuario(actualizado);
      setUsuarioOriginal(actualizado);
      setEditando(false);

      setMensaje("Perfil actualizado correctamente.");

    } catch (error) {
      console.error("Error al guardar:", error);
      setMensaje("No se pudieron guardar los cambios.");
    }

  };

  // Cancelar edición
  const cancelarEdicion = () => {

    setUsuario(usuarioOriginal);
    setEditando(false);
    setMensaje("");

  };

  if (cargando) {
    return (
      <div className="estado-perfil">
        <p>Cargando perfil...</p>
      </div>
    );
  }

  if (!usuario) {
    return (
      <div className="estado-perfil">
        <p>No se pudo cargar el perfil. Inicia sesión desde SpaceGo.</p>
      </div>
    );
  }

  return (
    <div className="perfil-container">

      <ProfileHeader
        titulo="Mi perfil"
        descripcion="Administra tu información personal en SpaceGo."
      />

      {mensaje && (
        <div className="mensaje-perfil" role="status">
          {mensaje}
        </div>
      )}

      <ProfileForm
        usuario={usuario}
        editando={editando}
        inputRef={nombreInputRef}
        onChange={manejarCambio}
        onEditar={() => {
          setMensaje("");
          setEditando(true);
        }}
        onGuardar={guardarCambios}
        onCancelar={cancelarEdicion}
      />

    </div>
  );
}

export default MiPerfil;