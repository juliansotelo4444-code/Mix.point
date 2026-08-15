import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { ProductCard } from '../components/ProductCard';
import { useCartContext } from '../context/CartContext';
import { PageCTA } from '../components/PageCTA';
import { WelcomeBack } from '../components/WelcomeBack';

const slides = [
  {
    id: 1,
    titulo: "¡DESCUBRE EL SABOR DE LA CALIDAD!",
    subtitulo: "Nueces y Frutos Secos Premium de Origen Argentino",
    badge: "BIENVENIDOS A MIX POINT",
  },
  {
    id: 2,
    titulo: "LOS FAVORITOS DE NUESTROS CLIENTES",
    subtitulo: "Selección especial de temporada con la máxima frescura",
    badge: "⭐ NUEVA COSECHA",
  },
  {
    id: 3,
    titulo: "CALIDAD 100% GARANTIZADA",
    subtitulo: "Si no estás satisfecho con tu pedido, te devolvemos tu dinero sin vueltas.",
    badge: "🔒 COMPRA SEGURA",
  }
];

export function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { products } = useProducts();
  const { addToCart } = useCartContext();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Teaser de productos: los primeros 4 del catálogo.
  // Si más adelante tenés un campo tipo `destacado: boolean` en tus
  // productos, cambiá esta línea por products.filter(p => p.destacado).
  const destacados = products.slice(0, 4);

  return (
    <>
      <WelcomeBack />

      {/* CARRUSEL HERO / GALERÍA DINÁMICA */}
      <section className="hero-carousel-section" style={{ position: 'relative', overflow: 'hidden', margin: '20px auto', maxWidth: '1200px', borderRadius: '12px', boxShadow: '0 8px 25px rgba(0,0,0,0.5)' }}>
        <div className="carousel-inner" style={{
          background: currentSlide === 1
            ? 'linear-gradient(135deg, #1f1f1f 0%, #111111 100%)'
            : currentSlide === 2
            ? 'linear-gradient(135deg, #2b2518 0%, #14120c 100%)'
            : 'linear-gradient(135deg, #11161d 0%, #0a0c10 100%)',
          color: '#fff',
          padding: '60px 30px',
          textAlign: 'center',
          minHeight: '320px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          border: '2px solid #d4af37',
          transition: 'background 0.5s ease-in-out'
        }}>
          <span style={{ backgroundColor: '#d4af37', color: '#000', padding: '5px 15px', borderRadius: '20px', fontSize: '13px', fontWeight: '800', marginBottom: '15px', letterSpacing: '1px' }}>
            {slides[currentSlide].badge}
          </span>
          <h2 style={{ fontSize: '32px', color: '#d4af37', marginBottom: '12px', fontWeight: '800', textTransform: 'uppercase', textShadow: '0 2px 4px rgba(0,0,0,0.4)' }}>
            {slides[currentSlide].titulo}
          </h2>
          <p style={{ fontSize: '18px', color: '#e0e0e0', maxWidth: '700px', marginBottom: '30px', lineHeight: '1.5' }}>
            {slides[currentSlide].subtitulo}
          </p>
          <Link to="/catalogo" style={{ backgroundColor: '#d4af37', color: '#000', padding: '12px 30px', borderRadius: '6px', fontWeight: 'bold', textDecoration: 'none', fontSize: '15px', boxShadow: '0 4px 10px rgba(212, 175, 55, 0.4)' }}>
            VER CATÁLOGO MAYORISTA 🛒
          </Link>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', padding: '12px', background: '#0a0a0a' }}>
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Ir al slide ${index + 1}`}
              style={{
                width: currentSlide === index ? '30px' : '12px',
                height: '10px',
                borderRadius: '5px',
                border: 'none',
                backgroundColor: currentSlide === index ? '#d4af37' : '#555',
                cursor: 'pointer',
                transition: 'width 0.3s'
              }}
            />
          ))}
        </div>
      </section>

      <section className="promotions-section">
        <picture>
          <source media="(min-width: 800px)" srcSet="/assets/Flyer-mix-point.png" />
          <img src="/assets/Flyer-mix-vertical.png" alt="Promoción Mix Point" className="flyer" />
        </picture>
      </section>

      {/* TEASER: productos destacados -> empuja al catálogo completo */}
      <section className="teaser-section">
        <h2 className="section-title">Nuestros favoritos</h2>
        <div className="product-grid">
          {destacados.map((product) => (
            <ProductCard key={product.id} product={product} addToCart={addToCart} />
          ))}
        </div>
        <div className="teaser-cta-wrapper">
          <Link to="/catalogo" className="teaser-cta-btn">Ver catálogo completo →</Link>
        </div>
      </section>

      {/* TEASERS: nosotros + envíos, como tarjetas con ícono */}
      <section className="teaser-grid-section">
        <div className="teaser-info-card">
          <span className="teaser-icon">🌾</span>
          <h3>Somos una distribuidora familiar</h3>
          <p>Compramos directo a productores, mercadería fresca y bien cuidada.</p>
          <Link to="/nosotros" className="teaser-link">Conocé nuestra historia →</Link>
        </div>

        <div className="teaser-info-card teaser-info-card--accent">
          <span className="teaser-icon">🚚</span>
          <h3>Envíos a todo el país</h3>
          <p>Zona oeste, norte y sur con entregas propias. Interior por Correo Argentino y Andreani.</p>
          <Link to="/envios" className="teaser-link">Ver zonas de entrega →</Link>
        </div>
      </section>

      <PageCTA
        texto="¿Tenés dudas sobre tu compra o querés precios mayoristas?"
        linkTexto="Pedí asesoramiento"
        to="/contacto"
        icono="🤝"
      />
    </>
  );
}