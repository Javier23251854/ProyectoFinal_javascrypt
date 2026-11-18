import { useEffect, useState, useRef } from "react";

import ProfileHeader from "../components/ProfileHeader";
import ProfileForm from "../components/ProfileForm";

import {
  actualizarUsuario
} from "../services/usuarioService";

import type { Usuario } from "../models/usuario";

interface MiPerfilProps {
  usuarioInicial: Usuario;
  onActualizado: (usuario: Usuario) => void;
}

function MiPerfil({ usuarioInicial, onActualizado }: MiPerfilProps) {

  const [usuario, setUsuario] = useState(usuarioInicial);
  const [usuarioOriginal, setUsuarioOriginal] = useState(usuarioInicial);
  const [editando, setEditando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const nombreInputRef = useRef<HTMLInputElement>(null);

  // Enfocar el campo nombre al editar
  useEffect(() => {
    if (editando) {
      nombreInputRef.current?.focus();
    }
  }, [editando]);

  // Detectar cambios en los campos
  const manejarCambio = (e: React.ChangeEvent<HTMLInputElement>) => {

    setUsuario({
      ...usuario,
      [e.target.name]: e.target.value
    });

  };

  // Guardar información
  const guardarCambios = async () => {

    try {

      const actualizado = await actualizarUsuario(usuario);

      setUsuario(actualizado);
      setUsuarioOriginal(actualizado);
      onActualizado(actualizado);
      setEditando(false);

      setMensaje("Perfil actualizado correctamente.");

    } catch (error) {
      console.error("Error al guardar:", error);
      setMensaje(error instanceof Error ? error.message : "No se pudieron guardar los cambios.");
    }

  };

  // Cancelar edición
  const cancelarEdicion = () => {

    setUsuario(usuarioOriginal);
    setEditando(false);
    setMensaje("");

  };

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