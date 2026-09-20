import { useState, useEffect } from 'react';
import type { Product, CartItem, Precios } from '../types';
import { calcularPrecioUnitario } from '../utils/precios';

const CART_STORAGE_KEY = 'mixpoint_cart_items';

function cargarCarritoGuardado(): CartItem[] {
  try {
    const saved = localStorage.getItem(CART_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // Ignorar si localStorage está bloqueado o en modo incógnito estricto
  }
  return [];
}

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>(cargarCarritoGuardado);

  // Persistencia automática cada vez que cambia el carrito
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // Ignorar si el almacenamiento local falla
    }
  }, [cart]);

  const addToCart = (product: Product, peso: keyof Precios, cantidad: number) => {
    setCart(prevCart => {
      // Revisamos si ya existe el mismo producto con el mismo peso/formato
      const existingItem = prevCart.find(
        item => item.id === product.id && item.escalaSeleccionada === peso
      );

      if (existingItem) {
        // Si ya existe, le sumamos la nueva cantidad a la que ya tenía
        return prevCart.map(item =>
          (item.id === product.id && item.escalaSeleccionada === peso)
            ? { ...item, quantity: item.quantity + cantidad }
            : item
        );
      }

      // Si es nuevo, lo agregamos con la cantidad que viene de la tarjeta
      return [...prevCart, { ...product, escalaSeleccionada: peso, quantity: cantidad }];
    });
  };

  // Calculamos el total usando el precio real según el formato elegido
  const cartTotal = cart.reduce((acc, item) => {
    const precioUnitario = calcularPrecioUnitario(item.precios, item.escalaSeleccionada);
    return acc + (precioUnitario * item.quantity);
  }, 0);

  // Resta 1 unidad o remueve si llega a 0
  const removeFromCart = (productId: number, escala: keyof Precios) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        item => item.id === productId && item.escalaSeleccionada === escala
      );

      if (existingItem && existingItem.quantity > 1) {
        return prevCart.map(item =>
          item.id === productId && item.escalaSeleccionada === escala
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      }
      return prevCart.filter(
        item => !(item.id === productId && item.escalaSeleccionada === escala)
      );
    });
  };

  // Modifica directamente la cantidad deseada (o remueve si es 0 o menor)
  const updateQuantity = (productId: number, escala: keyof Precios, nuevaCantidad: number) => {
    if (nuevaCantidad <= 0) {
      removeItem(productId, escala);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId && item.escalaSeleccionada === escala
          ? { ...item, quantity: nuevaCantidad }
          : item
      )
    );
  };

  // Quita el producto completo de la fila
  const removeItem = (productId: number, escala: keyof Precios) => {
    setCart(prevCart =>
      prevCart.filter(
        item => !(item.id === productId && item.escalaSeleccionada === escala)
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch {
      // Ignorar
    }
  };

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    removeItem,
    clearCart,
    cartTotal
  };
};