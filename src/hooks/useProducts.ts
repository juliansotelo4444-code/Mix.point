import { useState, useEffect } from 'react';
import type { Product } from '../types';

const SHEETS_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTsSl1udCka3CKz61sitiiwynsibWeGS65K9zEe-6UXdCb_k1W8_Nr0ABoIZm_7wIvHbWd13KKOqOiI/pub?gid=120010130&single=true&output=csv';

function parseCSV(text: string): Product[] {
  const lines = text.trim().split('\n');
  const headers = lines[0].split(',');

  return lines.slice(1).map(line => {
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

    return {
      id: parseInt(get('id')),
      nombre: get('nombre'),
      descripcion: get('descripcion') || undefined,
      categoria: get('categoria'),
      imagen: get('imagen'),
      precios: {
        kg:             num('kg') ?? 0,
        cincoKg:        num('cincoKg'),
        diezKg:         num('diezKg'),
        veinticincoKg:  num('veinticincoKg'),
        treintaKg:      num('treintaKg'),
      },
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