import { useCartContext } from '../context/CartContext';

export function CartButton() {
  const { cartCount, setShowCart } = useCartContext();

  if (cartCount === 0) return null;

  return (
    <button
      onClick={() => setShowCart(true)}
      className="fixed bottom-5 left-5 z-40 flex items-center gap-2 bg-[#1b2e24] hover:bg-[#76A33E] text-white px-4 py-3 rounded-full shadow-xl transition-all duration-200 hover:scale-105 active:scale-95"
      aria-label={`Ver carrito, ${cartCount} ${cartCount === 1 ? 'producto' : 'productos'}`}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
      <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline">Carrito</span>
      <span className="w-5 h-5 rounded-full bg-[#76A33E] text-white text-[11px] font-black flex items-center justify-center shadow-sm">
        {cartCount}
      </span>
    </button>
  );
}
export default CartButton;
