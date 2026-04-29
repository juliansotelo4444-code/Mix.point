import { useState } from 'react';
import type { Product, CartItem } from '../types';

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);

      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }

      // Agregamos el producto con la escala por defecto 'kg'
      return [...prevCart, { ...product, quantity: 1, escalaSeleccionada: 'kg' }];
    });
  };

  // Calculamos el total usando el precio de la escala seleccionada
  const cartTotal = cart.reduce((acc, item) => {
    // Obtenemos el precio numérico según la escala (por ahora siempre 'kg')
    const precio = item.precios.kg; 
    return acc + (precio * item.quantity);
  }, 0);

  // Agregá esta función dentro de export const useCart = () => { ... }

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

// No olvides exportarla al final del hook:
return { cart, addToCart, removeFromCart, cartTotal };

};