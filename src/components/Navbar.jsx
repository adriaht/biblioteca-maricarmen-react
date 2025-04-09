import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    // Verificar si hay un token en localStorage
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    // Eliminar el token y actualizar el estado
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
    // Cerrar el menú en móviles después de hacer logout
    setMenuOpen(false);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Biblioteca Mari Carmen Brito
        </Link>

        <div className="menu-icon" onClick={toggleMenu}>
          <div className={menuOpen ? 'hamburger open' : 'hamburger'}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        <ul className={menuOpen ? 'nav-menu active' : 'nav-menu'}>
          <li className="nav-item">
            <Link to="/" className="nav-link" onClick={() => setMenuOpen(false)}>
              Inici
            </Link>
          </li>
          
          {isAuthenticated ? (
            <>
              <li className="nav-item">
                <button onClick={handleLogout} className="logout-btn">
                  Tancar Sessió
                </button>
              </li>
            </>
          ) : (
            <li className="nav-item">
              <Link to="/login" className="nav-link login-link" onClick={() => setMenuOpen(false)}>
                Iniciar Sessió
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;