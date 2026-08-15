// Utilidades compartidas para leer/guardar los datos de entrega del
// cliente en localStorage. Las usan tanto el CheckoutModal (para
// pre-completar el formulario) como el saludo de bienvenida (para
// saber si mostrarlo y con qué nombre).

export interface DatosEntrega {
  nombre: string;
  telefono: string;
  direccion: string;
  zona: string;
}

export const CHECKOUT_STORAGE_KEY = 'mixpoint_datos_entrega';

export const DATOS_VACIOS: DatosEntrega = {
  nombre: '',
  telefono: '',
  direccion: '',
  zona: '',
};

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