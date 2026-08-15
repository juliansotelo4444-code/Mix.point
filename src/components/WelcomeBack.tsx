import { useState } from 'react';
import { cargarDatosGuardados } from '../utils/datosEntrega';

// Saludo para clientes que ya hicieron un pedido antes desde este
// mismo dispositivo/navegador. Se apoya en los mismos datos que
// guarda el CheckoutModal — si nunca compró (o los borró), no muestra nada.
export function WelcomeBack() {
  // Lee localStorage directo en el estado inicial (una sola vez, en el
  // primer render) en vez de en un useEffect — evita un render extra
  // innecesario y el warning de ESLint sobre setState dentro de efectos.
  const [nombre] = useState<string | null>(() => {
    const datos = cargarDatosGuardados();
    if (!datos.nombre.trim()) return null;
    // Solo el primer nombre, para que suene más natural y casual
    return datos.nombre.trim().split(' ')[0];
  });
  const [visible, setVisible] = useState(true);

  if (!nombre || !visible) return null;

  return (
    <div className="welcome-back">
      <span>¡Qué lindo tenerte de vuelta,{nombre}! ✨ Seleccionamos la mejor calidad en frutos secos especialmente para vos. ¡Disfrutá tu compra!"</span>
      <button
        className="welcome-back-close"
        onClick={() => setVisible(false)}
        aria-label="Cerrar saludo"
      >
        ✕
      </button>
    </div>
  );
}