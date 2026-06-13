import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import '../styles/valkira-navbar.css';

export default function Navbar() {
  const navigate = useNavigate();
  const { favoritesCount, cartCount } = useStore();
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('token'));

  useEffect(() => {
    const updateAuth = () => setIsLoggedIn(!!localStorage.getItem('token'));
    window.addEventListener('auth-changed', updateAuth);
    window.addEventListener('storage', updateAuth);
    return () => {
      window.removeEventListener('auth-changed', updateAuth);
      window.removeEventListener('storage', updateAuth);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.dispatchEvent(new Event('auth-changed'));
    navigate('/');
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  return (
    <nav className="vk-navbar">
      <div className="nav-inner">
        <Link to="/" className="nav-logo">
          VALKI<span>R</span>A
        </Link>

        <ul className="nav-links">
          <li><Link to="/">Inicio</Link></li>
          <li><Link to="/catalogo">Catálogo</Link></li>
          <li><Link to="/nosotros">Nosotros</Link></li>
        </ul>

        <div className="nav-actions">
          <button className="nav-icon" aria-label="Favoritos" onClick={() => navigate('/favorites')}>&#9825;
            {favoritesCount > 0 && <span className="nav-badge">{favoritesCount}</span>}
          </button>
          <button className="nav-icon" aria-label="Carrito" onClick={() => navigate('/cart')}>🛒
            {cartCount > 0 && <span className="nav-badge">{cartCount}</span>}
          </button>
          {isLoggedIn ? (
            <>
              <button className="nav-icon" aria-label="Perfil" onClick={handleProfileClick}>👤</button>
              <button className="btn-nav" onClick={handleLogout}>Cerrar sesión</button>
            </>
          ) : (
            <Link to="/login" className="btn-nav">Ingresar</Link>
          )}
        </div>
      </div>
    </nav>
  );
}
