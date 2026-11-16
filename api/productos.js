import { neon } from '@neondatabase/serverless';

const DEFAULT_DATABASE_URL = 'postgresql://neondb_owner:npg_r6XklViWbA7z@ep-billowing-resonance-axkinkbe-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Método no permitido. Solo se acepta GET.' });
  }

  try {
    const dbUrl = process.env.DATABASE_URL || DEFAULT_DATABASE_URL;
    const sql = neon(dbUrl);

    const rows = await sql.query(`
      SELECT 
        p.id,
        p.codigo,
        p.nombre,
        p.descripcion,
        p.imagen,
        p.unidad_medida,
        p.precio_venta,
        p.precio_5kg,
        p.precio_10kg,
        p.precio_25kg,
        p.precio_30kg,
        p.stock_actual,
        p.activo,
        COALESCE(c.nombre, 'Varios') as categoria
      FROM productos p
      LEFT JOIN categorias_producto c ON c.id = p.categoria_id
      WHERE p.activo = true
      ORDER BY c.nombre ASC, p.nombre ASC
    `);

    const num = (v) => {
      const n = Number(v);
      return (!isNaN(n) && n > 0) ? n : undefined;
    };

    const productos = rows.map((p, rowIndex) => {
      const tipoVenta = p.unidad_medida === 'unidad' ? 'unidad' : 'peso';
      const precioBase = Number(p.precio_venta) || 0;

      return {
        id: Number(p.id) || (8000 + rowIndex),
        codigo: p.codigo || '',
        nombre: p.nombre,
        descripcion: p.descripcion || undefined,
        categoria: p.categoria || 'Varios',
        imagen: p.imagen ? String(p.imagen).trim() : '',
        tipoVenta,
        stock: Number(p.stock_actual) || 0,
        precios: tipoVenta === 'unidad'
          ? {
              kg: 0,
              unidad: precioBase,
              cincoKg: num(p.precio_5kg),
              diezKg: num(p.precio_10kg),
              veinticincoKg: num(p.precio_25kg),
              treintaKg: num(p.precio_30kg),
            }
          : {
              kg: precioBase,
              cincoKg: num(p.precio_5kg),
              diezKg: num(p.precio_10kg),
              veinticincoKg: num(p.precio_25kg),
              treintaKg: num(p.precio_30kg),
            }
      };
    });

    res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
    return res.status(200).json(productos);
  } catch (error) {
    console.error('Error al consultar catálogo de productos en Neon DB:', error);
    return res.status(500).json({
      success: false,
      error: 'Error al consultar catálogo de productos',
      detalles: error.message
    });
  }
}
