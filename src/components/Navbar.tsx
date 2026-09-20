import { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useCartContext } from '../context/CartContext';
import './Navbar.css';

const WHATSAPP_NUMERO = '5491131469587';

const navClass = ({ isActive }: { isActive: boolean }) =>
  isActive ? 'nav-link nav-link--active' : 'nav-link';

const drawerNavClass = ({ isActive }: { isActive: boolean }) =>
  isActive ? 'nav-drawer-link nav-drawer-link--active' : 'nav-drawer-link';

export function Navbar() {
  const { cartCount, setShowCart } = useCartContext();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const [prevPath, setPrevPath] = useState(location.pathname);

  // Cerrar drawer al cambiar de ruta
  if (location.pathname !== prevPath) {
    setPrevPath(location.pathname);
    setMenuOpen(false);
  }

  // Cerrar con Escape y bloquear scroll del body
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };

    if (menuOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [menuOpen]);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          {/* BOTÓN HAMBURGUESA (MÓVIL) */}
          <button
            className={`nav-hamburger-btn ${menuOpen ? 'nav-hamburger-btn--active' : ''}`}
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label={menuOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'}
            aria-expanded={menuOpen}
          >
            <span className="hamburger-line" />
            <span className="hamburger-line" />
            <span className="hamburger-line" />
          </button>

          <Link to="/" className="navbar-brand">
            <img src="/assets/logo_mixpoint.png" alt="Mix Point Logo" className="navbar-logo-img" />
            <div className="navbar-brand-titles">
              <span className="navbar-brand-name">Mix Point</span>
              <span className="navbar-brand-tagline">Frutos Secos Premium</span>
            </div>
          </Link>

          {/* ENLACES DESKTOP */}
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

      {/* DRAWER MÓVIL Y BACKDROP */}
      {menuOpen && (
        <div
          className="nav-drawer-backdrop"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`nav-drawer ${menuOpen ? 'nav-drawer--open' : ''}`}
        aria-label="Menú principal móvil"
        aria-hidden={!menuOpen}
      >
        <div className="nav-drawer-header">
          <div className="nav-drawer-brand">
            <img src="/assets/logo_mixpoint.png" alt="Mix Point Logo" className="nav-drawer-logo" />
            <div className="nav-drawer-titles">
              <span className="nav-drawer-name">Mix Point</span>
              <span className="nav-drawer-sub">Menú Principal</span>
            </div>
          </div>
          <button
            className="nav-drawer-close-btn"
            onClick={() => setMenuOpen(false)}
            aria-label="Cerrar menú"
          >
            ✕
          </button>
        </div>

        <nav className="nav-drawer-nav">
          <ul className="nav-drawer-links">
            <li>
              <NavLink to="/" end className={drawerNavClass} onClick={() => setMenuOpen(false)}>
                <span className="nav-drawer-icon">🏠</span>
                <span>Inicio</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/catalogo" className={drawerNavClass} onClick={() => setMenuOpen(false)}>
                <span className="nav-drawer-icon">🛒</span>
                <span>Catálogo Completo</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/envios" className={drawerNavClass} onClick={() => setMenuOpen(false)}>
                <span className="nav-drawer-icon">🚚</span>
                <span>Envíos a todo el país</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/contacto" className={drawerNavClass} onClick={() => setMenuOpen(false)}>
                <span className="nav-drawer-icon">✉️</span>
                <span>Contacto Directo</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/nosotros" className={drawerNavClass} onClick={() => setMenuOpen(false)}>
                <span className="nav-drawer-icon">🌿</span>
                <span>Sobre Nosotros</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/privacidad" className={drawerNavClass} onClick={() => setMenuOpen(false)}>
                <span className="nav-drawer-icon">🔒</span>
                <span>Privacidad y Cookies</span>
              </NavLink>
            </li>
          </ul>
        </nav>

        <div className="nav-drawer-footer">
          <a
            href={`https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent('¡Hola Mix Point! Quisiera hacerles una consulta comercial.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="nav-drawer-wa-btn"
          >
            <span>💬 Escribinos por WhatsApp</span>
          </a>
          <p className="nav-drawer-footer-text">Atención personalizada de Lun a Vie 8 a 18 hs</p>
        </div>
      </aside>
    </>
  );
}
