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
      horarioEntrega,
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

    // 2. Determinar horario y momento exacto del pedido (Zona Horaria Argentina)
    const horarioEntregaVal = String(horarioEntrega || '').trim() || 'A convenir / Lo antes posible';

    const nowArg = new Date();
    const horaArgStr = nowArg.toLocaleTimeString('es-AR', {
      timeZone: 'America/Argentina/Buenos_Aires',
      hour: '2-digit',
      minute: '2-digit'
    });
    const fechaArgStr = nowArg.toLocaleDateString('es-AR', {
      timeZone: 'America/Argentina/Buenos_Aires',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    const momentoPedido = `${fechaArgStr} a las ${horaArgStr} hs`;

    let notasFinal = String(notas || '').trim();
    if (horarioEntregaVal && !notasFinal.includes(horarioEntregaVal)) {
      notasFinal = notasFinal
        ? `${notasFinal} | [Horario preferido: ${horarioEntregaVal}]`
        : `[Horario preferido: ${horarioEntregaVal}]`;
    }

    // 3. Preparar los datos e insertar en la base de datos de Neon
    const itemsJson = JSON.stringify(Array.isArray(items) ? items : []);
    const totalNumerico = Number(total) || 0;

    const insertResult = await sql.query(
      "INSERT INTO pedidos_web (numero, cliente_nombre, telefono, direccion, zona, metodo_pago, horario_entrega, notas, productos_str, items, total, estado, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10::jsonb, $11, 'pendiente', NOW()) RETURNING id, numero, created_at",
      [
        nuevoNumero,
        String(nombre).trim(),
        String(telefono || '').trim(),
        String(direccion || '').trim(),
        String(zona || '').trim(),
        String(metodoPago || 'No especificado').trim(),
        horarioEntregaVal,
        notasFinal,
        String(productos || '').trim(),
        itemsJson,
        totalNumerico
      ]
    );

    const pedidoGuardado = insertResult[0];

    // 4. Emitir NOTIFICACIÓN automática en la tabla `notificaciones`
    try {
      const tituloNotif = `🛒 Nuevo Pedido Web: ${nuevoNumero}`;
      const mensajeNotif = `Nuevo pedido de ${String(nombre).trim()} por $${totalNumerico.toLocaleString('es-AR')} recibido el ${momentoPedido}. Franja de entrega: ${horarioEntregaVal}. Tel: ${String(telefono || '').trim()}. Zona: ${String(zona || '').trim()}.`;

      await sql.query(
        "INSERT INTO notificaciones (tipo, titulo, mensaje, nivel, referencia_tipo, referencia_id, leida, created_at) VALUES ('pedido_web', $1, $2, 'info', 'pedido_web', $3, false, NOW())",
        [tituloNotif, mensajeNotif, pedidoGuardado.id]
      );
    } catch (errNotif) {
      console.warn('Aviso: no se pudo insertar en notificaciones:', errNotif.message);
    }

    // 5. Opcional: Notificar por Telegram o Webhook si estuvieran configurados en `configuracion_sistema`
    try {
      const configs = await sql.query(
        "SELECT clave, valor FROM configuracion_sistema WHERE clave IN ('telegram_bot_token', 'telegram_chat_id', 'alertas_webhook_url')"
      );
      const cfgMap = {};
      for (const c of configs) cfgMap[c.clave] = c.valor;

      if (cfgMap.telegram_bot_token && cfgMap.telegram_chat_id) {
        const tgMsg =
          `🛒 *Nuevo Pedido Web ${nuevoNumero}*\n\n` +
          `👤 *Cliente:* ${String(nombre).trim()}\n` +
          `📞 *Teléfono:* ${String(telefono || '').trim()}\n` +
          `📍 *Dirección:* ${String(direccion || '').trim()} (${String(zona || '').trim()})\n` +
          `⏰ *Horario de entrega:* ${horarioEntregaVal}\n` +
          `💰 *Total:* $${totalNumerico.toLocaleString('es-AR')}\n` +
          `🕒 *Hora recibido:* ${momentoPedido}\n\n` +
          `_Registrado automáticamente en Mix Point._`;

        fetch(`https://api.telegram.org/bot${cfgMap.telegram_bot_token}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: cfgMap.telegram_chat_id,
            text: tgMsg,
            parse_mode: 'Markdown'
          })
        }).catch((e) => console.warn('Error enviando a Telegram:', e.message));
      }

      if (cfgMap.alertas_webhook_url) {
        fetch(cfgMap.alertas_webhook_url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            evento: 'nuevo_pedido_web',
            numero: nuevoNumero,
            cliente: String(nombre).trim(),
            total: totalNumerico,
            horarioEntrega: horarioEntregaVal,
            hora: momentoPedido
          })
        }).catch((e) => console.warn('Error webhook:', e.message));
      }
    } catch (errExt) {
      console.warn('Aviso canales externos:', errExt.message);
    }

    return res.status(200).json({
      success: true,
      numeroPedido: nuevoNumero,
      id: pedidoGuardado.id,
      horarioEntrega: horarioEntregaVal,
      horaRegistro: momentoPedido,
      fecha: pedidoGuardado.created_at,
      mensaje: 'Pedido guardado y notificación emitida con éxito'
    });
  } catch (err) {
    console.error('Error al guardar pedido en Neon:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'Error al conectar con la base de datos'
    });
  }
}

