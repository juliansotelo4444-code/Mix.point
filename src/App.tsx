import { products } from './data/products';
import { useCart } from './hooks/useCart';
import './App.css';

function App() {
  const { cart, addToCart, removeFromCart, cartTotal } = useCart();
  const MINIMO_COMPRA = 70000;

  const handlePedidoWhatsApp = () => {
    const productosMsg = cart
      .map(item => `- ${item.nombre} (x${item.quantity})`)
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
          <img src="/assets/Flyer-mix-point.png" alt="Promo 1" className="flyer" />
          {/* <img src="/assets/promo_privado.png" alt="Promo 2" className="flyer" /> */}
        </section>

        <h2 style={{ textAlign: 'center' }}>Nuestro Catálogo</h2>

        <section className="product-grid">
          {products.map((product) => {
            const itemInCart = cart.find(item => item.id === product.id);
            return (
              <div key={product.id} className="product-card">
                <img src={product.imagen} alt={product.nombre} className="product-image" />
                <h3>{product.nombre}</h3>
                <p className="price-tag">${product.precios.kg} x KG</p>

                <div className="quantity-controls">
                  <button className="btn-qty" onClick={() => removeFromCart(product.id)}>-</button>
                  <span className="qty-num">{itemInCart ? itemInCart.quantity : 0}</span>
                  <button className="btn-qty" onClick={() => addToCart(product)}>+</button>
                </div>

                {itemInCart && <p className="subtotal-txt">Subtotal: ${itemInCart.quantity * product.precios.kg}</p>}
              </div>
            );
          })}
        </section>
      </main>

      <footer className="cart-footer">
        <p>Total Pedido: <span className="gold-text">${cartTotal}</span></p>
        {cartTotal >= MINIMO_COMPRA ? (
          <p className="free-ship">¡Envío Gratis habilitado! 🚚</p>
        ) : (
          <p className="min-alert">Faltan ${MINIMO_COMPRA - cartTotal} para el mínimo</p>
        )}
        <button className="btn-whatsapp" onClick={handlePedidoWhatsApp} disabled={cart.length === 0}>
          Finalizar Pedido por WhatsApp 📱
        </button>
      </footer>
    </div>
  );
}

export default App;