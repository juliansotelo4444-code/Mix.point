import { useState, useEffect } from 'react';

const SHEETS_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTsSl1udCka3CKz61sitiiwynsibWeGS65K9zEe-6UXdCb_k1W8_Nr0ABoIZm_7wIvHbWd13KKOqOiI/pub?gid=120010130&single=true&output=csv';

export interface Product {
  id: number;
  nombre: string;
  descripcion?: string;
  categoria: string;
  imagen: string;
  precios: {
    kg?: number;
    cincoKg?: number;
    diezKg?: number;
    veinticincoKg?: number;
    treintaKg?: number;
  };
}

function parseCSV(text: string): Product[] {
  const lines = text.trim().split('\n');
  const headers = lines[0].split(',');

  return lines.slice(1).map(line => {
    // Manejo de comas dentro de comillas (ej: descripciones con comas)
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
    const num = (key: string) => { const v = get(key); return v !== '' ? parseInt(v) : undefined; };

    const precios: Product['precios'] = {};
    if (num('kg') !== undefined)            precios.kg            = num('kg');
    if (num('cincoKg') !== undefined)       precios.cincoKg       = num('cincoKg');
    if (num('diezKg') !== undefined)        precios.diezKg        = num('diezKg');
    if (num('veinticincoKg') !== undefined) precios.veinticincoKg = num('veinticincoKg');
    if (num('treintaKg') !== undefined)     precios.treintaKg     = num('treintaKg');

    return {
      id: parseInt(get('id')),
      nombre: get('nombre'),
      descripcion: get('descripcion') || undefined,
      categoria: get('categoria'),
      imagen: get('imagen'),
      precios,
    };
  }).filter(p => !isNaN(p.id));
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(SHEETS_CSV_URL)
      .then(res => {
        if (!res.ok) throw new Error('No se pudo cargar la planilla');
        return res.text();
      })
      .then(text => {
        setProducts(parseCSV(text));
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { products, loading, error };
}