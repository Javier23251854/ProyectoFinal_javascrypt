import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import MiPerfil from "./pages/MiPerfil";

function App() {
  return (
    <BrowserRouter>
      <nav className="navbar">
        <h2>SpaceGo</h2>

        <Link to="/mi-perfil">Mi perfil</Link>
      </nav>

      <Routes>
        <Route path="/mi-perfil" element={<MiPerfil />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;