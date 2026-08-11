import { useCartContext } from '../context/CartContext';

export function CartButton() {
  const { cartCount, setShowCart } = useCartContext();

  return (
    <button
      className="cart-fab"
      onClick={() => setShowCart(true)}
      aria-label={`Ver carrito, ${cartCount} ${cartCount === 1 ? 'producto' : 'productos'}`}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
      {cartCount > 0 && <span className="cart-fab-badge">{cartCount}</span>}
    </button>
  );
}