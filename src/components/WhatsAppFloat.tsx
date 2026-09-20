import { useState } from 'react';
import './WhatsAppFloat.css';

const WHATSAPP_NUMERO = '5491131469587';

export function WhatsAppFloat() {
  const [showTooltip, setShowTooltip] = useState(true);

  const handleClick = () => {
    const mensaje = '¡Hola Mix Point! Estoy navegando por su tienda online y quisiera hacer una consulta comercial.';
    window.open(`https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensaje)}`, '_blank');
  };

  return (
    <div className="wa-float-container">
      {showTooltip && (
        <div className="wa-float-tooltip">
          <span>¿Dudas o pedidos mayoristas? 💬</span>
          <button
            className="wa-float-tooltip-close"
            onClick={(e) => {
              e.stopPropagation();
              setShowTooltip(false);
            }}
            aria-label="Cerrar aviso"
          >
            ✕
          </button>
        </div>
      )}
      <button
        className="wa-float-btn"
        onClick={handleClick}
        aria-label="Escribir por WhatsApp a Mix Point"
        title="Atención directa por WhatsApp"
      >
        <svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor">
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.97.53 1.767.818 2.796.818 3.182 0 5.768-2.587 5.769-5.766.001-3.182-2.585-5.804-5.77-5.804zm8.468 5.766c0 4.673-3.799 8.469-8.468 8.469-.99 0-1.953-.18-2.85-.512l-5.181 1.359 1.385-5.059c-.43-.96-.665-2.02-.665-3.12 0-4.673 3.799-8.47 8.468-8.47 4.67 0 8.469 3.797 8.469 8.47z" />
          <path d="M17.507 14.307l-.009.075c-.301 1.026-1.157 1.64-1.908 1.716-.751.077-1.46-.226-2.394-.601-1.341-.539-2.518-1.522-3.32-2.734-.803-1.213-.882-2.183-.585-2.614.298-.432.744-.576 1.06-.576.315 0 .524.015.65.04.148.03.242.067.337.293.118.283.473 1.155.513 1.238.04.083.067.18.014.286-.053.105-.08.172-.158.263-.079.09-.165.2-.236.269-.079.076-.162.158-.07.316.092.158.408.673.875 1.088.601.534 1.107.7 1.265.778.158.079.251.066.345-.043.094-.109.404-.47.512-.63.109-.161.217-.135.365-.08.148.054.937.442 1.097.521.161.08.268.12.308.188.04.068.04.394-.26 1.42z" />
        </svg>
      </button>
    </div>
  );
}
