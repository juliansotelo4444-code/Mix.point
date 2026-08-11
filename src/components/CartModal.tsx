import { useCartContext } from '../context/CartContext.tsx';
import { CheckoutModal } from './CheckoutModal';

const MINIMO_COMPRA = 20000;

export function CartModal() {
  const {
    cart, removeFromCart, cartTotal,
    showCart, setShowCart,
    showCheckout, setShowCheckout,
    enviando, handleConfirmarPedido,
  } = useCartContext();

  if (!showCart) return null;

  return (
    <>
      <div className="cart-modal-overlay" onClick={() => setShowCart(false)}>
        <div className="cart-modal" onClick={(e) => e.stopPropagation()}>
          <button className="cart-modal-close" onClick={() => setShowCart(false)} aria-label="Cerrar carrito">✕</button>
          <h2 className="cart-modal-title">Tu carrito</h2>

          {cart.length === 0 ? (
            <p className="cart-modal-empty">Todavía no agregaste productos.</p>
          ) : (
            <div className="cart-modal-items">
              {cart.map((item) => (
                <div key={`${item.id}-${item.escalaSeleccionada}`} className="cart-modal-item">
                  <div className="cart-modal-item-info">
                    <span className="cart-modal-item-name">{item.nombre}</span>
                    <span className="cart-modal-item-meta">{item.escalaSeleccionada} · x{item.quantity}</span>
                  </div>
                  <button
                    className="btn-remove"
                    onClick={() => removeFromCart(item.id)}
                    aria-label={`Quitar ${item.nombre} del carrito`}
                  >
                    Borrar
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="cart-modal-summary">
            <p className="cart-modal-total">Total: <span className="gold-text">${cartTotal}</span></p>

            {cartTotal >= MINIMO_COMPRA
              ? <p className="free-ship">¡Envío Gratis habilitado! 🚚</p>
              : <p className="min-alert">Faltan ${MINIMO_COMPRA - cartTotal} para el mínimo</p>
            }

            <button
              className="btn-whatsapp"
              onClick={() => setShowCheckout(true)}
              disabled={cart.length === 0}
            >
              Finalizar Pedido 📱
            </button>

            <div className="cart-modal-trust">
              <p>COMPRA 100% SEGURA Y CONFIABLE</p>
              <span>🔒 Pagos protegidos | 💳 Transferencias, Tarjetas y Mercado Pago</span>
            </div>
          </div>
        </div>
      </div>

      {showCheckout && (
        <CheckoutModal
          onConfirm={handleConfirmarPedido}
          onClose={() => setShowCheckout(false)}
          enviando={enviando}
        />
      )}
    </>
  );
}