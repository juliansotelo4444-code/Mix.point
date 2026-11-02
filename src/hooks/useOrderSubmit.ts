import { useState } from 'react';
import type { DatosEntrega } from '../utils/datosEntrega';

export interface OrderItemPayload {
  producto_id?: number;
  nombre: string;
  categoria?: string;
  escala: string;
  unidad_medida?: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

interface SubmitResult {
  success: boolean;
  numeroPedido?: string;
  horarioEntrega?: string;
  horaRegistro?: string;
  error?: string;
}

const APPS_SCRIPT_FALLBACK_URL = 'https://script.google.com/macros/s/AKfycbyLugszoGUzdKhIN1dDyICjm4tP2m2LrTRqZC9LQr_-85R9lG1fm3_yotSU5-LMKAxz/exec';

export function useOrderSubmit() {
  const [enviando, setEnviando] = useState(false);

  const submitPedido = async (
    datos: DatosEntrega,
    productos: string,
    total: number,
    items: OrderItemPayload[] = []
  ): Promise<SubmitResult> => {
    setEnviando(true);
    try {
      const payload = {
        nombre: datos.nombre,
        telefono: datos.telefono,
        direccion: datos.direccion,
        zona: datos.zona,
        metodoPago: datos.metodoPago || 'No especificado',
        horarioEntrega: datos.horarioEntrega || 'A coordinar / Lo antes posible',
        notas: datos.notas?.trim() || '',
        productos,
        items,
        total,
      };

      // 1. Enviar directamente a la base de datos Neon vía Serverless Function
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      try {
        const response = await fetch('/api/pedidos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          if (data && data.success) {
            return {
              success: true,
              numeroPedido: data.numeroPedido,
              horarioEntrega: data.horarioEntrega,
              horaRegistro: data.horaRegistro,
            };
          }
        }
      } catch (errApi) {
        console.warn('Aviso: intento en /api/pedidos no completado, activando respaldo...', errApi);
      }

      // 2. Respaldo Apps Script si fuera necesario
      const fallbackResponse = await fetch(APPS_SCRIPT_FALLBACK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          nombre: datos.nombre,
          telefono: datos.telefono,
          direccion: datos.direccion,
          zona: datos.zona,
          metodoPago: datos.metodoPago || 'No especificado',
          horarioEntrega: datos.horarioEntrega || 'A coordinar',
          notas: datos.notas?.trim() || '',
          productos,
          total,
        }),
      });

      const fallbackData = await fallbackResponse.json();
      return fallbackData;
    } catch (err) {
      console.error('Error general al enviar pedido:', err);
      return { success: false, error: 'No se pudo conectar con el servidor' };
    } finally {
      setEnviando(false);
    }
  };

  return { submitPedido, enviando };
}
