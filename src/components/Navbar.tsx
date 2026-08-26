import { NavLink, Link } from 'react-router-dom';
import { useCartContext } from '../context/CartContext';
import './Navbar.css';

const navClass = ({ isActive }: { isActive: boolean }) =>
  isActive ? 'nav-link nav-link--active' : 'nav-link';

export function Navbar() {
  const { cartCount, setShowCart } = useCartContext();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <img src="/assets/logo_mixpoint.png" alt="Mix Point Logo" className="navbar-logo-img" />
          <div className="navbar-brand-titles">
            <span className="navbar-brand-name">Mix Point</span>
            <span className="navbar-brand-tagline">Frutos Secos Premium</span>
          </div>
        </Link>

        <ul className="nav-links">
          <li>
            <NavLink to="/" end className={navClass}>Inicio</NavLink>
          </li>
          <li>
            <NavLink to="/catalogo" className={navClass}>Catálogo</NavLink>
          </li>
          <li>
            <NavLink to="/envios" className={navClass}>Envíos</NavLink>
          </li>
          <li>
            <NavLink to="/contacto" className={navClass}>Contacto</NavLink>
          </li>
          <li>
            <NavLink to="/nosotros" className={navClass}>Sobre nosotros</NavLink>
          </li>
        </ul>

        <div className="navbar-actions">
          <Link to="/catalogo" className="nav-icon-btn" aria-label="Buscar en el catálogo" title="Buscar productos">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </Link>

          <button
            className="nav-cart-btn"
            onClick={() => setShowCart(true)}
            aria-label={`Ver carrito (${cartCount} productos)`}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            <span className="nav-cart-text">Mi Carrito</span>
            {cartCount > 0 && <span className="nav-cart-badge">{cartCount}</span>}
          </button>
        </div>
      </div>
    </nav>
  );
}
