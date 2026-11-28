import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { cerrarSesion } from "../services/usuarioService";
import "./SiteHeader.css";

export default function SiteHeader() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [saliendo, setSaliendo] = useState(false);
  const [error, setError] = useState("");
  const esComparar = useLocation().pathname === "/comparar-alojamientos";

  const cerrarMenu = () => setMenuAbierto(false);

  async function salir() {
    if (saliendo) return;
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
        <a href="/" className="logo" onClick={cerrarMenu}>
          <img src="/Imagenes/logo cuarto.png" alt="SpaceGo, inicio" />
        </a>

        <button
          type="button"
          className="menu-icon"
          aria-label="Menú de navegación"
          aria-controls="menu-principal"
          aria-expanded={menuAbierto}
          onClick={() => setMenuAbierto((abierto) => !abierto)}
        >
          ☰
        </button>

        <nav
          id="menu-principal"
          className={`menu ${menuAbierto ? "activo" : ""}`}
          aria-label="Navegación principal"
        >
          <ul>
            <li><a href="/" onClick={cerrarMenu}>Inicio</a></li>
            <li>
              <a href="/buscar" className={esComparar ? "activo" : ""} onClick={cerrarMenu}>
                <i className="fa-solid fa-magnifying-glass" />
                Buscar alojamiento
              </a>
            </li>
            <li>
              <a href="/publicar" onClick={cerrarMenu}>
                <i className="fa-solid fa-plus" />
                Publicar alojamiento
              </a>
            </li>
            <li>
              <a href="/favoritos" onClick={cerrarMenu}>
                <i className="fa-regular fa-heart" />
                Favoritos
              </a>
            </li>
            <li>
              <NavLink
                to="/centro-ayuda"
                className={({ isActive }) => isActive ? "activo" : ""}
                onClick={cerrarMenu}
              >
                Centro de ayuda
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/mis-solicitudes"
                className={({ isActive }) => isActive ? "activo" : ""}
                onClick={cerrarMenu}
              >
                Mis solicitudes
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/mi-perfil"
                className={({ isActive }) => isActive ? "activo" : ""}
                onClick={cerrarMenu}
              >
                Mi perfil
              </NavLink>
            </li>
            <li>
              <button type="button" className="btn-principal" onClick={salir} disabled={saliendo}>
                {saliendo ? "Cerrando sesión..." : "Cerrar sesión"}
              </button>
            </li>
          </ul>
        </nav>
      </div>
      {error && <p className="container" role="alert">{error}</p>}
    </header>
  );
}

