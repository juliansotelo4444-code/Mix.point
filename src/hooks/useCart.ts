
import { useState } from 'react';
import type { Product, CartItem, Precios } from '../types'; 

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);

 const addToCart = (product: Product, peso: keyof Precios, cantidad: number) => {
  setCart(prevCart => {
    // Revisamos si ya existe el mismo producto con el mismo peso
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