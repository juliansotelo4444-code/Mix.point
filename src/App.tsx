import { useState, useMemo } from "react";
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

  return (
    <div className="app-container">

      <Navbar />

      <header className="header" id="inicio">
        <img src="/assets/logo_mixpoint.png" alt="Logo Mix Point" className="logo-header" />
        <h1>MIX POINT</h1>
        <p>Mayorista de Frutos Secos</p>
      </header>

      <main>
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
        <div className="info-card">
              <span className="info-icon">💰</span>
              <h3>Garantía</h3>
              <p>Cualquier inconveniente con tu pedido, te devolvemos el dinero. Sin preguntas.</p>
            </div>

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
      </footer>

    </div>
  );
}

export default App;