import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useCart } from '../hooks/useCart';
import { useProducts } from '../hooks/useProducts';
import { useOrderSubmit } from '../hooks/useOrderSubmit';
import { calcularPrecioUnitario, getEscalaLabel } from '../utils/precios';
import { WHATSAPP_NUMERO } from '../config/constants';
import { type DatosEntrega } from '../utils/datosEntrega';

type UseCartReturn = ReturnType<typeof useCart>;

interface CartContextType {
  cart: UseCartReturn['cart'];
  addToCart: UseCartReturn['addToCart'];
  removeFromCart: UseCartReturn['removeFromCart'];
  updateQuantity: UseCartReturn['updateQuantity'];
  removeItem: UseCartReturn['removeItem'];
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
  const {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    removeItem,
    clearCart,
    cartTotal,
    sincronizarConCatalogo,
  } = useCart();
  const { products } = useProducts();
  const { submitPedido, enviando } = useOrderSubmit();
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  // Cada vez que se descarga o actualiza el catálogo desde el Excel base,
  // revalidamos los precios de los productos que ya estaban en el carrito.
  useEffect(() => {
    if (products.length > 0) {
      sincronizarConCatalogo(products);
    }
  }, [products, sincronizarConCatalogo]);

  // Suma de unidades (no de líneas distintas) para el contador del botón flotante
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleConfirmarPedido = async (datos: DatosEntrega) => {
    const itemsEstructurados = cart.map(item => {
      const label = getEscalaLabel(item.escalaSeleccionada, item.tipoVenta);
      const precioUnitario = calcularPrecioUnitario(item.precios, item.escalaSeleccionada);
      const subtotal = precioUnitario * item.quantity;
      return {
        producto_id: item.id,
        nombre: item.nombre,
        categoria: item.categoria,
        escala: label,
        unidad_medida: item.tipoVenta === 'unidad' ? 'unidad' : 'kg',
        cantidad: item.quantity,
        precio_unitario: precioUnitario,
        subtotal: subtotal
      };
    });

    const productosTexto = cart
      .map(item => {
        const label = getEscalaLabel(item.escalaSeleccionada, item.tipoVenta);
        const precioUnitario = calcularPrecioUnitario(item.precios, item.escalaSeleccionada);
        const subtotal = precioUnitario * item.quantity;
        return `${item.nombre} (${label}) x${item.quantity} [$${subtotal.toLocaleString('es-AR')}]`;
      })
      .join(' | ');

    const resultado = await submitPedido(datos, productosTexto, cartTotal, itemsEstructurados);

    if (!resultado.success) {
      const continuar = window.confirm(
        'Hubo un problema temporal con el registro automático, pero podés enviar tu pedido directamente por WhatsApp para que lo preparemos.\n\n¿Querés enviarlo ahora?'
      );
      if (!continuar) return;
    }

    const pedidoCodigo = resultado.numeroPedido ? ` *${resultado.numeroPedido}*` : '';
    const productosMsg = cart
      .map(item => {
        const label = getEscalaLabel(item.escalaSeleccionada, item.tipoVenta);
        const precioUnitario = calcularPrecioUnitario(item.precios, item.escalaSeleccionada);
        const subtotal = precioUnitario * item.quantity;
        const unitarioTxt = item.quantity > 1 ? ` ($${precioUnitario.toLocaleString('es-AR')} c/u)` : '';
        return `- ${item.nombre} (${label}) x${item.quantity}: $${subtotal.toLocaleString('es-AR')}${unitarioTxt}`;
      })
      .join('\n');

    const horarioMsg = datos.horarioEntrega ? `\n⏰ Horario preferido de entrega: ${datos.horarioEntrega}` : '';
    const pagoMsg = datos.metodoPago ? `\n💳 Método de pago: ${datos.metodoPago}` : '';
    const notasMsg = datos.notas?.trim() ? `\n📝 Aclaraciones: ${datos.notas.trim()}` : '';
    const horaMsg = resultado.horaRegistro ? `\n🕒 Pedido registrado: ${resultado.horaRegistro}` : '';

    const mensaje =
      `Hola Mix Point! Quiero confirmar mi pedido${pedidoCodigo}:\n\n` +
      `📦 Detalle del pedido:\n` +
      `${productosMsg}\n\n` +
      `💰 Total: $${cartTotal.toLocaleString('es-AR')}\n\n` +
      `📍 Datos de entrega:\n` +
      `Nombre: ${datos.nombre}\n` +
      `Teléfono: ${datos.telefono}\n` +
      `Dirección: ${datos.direccion}\n` +
      `Zona: ${datos.zona}` +
      horarioMsg +
      pagoMsg +
      notasMsg +
      horaMsg;

    window.open(`https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensaje)}`, '_blank');
    clearCart();
    setShowCheckout(false);
    setShowCart(false);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        removeItem,
        clearCart,
        cartTotal,
        cartCount,
        showCart,
        setShowCart,
        showCheckout,
        setShowCheckout,
        enviando,
        handleConfirmarPedido,
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
