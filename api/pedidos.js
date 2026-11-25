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
      total,
      sessionId,
      cuponCodigo,
      remitoOrigenId
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

    // 3. Validar cupón (si vino) y preparar totales finales
    const itemsJson = JSON.stringify(Array.isArray(items) ? items : []);
    const totalBruto = Math.max(0, Number(total) || 0);
    let cuponRow = null;
    let descuentoAplicado = 0;
    let cuponCodigoValido = null;

    if (cuponCodigo && String(cuponCodigo).trim()) {
      try {
        const cRes = await sql.query(
          `SELECT id, codigo, tipo_descuento, valor_descuento, usos_maximos, usos_actuales, valido_hasta, activo
           FROM cupones
           WHERE UPPER(codigo) = UPPER($1)
           LIMIT 1`,
          [String(cuponCodigo).trim()]
        );
        const cand = cRes[0];
        if (cand && cand.activo && Number(cand.usos_actuales) < Number(cand.usos_maximos) && new Date(cand.valido_hasta) > new Date()) {
          cuponRow = cand;
          cuponCodigoValido = cand.codigo;
          if (cand.tipo_descuento === 'monto_fijo') {
            descuentoAplicado = Math.min(totalBruto, Math.round(Number(cand.valor_descuento) || 0));
          } else {
            descuentoAplicado = Math.round(totalBruto * ((Number(cand.valor_descuento) || 0) / 100));
          }
        }
      } catch (errCupon) {
        console.warn('Aviso validando cupón en pedido:', errCupon.message);
      }
    }

    const totalNumerico = Math.max(0, totalBruto - descuentoAplicado);
    const notasConCupon = cuponCodigoValido
      ? `${notasFinal ? notasFinal + ' | ' : ''}[Cupón ${cuponCodigoValido}: -$${descuentoAplicado.toLocaleString('es-AR')}]`
      : notasFinal;

    const insertResult = await sql.query(
      "INSERT INTO pedidos_web (numero, cliente_nombre, telefono, direccion, zona, metodo_pago, horario_entrega, notas, productos_str, items, total, cupon_codigo, descuento_monto, estado, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10::jsonb, $11, $12, $13, 'pendiente', NOW()) RETURNING id, numero, created_at",
      [
        nuevoNumero,
        String(nombre).trim(),
        String(telefono || '').trim(),
        String(direccion || '').trim(),
        String(zona || '').trim(),
        String(metodoPago || 'No especificado').trim(),
        horarioEntregaVal,
        notasConCupon,
        String(productos || '').trim(),
        itemsJson,
        totalNumerico,
        cuponCodigoValido,
        descuentoAplicado
      ]
    );

    const pedidoGuardado = insertResult[0];

    // 3b. Marcar carrito abandonado como recuperado y consumir cupón/recordatorio de reposición
    try {
      const telDigits = String(telefono || '').replace(/\D/g, '');
      const sid = String(sessionId || '').trim();
      if (sid || telDigits.length >= 8) {
        await sql.query(
          `UPDATE carritos_abandonados
           SET estado = 'recuperado', pedido_web_id = $1, recuperado_at = NOW(), updated_at = NOW()
           WHERE estado IN ('activo', 'abandonado', 'notificado')
             AND (
               ($2 <> '' AND session_id = $2)
               OR ($3 <> '' AND regexp_replace(COALESCE(telefono, ''), '[^0-9]', '', 'g') = $3)
             )`,
          [pedidoGuardado.id, sid, telDigits.length >= 8 ? telDigits : '']
        );
      }

      if (cuponRow) {
        await sql.query(
          `UPDATE cupones
           SET usos_actuales = usos_actuales + 1, usado_en_pedido_id = $1
           WHERE id = $2`,
          [pedidoGuardado.id, cuponRow.id]
        );
        await sql.query(
          `UPDATE recordatorios_reposicion
           SET estado = 'convertido', convertido_at = NOW()
           WHERE cupon_id = $1 AND estado <> 'convertido'`,
          [cuponRow.id]
        );
      }

      if (remitoOrigenId && !isNaN(Number(remitoOrigenId))) {
        await sql.query(
          `UPDATE recordatorios_reposicion
           SET estado = 'convertido', convertido_at = NOW()
           WHERE remito_id = $1 AND estado <> 'convertido'`,
          [Number(remitoOrigenId)]
        );
      }
    } catch (errRet) {
      console.warn('Aviso actualizando retención tras pedido:', errRet.message);
    }

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

    // 5. Replicar automáticamente a Google Sheets en tiempo real
    try {
      fetch('https://script.google.com/macros/s/AKfycbyLugszoGUzdKhIN1dDyICjm4tP2m2LrTRqZC9LQr_-85R9lG1fm3_yotSU5-LMKAxz/exec', {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          numero: nuevoNumero,
          nombre: String(nombre).trim(),
          telefono: String(telefono || '').trim(),
          direccion: String(direccion || '').trim(),
          zona: String(zona || '').trim(),
          metodoPago: String(metodoPago || 'No especificado').trim(),
          horarioEntrega: horarioEntregaVal,
          notas: notasConCupon,
          productos: String(productos || '').trim(),
          total: totalNumerico
        })
      }).catch((e) => console.warn('Aviso replicación Google Sheets:', e.message));
    } catch (_) {}

    // 6. Opcional: Notificar por Telegram o Webhook si estuvieran configurados en `configuracion_sistema`
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

