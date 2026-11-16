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
  codigo?: string;
  nombre: string;
  categoria: string;
  descripcion?: string;
  precios: Precios;
  imagen: string;
  tipoVenta: 'peso' | 'unidad';
  stock?: number;
  destacado_carrusel?: boolean;
  badge_carrusel?: string;
  orden_carrusel?: number;
  precio_oferta?: number;
}

export interface CartItem extends Product {
  quantity: number;
  escalaSeleccionada: keyof Precios;
}