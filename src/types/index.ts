// src/types/index.ts

export interface Precios {
  kg: number;
  cincoKg?: number;
  diezKg?: number;
  veinticincoKg?: number;
  treintaKg?: number;
}

export interface Product {
  id: number;
  nombre: string;
  categoria: string;
  descripcion?: string;
  precios: Precios;
  imagen: string;
}

export interface CartItem extends Product {
  quantity: number;
  escalaSeleccionada: keyof Precios;
}