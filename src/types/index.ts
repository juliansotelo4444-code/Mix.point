// src/types/index.ts

// Definimos la estructura de los precios según las columnas de la lista 
export interface Precios {
  kg: number;           // Precio base por 1kg
  cincoKg?: number;     // Precio x kg llevando 5kg 
  diezKg?: number;      // Precio x kg llevando 10kg 
  veinticincoKg?: number; // Específico para Mani 
  treintaKg?: number;   // Específico para Legumbres [cite: 6]
  unidad?: number;      // Para productos que se venden por pieza (Aceite, Miel) 
}

// Definimos la estructura del Producto
export interface Product {
  id: number;
  nombre: string;
  categoria: string;
  precios: Precios;
  imagen: string;
  descripcion?: string; // Opcional, para los mixes o detalles extra 
}

// Definimos la estructura de lo que va dentro del carrito
export interface CartItem extends Product {
  quantity: number;
  escalaSeleccionada: keyof Precios; // Para saber si compró x1kg, x5kg, etc.
}