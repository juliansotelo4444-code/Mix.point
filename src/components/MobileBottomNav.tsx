import { NavLink } from 'react-router-dom';
import { useCartContext } from '../context/CartContext';
import { WHATSAPP_NUMERO } from '../config/constants';

export function MobileBottomNav() {
  const { cartCount, setShowCart } = useCartContext();

  const handleWhatsAppClick = () => {
    const texto = 'Hola Mix Point! Estoy navegando desde mi celular y me gustaría consultar por sus productos y lista de precios.';
    window.open(`https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(texto)}`, '_blank');
  };

  return (
    <nav className="mobile-bottom-nav" aria-label="Navegación móvil principal">
      <NavLink
        to="/"
        end
        className={({ isActive }) =>
          `mobile-nav-item ${isActive ? 'mobile-nav-item--active' : ''}`
        }
      >
        <span className="mobile-nav-icon" aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </span>
        <span className="mobile-nav-label">Inicio</span>
      </NavLink>

      <NavLink
        to="/catalogo"
        className={({ isActive }) =>
          `mobile-nav-item ${isActive ? 'mobile-nav-item--active' : ''}`
        }
      >
        <span className="mobile-nav-icon" aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
          </svg>
        </span>
        <span className="mobile-nav-label">Catálogo</span>
      </NavLink>

      <button
        type="button"
        onClick={handleWhatsAppClick}
        className="mobile-nav-item mobile-nav-item--wa"
        aria-label="Consultar por WhatsApp"
      >
        <span className="mobile-nav-icon mobile-nav-icon--wa" aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
        </span>
        <span className="mobile-nav-label">WhatsApp</span>
      </button>

      <button
        type="button"
        onClick={() => setShowCart(true)}
        className="mobile-nav-item mobile-nav-item--cart"
        aria-label={`Ver carrito (${cartCount} productos)`}
      >
        <span className="mobile-nav-icon" aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          {cartCount > 0 && (
            <span className="mobile-nav-cart-badge">{cartCount}</span>
          )}
        </span>
        <span className="mobile-nav-label">Carrito</span>
      </button>
    </nav>
  );
}

