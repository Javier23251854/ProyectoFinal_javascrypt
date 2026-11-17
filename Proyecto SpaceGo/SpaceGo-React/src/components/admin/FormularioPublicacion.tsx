import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import type { Alojamiento, CamposEditables } from "../../models/alojamiento";
import Modal from "./Modal";
import { TIPOS } from "./utilidades";

interface FormularioPublicacionProps {
  publicacion: Alojamiento;
  guardando: boolean;
  onGuardar: (cambios: CamposEditables) => void;
  onCancelar: () => void;
}

type Errores = Partial<Record<keyof CamposEditables, string>>;

// Validaciones del formulario
const validar = (datos: CamposEditables): Errores => {
  const errores: Errores = {};

  if (datos.titulo.trim().length < 5) {
    errores.titulo = "El título debe tener al menos 5 caracteres.";
  }
  if (!datos.tipo) {
    errores.tipo = "Selecciona el tipo de alojamiento.";
  }
  if (!Number.isFinite(datos.precio) || datos.precio <= 0) {
    errores.precio = "Ingresa un precio mayor a 0.";
  }
  if (!datos.departamento.trim()) errores.departamento = "Campo obligatorio.";
  if (!datos.provincia.trim()) errores.provincia = "Campo obligatorio.";
  if (!datos.distrito.trim()) errores.distrito = "Campo obligatorio.";
  if (datos.descripcion.trim().length < 10) {
    errores.descripcion = "La descripción debe tener al menos 10 caracteres.";
  }

  return errores;
};

function FormularioPublicacion({
  publicacion,
  guardando,
  onGuardar,
  onCancelar
}: FormularioPublicacionProps) {
  const [datos, setDatos] = useState<CamposEditables>({
    titulo: publicacion.titulo,
    tipo: publicacion.tipo,
    precio: publicacion.precio,
    departamento: publicacion.departamento,
    provincia: publicacion.provincia,
    distrito: publicacion.distrito,
    descripcion: publicacion.descripcion
  });
  const [errores, setErrores] = useState<Errores>({});
  const tituloRef = useRef<HTMLInputElement>(null);

  // Enfocar el título al abrir el formulario (useRef)
  useEffect(() => {
    tituloRef.current?.focus();
  }, []);

  const manejarCambio = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setDatos((previos) => ({
      ...previos,
      [name]: name === "precio" ? Number(value) : value
    }));

    // Quitar el error del campo que se está corrigiendo
    setErrores((previos) => ({ ...previos, [name]: undefined }));
  };

  const enviar = (e: FormEvent) => {
    e.preventDefault();

    const nuevosErrores = validar(datos);
    setErrores(nuevosErrores);

    if (Object.keys(nuevosErrores).length > 0) return;

    onGuardar({
      ...datos,
      titulo: datos.titulo.trim(),
      departamento: datos.departamento.trim(),
      provincia: datos.provincia.trim(),
      distrito: datos.distrito.trim(),
      descripcion: datos.descripcion.trim()
    });
  };

  return (
    <Modal titulo="Editar publicación" onCerrar={onCancelar}>
      <form className="admin-form" onSubmit={enviar} noValidate>
        <div className="admin-campo">
          <label htmlFor="titulo">Título</label>
          <input
            id="titulo"
            name="titulo"
            ref={tituloRef}
            value={datos.titulo}
            onChange={manejarCambio}
          />
          {errores.titulo && <span className="admin-error">{errores.titulo}</span>}
        </div>

        <div className="admin-fila">
          <div className="admin-campo">
            <label htmlFor="tipo">Tipo</label>
            <select id="tipo" name="tipo" value={datos.tipo} onChange={manejarCambio}>
              {TIPOS.map((t) => (
                <option key={t.valor} value={t.valor}>
                  {t.etiqueta}
                </option>
              ))}
            </select>
            {errores.tipo && <span className="admin-error">{errores.tipo}</span>}
          </div>

          <div className="admin-campo">
            <label htmlFor="precio">Precio mensual (S/)</label>
            <input
              id="precio"
              name="precio"
              type="number"
              min="1"
              value={Number.isFinite(datos.precio) ? datos.precio : ""}
              onChange={manejarCambio}
            />
            {errores.precio && <span className="admin-error">{errores.precio}</span>}
          </div>
        </div>

        <div className="admin-fila admin-fila-3">
          <div className="admin-campo">
            <label htmlFor="departamento">Departamento</label>
            <input
              id="departamento"
              name="departamento"
              value={datos.departamento}
              onChange={manejarCambio}
            />
            {errores.departamento && <span className="admin-error">{errores.departamento}</span>}
          </div>

          <div className="admin-campo">
            <label htmlFor="provincia">Provincia</label>
            <input
              id="provincia"
              name="provincia"
              value={datos.provincia}
              onChange={manejarCambio}
            />
            {errores.provincia && <span className="admin-error">{errores.provincia}</span>}
          </div>

          <div className="admin-campo">
            <label htmlFor="distrito">Distrito</label>
            <input
              id="distrito"
              name="distrito"
              value={datos.distrito}
              onChange={manejarCambio}
            />
            {errores.distrito && <span className="admin-error">{errores.distrito}</span>}
          </div>
        </div>

        <div className="admin-campo">
          <label htmlFor="descripcion">Descripción</label>
          <textarea
            id="descripcion"
            name="descripcion"
            rows={4}
            value={datos.descripcion}
            onChange={manejarCambio}
          />
          {errores.descripcion && <span className="admin-error">{errores.descripcion}</span>}
        </div>

        <div className="admin-modal-pie">
          <button
            type="button"
            className="admin-btn admin-btn-claro"
            onClick={onCancelar}
            disabled={guardando}
          >
            Cancelar
          </button>
          <button type="submit" className="admin-btn admin-btn-primario" disabled={guardando}>
            {guardando ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default FormularioPublicacion;
