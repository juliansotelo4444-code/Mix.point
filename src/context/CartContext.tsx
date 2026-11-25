import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { useCart } from '../hooks/useCart';
import { useProducts } from '../hooks/useProducts';
import { useOrderSubmit } from '../hooks/useOrderSubmit';
import { calcularPrecioUnitario, getEscalaLabel, MULTIPLICADORES } from '../utils/precios';
import { WHATSAPP_NUMERO } from '../config/constants';
import {
  type DatosEntrega,
  cargarDatosGuardados,
  getOrCreateCartSessionId,
} from '../utils/datosEntrega';

type UseCartReturn = ReturnType<typeof useCart>;

export interface CuponAplicado {
  id: number;
  codigo: string;
  tipo_descuento: 'porcentaje' | 'monto_fijo';
  valor_descuento: number;
  valido_hasta?: string;
}

const CUPON_STORAGE_KEY = 'mixpoint_applied_coupon';
const REMITO_ORIGEN_KEY = 'mixpoint_remito_origen';

function cargarCuponGuardado(): CuponAplicado | null {
  try {
    const raw = localStorage.getItem(CUPON_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

function cargarRemitoOrigenGuardado(): number | null {
  try {
    const raw = localStorage.getItem(REMITO_ORIGEN_KEY);
    const n = raw ? parseInt(raw, 10) : NaN;
    return !isNaN(n) && n > 0 ? n : null;
  } catch {}
  return null;
}

interface CartContextType {
  cart: UseCartReturn['cart'];
  addToCart: UseCartReturn['addToCart'];
  removeFromCart: UseCartReturn['removeFromCart'];
  updateQuantity: UseCartReturn['updateQuantity'];
  removeItem: UseCartReturn['removeItem'];
  clearCart: () => void;
  replaceCart: UseCartReturn['replaceCart'];
  cartTotal: number;
  descuentoCupon: number;
  totalConDescuento: number;
  cartCount: number;
  cuponAplicado: CuponAplicado | null;
  aplicarCupon: (codigo: string) => Promise<{ ok: boolean; error?: string; cupon?: CuponAplicado }>;
  setCuponDirecto: (cupon: CuponAplicado | null) => void;
  quitarCupon: () => void;
  remitoOrigenId: number | null;
  setRemitoOrigenId: (id: number | null) => void;
  sincronizarCarritoConDatos: (datos: Partial<DatosEntrega>) => Promise<void>;
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
    replaceCart,
    cartTotal,
    sincronizarConCatalogo,
  } = useCart();
  const { products } = useProducts();
  const { submitPedido, enviando } = useOrderSubmit();
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [cuponAplicado, setCuponAplicado] = useState<CuponAplicado | null>(cargarCuponGuardado);
  const [remitoOrigenId, setRemitoOrigenIdState] = useState<number | null>(cargarRemitoOrigenGuardado);

  const setCuponDirecto = useCallback((cupon: CuponAplicado | null) => {
    setCuponAplicado(cupon);
    try {
      if (cupon) localStorage.setItem(CUPON_STORAGE_KEY, JSON.stringify(cupon));
      else localStorage.removeItem(CUPON_STORAGE_KEY);
    } catch {}
  }, []);

  const setRemitoOrigenId = useCallback((id: number | null) => {
    setRemitoOrigenIdState(id);
    try {
      if (id) localStorage.setItem(REMITO_ORIGEN_KEY, String(id));
      else localStorage.removeItem(REMITO_ORIGEN_KEY);
    } catch {}
  }, []);

  const aplicarCupon = useCallback(async (codigo: string) => {
    const clean = String(codigo || '').trim().toUpperCase();
    if (!clean) return { ok: false, error: 'Ingresá un código de cupón.' };
    try {
      const resp = await fetch(`/api/cupones?codigo=${encodeURIComponent(clean)}`);
      const data = await resp.json();
      if (data && data.valido && data.cupon) {
        setCuponDirecto(data.cupon);
        return { ok: true, cupon: data.cupon as CuponAplicado };
      }
      return { ok: false, error: data?.error || 'Cupón inválido o vencido.' };
    } catch {
      return { ok: false, error: 'No se pudo validar el cupón en este momento.' };
    }
  }, [setCuponDirecto]);

  const quitarCupon = useCallback(() => {
    setCuponDirecto(null);
  }, [setCuponDirecto]);

  const descuentoCupon = cuponAplicado && cartTotal > 0
    ? (cuponAplicado.tipo_descuento === 'monto_fijo'
        ? Math.min(cartTotal, Math.round(Number(cuponAplicado.valor_descuento) || 0))
        : Math.round(cartTotal * ((Number(cuponAplicado.valor_descuento) || 0) / 100)))
    : 0;

  const totalConDescuento = Math.max(0, cartTotal - descuentoCupon);

  // Cada vez que se descarga o actualiza el catálogo desde el Excel base,
  // revalidamos los precios de los productos que ya estaban en el carrito.
  useEffect(() => {
    if (products.length > 0) {
      sincronizarConCatalogo(products);
    }
  }, [products, sincronizarConCatalogo]);

  const sincronizarCarritoConDatos = useCallback(async (datos: Partial<DatosEntrega>) => {
    const telDigits = String(datos?.telefono || '').replace(/\D/g, '');
    const emailStr = String(datos?.email || '').trim();
    if (telDigits.length < 8 && !emailStr.includes('@')) return;

    try {
      const sessionId = getOrCreateCartSessionId();
      const itemsSync = cart.map(item => {
        const label = getEscalaLabel(item.escalaSeleccionada, item.tipoVenta);
        const pu = calcularPrecioUnitario(item.precios, item.escalaSeleccionada);
        return {
          producto_id: item.id,
          nombre: item.nombre,
          escala: label,
          escala_key: item.escalaSeleccionada,
          cantidad: item.quantity,
          unidad_medida: item.tipoVenta === 'unidad' ? 'unidad' : 'kg',
          precio_unitario: pu,
          subtotal: pu * item.quantity,
        };
      });

      await fetch('/api/carrito', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          nombre: datos.nombre || '',
          telefono: datos.telefono || '',
          email: emailStr,
          direccion: datos.direccion || '',
          zona: datos.zona || '',
          items: itemsSync,
          total: cartTotal,
        }),
      });
    } catch {
      // Sincronización silenciosa de respaldo
    }
  }, [cart, cartTotal]);

  // Auto-sincronizar carrito si el comprador ya tiene teléfono o email guardado en el dispositivo
  useEffect(() => {
    const saved = cargarDatosGuardados();
    const telDigits = String(saved.telefono || '').replace(/\D/g, '');
    const emailStr = String(saved.email || '').trim();
    if (telDigits.length < 8 && !emailStr.includes('@')) return;

    const timer = setTimeout(() => {
      sincronizarCarritoConDatos(saved);
    }, 2500);

    return () => clearTimeout(timer);
  }, [cart, cartTotal, sincronizarCarritoConDatos]);

  // Suma de unidades (no de líneas distintas) para el contador del botón flotante
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleConfirmarPedido = async (datos: DatosEntrega) => {
    const itemsEstructurados = cart.map(item => {
      const label = getEscalaLabel(item.escalaSeleccionada, item.tipoVenta);
      const precioUnitario = calcularPrecioUnitario(item.precios, item.escalaSeleccionada);
      const subtotal = precioUnitario * item.quantity;
      const mult = MULTIPLICADORES[item.escalaSeleccionada] || 1;
      const kilosTotales = item.tipoVenta === 'unidad' ? item.quantity : (item.quantity * mult);
      const precioPorKg = item.tipoVenta === 'unidad'
        ? precioUnitario
        : (item.precios[item.escalaSeleccionada] || Math.round((precioUnitario / mult) * 100) / 100);

      return {
        producto_id: item.id,
        nombre: item.nombre,
        categoria: item.categoria,
        escala: label,
        escala_key: item.escalaSeleccionada,
        multiplicador: mult,
        bultos: item.quantity,
        kilos_totales: kilosTotales,
        unidad_medida: item.tipoVenta === 'unidad' ? 'unidad' : 'kg',
        cantidad: item.quantity,
        precio_unitario: precioUnitario,
        precio_por_kg: precioPorKg,
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

    const resultado = await submitPedido(datos, productosTexto, cartTotal, itemsEstructurados, {
      sessionId: getOrCreateCartSessionId(),
      cuponCodigo: cuponAplicado?.codigo,
      descuentoMonto: descuentoCupon,
      remitoOrigenId: remitoOrigenId ?? undefined,
    });

    if (!resultado.success) {
      console.warn('Aviso: el registro automático no confirmó respuesta en servidor, pero se envía por WhatsApp oficial.');
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

    const cuponMsg = (cuponAplicado && descuentoCupon > 0)
      ? `\n🎟️ Cupón aplicado (${cuponAplicado.codigo}): -$${descuentoCupon.toLocaleString('es-AR')}`
      : '';
    const horarioMsg = datos.horarioEntrega ? `\n⏰ Horario preferido de entrega: ${datos.horarioEntrega}` : '';
    const pagoMsg = datos.metodoPago ? `\n💳 Método de pago: ${datos.metodoPago}` : '';
    const notasMsg = datos.notas?.trim() ? `\n📝 Aclaraciones: ${datos.notas.trim()}` : '';
    const horaMsg = resultado.horaRegistro ? `\n🕒 Pedido registrado: ${resultado.horaRegistro}` : '';

    const mensaje =
      `Hola Mix Point! Quiero confirmar mi pedido${pedidoCodigo}:\n\n` +
      `📦 Detalle del pedido:\n` +
      `${productosMsg}\n\n` +
      `💰 Total: $${totalConDescuento.toLocaleString('es-AR')}` +
      cuponMsg +
      `\n\n` +
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
    setCuponDirecto(null);
    setRemitoOrigenId(null);
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
        replaceCart,
        cartTotal,
        descuentoCupon,
        totalConDescuento,
        cartCount,
        cuponAplicado,
        aplicarCupon,
        setCuponDirecto,
        quitarCupon,
        remitoOrigenId,
        setRemitoOrigenId,
        sincronizarCarritoConDatos,
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
