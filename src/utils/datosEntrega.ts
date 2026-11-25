// Utilidades compartidas para leer/guardar los datos de entrega del
// cliente en localStorage. Las usan tanto el CheckoutModal (para
// pre-completar el formulario) como el saludo de bienvenida (para
// saber si mostrarlo y con qué nombre).

export interface DatosEntrega {
  nombre: string;
  telefono: string;
  email?: string;
  direccion: string;
  zona: string;
  metodoPago?: string;
  horarioEntrega?: string;
  notas?: string;
}

export const CHECKOUT_STORAGE_KEY = 'mixpoint_datos_entrega';
export const CART_SESSION_KEY = 'mixpoint_cart_session_id';

export const DATOS_VACIOS: DatosEntrega = {
  nombre: '',
  telefono: '',
  email: '',
  direccion: '',
  zona: '',
  metodoPago: 'Transferencia bancaria',
  horarioEntrega: 'Mañana (09:00 a 13:00 hs)',
  notas: '',
};

export function getOrCreateCartSessionId(): string {
  try {
    const existing = localStorage.getItem(CART_SESSION_KEY);
    if (existing && existing.trim()) return existing;
    const generated =
      typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : `mp_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem(CART_SESSION_KEY, generated);
    return generated;
  } catch {
    return `mp_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  }
}

export function cargarDatosGuardados(): DatosEntrega {
  try {
    const guardado = localStorage.getItem(CHECKOUT_STORAGE_KEY);
    if (guardado) return { ...DATOS_VACIOS, ...JSON.parse(guardado) };
  } catch {
    // noop: navegación privada o localStorage bloqueado
  }
  return DATOS_VACIOS;
}

export function guardarDatosEntrega(datos: DatosEntrega) {
  try {
    localStorage.setItem(CHECKOUT_STORAGE_KEY, JSON.stringify(datos));
  } catch {
    // noop
  }
}

export function borrarDatosEntrega() {
  try {
    localStorage.removeItem(CHECKOUT_STORAGE_KEY);
  } catch {
    // noop
  }
}