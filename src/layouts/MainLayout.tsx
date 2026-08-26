import { Outlet, Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { CartButton } from '../components/CartButton';
import { CartModal } from '../components/CartModal';
import { SocialBarTop } from '../components/SocialLinks';
import { ScrollToTop } from '../components/ScrollToTop';
import { CartProvider } from '../context/CartContext';
import '../App.css';

export function MainLayout() {
  return (
    <CartProvider>
      <ScrollToTop />
      <div className="app-container">
        <SocialBarTop />
        <Navbar />

        <main>
          <Outlet />
        </main>

        <footer style={{
          backgroundColor: 'var(--primary-green)',
          color: 'var(--text-white)',
          padding: '50px 24px 30px',
          marginTop: 'auto',
          borderTop: '1px solid var(--border-light)'
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '36px',
            marginBottom: '40px'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                <img src="/assets/logo_mixpoint.png" alt="Mix Point" style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#fff' }} />
                <span style={{ fontFamily: 'var(--font-title)', fontSize: '1.4rem', fontWeight: 700, color: '#fff' }}>Mix Point</span>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', lineHeight: '1.6', margin: 0 }}>
                Distribuidora mayorista y minorista de frutos secos, cereales y alimentos naturales. Calidad prémium directo de productores.
              </p>
            </div>

            <div>
              <h4 style={{ fontFamily: 'var(--font-title)', fontSize: '1.1rem', color: 'var(--accent-gold)', margin: '0 0 14px' }}>Navegación</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem' }}>
                <li><Link to="/" style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none' }}>Inicio</Link></li>
                <li><Link to="/catalogo" style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none' }}>Catálogo Mayorista & Minorista</Link></li>
                <li><Link to="/envios" style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none' }}>Zonas de Envío</Link></li>
                <li><Link to="/contacto" style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none' }}>Atención a Comercios</Link></li>
                <li><Link to="/nosotros" style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none' }}>Nuestra Historia</Link></li>
              </ul>
            </div>

            <div>
              <h4 style={{ fontFamily: 'var(--font-title)', fontSize: '1.1rem', color: 'var(--accent-gold)', margin: '0 0 14px' }}>Contacto Directo</h4>
              <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem', margin: '0 0 8px' }}>📍 Buenos Aires, Argentina</p>
              <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem', margin: '0 0 8px' }}>📱 WhatsApp: <a href="https://wa.me/5491131469587" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-gold)', textDecoration: 'none', fontWeight: 600 }}>+54 9 11 3146-9587</a></p>
              <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem', margin: 0 }}>📸 Instagram: <a href="https://www.instagram.com/mixpoint.frutossecos/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-gold)', textDecoration: 'none', fontWeight: 600 }}>@mixpoint.frutossecos</a></p>
            </div>
          </div>

          <div style={{
            borderTop: '1px solid rgba(255,255,255,0.15)',
            paddingTop: '20px',
            textAlign: 'center',
            fontSize: '0.82rem',
            color: 'rgba(255,255,255,0.6)'
          }}>
            © {new Date().getFullYear()} Mix Point. Todos los derechos reservados. Alimentos naturales y frutos secos de máxima calidad.
          </div>
        </footer>

        <CartButton />
        <CartModal />
      </div>
    </CartProvider>
  );
}