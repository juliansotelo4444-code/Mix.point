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

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Método no permitido. Solo POST.' });
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

    const sessionId = String(body.sessionId || '').trim();
    const nombre = String(body.nombre || '').trim();
    const telefono = String(body.telefono || '').trim();
    const email = String(body.email || '').trim();
    const direccion = String(body.direccion || '').trim();
    const zona = String(body.zona || '').trim();
    const items = Array.isArray(body.items) ? body.items : [];
    const total = Math.max(0, Number(body.total) || 0);

    const digitsTel = telefono.replace(/\D/g, '');
    const tieneContacto = digitsTel.length >= 8 || email.includes('@');

    if (!sessionId || !tieneContacto) {
      return res.status(200).json({ ok: true, skipped: true });
    }

    if (items.length === 0) {
      await sql.query(
        `UPDATE carritos_abandonados
         SET items = '[]'::jsonb, total = 0, estado = 'expirado', updated_at = NOW()
         WHERE session_id = $1 AND estado <> 'recuperado'`,
        [sessionId]
      );
      return res.status(200).json({ ok: true, cleared: true });
    }

    const itemsJson = JSON.stringify(items);

    await sql.query(
      `INSERT INTO carritos_abandonados (
         session_id, cliente_nombre, telefono, email, direccion, zona,
         items, total, estado, ultima_actividad_at, created_at, updated_at
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb, $8, 'activo', NOW(), NOW(), NOW())
       ON CONFLICT (session_id) DO UPDATE SET
         cliente_nombre = COALESCE(NULLIF(EXCLUDED.cliente_nombre, ''), carritos_abandonados.cliente_nombre),
         telefono = COALESCE(NULLIF(EXCLUDED.telefono, ''), carritos_abandonados.telefono),
         email = COALESCE(NULLIF(EXCLUDED.email, ''), carritos_abandonados.email),
         direccion = COALESCE(NULLIF(EXCLUDED.direccion, ''), carritos_abandonados.direccion),
         zona = COALESCE(NULLIF(EXCLUDED.zona, ''), carritos_abandonados.zona),
         items = EXCLUDED.items,
         total = EXCLUDED.total,
         estado = 'activo',
         notificado_at = CASE WHEN carritos_abandonados.estado IN ('recuperado', 'expirado') THEN NULL ELSE carritos_abandonados.notificado_at END,
         recuperado_at = CASE WHEN carritos_abandonados.estado = 'recuperado' THEN NULL ELSE carritos_abandonados.recuperado_at END,
         ultima_actividad_at = NOW(),
         updated_at = NOW()`,
      [sessionId, nombre || null, telefono || null, email || null, direccion || null, zona || null, itemsJson, total]
    );

    return res.status(200).json({ ok: true, synced: true });
  } catch (err) {
    console.error('Error sincronizando carrito en Neon DB:', err);
    return res.status(500).json({ ok: false, error: err.message });
  }
}
