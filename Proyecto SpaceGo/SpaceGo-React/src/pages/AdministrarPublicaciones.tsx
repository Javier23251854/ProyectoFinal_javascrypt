import { useMemo, useState } from "react";

import "./AdministrarPublicaciones.css";

import NotificacionProvider from "../context/NotificacionProvider";
import { useNotificacion } from "../context/NotificacionContext";
import { usePublicaciones } from "../hooks/usePublicaciones";

import TarjetaPublicacion from "../components/admin/TarjetaPublicacion";
import DetallePublicacion from "../components/admin/DetallePublicacion";
import FormularioPublicacion from "../components/admin/FormularioPublicacion";
import ConfirmarEliminar from "../components/admin/ConfirmarEliminar";
import { estaActivo } from "../components/admin/utilidades";

import type { Alojamiento, CamposEditables } from "../models/alojamiento";

type FiltroEstado = "todas" | "activas" | "desactivadas";

// Recuperar el usuario con sesión iniciada (igual que Mi perfil)
const obtenerUsuarioId = (): string | null => {
  const parametros = new URLSearchParams(window.location.search);
  const idRecibido = parametros.get("usuarioId");

  if (idRecibido) {
    localStorage.setItem("spacego_usuario_id", idRecibido);
    window.dispatchEvent(new Event("spacego-auth-change"));
  }

  return idRecibido || localStorage.getItem("spacego_usuario_id");
};

function PanelPublicaciones() {
  const { notificar } = useNotificacion();

  const [usuarioId] = useState<string | null>(obtenerUsuarioId);

  const {
    publicaciones,
    cargando,
    error,
    modoDemostracion,
    recargar,
    editar,
    cambiarEstado,
    eliminar
  } = usePublicaciones(usuarioId);

  const [busqueda, setBusqueda] = useState("");
  const [filtro, setFiltro] = useState<FiltroEstado>("todas");

  const [verPublicacion, setVerPublicacion] = useState<Alojamiento | null>(null);
  const [editarPublicacion, setEditarPublicacion] = useState<Alojamiento | null>(null);
  const [eliminarPublicacion, setEliminarPublicacion] = useState<Alojamiento | null>(null);

  const [ocupadoId, setOcupadoId] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [eliminando, setEliminando] = useState(false);

  // Resumen
  const totalActivas = publicaciones.filter(estaActivo).length;
  const totalDesactivadas = publicaciones.length - totalActivas;

  // Búsqueda + filtro por estado + orden por fecha (más recientes primero)
  const visibles = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();

    return publicaciones
      .filter((a) => {
        if (filtro === "activas" && !estaActivo(a)) return false;
        if (filtro === "desactivadas" && estaActivo(a)) return false;
        if (!texto) return true;

        return (
          a.titulo.toLowerCase().includes(texto) ||
          a.distrito.toLowerCase().includes(texto)
        );
      })
      .sort((a, b) => b.fecha.localeCompare(a.fecha));
  }, [publicaciones, busqueda, filtro]);

  // Guardar edición
  const guardarEdicion = async (cambios: CamposEditables) => {
    if (!editarPublicacion) return;

    setGuardando(true);

    try {
      await editar(editarPublicacion.id, cambios);
      setEditarPublicacion(null);
      notificar("Publicación actualizada correctamente.");
    } catch (e) {
      console.error(e);
      notificar("No se pudo actualizar la publicación.", "error");
    } finally {
      setGuardando(false);
    }
  };

  // Activar o desactivar
  const alternarEstado = async (a: Alojamiento) => {
    const nuevoEstado = !estaActivo(a);

    setOcupadoId(String(a.id));

    try {
      await cambiarEstado(a.id, nuevoEstado);
      notificar(nuevoEstado ? "Publicación activada." : "Publicación desactivada.");
    } catch (e) {
      console.error(e);
      notificar("No se pudo cambiar el estado.", "error");
    } finally {
      setOcupadoId(null);
    }
  };

  // Eliminar
  const confirmarEliminacion = async () => {
    if (!eliminarPublicacion) return;

    setEliminando(true);

    try {
      await eliminar(eliminarPublicacion.id);
      setEliminarPublicacion(null);
      notificar("Publicación eliminada.");
    } catch (e) {
      console.error(e);
      notificar("No se pudo eliminar la publicación.", "error");
    } finally {
      setEliminando(false);
    }
  };

  // Estados de la pantalla
  if (!usuarioId) {
    return (
      <section className="admin-pagina">
        <div className="admin-estado">
          <p>Inicia sesión en SpaceGo para administrar tus publicaciones.</p>
        </div>
      </section>
    );
  }

  if (cargando) {
    return (
      <section className="admin-pagina">
        <div className="admin-estado">
          <p>Cargando publicaciones...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="admin-pagina">
        <div className="admin-estado">
          <p>{error}</p>
          <button type="button" className="admin-btn admin-btn-primario" onClick={recargar}>
            Reintentar
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="admin-pagina">
      <header className="admin-encabezado">
        <h1>Administrar publicaciones</h1>
        <p>Visualiza, edita, desactiva o elimina los alojamientos que publicaste.</p>
      </header>

      {modoDemostracion && (
        <div className="admin-aviso">
          Las publicaciones aún no tienen propietario asignado, por eso se muestran todas.
        </div>
      )}

      <div className="admin-resumen">
        <div className="admin-resumen-item">
          <strong>{publicaciones.length}</strong>
          <span>Total</span>
        </div>
        <div className="admin-resumen-item">
          <strong>{totalActivas}</strong>
          <span>Activas</span>
        </div>
        <div className="admin-resumen-item">
          <strong>{totalDesactivadas}</strong>
          <span>Desactivadas</span>
        </div>
      </div>

      <div className="admin-herramientas">
        <input
          type="search"
          placeholder="Buscar por título o distrito"
          aria-label="Buscar publicaciones"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />

        <select
          aria-label="Filtrar por estado"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value as FiltroEstado)}
        >
          <option value="todas">Todas</option>
          <option value="activas">Activas</option>
          <option value="desactivadas">Desactivadas</option>
        </select>
      </div>

      {visibles.length === 0 ? (
        <div className="admin-estado">
          <p>
            {publicaciones.length === 0
              ? "Aún no tienes publicaciones."
              : "No hay publicaciones que coincidan con tu búsqueda."}
          </p>
        </div>
      ) : (
        <div className="admin-grid">
          {visibles.map((a) => (
            <TarjetaPublicacion
              key={a.id}
              publicacion={a}
              ocupado={ocupadoId === String(a.id)}
              onVer={setVerPublicacion}
              onEditar={setEditarPublicacion}
              onAlternarEstado={alternarEstado}
              onEliminar={setEliminarPublicacion}
            />
          ))}
        </div>
      )}

      {verPublicacion && (
        <DetallePublicacion
          publicacion={verPublicacion}
          onCerrar={() => setVerPublicacion(null)}
        />
      )}

      {editarPublicacion && (
        <FormularioPublicacion
          key={editarPublicacion.id}
          publicacion={editarPublicacion}
          guardando={guardando}
          onGuardar={guardarEdicion}
          onCancelar={() => setEditarPublicacion(null)}
        />
      )}

      {eliminarPublicacion && (
        <ConfirmarEliminar
          publicacion={eliminarPublicacion}
          eliminando={eliminando}
          onConfirmar={confirmarEliminacion}
          onCancelar={() => setEliminarPublicacion(null)}
        />
      )}
    </section>
  );
}

// La página envuelve el panel con el Provider de notificaciones (Context)
function AdministrarPublicaciones() {
  return (
    <NotificacionProvider>
      <PanelPublicaciones />
    </NotificacionProvider>
  );
}

export default AdministrarPublicaciones;
