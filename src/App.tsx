import { useState, useMemo } from "react";
import { products } from './data/products';
import { useCart } from './hooks/useCart';
import { ProductCard } from './components/ProductCard';
import './App.css';

function App() {
  const { cart, addToCart, removeFromCart, cartTotal } = useCart();
  const MINIMO_COMPRA = 20000;

  // ── BUSCADOR ──────────────────────────────────────────────
  const [query, setQuery] = useState("");

  const productosFiltrados = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return products;
    return products.filter((p) =>
      p.nombre.toLowerCase().includes(q) ||
      p.categoria.toLowerCase().includes(q) ||
      p.descripcion?.toLowerCase().includes(q)
    );
  }, [query]);
  // ──────────────────────────────────────────────────────────

  const handlePedidoWhatsApp = () => {
    const productosMsg = cart
      .map(item => {
        const pesosLabels: Record<string, string> = {
          kg: "1kg",
          cincoKg: "5kg",
          diezKg: "10kg",
          veinticincoKg: "25kg",
          treintaKg: "30kg"
        };
        const label = pesosLabels[item.escalaSeleccionada] || item.escalaSeleccionada;
        return `- ${item.nombre} (${label}) x${item.quantity}`;
      })
      .join('%0A');

    const mensaje = `Hola Mix Point! Quería hacer un pedido:%0A${productosMsg}%0ATotal: $${cartTotal}`;
    window.open(`https://wa.me/5491131469587?text=${mensaje}`, '_blank');
  };

  return (
    <div className="app-container">
      <header className="header">
        <img src="/assets/logo_mixpoint.png" alt="Logo" className="logo-header" />
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

        <h2 style={{ textAlign: 'center' }}>Nuestro Catálogo</h2>

        {/* ── BUSCADOR ── */}
        <div style={{ display: 'flex', justifyContent: 'center', margin: '1rem 0' }}>
          <input
            type="text"
            placeholder="Buscar productos..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              padding: '0.6rem 1rem',
              fontSize: '1rem',
              borderRadius: '8px',
              border: '1px solid #ccc',
              width: '100%',
              maxWidth: '400px'
            }}
          />
        </div>

        {/* Contador de resultados */}
        {query && (
          <p style={{ textAlign: 'center', color: '#888', marginBottom: '1rem' }}>
            {productosFiltrados.length} resultado{productosFiltrados.length !== 1 ? 's' : ''} para "{query}"
          </p>
        )}

        <section className="product-grid">
          {productosFiltrados.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              addToCart={addToCart}
            />
          ))}
        </section>
      </main>

      <footer className="cart-footer">
        <div className="cart-items-list">
          {cart.map((item) => (
            <div key={`${item.id}-${item.escalaSeleccionada}`} className="cart-item-mini">
              <span>{item.nombre} ({item.escalaSeleccionada}) x{item.quantity}</span>
              <button
                className="btn-remove"
                onClick={() => removeFromCart(item.id)}
              >
                Borrar
              </button>
            </div>
          ))}
        </div>
        <p>Total Pedido: <span className="gold-text">${cartTotal}</span></p>
        {cartTotal >= MINIMO_COMPRA ? (
          <p className="free-ship">¡Envío Gratis habilitado! 🚚</p>
        ) : (
          <p className="min-alert">Faltan ${MINIMO_COMPRA - cartTotal} para el mínimo</p>
        )}
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