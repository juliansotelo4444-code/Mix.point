import { createContext, useContext, useState, type ReactNode } from 'react';
import { useCart } from '../hooks/useCart';
import { useOrderSubmit } from '../hooks/useOrderSubmit';
import { calcularPrecioUnitario } from '../utils/precios';

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
  clearCart: () => void;
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
  const { cart, addToCart, removeFromCart, clearCart, cartTotal } = useCart();
  const { submitPedido, enviando } = useOrderSubmit();
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  // Suma de unidades (no de líneas distintas) para el contador del botón flotante
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleConfirmarPedido = async (datos: DatosEntrega) => {
    const productosTexto = cart
      .map(item => {
        const label = pesosLabels[item.escalaSeleccionada] || item.escalaSeleccionada;
        const precioUnitario = calcularPrecioUnitario(item.precios, item.escalaSeleccionada);
        const subtotal = precioUnitario * item.quantity;
        return `${item.nombre} (${label}) x${item.quantity} [$${subtotal.toLocaleString('es-AR')}]`;
      })
      .join(' | ');

    const resultado = await submitPedido(datos, productosTexto, cartTotal);

    if (!resultado.success) {
      const continuar = window.confirm(
        'Hubo un problema temporal con el registro automático, pero podés enviar tu pedido directamente por WhatsApp para que lo preparemos.\n\n¿Querés enviarlo ahora?'
      );
      if (!continuar) return;
    }

    const pedidoCodigo = resultado.numeroPedido ? ` *${resultado.numeroPedido}*` : '';
    const productosMsg = cart
      .map(item => {
        const label = pesosLabels[item.escalaSeleccionada] || item.escalaSeleccionada;
        const precioUnitario = calcularPrecioUnitario(item.precios, item.escalaSeleccionada);
        const subtotal = precioUnitario * item.quantity;
        const unitarioTxt = item.quantity > 1 ? ` ($${precioUnitario.toLocaleString('es-AR')} c/u)` : '';
        return `- ${item.nombre} (${label}) x${item.quantity}: $${subtotal.toLocaleString('es-AR')}${unitarioTxt}`;
      })
      .join('\n');

    const mensaje =
      `Hola Mix Point! Quiero confirmar mi pedido${pedidoCodigo}:\n\n` +
      `📦 Detalle del pedido:\n` +
      `${productosMsg}\n\n` +
      `💰 Total: $${cartTotal.toLocaleString('es-AR')}\n\n` +
      `📍 Datos de entrega:\n` +
      `Nombre: ${datos.nombre}\n` +
      `Teléfono: ${datos.telefono}\n` +
      `Dirección: ${datos.direccion}\n` +
      `Zona: ${datos.zona}`;

    window.open(`https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensaje)}`, '_blank');
    clearCart();
    setShowCheckout(false);
    setShowCart(false);
  };

  return (
    <CartContext.Provider
      value={{
        cart, addToCart, removeFromCart, clearCart, cartTotal, cartCount,
        showCart, setShowCart,
        showCheckout, setShowCheckout,
        enviando, handleConfirmarPedido,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCartContext() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCartContext debe usarse dentro de <CartProvider>');
  return ctx;
}