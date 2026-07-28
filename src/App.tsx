import { useState, useMemo, useEffect } from "react";
import { useProducts } from './hooks/useProducts';
import { useCart } from './hooks/useCart';
import { ProductCard } from './components/ProductCard';
import { Navbar } from './components/Navbar';
import './App.css';

const PRODUCTOS_POR_PAGINA = 28;

function App() {
  const { products, loading, error } = useProducts();
  const { cart, addToCart, removeFromCart, cartTotal } = useCart();
  const MINIMO_COMPRA = 20000;

  const [query, setQuery] = useState("");
  const [pagina, setPagina] = useState(1);

  // Estados para el Carrusel Hero Dinámico (Galería superior)
  const [currentSlide, setCurrentSlide] = useState(0);
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

  // Rotación automática del carrusel cada 5 segundos
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  // Estados para el formulario de cuestionario/mayoristas
  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    zona: "",
    tipo_compra: "familiar",
  });

  const productosFiltrados = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return products;
    return products.filter((p) =>
      p.nombre.toLowerCase().includes(q) ||
      p.categoria.toLowerCase().includes(q) ||
      p.descripcion?.toLowerCase().includes(q)
    );
  }, [query, products]);

  const totalPaginas = Math.ceil(productosFiltrados.length / PRODUCTOS_POR_PAGINA);

  const productosPagina = useMemo(() => {
    const inicio = (pagina - 1) * PRODUCTOS_POR_PAGINA;
    return productosFiltrados.slice(inicio, inicio + PRODUCTOS_POR_PAGINA);
  }, [productosFiltrados, pagina]);

  const handleQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setPagina(1);
  };

  const handlePagina = (nueva: number) => {
    setPagina(nueva);
    document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handlePedidoWhatsApp = () => {
    const pesosLabels: Record<string, string> = {
      kg: "1kg", cincoKg: "5kg", diezKg: "10kg",
      veinticincoKg: "25kg", treintaKg: "30kg"
    };

    const productosMsg = cart
      .map(item => {
        const label = pesosLabels[item.escalaSeleccionada] || item.escalaSeleccionada;
        return `- ${item.nombre} (${label}) x${item.quantity}`;
      })
      .join('%0A');

    const mensaje = `Hola Mix Point! Quería hacer un pedido:%0A${productosMsg}%0ATotal: $${cartTotal}`;
    window.open(`https://wa.me/5491131469587?text=${mensaje}`, '_blank');
  };

  // Manejador para el formulario de asesoramiento
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitAsesoramiento = (e: React.FormEvent) => {
    e.preventDefault();
    const mensaje = `Hola Mix Point! Me interesa recibir asesoramiento:%0A- Nombre/Comercio: ${formData.nombre}%0A- Teléfono: ${formData.telefono}%0A- Tipo de compra: ${formData.tipo_compra}%0A- Barrio/Localidad: ${formData.zona}`;
    window.open(`https://wa.me/5491131469587?text=${mensaje}`, '_blank');
  };

  return (
    <div className="app-container">

      <Navbar />

      <header className="header" id="inicio">
        <img src="/assets/logo_mixpoint.png" alt="Logo Mix Point" className="logo-header" />
        <h1>MIX POINT</h1>
        <p>Mayorista de Frutos Secos</p>
      </header>

      <main>
        {/* CARRUSEL HERO / GALERÍA DINÁMICA MEJORADA */}
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
            <a href="#catalogo" style={{ backgroundColor: '#d4af37', color: '#000', padding: '12px 30px', borderRadius: '6px', fontWeight: 'bold', textDecoration: 'none', fontSize: '15px', boxShadow: '0 4px 10px rgba(212, 175, 55, 0.4)', transition: 'transform 0.2s' }}>
              VER CATÁLOGO MAYORISTA 🛒
            </a>
          </div>

          {/* Botones indicadores y controles del carrusel */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', padding: '12px', background: '#0a0a0a' }}>
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
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

        <h2 className="catalog-title" id="catalogo">Nuestro Catálogo</h2>

        <div className="search-wrapper">
          <input
            type="text"
            placeholder="Buscar productos..."
            value={query}
            onChange={handleQuery}
            className="search-input"
          />
        </div>

        {loading && <p className="status-msg">Cargando productos...</p>}
        {error && <p className="status-msg status-msg--error">Error al cargar productos. Intentá recargar la página.</p>}

        {query && !loading && (
          <p className="status-msg">
            {productosFiltrados.length} resultado{productosFiltrados.length !== 1 ? 's' : ''} para "{query}"
          </p>
        )}

        <section className="product-grid">
          {productosPagina.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              addToCart={addToCart}
            />
          ))}
        </section>

        {totalPaginas > 1 && (
          <div className="paginacion">
            <button
              className="pag-btn"
              onClick={() => handlePagina(pagina - 1)}
              disabled={pagina === 1}
            >
              ← Anterior
            </button>

            {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                className={`pag-btn ${n === pagina ? 'pag-btn--active' : ''}`}
                onClick={() => handlePagina(n)}
              >
                {n}
              </button>
            ))}

            <button
              className="pag-btn"
              onClick={() => handlePagina(pagina + 1)}
              disabled={pagina === totalPaginas}
            >
              Siguiente →
            </button>
          </div>
        )}

        <section className="envios-section" id="envios">
          <h2 className="section-title">Envíos y entregas</h2>
          <div className="info-grid">
            <div className="info-card">
              <span className="info-icon">📦</span>
              <h3>Correo Argentino / Andreani</h3>
              <p>Enviamos al interior del país por Correo Argentino y Andreani.</p>
            </div>
            <div className="info-card">
              <span className="info-icon">🌎</span>
              <h3>Zona oeste</h3>
              <p>Entrega sin cargo según disponibilidad.</p>
            </div>
            <div className="info-card">
              <span className="info-icon">🚚</span>
              <h3>Zona norte</h3>
              <p>Entrega sin cargo una vez por semana en zona norte.</p>
            </div>
            <div className="info-card">
              <span className="info-icon">🛵</span>
              <h3>Zona sur</h3>
              <p>Entrega por logística propia en zona sur.</p>
            </div>
          </div>
        </section>

        <div className="info-card" style={{ maxWidth: '1200px', margin: '20px auto' }}>
          <span className="info-icon">💰</span>
          <h3>Garantía</h3>
          <p>Cualquier inconveniente con tu pedido, te devolvemos el dinero. Sin preguntas.</p>
        </div>

        {/* SECCIÓN DE TESTIMONIOS Y PRUEBA SOCIAL
        <section className="testimonios-section" style={{ maxWidth: '1200px', margin: '40px auto', padding: '20px', textAlign: 'center' }}>
          <h2 className="section-title" style={{ color: '#d4af37', marginBottom: '20px' }}>Lo que dicen nuestros clientes</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            
            <div style={{ background: '#1a1a1a', padding: '20px', borderRadius: '8px', border: '1px solid #333', textAlign: 'left', color: '#fff' }}>
              <p style={{ fontStyle: 'italic', color: '#ccc', marginBottom: '15px' }}>"Excelente calidad de las nueces mariposa. Compramos para nuestra dietética y la frescura se nota un montón. Súper recomendable."</p>
              <h4 style={{ color: '#d4af37', margin: '0' }}>Mariana G.</h4>
              <span style={{ fontSize: '12px', color: '#888' }}>Dueña de Dietética (Zona Oeste)</span>
            </div>

            <div style={{ background: '#1a1a1a', padding: '20px', borderRadius: '8px', border: '1px solid #333', textAlign: 'left', color: '#fff' }}>
              <p style={{ fontStyle: 'italic', color: '#ccc', marginBottom: '15px' }}>"Excelente atención y cumplimiento con los tiempos de entrega. ¡Los precios mayoristas son inmejorables!"</p>
              <h4 style={{ color: '#d4af37', margin: '0' }}>Esteban R.</h4>
              <span style={{ fontSize: '12px', color: '#888' }}>Comercio Minorista</span>
            </div>

            <div style={{ background: '#1a1a1a', padding: '20px', borderRadius: '8px', border: '1px solid #333', textAlign: 'left', color: '#fff' }}>
              <p style={{ fontStyle: 'italic', color: '#ccc', marginBottom: '15px' }}>"Hice un pedido familiar grande y llegó todo perfecto. Los frutos secos súper enteros y bien envasados."</p>
              <h4 style={{ color: '#d4af37', margin: '0' }}>Carla P.</h4>
              <span style={{ fontSize: '12px', color: '#888' }}>Consumo Familiar</span>
            </div>

          </div>
        </section> */}

        {/* SECCIÓN DE CUESTIONARIO / ASESORAMIENTO COMERCIAL */}
        <section className="contacto-mayoristas" style={{ backgroundColor: '#1a1a1a', color: '#fff', padding: '40px 20px', borderTop: '2px solid #d4af37', borderBottom: '2px solid #d4af37', margin: '40px 0' }}>
          <div className="container" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{ color: '#d4af37', marginBottom: '10px' }}>¿Querés comprar por mayor o tenés dudas?</h2>
            <p style={{ marginBottom: '30px', color: '#ccc' }}>Completá tus datos y un asesor comercial se pondrá en contacto con vos a la brevedad.</p>
            
            <form onSubmit={handleSubmitAsesoramiento} style={{ display: 'flex', flexDirection: 'column', gap: '15px', textAlign: 'left' }}>
              <div>
                <label htmlFor="nombre" style={{ fontSize: '14px', display: 'block', marginBottom: '5px' }}>Nombre o Razón Social</label>
                <input type="text" id="nombre" name="nombre" value={formData.nombre} onChange={handleFormChange} required placeholder="Ej: Distribuidora Los Amigos" style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #444', background: '#2a2a2a', color: '#fff', boxSizing: 'border-box' }} />
              </div>

              <div>
                <label htmlFor="telefono" style={{ fontSize: '14px', display: 'block', marginBottom: '5px' }}>Teléfono / WhatsApp</label>
                <input type="tel" id="telefono" name="telefono" value={formData.telefono} onChange={handleFormChange} required placeholder="Ej: 11 1234 5678" style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #444', background: '#2a2a2a', color: '#fff', boxSizing: 'border-box' }} />
              </div>

              <div>
                <label htmlFor="tipo_compra" style={{ fontSize: '14px', display: 'block', marginBottom: '5px' }}>Tipo de compra</label>
                <select id="tipo_compra" name="tipo_compra" value={formData.tipo_compra} onChange={handleFormChange} style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #444', background: '#2a2a2a', color: '#fff', boxSizing: 'border-box' }}>
                  <option value="familiar">Familiar</option>
                  <option value="revendedor">Revendedor</option>
                  <option value="comercio">Comercio / Dietética</option>
                </select>
              </div>

              <div>
                <label htmlFor="zona" style={{ fontSize: '14px', display: 'block', marginBottom: '5px' }}>Barrio / Localidad</label>
                <input type="text" id="zona" name="zona" value={formData.zona} onChange={handleFormChange} required placeholder="Ej: Ituzaingo" style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #444', background: '#2a2a2a', color: '#fff', boxSizing: 'border-box' }} />
              </div>

              <button type="submit" style={{ backgroundColor: '#d4af37', color: '#000', fontWeight: 'bold', padding: '12px', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '10px', transition: 'background 0.3s' }}>
                Solicitar Asesoramiento por WhatsApp 📱
              </button>
            </form>
          </div>
        </section>

        <section className="nosotros-section" id="nosotros">
          <h2 className="section-title">Sobre nosotros</h2>
          <div className="nosotros-card">
            <p>
              Somos una distribuidora joven que trabaja en familia. Compramos directo a productores mercadería fresca, granos enteros, bien cuidados, con la maduración
              justa para que conserven todos sus nutrientes y propiedades.
            </p>
          </div>
        </section>
      </main>

      {/* FOOTER CON CARRITO Y SELLOS DE CONFIANZA / PAGOS */}
      <footer className="cart-footer">
        <div className="cart-items-list">
          {cart.map((item) => (
            <div key={`${item.id}-${item.escalaSeleccionada}`} className="cart-item-mini">
              <span>{item.nombre} ({item.escalaSeleccionada}) x{item.quantity}</span>
              <button className="btn-remove" onClick={() => removeFromCart(item.id)}>
                Borrar
              </button>
            </div>
          ))}
        </div>

        <p>Total: <span className="gold-text">${cartTotal}</span></p>

        {cartTotal >= MINIMO_COMPRA
          ? <p className="free-ship">¡Envío Gratis habilitado! 🚚</p>
          : <p className="min-alert">Faltan ${MINIMO_COMPRA - cartTotal} para el mínimo</p>
        }

        <button
          className="btn-whatsapp"
          onClick={handlePedidoWhatsApp}
          disabled={cart.length === 0}
        >
          Finalizar Pedido por WhatsApp 📱
        </button>

        {/* Sellos de confianza y medios de pago */}
        <div style={{ marginTop: '15px', paddingTop: '10px', borderTop: '1px solid #333', textAlign: 'center', fontSize: '12px', color: '#aaa' }}>
          <p style={{ margin: '0 0 5px 0', color: '#d4af37', fontWeight: 'bold' }}>COMPRA 100% SEGURA Y CONFIABLE</p>
          <span>🔒 Pagos protegidos | 💳 Transferencias, Tarjetas y Mercado Pago</span>
        </div>
      </footer>

    </div>
  );
}

export default App;