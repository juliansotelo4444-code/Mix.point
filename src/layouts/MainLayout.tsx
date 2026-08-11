import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { CartButton } from '../components/CartButton';
import { CartModal } from '../components/CartModal';
import { SocialBarTop } from '../components/SocialLinks';
import { ScrollToTop } from '../components/ScrollToTop';
import { CartProvider } from '../context/CartContext';
import '../App.css';

// Este layout envuelve TODAS las páginas (ver App.tsx). El Navbar, la
// barra de redes y el carrito viven acá arriba, así que persisten sin
// importar a qué página navegue el usuario — el <Outlet /> es donde se
// renderiza el contenido específico de cada página.
export function MainLayout() {
  return (
    <CartProvider>
      <ScrollToTop />
      <div className="app-container">

        <Navbar />

        <header className="header" id="inicio">
          <img src="/assets/logo_mixpoint.png" alt="Logo Mix Point" className="logo-header" />
          <h1>MIX POINT</h1>
          <p>Distribuidor mayorista de Frutos Secos</p>
        </header>

        <SocialBarTop />

        <main>
          <Outlet />
        </main>

        <CartButton />
        <CartModal />

      </div>
    </CartProvider>
  );
}