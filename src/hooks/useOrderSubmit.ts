import { useState } from 'react';

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxUe5HAWVgTXRr61grTfLlJf-rhB9J8AeY_QRqEtuVYc6p9Xg3sMGQPzrTR4LVBp_kQ/exec';
interface DatosEntrega {
  nombre: string;
  telefono: string;
  direccion: string;
  zona: string;
}

interface SubmitResult {
  success: boolean;
  numeroPedido?: string;
  error?: string;
}

export function useOrderSubmit() {
  const [enviando, setEnviando] = useState(false);

  const submitPedido = async (
    datos: DatosEntrega,
    productos: string,
    total: number
  ): Promise<SubmitResult> => {
    setEnviando(true);
    try {
      const response = await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        // Apps Script no maneja bien application/json con preflight CORS,
        // text/plain evita el preflight y Apps Script igual lo parsea con JSON.parse
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          nombre: datos.nombre,
          telefono: datos.telefono,
          direccion: datos.direccion,
          zona: datos.zona,
          productos,
          total,
        }),
      });

      const data = await response.json();
      return data;
    } catch  {
      return { success: false, error: 'No se pudo conectar con el servidor' };
    } finally {
      setEnviando(false);
    }
  };

  return { submitPedido, enviando };
}