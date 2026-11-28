import { NavLink } from "react-router-dom";

function SiteFooter() {
  return (
    <footer className="footer">
      <div className="footer-container container">
        <div className="footer-box">
          <div className="footer-logo">
            <img src="/Imagenes/logo cuarto.png" alt="Logo SpaceGo" />
          </div>
          <p>Una plataforma pensada para ayudarte a encontrar el espacio que necesitas.</p>
        </div>

        <div className="footer-box">
          <h3>Información</h3>
          <p>SpaceGo es una plataforma creada para facilitar la búsqueda de espacios de alojamiento de manera sencilla, clara y práctica.</p>
          <p>Conectamos a personas que buscan un lugar donde vivir con propietarios que desean publicar sus espacios.</p>
        </div>

        <div className="footer-box">
          <h3>Páginas</h3>
          <ul>
            <li><a href="/">Inicio</a></li>
            <li><a href="/buscar">Buscar alojamiento</a></li>
            <li><a href="/publicar">Publicar alojamiento</a></li>
            <li><a href="/favoritos">Favoritos</a></li>
            <li><NavLink to="/mi-perfil">Mi perfil</NavLink></li>
            <li><NavLink to="/administrar-publicaciones">Administrar publicaciones</NavLink></li>
            <li><NavLink to="/centro-ayuda">Centro de ayuda</NavLink></li>
            <li><NavLink to="/comparar-alojamientos">Comparar alojamientos</NavLink></li>
            <li><NavLink to="/mis-solicitudes">Mis solicitudes</NavLink></li>
          </ul>
        </div>

        <div className="footer-box">
          <h3>Contacto</h3>
          <p><i className="fa-solid fa-phone" /> +51 987 654 321</p>
          <p><i className="fa-solid fa-envelope" /> contacto@spacego.pe</p>
          <p><i className="fa-solid fa-location-dot" /> Perú</p>
          <div className="redes">
            <a href="#" aria-label="Facebook"><i className="fa-brands fa-facebook" /></a>
            <a href="#" aria-label="Instagram"><i className="fa-brands fa-instagram" /></a>
            <a href="#" aria-label="TikTok"><i className="fa-brands fa-tiktok" /></a>
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
