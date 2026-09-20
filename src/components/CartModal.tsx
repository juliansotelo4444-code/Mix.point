import { useCartContext } from '../context/CartContext';
import { CheckoutModal } from './CheckoutModal';
import { calcularPrecioUnitario } from '../utils/precios';

const MINIMO_COMPRA = 20000;

const pesosLabels: Record<string, string> = {
  kg: "1kg",
  cincoKg: "5kg",
  diezKg: "10kg",
  veinticincoKg: "25kg",
  treintaKg: "30kg",
  unidad: "Unidad",
};

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
          <div className="cart-modal-header">
            <h2 className="cart-modal-title">Tu Carrito</h2>
            <button className="cart-modal-close" onClick={() => setShowCart(false)} aria-label="Cerrar carrito">✕</button>
          </div>

          {cart.length === 0 ? (
            <p className="cart-modal-empty">Todavía no agregaste productos.</p>
          ) : (
            <div className="cart-modal-items">
              {cart.map((item) => {
                const label = pesosLabels[item.escalaSeleccionada] || item.escalaSeleccionada;
                const precioUnitario = calcularPrecioUnitario(item.precios, item.escalaSeleccionada);
                const subtotal = precioUnitario * item.quantity;

                return (
                  <div key={`${item.id}-${item.escalaSeleccionada}`} className="cart-modal-item">
                    <div className="cart-modal-item-info">
                      <span className="cart-modal-item-name">{item.nombre}</span>
                      <div className="cart-modal-item-details">
                        <span className="cart-modal-item-meta">{label} · x{item.quantity}</span>
                        <span className="cart-modal-item-cost">${subtotal.toLocaleString('es-AR')}</span>
                        {item.quantity > 1 && (
                          <span className="cart-modal-item-unit">(${precioUnitario.toLocaleString('es-AR')} c/u)</span>
                        )}
                      </div>
                    </div>
                    <button
                      className="btn-remove"
                      onClick={() => removeFromCart(item.id, item.escalaSeleccionada)}
                      aria-label={`Quitar ${item.nombre} del carrito`}
                    >
                      Borrar
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          <div className="cart-modal-summary">
            <p className="cart-modal-total">Total: <span className="gold-text">${cartTotal.toLocaleString('es-AR')}</span></p>

            {cartTotal >= MINIMO_COMPRA
              ? <p className="free-ship">¡Tenés Envío Gratis habilitado! 🚚</p>
              : <p className="min-alert">Te faltan ${(MINIMO_COMPRA - cartTotal).toLocaleString('es-AR')} para obtener <strong>Envío Gratis</strong></p>
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