import { useState } from "react";
import { NavLink } from "react-router-dom";
import { cerrarSesion } from "../services/usuarioService";

export default function SiteHeader() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [saliendo, setSaliendo] = useState(false);
  const [error, setError] = useState("");
  const cerrarMenu = () => setMenuAbierto(false);

  async function salir() {
    setSaliendo(true);
    setError("");
    try {
      await cerrarSesion();
      window.location.replace("/");
    } catch {
      setError("No se pudo cerrar la sesión. Inténtalo nuevamente.");
      setSaliendo(false);
    }
  }

  return (
    <header className="header">
      <div className="navbar container">
        <a className="logo" href="/">
          <img src="/Imagenes/logo-cuarto.png" alt="SpaceGo, inicio" />
        </a>
        <button type="button" className="menu-icon" aria-label="Menú de navegación"
                aria-controls="menu-principal" aria-expanded={menuAbierto}
                onClick={() => setMenuAbierto(!menuAbierto)}>☰</button>
        <nav id="menu-principal" aria-label="Navegación principal"
             className={`menu ${menuAbierto ? "menu-abierto" : ""}`}>
          <ul>
            <li><a href="/">Inicio</a></li>
            <li><a href="/buscar">Buscar alojamiento</a></li>
            <li><a href="/publicar">Publicar alojamiento</a></li>
            <li><a href="/favoritos">Favoritos</a></li>
            <li><NavLink to="/mi-perfil" className={({ isActive }) => isActive ? "activo" : ""}
                         onClick={cerrarMenu}>Mi perfil</NavLink></li>
            <li><button type="button" onClick={salir} disabled={saliendo}
                        className="btn-cerrar-sesion">Cerrar sesión</button></li>
          </ul>
        </nav>
      </div>
      {error && <p className="container" role="alert">{error}</p>}
    </header>
  );
}
