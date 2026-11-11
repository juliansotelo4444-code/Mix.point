import type { Precios } from '../types';

// Multiplicador de cada formato de venta. Para "kg" y "unidad" el precio
// guardado YA es el precio final (x1), para las bolsas mayoristas el precio
// guardado es "precio por kg" y hay que multiplicarlo por el peso del bulto.
export const MULTIPLICADORES: Record<keyof Precios, number> = {
  kg: 1,
  cincoKg: 5,
  diezKg: 10,
  veinticincoKg: 25,
  treintaKg: 30,
  unidad: 1,
};

// Calcula el precio de UNA unidad de venta (una bolsa, un kilo, una unidad
// suelta) según el formato elegido. Esto es lo que se multiplica después
// por la cantidad que pidió el cliente.
export function calcularPrecioUnitario(precios: Precios, escala: keyof Precios): number {
  const precioBase = precios[escala] ?? 0;
  const multiplicador = MULTIPLICADORES[escala] ?? 1;
  return precioBase * multiplicador;
}

export function getEscalaLabel(escala: keyof Precios, tipoVenta: 'peso' | 'unidad' = 'peso'): string {
  if (tipoVenta === 'unidad') {
    if (escala === 'cincoKg') return 'Pack x5 (Mayorista)';
    if (escala === 'diezKg') return 'Pack x10 (Mayorista)';
    return 'Unidad';
  }

  const pesoMap: Record<keyof Precios, string> = {
    kg: '1kg',
    cincoKg: '5kg',
    diezKg: '10kg',
    veinticincoKg: '25kg',
    treintaKg: '30kg',
    unidad: 'Unidad',
  };

  return pesoMap[escala] || String(escala);
}
