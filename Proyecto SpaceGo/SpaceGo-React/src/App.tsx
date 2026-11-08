import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import SiteHeader from "./components/SiteHeader";
import SiteFooter from "./components/SiteFooter";

import MiPerfil from "./pages/MiPerfil";
import AdministrarPublicaciones from "./pages/AdministrarPublicaciones";
import CentroAyuda from "./pages/CentroAyuda";
import CompararAlojamientos from "./pages/CompararAlojamientos";
import MisSolicitudes from "./pages/MisSolicitudes";

function App() {
  return (
    <BrowserRouter>
      <div className="app">

        <SiteHeader />

        <main className="contenido-principal">
          <Routes>
            <Route path="/" element={<Navigate to="/mi-perfil" replace />} />

            <Route path="/mi-perfil" element={<MiPerfil />} />
            <Route path="/administrar-publicaciones" element={<AdministrarPublicaciones />} />
            <Route path="/centro-ayuda" element={<CentroAyuda />} />
            <Route path="/comparar-alojamientos" element={<CompararAlojamientos />} />
            <Route path="/mis-solicitudes" element={<MisSolicitudes />} />
          </Routes>
        </main>

        <SiteFooter />

      </div>
    </BrowserRouter>
  );
}

export default App;