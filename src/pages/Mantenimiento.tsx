import { useEffect } from 'react';
import { WHATSAPP_NUMERO, WHATSAPP_DISPLAY } from '../config/constants';

export function Mantenimiento() {
  useEffect(() => {
    document.title = 'Estamos mejorando para vos | Mix Point';
  }, []);

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(
    '¡Hola Mix Point! Vi que la página está en mantenimiento. Quisiera hacer una consulta / pedido:'
  )}`;

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #faf7f0 0%, #f4ede0 50%, #eae0d0 100%)',
      fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      padding: '24px 16px',
      color: '#2d3748',
      boxSizing: 'border-box'
    }}>
      <div style={{
        maxWidth: '560px',
        width: '100%',
        background: '#ffffff',
        borderRadius: '20px',
        boxShadow: '0 20px 40px rgba(74, 52, 28, 0.08), 0 1px 3px rgba(0,0,0,0.05)',
        border: '1px solid rgba(226, 218, 201, 0.8)',
        padding: '40px 32px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Banda superior decorativa */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '6px',
          background: 'linear-gradient(90deg, #2e7d32, #4caf50, #81c784)'
        }} />

        {/* Badge animado */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: '#f0fdf4',
          border: '1px solid #bbf7d0',
          color: '#166534',
          fontSize: '12px',
          fontWeight: 700,
          padding: '6px 14px',
          borderRadius: '999px',
          marginBottom: '24px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#22c55e',
            display: 'inline-block',
            boxShadow: '0 0 0 3px rgba(34, 197, 94, 0.25)'
          }} />
          Mantenimiento programado
        </div>

        {/* Icono central */}
        <div style={{
          fontSize: '52px',
          marginBottom: '16px',
          filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.06))'
        }}>
          🥜 ⚙️
        </div>

        {/* Título principal solicitado */}
        <h1 style={{
          fontSize: '26px',
          lineHeight: '1.3',
          color: '#1b4332',
          margin: '0 0 14px 0',
          fontWeight: 800
        }}>
          Estamos trabajando para darle una mejor atención
        </h1>

        {/* Subtítulo descriptivo */}
        <p style={{
          fontSize: '15px',
          lineHeight: '1.6',
          color: '#555',
          margin: '0 0 28px 0'
        }}>
          Estamos realizando mejoras en nuestro catálogo mayorista, sincronización de precios y sistema de pedidos para brindarte una experiencia más rápida y completa.
        </p>

        {/* Caja de atención por WhatsApp */}
        <div style={{
          background: '#fcfbf8',
          border: '1px solid #ebe5d8',
          borderRadius: '14px',
          padding: '20px',
          marginBottom: '20px'
        }}>
          <p style={{
            fontSize: '13.5px',
            color: '#444',
            margin: '0 0 14px 0',
            fontWeight: 500
          }}>
            ¿Necesitás hacer un pedido urgente o consultar listas de precios mayoristas? Nuestro equipo comercial sigue activo:
          </p>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              backgroundColor: '#25D366',
              color: '#ffffff',
              padding: '13px 26px',
              borderRadius: '10px',
              textDecoration: 'none',
              fontWeight: 700,
              fontSize: '15px',
              boxShadow: '0 4px 12px rgba(37, 211, 102, 0.3)',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              width: '100%',
              boxSizing: 'border-box'
            }}
          >
            <span>💬</span> Contactar por WhatsApp ({WHATSAPP_DISPLAY})
          </a>
        </div>

        <p style={{
          fontSize: '12px',
          color: '#888',
          margin: 0
        }}>
          Estaremos de vuelta en breve. ¡Muchas gracias por tu paciencia y confianza!
        </p>
      </div>

      {/* Pie de página institucional */}
      <div style={{
        marginTop: '20px',
        textAlign: 'center',
        fontSize: '12px',
        color: '#777'
      }}>
        <strong>Mix Point</strong> — Distribuidora Mayorista y Minorista
      </div>
    </div>
  );
}
export default Mantenimiento;
