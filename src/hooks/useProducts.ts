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

const PRODUCTS_CACHE_KEY = 'mixpoint_products_neon_v1';
const LEGACY_CACHE_KEY = 'mixpoint_products_sheets_v3';

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

  useEffect(() => {
    let cancel = false;

    async function cargarCatalogo() {
      // 1. FUENTE PRINCIPAL: Base de datos Neon PostgreSQL en tiempo real
      try {
        const res = await fetch(`/api/productos?_t=${Date.now()}`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            if (cancel) return;
            const normalizados: Product[] = data.map((p: any) => {
              const esUnidad = p.tipoVenta === 'unidad' || p.unidad_medida === 'unidad';
              const precioBase = Number(p.precio_venta || (p.precios ? (p.precios.unidad ?? p.precios.kg) : 0)) || 0;
              const numVal = (v: any) => {
                const n = Number(v);
                return (!isNaN(n) && n > 0) ? n : undefined;
              };

              return {
                id: Number(p.id),
                codigo: p.codigo || '',
                nombre: p.nombre,
                descripcion: p.descripcion || undefined,
                categoria: p.categoria || 'Varios',
                imagen: getProductImage(Number(p.id), p.imagen),
                tipoVenta: esUnidad ? 'unidad' : 'peso',
                stock: Number(p.stock_actual ?? p.stock ?? 0),
                destacado_carrusel: Boolean(p.destacado_carrusel),
                badge_carrusel: p.badge_carrusel || undefined,
                orden_carrusel: Number(p.orden_carrusel) || 0,
                precio_oferta: numVal(p.precio_oferta),
                precios: p.precios || (esUnidad
                  ? {
                      kg: 0,
                      unidad: precioBase,
                      cincoKg: numVal(p.precio_5kg),
                      diezKg: numVal(p.precio_10kg),
                      veinticincoKg: numVal(p.precio_25kg),
                      treintaKg: numVal(p.precio_30kg),
                    }
                  : {
                      kg: precioBase,
                      cincoKg: numVal(p.precio_5kg),
                      diezKg: numVal(p.precio_10kg),
                      veinticincoKg: numVal(p.precio_25kg),
                      treintaKg: numVal(p.precio_30kg),
                    }),
              };
            });

            setProducts(normalizados);
            try {
              localStorage.setItem(PRODUCTS_CACHE_KEY, JSON.stringify(normalizados));
            } catch {}
            setLoading(false);
            setError(null);
            return;
          }
        }
      } catch (errDb) {
        console.warn('[useProducts] Consulta /api/productos no disponible, usando respaldo...', errDb);
      }

      // 2. RESPALDO LOCAL: Backend Express en puerto 4000 si está corriendo localmente
      try {
        const resLocal = await fetch(`http://localhost:4000/api/productos/public?_t=${Date.now()}`);
        if (resLocal.ok) {
          const rawLocal = await resLocal.json();
          if (Array.isArray(rawLocal) && rawLocal.length > 0) {
            if (cancel) return;
            const normalizadosLocal: Product[] = rawLocal.map((p: any, idx: number) => {
              const esUnidad = p.unidad_medida === 'unidad';
              const base = Number(p.precio_venta) || 0;
              const numVal = (v: any) => {
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
                destacado_carrusel: Boolean(p.destacado_carrusel),
                badge_carrusel: p.badge_carrusel || undefined,
                orden_carrusel: Number(p.orden_carrusel) || 0,
                precio_oferta: numVal(p.precio_oferta),
                precios: esUnidad
                  ? {
                      kg: 0,
                      unidad: base,
                      cincoKg: numVal(p.precio_5kg),
                      diezKg: numVal(p.precio_10kg),
                      veinticincoKg: numVal(p.precio_25kg),
                      treintaKg: numVal(p.precio_30kg),
                    }
                  : {
                      kg: base,
                      cincoKg: numVal(p.precio_5kg),
                      diezKg: numVal(p.precio_10kg),
                      veinticincoKg: numVal(p.precio_25kg),
                      treintaKg: numVal(p.precio_30kg),
                    },
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

      // 3. RESPALDO DE CONTINGENCIA: Google Sheets CSV
      try {
        const cacheBuster = `&_t=${Date.now()}`;
        const res = await fetch(`${SHEETS_CSV_URL}${cacheBuster}`);
        if (!res.ok) throw new Error('No se pudo cargar la planilla de respaldo');
        const text = await res.text();
        if (cancel) return;
        const parsed = parseCSV(text);
        if (parsed.length > 0) {
          setProducts(parsed);
          try {
            localStorage.setItem(PRODUCTS_CACHE_KEY, JSON.stringify(parsed));
          } catch {}
        }
        setLoading(false);
        setError(null);
      } catch (err: unknown) {
        if (cancel) return;
        const msg = err instanceof Error ? err.message : 'Error al cargar productos';
        setProducts(prev => {
          if (prev.length === 0) {
            setError(msg);
          }
          return prev;
        });
        setLoading(false);
      }
    }

    cargarCatalogo();

    return () => {
      cancel = true;
    };
  }, []);

  return { products, loading, error };
}
