import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useCartContext } from '../context/CartContext';
import { FeaturedCarousel } from '../components/FeaturedCarousel';
import { PageCTA } from '../components/PageCTA';
import { WelcomeBack } from '../components/WelcomeBack';

interface CategoryItem {
  id: string;
  nombre: string;
  nombreCorto: string;
  icono: string;
  descripcion: string;
  filtroUrl: string;
  badge: string;
}

const CATEGORIAS_VISUALES: CategoryItem[] = [
  {
    id: 'frutos-secos',
    nombre: 'Frutos Secos',
    nombreCorto: 'Frutos Secos',
    icono: '🌰',
    descripcion: 'Nueces Chandler Extra Light, Almendras Guara, Castañas de Cajú y Pistachos.',
    filtroUrl: '/catalogo?categoria=Frutos%20Secos',
    badge: 'Destacados',
  },
  {
    id: 'mixes',
    nombre: 'Mixes Artesanales',
    nombreCorto: 'Mixes',
    icono: '🍇',
    descripcion: 'Mix Patagonia, Clásico, Fitness, Cervecero y combinaciones especiales.',
    filtroUrl: '/catalogo?buscar=Mix',
    badge: 'Elaboración Propia',
  },
  {
    id: 'semillas',
    nombre: 'Semillas & Cereales',
    nombreCorto: 'Semillas',
    icono: '🌾',
    descripcion: 'Chía, Sésamo integral, Lino dorado, Avena gruesa tradicional y Quinoa pura.',
    filtroUrl: '/catalogo?categoria=Semillas',
    badge: '100% Natural',
  },
  {
    id: 'aceites',
    nombre: 'Aceites & Condimentos',
    nombreCorto: 'Aceites',
    icono: '🫒',
    descripcion: 'Aceite de oliva extra virgen prensado en frío, sales marinas y especias seleccionadas.',
    filtroUrl: '/catalogo?categoria=Aceites',
    badge: 'Gourmet',
  },
  {
    id: 'reposteria',
    nombre: 'Chocolates & Repostería',
    nombreCorto: 'Chocolates',
    icono: '🍫',
    descripcion: 'Gotas de chocolate, cacao puro, harinas de frutos secos y coco rallado.',
    filtroUrl: '/catalogo?categoria=Reposteria',
    badge: 'Repostería Saludable',
  },
  {
    id: 'snacks',
    nombre: 'Snacks & Frutas Desecadas',
    nombreCorto: 'Snacks',
    icono: '🍌',
    descripcion: 'Dátiles, pasas de uva morochas y rubias, chips de banana y maní tostado.',
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
    document.title = 'Mix Point | Frutos Secos & Alimentos Naturales';
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

      {/* ══════════════════════════════════════════════════════════════
          1. EXPERIENCIA EXCLUSIVA MÓVIL: RÁPIDA, DIRECTA Y TIPO APP
          ══════════════════════════════════════════════════════════════ */}
      <section className="mobile-home-hub" aria-label="Portada móvil rápida">
        <div className="mobile-hub-header">
          <span className="mobile-hub-badge">🌿 Venta Mayorista & Minorista</span>
          <h1 className="mobile-hub-title">Frutos Secos & Mixes Prémium</h1>
          <p className="mobile-hub-sub">Precios directos de origen con envíos a todo el país.</p>
        </div>

        {/* BUSCADOR INSTANTÁNEO MÓVIL CON BOTÓN TÁCTIL */}
        <form onSubmit={handleHeroSearchSubmit} className="mobile-search-bar" role="search">
          <span className="mobile-search-icon" aria-hidden="true">🔍</span>
          <input
            type="text"
            placeholder="Buscar frutos secos, mix, semillas..."
            value={heroSearch}
            onChange={(e) => setHeroSearch(e.target.value)}
            className="mobile-search-input"
            aria-label="Buscar producto en el catálogo"
          />
          {heroSearch ? (
            <button
              type="button"
              onClick={() => setHeroSearch('')}
              className="mobile-search-clear-btn"
              aria-label="Limpiar búsqueda"
            >
              ✕
            </button>
          ) : (
            <button type="submit" className="mobile-search-submit-btn">
              Ir
            </button>
          )}
        </form>

        {/* CARRUSEL DE CATEGORÍAS CON AVATARES CIRCULARES (ESTILO STORIES TÁCTIL) */}
        <div className="mobile-categories-slider-wrapper">
          <div className="mobile-categories-slider">
            {CATEGORIAS_VISUALES.map((cat) => (
              <Link
                key={cat.id}
                to={cat.filtroUrl}
                className="mobile-category-bubble"
              >
                <div className="mobile-category-avatar">
                  <span className="mobile-avatar-emoji">{cat.icono}</span>
                </div>
                <span className="mobile-category-label">{cat.nombreCorto}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* BANNER RÁPIDO PARA NEGOCIOS Y DIETÉTICAS EN CELULAR */}
        <div className="mobile-wholesale-card">
          <div className="mobile-wholesale-card-content">
            <span className="mobile-wholesale-pill">📦 Comercios & Dietéticas</span>
            <h3>¿Buscás precios por bulto cerrado?</h3>
            <p>Escalas en bolsas de 5kg, 10kg y bultos cerrados con atención comercial directa.</p>
          </div>
          <Link to="/contacto" className="btn-mobile-wholesale-cta">
            Pedir Lista por WhatsApp 💬
          </Link>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          2. EXPERIENCIA EXCLUSIVA COMPUTADORA: PANORÁMICA, RICA Y BOUTIQUE
          ══════════════════════════════════════════════════════════════ */}
      <section className="hero-premium hero-premium-desktop-only">
        <div className="hero-premium-container">
          <div className="hero-content">
            <span className="hero-badge">
              <span className="hero-badge-dot" aria-hidden="true" />
              🌿 Distribuidora de Frutos Secos & Alimentos Naturales
            </span>

            <h1 className="hero-title">
              Calidad y Frescura <em>Directo a tu Puerta</em>
            </h1>

            <p className="hero-subtitle">
              Nueces seleccionadas, almendras, mixes y productos naturales. Venta fraccionada por kilo y bultos cerrados para dietéticas, comercios y consumo familiar en todo el país.
            </p>

            {/* BUSCADOR DIRECTO EN EL HERO DESKTOP */}
            <form onSubmit={handleHeroSearchSubmit} className="hero-search-box" role="search">
              <span className="hero-search-icon" aria-hidden="true">🔍</span>
              <input
                type="text"
                placeholder="¿Qué producto estás buscando? (ej: almendras, nueces, chía)..."
                value={heroSearch}
                onChange={(e) => setHeroSearch(e.target.value)}
                className="hero-search-input"
                aria-label="Buscar producto en el catálogo"
              />
              <button type="submit" className="hero-search-submit">
                Buscar en Catálogo
              </button>
            </form>

            {/* CHIPS DE ACCESO DIRECTO DESKTOP */}
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

            {/* BOTONES PRINCIPALES DESKTOP */}
            <div className="hero-cta-group">
              <Link to="/catalogo" className="btn-primary">
                Explorar Catálogo Completo 🛒
              </Link>
              <Link to="/contacto" className="btn-secondary">
                Atención Mayorista 💬
              </Link>
            </div>

            {/* MÉTRICAS TRANSPARENTES DESKTOP */}
            <div className="hero-trust-bar">
              <div className="hero-trust-item">
                <strong>+{products.length > 0 ? products.length : 250}</strong>
                <span>Productos en Catálogo</span>
              </div>
              <div className="hero-trust-sep" aria-hidden="true">·</div>
              <div className="hero-trust-item">
                <strong>Bulto y Kilo</strong>
                <span>Mayorista & Minorista</span>
              </div>
              <div className="hero-trust-sep" aria-hidden="true">·</div>
              <div className="hero-trust-item">
                <strong>Envíos</strong>
                <span>A Todo el País</span>
              </div>
              <div className="hero-trust-sep" aria-hidden="true">·</div>
              <div className="hero-trust-item">
                <strong>Atención Directa</strong>
                <span>Vía WhatsApp</span>
              </div>
            </div>
          </div>

          {/* VISUAL SHOWCASE DESKTOP */}
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

            {/* TARJETAS FLOTANTES DESKTOP */}
            <div className="hero-floating-card hero-floating-card--top">
              <span className="floating-card-icon">⭐</span>
              <div className="floating-card-info">
                <span className="floating-card-title">Nueces Chandler</span>
                <span className="floating-card-sub">Partidas y Enteras</span>
              </div>
            </div>

            <div className="hero-floating-card hero-floating-card--bottom">
              <span className="floating-card-icon">🌿</span>
              <div className="floating-card-info">
                <span className="floating-card-title">Mixes y Frutos</span>
                <span className="floating-card-sub">Venta por Kilo y Bulto</span>
              </div>
            </div>

            <div className="hero-seal-badge">
              <span className="hero-seal-icon">🌿</span>
              <span className="hero-seal-text">Calidad Prémium</span>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          3. EXPLORÁ POR CATEGORÍA (GRILLA COMPLETA EN DESKTOP)
          ══════════════════════════════════════════════════════════════ */}
      <section className="home-categories-section home-categories-desktop-only" aria-label="Explorar por categoría de producto">
        <div className="home-categories-container">
          <div className="section-header">
            <span className="section-tag">Variedad y Calidad</span>
            <h2 className="section-title">Explorá Nuestras Categorías</h2>
            <p className="section-subtitle">
              Encontrá rápidamente lo que buscás: frutos secos puros, mixes artesanales, semillas, aceites y harinas.
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

      {/* ══════════════════════════════════════════════════════════════
          4. CARRUSEL DESTACADOS DE LA SEMANA (COMPARTIDO Y FLUIDO)
          ══════════════════════════════════════════════════════════════ */}
      <section className="teaser-section">
        {loading ? (
          <p className="status-msg">Cargando productos destacados del catálogo...</p>
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

      {/* ══════════════════════════════════════════════════════════════
          5. MODALIDADES DE COMPRA (BENTO GRID ADAPTATIVO)
          ══════════════════════════════════════════════════════════════ */}
      <section className="bento-section" aria-label="Modalidades de compra y propuesta de valor">
        <div className="bento-container">
          <div className="section-header">
            <span className="section-tag">Cómo Comprar en Mix Point</span>
            <h2 className="section-title">Modalidades para Cada Necesidad</h2>
            <p className="section-subtitle">
              Tanto si tenés un comercio como si querés abastecer tu hogar, contamos con opciones directas y claras.
            </p>
          </div>

          <div className="bento-grid">
            {/* Tarjeta Destacada Grande: Mayorista */}
            <div className="bento-card bento-card--large">
              <div className="bento-badge">Atención a Comercios y Dietéticas</div>
              <h3 className="bento-title">Precios Mayoristas Directos por Bulto Cerrado</h3>
              <p className="bento-desc">
                Accedé a precios preferenciales en bolsas cerradas de 5kg, 10kg y bultos de 25kg/30kg. Ideales para dietéticas, repostería, emprendedores gastronómicos y revendedores independientes.
              </p>
              <div className="bento-wholesale-perks">
                <span className="bento-perk-item">✓ Escalas especiales por 5kg, 10kg y bulto cerrado</span>
                <span className="bento-perk-item">✓ Lista de precios mayorista actualizada</span>
                <span className="bento-perk-item">✓ Asesoramiento directo y pedidos coordinados por WhatsApp</span>
              </div>
              <div className="bento-actions">
                <Link to="/contacto" className="btn-bento-primary">
                  Consultar Lista Mayorista por WhatsApp 📱
                </Link>
                <Link to="/catalogo" className="btn-bento-secondary">
                  Ver Productos en Catálogo →
                </Link>
              </div>
            </div>

            {/* Tarjeta 2: Venta Minorista */}
            <div className="bento-card">
              <div className="bento-icon-box">🛍️</div>
              <h3 className="bento-title">Compra Minorista Fraccionada</h3>
              <p className="bento-desc">
                Comprá por kilogramo o unidad con la misma frescura y calidad superior que entregamos a los comercios.
              </p>
              <span className="bento-pill-tag">Consumo Familiar</span>
            </div>

            {/* Tarjeta 3: Logística y Envíos */}
            <div className="bento-card">
              <div className="bento-icon-box">🚚</div>
              <h3 className="bento-title">Envíos a Domicilio y Despachos</h3>
              <p className="bento-desc">
                Entregas programadas en AMBA y despachos rápidos al interior a través de Andreani y Correo Argentino.
              </p>
              <Link to="/envios" className="bento-card-link">
                Conocer Zonas y Logística →
              </Link>
            </div>

            {/* Tarjeta 4: Coordinación Simple */}
            <div className="bento-card">
              <div className="bento-icon-box">💬</div>
              <h3 className="bento-title">Coordinación Rápida por WhatsApp</h3>
              <p className="bento-desc">
                Confirmamos tu carrito, verificamos disponibilidad de stock y coordinamos el pago y día de entrega sin vueltas.
              </p>
              <span className="bento-pill-tag">Atención Personalizada</span>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          6. BANNER CTA FINAL DE CONVERSIÓN
          ══════════════════════════════════════════════════════════════ */}
      <PageCTA
        texto="¿Querés comprar por bulto cerrado o tenés dudas sobre algún producto?"
        linkTexto="Hablá con nosotros por WhatsApp"
        to="/contacto"
        icono="📦"
      />
    </div>
  );
}
