import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useCartContext } from '../context/CartContext';
import { FeaturedCarousel } from '../components/FeaturedCarousel';
import { PageCTA } from '../components/PageCTA';
import { WelcomeBack } from '../components/WelcomeBack';
import { ReviewsSection } from '../components/ReviewsSection';
import { DesktopVideoPresentation } from '../components/DesktopVideoPresentation';

interface CategoryItem {
  id: string;
  nombre: string;
  icono: string;
  descripcion: string;
  filtroUrl: string;
  badge: string;
}

const CATEGORIAS_VISUALES: CategoryItem[] = [
  {
    id: 'frutos-secos',
    nombre: 'Frutos Secos',
    icono: '🌰',
    descripcion: 'Nueces Chandler Extra Light, Almendras Guara, Castañas de Cajú y Pistachos.',
    filtroUrl: '/catalogo?categoria=Frutos%20Secos',
    badge: 'Más Vendidos',
  },
  {
    id: 'mixes',
    nombre: 'Mixes Artesanales',
    icono: '🍇',
    descripcion: 'Mix Patagonia, Clásico, Fitness, Cervecero y Frutos Rojos tostados al punto.',
    filtroUrl: '/catalogo?buscar=Mix',
    badge: 'Elaboración Propia',
  },
  {
    id: 'semillas',
    nombre: 'Semillas & Cereales',
    icono: '🌾',
    descripcion: 'Chía, Sésamo integral, Lino dorado, Avena gruesa tradicional y Quinoa pura.',
    filtroUrl: '/catalogo?categoria=Semillas',
    badge: '100% Natural',
  },
  {
    id: 'aceites',
    nombre: 'Aceites & Condimentos',
    icono: '🫒',
    descripcion: 'Aceite de oliva extra virgen prensado en frío, sales marinas y especias puras.',
    filtroUrl: '/catalogo?categoria=Aceites',
    badge: 'Calidad Gourmet',
  },
  {
    id: 'reposteria',
    nombre: 'Chocolates & Repostería',
    icono: '🍫',
    descripcion: 'Gotas de chocolate 70%, cacao amargo, harinas de almendra y coco rallado.',
    filtroUrl: '/catalogo?categoria=Reposteria',
    badge: 'Sin TACC / Saludable',
  },
  {
    id: 'snacks',
    nombre: 'Snacks & Frutas Desecadas',
    icono: '🍌',
    descripcion: 'Dátiles seleccionados, pasas de uva morochas, chips de banana y maní tostado.',
    filtroUrl: '/catalogo?categoria=Snacks',
    badge: 'Energía Diaria',
  },
];

export function Home() {
  const { products, loading } = useProducts();
  const { addToCart } = useCartContext();
  const navigate = useNavigate();

  const [heroSearch, setHeroSearch] = useState('');

  useEffect(() => {
    document.title = 'Mix Point | Frutos Secos & Mix Artesanales Premium';
  }, []);

  const handleHeroSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = heroSearch.trim();
    if (query) {
      navigate(`/catalogo?buscar=${encodeURIComponent(query)}`);
    } else {
      navigate('/catalogo');
    }
  };

  return (
    <div className="home-page">
      <WelcomeBack />

      {/* ── 1. HERO SECTION REDISEÑADO CON BUSCADOR INTERACTIVO & VALUE METRICS ── */}
      <section className="hero-premium">
        <div className="hero-premium-container">
          <div className="hero-content">
            <span className="hero-badge">
              <span className="hero-badge-dot" aria-hidden="true" />
              🌿 Cosecha Directa & Alimentos Naturales
            </span>

            <h1 className="hero-title">
              Sabor Natural y <em>Frescura Prémium</em> Directo de Origen
            </h1>

            <p className="hero-subtitle">
              Nueces seleccionadas, mixes artesanales recién tostados y alimentos saludables. Venta minorista y bultos cerrados para dietéticas con envíos seguros a todo el país.
            </p>

            {/* BUSCADOR INSTANTÁNEO EN EL HERO */}
            <form onSubmit={handleHeroSearchSubmit} className="hero-search-box" role="search">
              <span className="hero-search-icon" aria-hidden="true">🔍</span>
              <input
                type="text"
                placeholder="¿Qué producto buscás? (ej: almendras, nueces, chía)..."
                value={heroSearch}
                onChange={(e) => setHeroSearch(e.target.value)}
                className="hero-search-input"
                aria-label="Buscar producto en el catálogo"
              />
              <button type="submit" className="hero-search-submit">
                Buscar
              </button>
            </form>

            {/* CHIPS DE ACCESO DIRECTO RÁPIDO */}
            <div className="hero-quick-chips">
              <span className="hero-chips-label">Populares:</span>
              {['Nueces', 'Almendras', 'Mix Patagonia', 'Aceite de Oliva', 'Chía'].map((item) => (
                <Link
                  key={item}
                  to={`/catalogo?buscar=${encodeURIComponent(item)}`}
                  className="hero-chip-pill"
                >
                  {item}
                </Link>
              ))}
            </div>

            {/* BOTONES PRINCIPALES DE LLAMADO A LA ACCIÓN */}
            <div className="hero-cta-group">
              <Link to="/catalogo" className="btn-primary">
                Explorar Catálogo Completo 🛒
              </Link>
              <Link to="/contacto" className="btn-secondary">
                Atención Mayorista 💬
              </Link>
            </div>

            {/* VALUE METRICS / PROMESAS DE MARCA */}
            <div className="hero-trust-bar">
              <div className="hero-trust-item">
                <strong>+{products.length > 0 ? products.length : 250}</strong>
                <span>Variedades</span>
              </div>
              <div className="hero-trust-sep" aria-hidden="true">·</div>
              <div className="hero-trust-item">
                <strong>Mayorista</strong>
                <span>Bultos y Kilos</span>
              </div>
              <div className="hero-trust-sep" aria-hidden="true">·</div>
              <div className="hero-trust-item">
                <strong>Envíos</strong>
                <span>A Todo el País</span>
              </div>
              <div className="hero-trust-sep" aria-hidden="true">·</div>
              <div className="hero-trust-item">
                <strong>4.9 ★</strong>
                <span>Calificación</span>
              </div>
            </div>
          </div>

          {/* VISUAL SHOWCASE CON FOTOGRAFÍA Y TARJETAS FLOTANTES */}
          <div className="hero-visual">
            <div className="hero-image-wrapper">
              <img
                src="/assets/fondo.frutos.jpg"
                alt="Frutos Secos Premium Mix Point"
                className="hero-image"
                loading="eager"
              />
              <div className="hero-image-overlay" />
            </div>

            {/* TARJETA FLOTANTE 1: PRODUCTO ESTRELLA */}
            <div className="hero-floating-card hero-floating-card--top">
              <span className="floating-card-icon">⭐</span>
              <div className="floating-card-info">
                <span className="floating-card-title">Nueces Chandler</span>
                <span className="floating-card-sub">Cosecha Extra Light</span>
              </div>
            </div>

            {/* TARJETA FLOTANTE 2: MIX ARTESANAL */}
            <div className="hero-floating-card hero-floating-card--bottom">
              <span className="floating-card-icon">🔥</span>
              <div className="floating-card-info">
                <span className="floating-card-title">Mix Patagonia</span>
                <span className="floating-card-sub">Elaboración Semanal</span>
              </div>
            </div>

            {/* SELLO DE CALIDAD */}
            <div className="hero-seal-badge">
              <span className="hero-seal-icon">🌿</span>
              <span className="hero-seal-text">Origen Argentino</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. SECCIÓN EXPLORÁ POR CATEGORÍA ── */}
      <section className="home-categories-section" aria-label="Explorar por categoría de producto">
        <div className="home-categories-container">
          <div className="section-header">
            <span className="section-tag">Variedad de la Huerta a tu Mesa</span>
            <h2 className="section-title">Explorá Nuestras Categorías</h2>
            <p className="section-subtitle">
              Encontrá rápidamente lo que buscás: frutos secos puros, mixes saludables, harinas y productos gourmet.
            </p>
          </div>

          <div className="home-categories-grid">
            {CATEGORIAS_VISUALES.map((cat) => (
              <Link
                key={cat.id}
                to={cat.filtroUrl}
                className="home-category-card"
              >
                <div className="home-cat-badge">{cat.badge}</div>
                <div className="home-cat-icon-box">{cat.icono}</div>
                <h3 className="home-cat-title">{cat.nombre}</h3>
                <p className="home-cat-desc">{cat.descripcion}</p>
                <span className="home-cat-link-text">
                  Ver productos <span aria-hidden="true">→</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. CARRUSEL DE PRODUCTOS DESTACADOS DE LA SEMANA (EXCEL BASE) ── */}
      <section className="teaser-section">
        {loading ? (
          <p className="status-msg">Cargando productos destacados de la huerta...</p>
        ) : (
          <FeaturedCarousel
            products={products}
            addToCart={addToCart}
            title="Destacados de la Semana"
            subtitle="Los 5 frutos secos y mixes más pedidos de nuestro catálogo con precios mayoristas directos."
          />
        )}

        <div className="teaser-cta-wrapper" style={{ marginTop: '24px' }}>
          <Link to="/catalogo" className="teaser-cta-btn">
            Explorar catálogo completo ({products.length > 0 ? products.length : 250} productos) →
          </Link>
        </div>
      </section>

      {/* ── 4. BENTO GRID: ¿POR QUÉ ELEGIR MIX POINT? ── */}
      <section className="bento-section" aria-label="Ventajas comerciales y propuesta de valor de Mix Point">
        <div className="bento-container">
          <div className="section-header">
            <span className="section-tag">Nuestra Propuesta de Valor</span>
            <h2 className="section-title">¿Por Qué Elegir Mix Point?</h2>
            <p className="section-subtitle">
              Combinamos calidad de cosecha prémium, precios directos sin intermediarios y un servicio de logística pensado para comercios y familias.
            </p>
          </div>

          <div className="bento-grid">
            {/* Tarjeta Destacada Grande: Mayorista */}
            <div className="bento-card bento-card--large">
              <div className="bento-badge">Atención a Comercios y Dietéticas</div>
              <h3 className="bento-title">Precios Mayoristas Directos por Bulto Cerrado</h3>
              <p className="bento-desc">
                Accedé a escalas preferenciales en bolsas de 5kg, 10kg y bultos de 25kg/30kg. Ideales para dietéticas, repostería, cafeterías y revendedores independientes en todo el país.
              </p>
              <div className="bento-wholesale-perks">
                <span className="bento-perk-item">✓ Ahorro de hasta el 25% por escala</span>
                <span className="bento-perk-item">✓ Facturación comercial A y B</span>
                <span className="bento-perk-item">✓ Asesor comercial directo vía WhatsApp</span>
              </div>
              <div className="bento-actions">
                <Link to="/contacto" className="btn-bento-primary">
                  Pedir Lista Mayorista por WhatsApp 📱
                </Link>
                <Link to="/catalogo" className="btn-bento-secondary">
                  Ver Productos en Catálogo →
                </Link>
              </div>
            </div>

            {/* Tarjeta 2: Calidad en Origen */}
            <div className="bento-card">
              <div className="bento-icon-box">🌰</div>
              <h3 className="bento-title">Cosecha Seleccionada y Frescura</h3>
              <p className="bento-desc">
                Granos enteros, crocantes y con aroma natural intacto. Cuidamos cada lote para evitar humedad y conservar todas las propiedades nutricionales.
              </p>
              <span className="bento-pill-tag">🌿 Origen Nacional</span>
            </div>

            {/* Tarjeta 3: Logística Ágil */}
            <div className="bento-card">
              <div className="bento-icon-box">🚚</div>
              <h3 className="bento-title">Envíos en AMBA y Despachos Nacionales</h3>
              <p className="bento-desc">
                Entregas periódicas en Zona Oeste, Norte, Sur y CABA. Despachos rápidos al interior por Correo Argentino y Andreani con seguimiento online.
              </p>
              <Link to="/envios" className="bento-card-link">
                Conocer Zonas y Logística →
              </Link>
            </div>

            {/* Tarjeta 4: Garantía Total */}
            <div className="bento-card">
              <div className="bento-icon-box">🛡️</div>
              <h3 className="bento-title">Garantía de Satisfacción 100%</h3>
              <p className="bento-desc">
                Si algún producto no llega en óptimas condiciones o no cumple tus expectativas, te brindamos cambio inmediato o reintegro sin complicaciones.
              </p>
              <span className="bento-pill-tag">✨ Confianza Total</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. VIDEO INSTITUCIONAL RESPONSIVE ── */}
      <DesktopVideoPresentation />

      {/* ── 6. SECCIÓN DE OPINIONES DE COMPRADORES Y DIETÉTICAS ── */}
      <ReviewsSection />

      {/* ── 7. BANNER CTA FINAL DE CONVERSIÓN ── */}
      <PageCTA
        texto="¿Tenés una dietética, comercio o querés comprar por bulto cerrado?"
        linkTexto="Pedí lista de precios mayorista"
        to="/contacto"
        icono="📦"
      />
    </div>
  );
}
