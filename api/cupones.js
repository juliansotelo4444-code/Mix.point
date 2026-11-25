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

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') {
    return res.status(405).json({ valido: false, error: 'Método no permitido. Solo GET.' });
  }

  try {
    const dbUrl = process.env.DATABASE_URL || DEFAULT_DATABASE_URL;
    const sql = neon(dbUrl);

    const codigo = String(req.query.codigo || '').trim().toUpperCase();
    if (!codigo) {
      return res.status(400).json({ valido: false, error: 'Ingresá un código de cupón.' });
    }

    const rows = await sql.query(
      `SELECT id, codigo, tipo_descuento, valor_descuento, cliente_id, usos_maximos, usos_actuales, valido_hasta, activo
       FROM cupones
       WHERE UPPER(codigo) = UPPER($1)
       LIMIT 1`,
      [codigo]
    );

    const cupon = rows[0];
    if (!cupon) {
      return res.status(200).json({ valido: false, error: 'El código de cupón no existe.' });
    }
    if (!cupon.activo) {
      return res.status(200).json({ valido: false, error: 'Este cupón ya fue desactivado.' });
    }
    if (Number(cupon.usos_actuales) >= Number(cupon.usos_maximos)) {
      return res.status(200).json({ valido: false, error: 'Este cupón ya alcanzó el límite de usos.' });
    }
    if (new Date(cupon.valido_hasta) <= new Date()) {
      return res.status(200).json({ valido: false, error: 'Este cupón ya venció.' });
    }

    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({
      valido: true,
      cupon: {
        id: cupon.id,
        codigo: cupon.codigo,
        tipo_descuento: cupon.tipo_descuento,
        valor_descuento: Number(cupon.valor_descuento),
        valido_hasta: cupon.valido_hasta
      }
    });
  } catch (err) {
    console.error('Error validando cupón:', err);
    return res.status(500).json({ valido: false, error: 'No se pudo validar el cupón.' });
  }
}
