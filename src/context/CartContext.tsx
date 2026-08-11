import { createContext, useContext, useState, type ReactNode } from 'react';
import { useCart } from '../hooks/useCart';
import { useOrderSubmit } from '../hooks/useOrderSubmit';

const WHATSAPP_NUMERO = '5491131469587';

const pesosLabels: Record<string, string> = {
  kg: "1kg", cincoKg: "5kg", diezKg: "10kg",
  veinticincoKg: "25kg", treintaKg: "30kg", unidad: "unidad"
};

interface DatosEntrega {
  nombre: string;
  telefono: string;
  direccion: string;
  zona: string;
}

type UseCartReturn = ReturnType<typeof useCart>;

interface CartContextType {
  cart: UseCartReturn['cart'];
  addToCart: UseCartReturn['addToCart'];
  removeFromCart: UseCartReturn['removeFromCart'];
  cartTotal: number;
  cartCount: number;
  showCart: boolean;
  setShowCart: (v: boolean) => void;
  showCheckout: boolean;
  setShowCheckout: (v: boolean) => void;
  enviando: boolean;
  handleConfirmarPedido: (datos: DatosEntrega) => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Envuelve toda la app (ver MainLayout.tsx) para que el carrito y el
// checkout estén disponibles sin importar en qué página esté el usuario.
export function CartProvider({ children }: { children: ReactNode }) {
  const { cart, addToCart, removeFromCart, cartTotal } = useCart();
  const { submitPedido, enviando } = useOrderSubmit();
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  // Suma de unidades (no de líneas distintas) para el contador del botón flotante
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleConfirmarPedido = async (datos: DatosEntrega) => {
    const productosTexto = cart
      .map(item => {
        const label = pesosLabels[item.escalaSeleccionada] || item.escalaSeleccionada;
        return `${item.nombre} (${label}) x${item.quantity}`;
      })
      .join(' | ');

    const resultado = await submitPedido(datos, productosTexto, cartTotal);

    if (!resultado.success) {
      alert('Hubo un problema al registrar tu pedido. Probá de nuevo o escribinos directamente por WhatsApp.');
      return;
    }

    const productosMsg = cart
      .map(item => {
        const label = pesosLabels[item.escalaSeleccionada] || item.escalaSeleccionada;
        return `- ${item.nombre} (${label}) x${item.quantity}`;
      })
      .join('%0A');

    const mensaje =
      `Hola Mix Point! Quiero confirmar mi pedido *${resultado.numeroPedido}*:%0A` +
      `${productosMsg}%0A` +
      `Total: $${cartTotal}%0A%0A` +
      `📍 Datos de entrega:%0A` +
      `Nombre: ${datos.nombre}%0A` +
      `Teléfono: ${datos.telefono}%0A` +
      `Dirección: ${datos.direccion}%0A` +
      `Zona: ${datos.zona}`;

    window.open(`https://wa.me/${WHATSAPP_NUMERO}?text=${mensaje}`, '_blank');
    setShowCheckout(false);
    setShowCart(false);
  };

  return (
    <CartContext.Provider
      value={{
        cart, addToCart, removeFromCart, cartTotal, cartCount,
        showCart, setShowCart,
        showCheckout, setShowCheckout,
        enviando, handleConfirmarPedido,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCartContext() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCartContext debe usarse dentro de <CartProvider>');
  return ctx;
}