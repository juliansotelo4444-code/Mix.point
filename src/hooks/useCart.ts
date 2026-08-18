import { useState } from 'react';
import type { Product, CartItem, Precios } from '../types';
import { calcularPrecioUnitario } from '../utils/precios';

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);

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
  // (kg, 5kg, 10kg, unidad, etc.) en vez de asumir siempre "kg".
  const cartTotal = cart.reduce((acc, item) => {
    const precioUnitario = calcularPrecioUnitario(item.precios, item.escalaSeleccionada);
    return acc + (precioUnitario * item.quantity);
  }, 0);

  const removeFromCart = (productId: number) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(item => item.id === productId);

      if (existingItem && existingItem.quantity > 1) {
        // Si hay más de uno, restamos 1
        return prevCart.map(item =>
          item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
        );
      }
      // Si hay uno solo o no existe, lo sacamos del array
      return prevCart.filter(item => item.id !== productId);
    });
  };

  return { cart, addToCart, removeFromCart, cartTotal };
};;