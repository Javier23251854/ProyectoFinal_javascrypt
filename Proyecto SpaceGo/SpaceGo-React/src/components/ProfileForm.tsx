
import type { ChangeEvent, FormEvent, RefObject } from "react";
import type { Usuario } from "../models/usuario";

interface ProfileFormProps {
  usuario: Usuario;
  editando: boolean;
  inputRef: RefObject<HTMLInputElement | null>;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onEditar: () => void;
  onGuardar: () => void;
  onCancelar: () => void;
}

function ProfileForm({
  usuario,
  editando,
  inputRef,
  onChange,
  onEditar,
  onGuardar,
  onCancelar
}: ProfileFormProps) {

  const manejarEnvio = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onGuardar();
  };

  return (
    <div className="perfil-card">

      <h2>Información personal</h2>

      <form onSubmit={manejarEnvio}>

        <label>Nombre completo</label>
        <input
          ref={inputRef}
          type="text"
          name="nombre"
          value={usuario.nombre}
          onChange={onChange}
          disabled={!editando}
          required
          minLength={3}
        />

        <label>Correo electrónico</label>
        <input
          type="email"
          name="correo"
          value={usuario.correo}
          onChange={onChange}
          disabled={!editando}
          required
        />

        <label>Teléfono</label>
        <input
          type="tel"
          name="telefono"
          value={usuario.telefono}
          onChange={onChange}
          disabled={!editando}
          required
          pattern="[0-9]{9}"
          title="El teléfono debe tener 9 dígitos."
        />

        <label>Distrito</label>
        <input
          type="text"
          name="distrito"
          value={usuario.distrito}
          onChange={onChange}
          disabled={!editando}
          required
        />

        {editando ? (
          <div>
            <button type="submit">Guardar cambios</button>
            <button type="button" onClick={onCancelar}>
              Cancelar
            </button>
          </div>
        ) : (
          <button type="button" onClick={onEditar}>
            Editar perfil
          </button>
        )}

      </form>

    </div>
  );
}

export default ProfileForm;
