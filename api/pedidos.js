import { neon } from '@neondatabase/serverless';

const DEFAULT_DATABASE_URL = 'postgresql://neondb_owner:npg_r6XklViWbA7z@ep-billowing-resonance-axkinkbe-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Método no permitido. Solo se acepta POST.' });
  }

  try {
    const dbUrl = process.env.DATABASE_URL || DEFAULT_DATABASE_URL;
    const sql = neon(dbUrl);

    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        body = {};
      }
    }
    body = body || {};

    const {
      nombre,
      telefono,
      direccion,
      zona,
      metodoPago,
      notas,
      productos,
      items,
      total
    } = body;

    if (!nombre || !String(nombre).trim()) {
      return res.status(400).json({ success: false, error: 'El nombre del cliente es obligatorio.' });
    }

    // 1. Obtener el siguiente correlativo oficial MP-XXXX
    const maxResult = await sql.query(
      "SELECT COALESCE(MAX(NULLIF(regexp_replace(numero, '[^0-9]', '', 'g'), '')::int), 154) as max_num FROM pedidos_web"
    );

    const maxNum = (maxResult[0] && maxResult[0].max_num) ? parseInt(maxResult[0].max_num, 10) : 154;
    const nuevoNumero = 'MP-' + String(maxNum + 1).padStart(4, '0');

    // 2. Preparar los datos e insertar en la base de datos de Neon
    const itemsJson = JSON.stringify(Array.isArray(items) ? items : []);
    const totalNumerico = Number(total) || 0;

    const insertResult = await sql.query(
      "INSERT INTO pedidos_web (numero, cliente_nombre, telefono, direccion, zona, metodo_pago, notas, productos_str, items, total, estado, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9::jsonb, $10, 'pendiente', NOW()) RETURNING id, numero, created_at",
      [
        nuevoNumero,
        String(nombre).trim(),
        String(telefono || '').trim(),
        String(direccion || '').trim(),
        String(zona || '').trim(),
        String(metodoPago || 'No especificado').trim(),
        String(notas || '').trim(),
        String(productos || '').trim(),
        itemsJson,
        totalNumerico
      ]
    );

    const pedidoGuardado = insertResult[0];

    return res.status(200).json({
      success: true,
      numeroPedido: nuevoNumero,
      id: pedidoGuardado.id,
      fecha: pedidoGuardado.created_at,
      mensaje: 'Pedido guardado directamente en la base de datos de Mix Point'
    });
  } catch (err) {
    console.error('Error al guardar pedido en Neon:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'Error al conectar con la base de datos'
    });
  }
}
