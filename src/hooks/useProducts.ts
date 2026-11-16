import { useState, useEffect } from 'react';
import type { Product } from '../types';
import { getProductImage } from '../utils/productImages';
import { SHEETS_CSV_URL } from '../config/constants';

function parseCSV(text: string): Product[] {
  // Google Sheets exporta con saltos de línea \r\n (estilo Windows) y a veces
  // con un BOM invisible (\uFEFF) al principio del archivo.
  const cleanText = text.replace(/^\uFEFF/, '');
  const lines = cleanText.trim().split(/\r\n|\n/);
  const headers = lines[0].split(',').map(h => h.trim());

  const parsedList = lines.slice(1).map((line, rowIndex) => {
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

    const nombre = get('nombre');
    const descripcion = get('descripcion') || undefined;

    // Detectamos tipo de venta. Si no viene explícito, analizamos si por nombre
    // o descripción es un producto unitario (ej: chocolates x10, tinturas en frasco, esencias)
    const tipoVentaRaw = get('tipoVenta').toLowerCase().trim();
    let tipoVenta: 'peso' | 'unidad' = tipoVentaRaw === 'unidad' ? 'unidad' : 'peso';
    if (!tipoVentaRaw) {
      const combined = `${nombre} ${descripcion || ''}`.toLowerCase();
      if (
        combined.includes('por 10 unidades') ||
        combined.includes('caja x') ||
        combined.includes('100cc') ||
        combined.includes('60 cc') ||
        combined.includes('60cc') ||
        combined.includes('50cc') ||
        combined.includes('40cc')
      ) {
        tipoVenta = 'unidad';
      }
    }

    const precioBase = num('kg') ?? 0;
    const rawId = parseInt(get('id'), 10);
    const id = isNaN(rawId) ? 8000 + rowIndex : rawId;

    // Normalización de categoría: primer letra siempre en mayúscula
    const rawCategoria = get('categoria').trim();
    let categoria = rawCategoria;
    if (categoria) {
      categoria = categoria.charAt(0).toUpperCase() + categoria.slice(1);
    } else {
      const nombreLower = nombre.toLowerCase();
      if (nombreLower.includes('eritritol') || nombreLower.includes('stevia')) {
        categoria = 'Azucares';
      } else {
        categoria = 'Varios';
      }
    }

    return {
      id,
      nombre,
      descripcion,
      categoria,
      imagen: getProductImage(id, get('imagen')),
      tipoVenta,
      precios: tipoVenta === 'unidad'
        ? {
            kg: 0,
            unidad: precioBase,
            // Conservamos precios de bulto/pack mayorista si están cargados en el Excel
            cincoKg: num('cincoKg'),
            diezKg: num('diezKg'),
          }
        : {
            kg:             precioBase,
            cincoKg:        num('cincoKg'),
            diezKg:         num('diezKg'),
            veinticincoKg:  num('veinticincoKg'),
            treintaKg:      num('treintaKg'),
          },
    };
  });

  // El Excel base es ley: NINGÚN producto debe ser descartado silenciosamente.
  // Si encontramos IDs duplicados en la planilla, asignamos un ID seguro en memoria
  // para que ambos productos aparezcan en la tienda sin colisionar en React.
  const seenIds = new Set<number>();
  return parsedList.map((p, idx) => {
    let finalId = p.id;
    if (seenIds.has(finalId)) {
      console.warn(`[Excel Base] ID duplicado ${finalId} en "${p.nombre}". Asignando ID único virtual.`);
      finalId = finalId * 1000 + idx;
    }
    seenIds.add(finalId);
    return { ...p, id: finalId };
  });
}

const PRODUCTS_CACHE_KEY = 'mixpoint_products_db_v2';
const LEGACY_CACHE_KEY = 'mixpoint_cached_products_v1';

function getCachedProducts(): Product[] {
  try {
    const raw = localStorage.getItem(PRODUCTS_CACHE_KEY) || localStorage.getItem(LEGACY_CACHE_KEY);
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

  const cargarCatalogo = async (cancelToken = { cancelled: false }) => {
    // 1. Intentar cargar directamente desde la base de datos Neon vía Serverless Function
    try {
      const res = await fetch(`/api/productos?_t=${Date.now()}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          if (cancelToken.cancelled) return;
          const normalizados: Product[] = data.map((p) => ({
            ...p,
            imagen: getProductImage(p.id, p.imagen),
          }));
          setProducts(normalizados);
          try {
            localStorage.setItem(PRODUCTS_CACHE_KEY, JSON.stringify(normalizados));
          } catch {
            // Ignorar límite de almacenamiento
          }
          setLoading(false);
          setError(null);
          return;
        }
      }
    } catch (errDb) {
      console.warn('[useProducts] Intento con /api/productos no completado, probando respaldo...', errDb);
    }

    // 2. Respaldo secundario: intentar consultar backend local si estuviera corriendo en puerto 4000
    try {
      const resLocal = await fetch(`http://localhost:4000/api/productos/public?_t=${Date.now()}`);
      if (resLocal.ok) {
        const rawLocal = await resLocal.json();
        if (Array.isArray(rawLocal) && rawLocal.length > 0) {
          if (cancelToken.cancelled) return;
          const normalizadosLocal: Product[] = rawLocal.map((p, idx) => {
            const esUnidad = p.unidad_medida === 'unidad';
            const base = Number(p.precio_venta) || 0;
            const num = (v: any) => {
              const n = Number(v);
              return (!isNaN(n) && n > 0) ? n : undefined;
            };
            return {
              id: Number(p.id) || (8000 + idx),
              codigo: p.codigo || '',
              nombre: p.nombre,
              descripcion: p.descripcion || undefined,
              categoria: p.categoria || 'Varios',
              imagen: getProductImage(Number(p.id), p.imagen),
              tipoVenta: esUnidad ? 'unidad' : 'peso',
              stock: Number(p.stock_actual) || 0,
              precios: esUnidad
                ? {
                    kg: 0,
                    unidad: base,
                    cincoKg: num(p.precio_5kg),
                    diezKg: num(p.precio_10kg),
                    veinticincoKg: num(p.precio_25kg),
                    treintaKg: num(p.precio_30kg),
                  }
                : {
                    kg: base,
                    cincoKg: num(p.precio_5kg),
                    diezKg: num(p.precio_10kg),
                    veinticincoKg: num(p.precio_25kg),
                    treintaKg: num(p.precio_30kg),
                  }
            };
          });
          setProducts(normalizadosLocal);
          try {
            localStorage.setItem(PRODUCTS_CACHE_KEY, JSON.stringify(normalizadosLocal));
          } catch {}
          setLoading(false);
          setError(null);
          return;
        }
      }
    } catch {}

    // 3. Respaldo terciario de contingencia: Google Sheets CSV original
    try {
      const cacheBuster = `&_t=${Date.now()}`;
      const res = await fetch(`${SHEETS_CSV_URL}${cacheBuster}`);
      if (!res.ok) throw new Error('No se pudo cargar la planilla');
      const text = await res.text();
      if (cancelToken.cancelled) return;
      const parsed = parseCSV(text);
      if (parsed.length > 0) {
        setProducts(parsed);
        try {
          localStorage.setItem(PRODUCTS_CACHE_KEY, JSON.stringify(parsed));
        } catch {}
      }
      setLoading(false);
      setError(null);
    } catch (err: any) {
      if (cancelToken.cancelled) return;
      // Si ya teníamos productos en caché, no mostramos pantalla de error
      setProducts(prev => {
        if (prev.length === 0) {
          setError(err.message || 'Error al cargar productos');
        }
        return prev;
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    const cancelToken = { cancelled: false };
    cargarCatalogo(cancelToken);

    return () => {
      cancelToken.cancelled = true;
    };
  }, []);

  return { products, loading, error, refetch: () => cargarCatalogo({ cancelled: false }) };
}
