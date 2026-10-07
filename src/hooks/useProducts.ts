import { useState, useEffect } from 'react';
import type { Product } from '../types';
import { getProductImage } from '../utils/productImages';

const SHEETS_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTsSl1udCka3CKz61sitiiwynsibWeGS65K9zEe-6UXdCb_k1W8_Nr0ABoIZm_7wIvHbWd13KKOqOiI/pub?gid=120010130&single=true&output=csv';

function parseCSV(text: string): Product[] {
  // Google Sheets exporta con saltos de línea \r\n (estilo Windows) y a veces
  // con un BOM invisible (\uFEFF) al principio del archivo. Si no se limpian,
  // el header "id" (o el último, "tipoVenta") no matchea con indexOf(),
  // haciendo que TODOS los productos se descarten silenciosamente al final
  // por el filter(!isNaN(p.id)).
  const cleanText = text.replace(/^\uFEFF/, '');
  const lines = cleanText.trim().split(/\r\n|\n/);
  const headers = lines[0].split(',').map(h => h.trim());

  const productos = lines.slice(1).map(line => {
    const cols: string[] = [];
    let current = '';
    let inQuotes = false;
    for (const char of line) {
      if (char === '"') { inQuotes = !inQuotes; }
      else if (char === ',' && !inQuotes) { cols.push(current.trim()); current = ''; }
      else { current += char; }
    }
    cols.push(current.trim());

    const get = (key: string) => cols[headers.indexOf(key)]?.trim() ?? '';
    const num = (key: string) => {
      const v = get(key);
      if (!v) return undefined;
      const parsed = parseInt(v.replace(/\s+/g, ''), 10);
      return isNaN(parsed) ? undefined : parsed;
    };

    // Leemos la columna tipoVenta. Si está vacía o no existe, asumimos
    // "peso" (comportamiento de siempre, no rompe nada de lo que ya
    // tenías cargado).
    const tipoVentaRaw = get('tipoVenta').toLowerCase();
    const tipoVenta: 'peso' | 'unidad' = tipoVentaRaw === 'unidad' ? 'unidad' : 'peso';

    const precioBase = num('kg') ?? 0;

    const id = parseInt(get('id'), 10);

    return {
      id,
      nombre: get('nombre'),
      descripcion: get('descripcion') || undefined,
      categoria: get('categoria'),
      imagen: getProductImage(id, get('imagen')),
      tipoVenta,
      precios: tipoVenta === 'unidad'
        // Producto por unidad: el precio que estaba en la columna "kg"
        // pasa a vivir en la clave "unidad" (precio fijo por unidad).
        ? { kg: 0, unidad: precioBase }
        // Producto por peso: comportamiento original, sin cambios.
        : {
            kg:             precioBase,
            cincoKg:        num('cincoKg'),
            diezKg:         num('diezKg'),
            veinticincoKg:  num('veinticincoKg'),
            treintaKg:      num('treintaKg'),
          },
    };
  });

  return productos.filter(p => !isNaN(p.id));
}

const PRODUCTS_CACHE_KEY = 'mixpoint_cached_products_v1';

function getCachedProducts(): Product[] {
  try {
    const raw = localStorage.getItem(PRODUCTS_CACHE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // Modo privado o localStorage bloqueado
  }
  return [];
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(getCachedProducts);
  const [loading, setLoading] = useState<boolean>(() => getCachedProducts().length === 0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancel = false;

    fetch(SHEETS_CSV_URL)
      .then(res => {
        if (!res.ok) throw new Error('No se pudo cargar la planilla');
        return res.text();
      })
      .then(text => {
        if (cancel) return;
        const parsed = parseCSV(text);
        if (parsed.length > 0) {
          setProducts(parsed);
          try {
            localStorage.setItem(PRODUCTS_CACHE_KEY, JSON.stringify(parsed));
          } catch {
            // Ignorar límite de almacenamiento
          }
        }
        setLoading(false);
        setError(null);
      })
      .catch(err => {
        if (cancel) return;
        // Si ya teníamos productos en caché, no mostramos error bloqueante
        setProducts(prev => {
          if (prev.length === 0) {
            setError(err.message);
          }
          return prev;
        });
        setLoading(false);
      });

    return () => {
      cancel = true;
    };
  }, []);

  return { products, loading, error };
}