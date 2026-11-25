import { neon } from '@neondatabase/serverless';

const DEFAULT_DATABASE_URL = 'postgresql://neondb_owner:npg_r6XklViWbA7z@ep-billowing-resonance-axkinkbe-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require';

const num = (v) => {
  const n = Number(v);
  return (!isNaN(n) && n > 0) ? n : undefined;
};

function inferirEscalaYCantidad(ri, tipoVenta, precios) {
  const rawDesc = String(ri.descripcion || '').toLowerCase();
  const cantTotal = Number(ri.cantidad) || 1;

  if (rawDesc.includes('30kg') || rawDesc.includes('30 kg') || rawDesc.includes('x30')) {
    if (precios.treintaKg && cantTotal >= 30 && cantTotal % 30 === 0) {
      return { escalaSeleccionada: 'treintaKg', quantity: cantTotal / 30 };
    }
  }
  if (rawDesc.includes('25kg') || rawDesc.includes('25 kg') || rawDesc.includes('x25')) {
    if (precios.veinticincoKg && cantTotal >= 25 && cantTotal % 25 === 0) {
      return { escalaSeleccionada: 'veinticincoKg', quantity: cantTotal / 25 };
    }
  }
  if (rawDesc.includes('10kg') || rawDesc.includes('10 kg') || rawDesc.includes('x10')) {
    if (precios.diezKg && cantTotal >= 10 && cantTotal % 10 === 0) {
      return { escalaSeleccionada: 'diezKg', quantity: cantTotal / 10 };
    }
  }
  if (rawDesc.includes('5kg') || rawDesc.includes('5 kg') || rawDesc.includes('x5')) {
    if (precios.cincoKg && cantTotal >= 5 && cantTotal % 5 === 0) {
      return { escalaSeleccionada: 'cincoKg', quantity: cantTotal / 5 };
    }
  }

  return {
    escalaSeleccionada: tipoVenta === 'unidad' ? 'unidad' : 'kg',
    quantity: Math.max(1, cantTotal)
  };
}

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
    return res.status(405).json({ ok: false, error: 'Método no permitido. Solo GET.' });
  }

  try {
    const dbUrl = process.env.DATABASE_URL || DEFAULT_DATABASE_URL;
    const sql = neon(dbUrl);

    const pedidoId = parseInt(String(req.query.pedidoId || ''), 10);
    const cuponParam = String(req.query.cupon || '').trim().toUpperCase();

    if (!pedidoId || isNaN(pedidoId)) {
      return res.status(400).json({ ok: false, error: 'ID de pedido inválido.' });
    }

    const remitoRows = await sql.query(
      `SELECT r.id, r.numero, r.fecha, r.direccion_entrega,
              c.razon_social AS cliente_nombre, c.telefono AS cliente_telefono,
              c.direccion AS cliente_direccion, c.localidad AS cliente_localidad
       FROM remitos r
       JOIN clientes c ON c.id = r.cliente_id
       WHERE r.id = $1 AND r.estado NOT IN ('cancelado', 'anulado')
       LIMIT 1`,
      [pedidoId]
    );

    const remito = remitoRows[0];
    if (!remito) {
      return res.status(404).json({ ok: false, error: 'No encontramos ese pedido para reponer.' });
    }

    const itemRows = await sql.query(
      `SELECT ri.cantidad, ri.descripcion,
              p.id, p.codigo, p.nombre, p.descripcion AS prod_desc, p.imagen, p.unidad_medida,
              p.precio_venta, p.precio_5kg, p.precio_10kg, p.precio_25kg, p.precio_30kg,
              p.stock_actual, COALESCE(cat.nombre, 'Varios') AS categoria
       FROM remito_items ri
       JOIN productos p ON p.id = ri.producto_id
       LEFT JOIN categorias_producto cat ON cat.id = p.categoria_id
       WHERE ri.remito_id = $1 AND p.activo = true
       ORDER BY ri.id ASC`,
      [pedidoId]
    );

    const items = itemRows.map((p) => {
      const tipoVenta = p.unidad_medida === 'unidad' ? 'unidad' : 'peso';
      const precioBase = Number(p.precio_venta) || 0;
      const precios = tipoVenta === 'unidad'
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
          };

      const { escalaSeleccionada, quantity } = inferirEscalaYCantidad(p, tipoVenta, precios);

      return {
        id: Number(p.id),
        codigo: p.codigo || '',
        nombre: p.nombre,
        categoria: p.categoria || 'Varios',
        descripcion: p.prod_desc || undefined,
        imagen: p.imagen ? String(p.imagen).trim() : '',
        tipoVenta,
        stock: Number(p.stock_actual) || 0,
        precios,
        quantity,
        escalaSeleccionada
      };
    });

    let cuponValido = false;
    let cuponData = null;
    let errorCupon = null;

    if (cuponParam) {
      const cRows = await sql.query(
        `SELECT id, codigo, tipo_descuento, valor_descuento, usos_maximos, usos_actuales, valido_hasta, activo
         FROM cupones WHERE UPPER(codigo) = UPPER($1) LIMIT 1`,
        [cuponParam]
      );
      const cRow = cRows[0];
      if (!cRow) {
        errorCupon = 'El cupón ingresado no existe.';
      } else if (!cRow.activo || Number(cRow.usos_actuales) >= Number(cRow.usos_maximos)) {
        errorCupon = 'Este cupón ya fue utilizado o desactivado.';
      } else if (new Date(cRow.valido_hasta) <= new Date()) {
        errorCupon = 'Este cupón venció.';
      } else {
        cuponValido = true;
        cuponData = {
          id: cRow.id,
          codigo: cRow.codigo,
          tipo_descuento: cRow.tipo_descuento,
          valor_descuento: Number(cRow.valor_descuento),
          valido_hasta: cRow.valido_hasta
        };
      }
    }

    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({
      ok: true,
      remito: {
        id: remito.id,
        numero: remito.numero,
        fecha: remito.fecha,
        cliente_nombre: remito.cliente_nombre,
        telefono: remito.cliente_telefono || '',
        direccion: remito.direccion_entrega || remito.cliente_direccion || '',
        zona: remito.cliente_localidad || ''
      },
      items,
      cuponValido,
      cupon: cuponData,
      errorCupon
    });
  } catch (err) {
    console.error('Error en /api/reponer:', err);
    return res.status(500).json({ ok: false, error: err.message });
  }
}
