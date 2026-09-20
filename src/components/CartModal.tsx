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
    cart,
    cartTotal,
    updateQuantity,
    removeItem,
    showCart,
    setShowCart,
    showCheckout,
    setShowCheckout,
    enviando,
    handleConfirmarPedido,
  } = useCartContext();

  if (!showCart) return null;

  const porcentajeEnvio = Math.min(100, Math.round((cartTotal / MINIMO_COMPRA) * 100));
  const tieneEnvioGratis = cartTotal >= MINIMO_COMPRA;

  return (
    <>
      <div className="cart-modal-overlay" onClick={() => setShowCart(false)}>
        <div className="cart-modal" onClick={(e) => e.stopPropagation()}>
          <div className="cart-modal-header">
            <h2 className="cart-modal-title">Tu Carrito</h2>
            <button className="cart-modal-close" onClick={() => setShowCart(false)} aria-label="Cerrar carrito">✕</button>
          </div>

          {/* BARRA DE PROGRESO DE ENVÍO GRATIS */}
          <div className="cart-shipping-progress-container">
            <div className="cart-shipping-progress-header">
              {tieneEnvioGratis ? (
                <span className="cart-shipping-free-msg">🎉 ¡Envío Gratis habilitado para tu compra! 🚚</span>
              ) : (
                <span className="cart-shipping-needed-msg">
                  Te faltan <strong>${(MINIMO_COMPRA - cartTotal).toLocaleString('es-AR')}</strong> para <strong>Envío Gratis</strong>
                </span>
              )}
              <span className="cart-shipping-pct">{porcentajeEnvio}%</span>
            </div>
            <div className="cart-shipping-progress-bar">
              <div
                className={`cart-shipping-progress-fill ${tieneEnvioGratis ? 'cart-shipping-progress-fill--complete' : ''}`}
                style={{ width: `${porcentajeEnvio}%` }}
              />
            </div>
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
                        <span className="cart-modal-item-meta">{label}</span>
                        <span className="cart-modal-item-cost">${subtotal.toLocaleString('es-AR')}</span>
                        {item.quantity > 1 && (
                          <span className="cart-modal-item-unit">(${precioUnitario.toLocaleString('es-AR')} c/u)</span>
                        )}
                      </div>
                    </div>

                    <div className="cart-item-actions">
                      <div className="cart-item-qty-selector">
                        <button
                          type="button"
                          className="cart-qty-btn"
                          onClick={() => updateQuantity(item.id, item.escalaSeleccionada, item.quantity - 1)}
                          aria-label="Restar una unidad"
                        >
                          -
                        </button>
                        <span className="cart-qty-val">{item.quantity}</span>
                        <button
                          type="button"
                          className="cart-qty-btn"
                          onClick={() => updateQuantity(item.id, item.escalaSeleccionada, item.quantity + 1)}
                          aria-label="Sumar una unidad"
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        className="btn-trash-item"
                        onClick={() => removeItem(item.id, item.escalaSeleccionada)}
                        aria-label={`Eliminar ${item.nombre} del carrito`}
                        title="Eliminar producto"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 6h18" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                          <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          <line x1="10" y1="11" x2="10" y2="17" />
                          <line x1="14" y1="11" x2="14" y2="17" />
                        </svg>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="cart-modal-summary">
            <p className="cart-modal-total">Total: <span className="gold-text">${cartTotal.toLocaleString('es-AR')}</span></p>

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