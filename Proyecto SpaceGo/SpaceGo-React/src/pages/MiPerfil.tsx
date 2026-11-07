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

  // Crear referencia para el campo nombre
  const nombreInputRef = useRef<HTMLInputElement>(null);

  // Cargar información del usuario
  useEffect(() => {

    const cargarDatos = async () => {
      try {
        const datos = await obtenerUsuario();
        setUsuario(datos[0]);
        setUsuarioOriginal(datos[0]);
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

      alert("Perfil actualizado correctamente");

    } catch (error) {
      console.error("Error al guardar:", error);
      alert("No se pudieron guardar los cambios");
    }

  };

  // Cancelar edición y recuperar los datos originales
  const cancelarEdicion = () => {
    setUsuario(usuarioOriginal);
    setEditando(false);
  };

  if (cargando) return <p>Cargando perfil...</p>;

  if (!usuario) return <p>No se pudo cargar el perfil.</p>;

  return (
    <div className="perfil-container">

      <ProfileHeader
        titulo="Mi perfil"
        descripcion="Administra tu información personal en SpaceGo."
      />

      <ProfileForm
        usuario={usuario}
        editando={editando}
        inputRef={nombreInputRef}
        onChange={manejarCambio}
        onEditar={() => setEditando(true)}
        onGuardar={guardarCambios}
        onCancelar={cancelarEdicion}
      />

    </div>
  );
}

export default MiPerfil;