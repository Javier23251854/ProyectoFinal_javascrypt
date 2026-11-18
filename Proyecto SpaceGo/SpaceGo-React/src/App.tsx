import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import SiteHeader from "./components/SiteHeader";
import SiteFooter from "./components/SiteFooter";
import MiPerfil from "./pages/MiPerfil";
import AdministrarPublicaciones from "./pages/AdministrarPublicaciones";
import CentroAyuda from "./pages/CentroAyuda";
import CompararAlojamientos from "./pages/CompararAlojamientos";
import MisSolicitudes from "./pages/MisSolicitudes";
import type { Usuario } from "./models/usuario";
import { obtenerSesion } from "./services/usuarioService";

export default function App() {
  const [usuario, setUsuario] = useState<Usuario>();
  const [error, setError] = useState(false);

  useEffect(() => {
    let consulta: AbortController | undefined;
    const comprobarSesion = () => {
      if (document.visibilityState === "hidden") return;
      consulta?.abort();
      const controlador = new AbortController();
      consulta = controlador;
      obtenerSesion(controlador.signal).then((sesion) => {
        if (controlador.signal.aborted) return;
        setError(false);
        if (sesion) {
          setUsuario(sesion);
          return;
        }
        setUsuario(undefined);
        const volver = window.location.pathname + window.location.search;
        window.location.replace("/login?volver=" + encodeURIComponent(volver));
      }).catch(() => {
        if (!controlador.signal.aborted) setError(true);
      });
    };

    comprobarSesion();
    window.addEventListener("pageshow", comprobarSesion);
    document.addEventListener("visibilitychange", comprobarSesion);
    return () => {
      consulta?.abort();
      window.removeEventListener("pageshow", comprobarSesion);
      document.removeEventListener("visibilitychange", comprobarSesion);
    };
  }, []);

  if (error) {
    return (
      <div className="estado-perfil" role="alert">
        <p>No se pudo comprobar la sesión.</p>
        <button className="btn" onClick={() => window.location.reload()}>Reintentar</button>
      </div>
    );
  }
  if (!usuario) return <p className="estado-perfil" role="status">Comprobando sesión…</p>;

  return (
    <BrowserRouter>
      <div className="app" key={usuario.id}>
        <SiteHeader />
        <main className="contenido-principal">
          <Routes>
            <Route path="/mi-perfil" element={<MiPerfil usuarioInicial={usuario} onActualizado={setUsuario} />} />
            <Route path="/administrar-publicaciones" element={<AdministrarPublicaciones />} />
            <Route path="/centro-ayuda" element={<CentroAyuda />} />
            <Route path="/comparar-alojamientos" element={<CompararAlojamientos />} />
            <Route path="/mis-solicitudes" element={<MisSolicitudes />} />
            <Route path="*" element={<Navigate to="/mi-perfil" replace />} />
          </Routes>
        </main>
        <SiteFooter />
      </div>
    </BrowserRouter>
  );
}
