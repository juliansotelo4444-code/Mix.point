import { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useCartContext } from '../context/CartContext';

export function Navbar() {
  const { cartCount, setShowCart } = useCartContext();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Cerrar menú móvil al navegar
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchTerm.trim();
    if (q) {
      navigate(`/catalogo?buscar=${encodeURIComponent(q)}`);
    } else {
      navigate('/catalogo');
    }
  };

  const navLinkStyle = ({ isActive }: { isActive: boolean }) =>
    `inline-flex items-center py-2.5 px-3 text-sm font-semibold transition-colors duration-150 border-b-2 ${
      isActive
        ? 'text-[#76A33E] border-[#76A33E]'
        : 'text-gray-700 hover:text-[#76A33E] border-transparent'
    }`;

  const drawerLinkStyle = ({ isActive }: { isActive: boolean }) =>
    `block py-3 px-4 text-base font-semibold rounded-lg transition-colors ${
      isActive
        ? 'text-[#76A33E] bg-[#f2f7ec]'
        : 'text-gray-800 hover:bg-gray-100'
    }`;

  return (
    <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm font-sans">
      {/* 1. FILA SUPERIOR (Logo + Buscador amplio + Usuario + Carrito) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Lado Izquierdo: Botón Hamburguesa Móvil + Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:text-[#76A33E] hover:bg-gray-100 focus:outline-none"
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          >
            {menuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>

          <Link to="/" className="flex items-center gap-2.5 group">
            <img
              src="/assets/logo_mixpoint.png"
              alt="Mix Point"
              className="w-10 h-10 object-contain rounded-full shadow-sm"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <div className="flex flex-col">
              <span className="font-extrabold text-xl md:text-2xl tracking-tight text-gray-900 group-hover:text-[#76A33E] transition-colors">
                MIX POINT
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500">
                Distribuidora Mayorista
              </span>
            </div>
          </Link>
        </div>

        {/* Centro / Derecha: Barra de Búsqueda Amplia */}
        <div className="flex-1 max-w-xl mx-2 hidden sm:block">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar frutos secos, mixes, semillas, harinas..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 hover:bg-gray-100/80 focus:bg-white text-gray-900 rounded-lg border border-gray-300 focus:border-[#76A33E] focus:ring-2 focus:ring-[#76A33E]/20 transition-all outline-none"
            />
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" strokeWidth="2" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </span>
          </form>
        </div>

        {/* Lado Derecho: Acciones (Usuario + Carrito) */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Ícono Cuenta de Usuario */}
          <Link
            to="/catalogo"
            className="flex items-center gap-1.5 p-2 rounded-lg text-gray-700 hover:text-[#76A33E] hover:bg-gray-100 transition-colors"
            title="Lista de Precios Mayorista"
            aria-label="Cuenta y Catálogo"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="hidden xl:inline text-xs font-semibold uppercase tracking-wider text-gray-600">
              Mayorista
            </span>
          </Link>

          {/* Botón Carrito con Contador Circular Verde Oliva (#76A33E) */}
          <button
            onClick={() => setShowCart(true)}
            className="relative flex items-center justify-center p-2 rounded-lg text-gray-800 hover:text-[#76A33E] hover:bg-gray-100 transition-colors group"
            aria-label={`Ver carrito de compras con ${cartCount} productos`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>

            {cartCount > 0 ? (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#76A33E] text-white text-[11px] font-black flex items-center justify-center shadow-sm ring-2 ring-white animate-in zoom-in">
                {cartCount}
              </span>
            ) : (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-gray-300 ring-2 ring-white" />
            )}
          </button>
        </div>
      </div>

      {/* 2. FILA INFERIOR (Sub-navbar): Enlaces alineados a la izquierda */}
      <div className="w-full bg-white border-t border-gray-100 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <nav className="flex items-center gap-2 -mb-px">
            <NavLink to="/" end className={navLinkStyle}>
              Inicio
            </NavLink>
            <NavLink to="/catalogo" className={navLinkStyle}>
              Productos
            </NavLink>
            <NavLink to="/contacto" className={navLinkStyle}>
              Contacto
            </NavLink>
          </nav>

          <div className="flex items-center gap-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <span className="flex items-center gap-1.5 text-emerald-800">
              <span className="w-2 h-2 rounded-full bg-[#76A33E] inline-block animate-pulse" />
              Precios Mayoristas Directos
            </span>
            <span className="text-gray-300">•</span>
            <span>Envíos CABA y GBA</span>
          </div>
        </div>
      </div>

      {/* 3. BUSCADOR EN MÓVILES (Fila extra para pantallas pequeñas) */}
      <div className="sm:hidden px-4 pb-3 pt-1 border-t border-gray-100">
        <form onSubmit={handleSearchSubmit} className="relative w-full">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar productos..."
            className="w-full pl-9 pr-3 py-1.5 text-sm bg-gray-50 rounded-lg border border-gray-300 focus:border-[#76A33E] focus:outline-none"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" strokeWidth="2" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>
        </form>
      </div>

      {/* 4. MENÚ MÓVIL DESPLEGABLE (DRAWER) */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 px-4 pt-2 pb-5 space-y-1 shadow-lg animate-in slide-in-from-top-2">
          <NavLink to="/" end className={drawerLinkStyle}>
            Inicio
          </NavLink>
          <NavLink to="/catalogo" className={drawerLinkStyle}>
            Productos
          </NavLink>
          <NavLink to="/contacto" className={drawerLinkStyle}>
            Contacto
          </NavLink>
          <div className="pt-3 border-t border-gray-100 mt-2">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              Atención Mayorista
            </p>
            <p className="text-sm font-semibold text-gray-800">
              WhatsApp: +54 9 11 5707-7061
            </p>
          </div>
        </div>
      )}
    </header>
  );
}
export default Navbar;
