import { products } from './data/products';
import { useCart } from './hooks/useCart';
import { ProductCard } from './components/ProductCard';
import './App.css';

function App() {
  // En la parte superior de App.tsx
const { cart, addToCart, removeFromCart, cartTotal } = useCart();
  const MINIMO_COMPRA = 20000;
  

  const handlePedidoWhatsApp = () => {
  const productosMsg = cart
    .map(item => {
      // Traducimos las llaves técnicas a nombres legibles para el cliente
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
            {/* Si la pantalla tiene 800px o más, usa la horizontal */}
            <source 
              media="(min-width: 800px)" 
              srcSet="/assets/Flyer-mix-point.png" 
            />
            {/* Si es menor a 800px (celulares), usa la vertical */}
            <img 
              src="/assets/Flyer-mix-vertical.png" 
              alt="Promoción Mix Point" 
              className="flyer" 
            />
          </picture>
        </section>

        <h2 style={{ textAlign: 'center' }}>Nuestro Catálogo</h2>

        <section className="product-grid">
  {products.map((product) => (
    <ProductCard 
      key={product.id} 
      product={product} 
      addToCart={addToCart} 
    />
  ))}
</section>
      </main>

      <footer className="cart-footer">
        {/* Esto va dentro del footer o antes del total en App.tsx */}
<div className="cart-items-list">
  {cart.map((item) => (
    <div key={`${item.id}-${item.escalaSeleccionada}`} className="cart-item-mini">
      <span>{item.nombre} ({item.escalaSeleccionada}) x{item.quantity}</span>
      
      {/* AQUÍ USAMOS LA FUNCIÓN QUE TENÍA ERROR */}
      <button 
  className="btn-remove" 
  onClick={() => removeFromCart(item.id)} // Pasamos solo el ID numérico
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
        <button className="btn-whatsapp" onClick={handlePedidoWhatsApp} disabled={cart.length === 0}>
          Finalizar Pedido por WhatsApp 📱
        </button>
      </footer>
    </div>
  );
}

export default App;