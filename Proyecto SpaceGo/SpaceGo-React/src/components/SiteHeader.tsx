import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function SiteHeader() {

  const [menuAbierto, setMenuAbierto] = useState(false);
  const [sesionActiva, setSesionActiva] = useState(false);

  const cerrarMenu = () => {
    setMenuAbierto(false);
  };

  useEffect(() => {

    const comprobarSesion = () => {
      const usuarioId = localStorage.getItem("spacego_usuario_id");
      setSesionActiva(!!usuarioId);
    };

    comprobarSesion();

    window.addEventListener("spacego-auth-change", comprobarSesion);

    return () => {
      window.removeEventListener("spacego-auth-change", comprobarSesion);
    };

  }, []);

  const cerrarSesion = () => {

    localStorage.removeItem("spacego_usuario_id");

    setSesionActiva(false);
    cerrarMenu();

    window.location.href = "http://localhost:4200/";

  };

  return (
    <header className="header">
      <div className="navbar container">

        <div className="logo">
          <a href="http://localhost:4200/" onClick={cerrarMenu}>
            <img src="/Imagenes/logo-cuarto.png" alt="Logo SpaceGo" />
          </a>
        </div>

        <button
          type="button"
          className="menu-icon"
          aria-label="Abrir menú"
          aria-expanded={menuAbierto}
          onClick={() => setMenuAbierto(!menuAbierto)}
        >
          &#9776;
        </button>

        <nav className={`menu ${menuAbierto ? "menu-abierto" : ""}`}>
          <ul>

            <li>
              <a href="http://localhost:4200/" onClick={cerrarMenu}>
                Inicio
              </a>
            </li>

            <li>
              <a href="http://localhost:4200/buscar" onClick={cerrarMenu}>
                <i className="fa-solid fa-magnifying-glass"></i>
                Buscar alojamiento
              </a>
            </li>

            {sesionActiva && (
              <>
                <li>
                  <a href="http://localhost:4200/publicar" onClick={cerrarMenu}>
                    <i className="fa-solid fa-plus"></i>
                    Publicar alojamiento
                  </a>
                </li>

                <li>
                  <a href="http://localhost:4200/favoritos" onClick={cerrarMenu}>
                    <i className="fa-regular fa-heart"></i>
                    Favoritos
                  </a>
                </li>

                <li>
                  <Link
                    to="/mi-perfil"
                    className="btn-login-nav activo"
                    onClick={cerrarMenu}
                  >
                    <i className="fa-solid fa-user"></i>
                    Mi perfil
                  </Link>
                </li>

                <li>
                  <button
                    type="button"
                    onClick={cerrarSesion}
                    className="btn-cerrar-sesion"
                  >
                    Cerrar sesión
                  </button>
                </li>
              </>
            )}

            {!sesionActiva && (
              <li>
                <a
                  href="http://localhost:4200/login"
                  className="btn-login-nav"
                  onClick={cerrarMenu}
                >
                  <i className="fa-solid fa-user"></i>
                  Iniciar sesión
                </a>
              </li>
            )}

          </ul>
        </nav>

      </div>
    </header>
  );
}

export default SiteHeader;