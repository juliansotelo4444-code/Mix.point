// src/types/index.ts

export interface Precios {
  kg: number;
  cincoKg?: number;
  diezKg?: number;
  veinticincoKg?: number;
  treintaKg?: number;
  unidad?: number;
}

export interface Product {
  id: number;
  nombre: string;
  categoria: string;
  descripcion?: string;
  precios: Precios;
  imagen: string;
  tipoVenta: 'peso' | 'unidad';
}

export interface CartItem extends Product {
  quantity: number;
  escalaSeleccionada: keyof Precios;
}