
import { NavLink } from "react-router-dom";

function SiteFooter() {
  return (
    <footer className="footer">

      <div className="footer-container container">

        {/* COLUMNA 1: SPACEGO */}
        <div className="footer-box">
          <div className="footer-logo">
            <img src="/Imagenes/logo-cuarto.png" alt="Logo SpaceGo" />
          </div>

          <p>
            Una plataforma pensada para ayudarte a encontrar
            el espacio que necesitas.
          </p>
        </div>

        {/* COLUMNA 2: INFORMACIÓN */}
        <div className="footer-box">
          <h3>Información</h3>

          <p>
            SpaceGo es una plataforma creada para facilitar
            la búsqueda de espacios de alojamiento de manera
            sencilla, clara y práctica.
          </p>

          <p>
            Conectamos a personas que buscan un lugar donde vivir
            con propietarios que desean publicar sus espacios.
          </p>
        </div>

        {/* COLUMNA 3: PÁGINAS */}
        <div className="footer-box">
          <h3>Páginas</h3>

          <ul>
            <li>
              <NavLink to="/mi-perfil" className={({ isActive }) => isActive ? "pagina-activa" : ""}>
                Mi perfil
              </NavLink>
            </li>

            <li>
              <NavLink to="/centro-ayuda" className={({ isActive }) => isActive ? "pagina-activa" : ""}>
                Centro de ayuda
              </NavLink>
            </li>

            <li>
              <NavLink to="/comparar-alojamientos" className={({ isActive }) => isActive ? "pagina-activa" : ""}>
                Comparar alojamientos
              </NavLink>
            </li>

            <li>
              <NavLink to="/mis-solicitudes" className={({ isActive }) => isActive ? "pagina-activa" : ""}>
                Mis solicitudes
              </NavLink>
            </li>
          </ul>
        </div>

        {/* COLUMNA 4: CONTACTO */}
        <div className="footer-box">
          <h3>Contacto</h3>

          <p>
            <i className="fa-solid fa-phone"></i>
            +51 987 654 321
          </p>

          <p>
            <i className="fa-solid fa-envelope"></i>
            contacto@spacego.pe
          </p>

          <p>
            <i className="fa-solid fa-location-dot"></i>
            Perú
          </p>

          <div className="redes">
            <a href="#" aria-label="Facebook">
              <i className="fa-brands fa-facebook"></i>
            </a>

            <a href="#" aria-label="Instagram">
              <i className="fa-brands fa-instagram"></i>
            </a>

            <a href="#" aria-label="TikTok">
              <i className="fa-brands fa-tiktok"></i>
            </a>
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        <p>© 2026 SpaceGo - Todos los derechos reservados</p>
      </div>

    </footer>
  );
}

export default SiteFooter;
