import { Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { ProductCard } from '../components/ProductCard';
import { useCartContext } from '../context/CartContext';
import { PageCTA } from '../components/PageCTA';
import { WelcomeBack } from '../components/WelcomeBack';
import { ReviewsSection } from '../components/ReviewsSection';

export function Home() {
  const { products, loading } = useProducts();
  const { addToCart } = useCartContext();

  // Teaser de productos: los primeros 4 del catálogo o favoritos
  const destacados = products.slice(0, 4);

  return (
    <>
      <WelcomeBack />

      {/* HERO SECTION — ESTILO ORGANIC & NATURAL PREMIUM */}
      <section className="hero-premium">
        <div className="hero-premium-container">
          <div className="hero-content">
            <span className="hero-badge">
              ✨ 100% Calidad Garantizada
            </span>

            <h1 className="hero-title">
              Sabor Natural y <em>Frescura Premium</em>
            </h1>

            <p className="hero-subtitle">
              Descubrí frutos secos, mix artesanales y alimentos naturales seleccionados de máxima calidad argentina. Venta mayorista y minorista con envíos directos a tu puerta.
            </p>

            <div className="hero-cta-group">
              <Link to="/catalogo" className="btn-primary">
                Explorar Catálogo 🛒
              </Link>
              <Link to="/contacto" className="btn-secondary">
                Pedir Asesoramiento 💬
              </Link>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-image-wrapper">
              <img
                src="/assets/fondo.frutos.jpg"
                alt="Frutos Secos Premium Mix Point"
                className="hero-image"
              />
            </div>
            <div className="hero-seal-badge">
              <span className="hero-seal-icon">🌿</span>
              <span className="hero-seal-text">Origen Argentino</span>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES / BENEFICIOS DESTACADOS */}
      <section className="features-bar">
        <div className="features-container">
          <div className="feature-item">
            <div className="feature-icon-box">🚚</div>
            <div className="feature-text">
              <h4>Envío a Domicilio</h4>
              <p>Entregas en AMBA e interior por Correo y Andreani.</p>
            </div>
          </div>

          <div className="feature-item">
            <div className="feature-icon-box">🌰</div>
            <div className="feature-text">
              <h4>Cosecha Seleccionada</h4>
              <p>Granos enteros y frescos directo de productores.</p>
            </div>
          </div>

          <div className="feature-item">
            <div className="feature-icon-box">🤝</div>
            <div className="feature-text">
              <h4>Venta Directa</h4>
              <p>Precios mayoristas para dietéticas y familias.</p>
            </div>
          </div>

          <div className="feature-item">
            <div className="feature-icon-box">🔒</div>
            <div className="feature-text">
              <h4>Garantía Total</h4>
              <p>Satisfacción 100% asegurada en cada pedido.</p>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCTOS DESTACADOS / FAVORITOS */}
      <section className="teaser-section">
        <div className="section-header">
          <span className="section-tag">Selección Especial</span>
          <h2 className="section-title">Nuestros Favoritos</h2>
          <p className="section-subtitle">Los productos más elegidos por su calidad y frescura inigualable.</p>
        </div>

        {loading ? (
          <p className="status-msg">Cargando productos destacados...</p>
        ) : (
          <div className="product-grid">
            {destacados.map((product) => (
              <ProductCard key={product.id} product={product} addToCart={addToCart} />
            ))}
          </div>
        )}

        <div className="teaser-cta-wrapper">
          <Link to="/catalogo" className="teaser-cta-btn">
            Ver catálogo completo ({products.length} productos) →
          </Link>
        </div>
      </section>

      {/* PROMICIONES / FLYER */}
      <section className="promotions-section">
        <picture>
          <source media="(min-width: 800px)" srcSet="/assets/Flyer-mix-point.png" />
          <img src="/assets/Flyer-mix-vertical.png" alt="Promoción Mix Point" className="flyer" />
        </picture>
      </section>

      {/* SECCIÓN DE OPINIONES DE COMPRADORES */}
      <ReviewsSection />

      {/* TEASERS GRID: NOSOTROS Y ENVÍOS */}
      <section className="teaser-grid-section">
        <div className="teaser-info-card">
          <span className="teaser-icon">🌾</span>
          <h3>Distribuidora Familiar</h3>
          <p>Trabajamos directo con productores agropecuarios para garantizar mercadería fresca y bien conservada.</p>
          <Link to="/nosotros" className="teaser-link">Conocé nuestra historia →</Link>
        </div>

        <div className="teaser-info-card teaser-info-card--accent">
          <span className="teaser-icon">🚚</span>
          <h3>Logística y Envíos</h3>
          <p>Entregas periódicas en zona oeste, norte y sur. Despachos rápidos a todo el país.</p>
          <Link to="/envios" className="teaser-link">Ver zonas y condiciones →</Link>
        </div>
      </section>

      <PageCTA
        texto="¿Tenés una dietética, comercio o querés comprar por bulto cerrado?"
        linkTexto="Pedí lista de precios mayorista"
        to="/contacto"
        icono="📦"
      />
    </>
  );
}