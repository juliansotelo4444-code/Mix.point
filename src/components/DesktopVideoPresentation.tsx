import { useState } from 'react';

const WHATSAPP_NUMERO = '5491131469587';

export function DesktopVideoPresentation() {
  const [videoError, setVideoError] = useState(false);

  const handleConsultarCatalogoVideo = () => {
    const texto = 'Hola Mix Point! Vi su presentación en la web y me gustaría recibir su catálogo audiovisual e institucional.';
    window.open(`https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(texto)}`, '_blank');
  };

  return (
    <section className="desktop-video-section" id="presentacion-video">
      <div className="desktop-video-container">
        <div className="desktop-video-header">
          <span className="desktop-video-tag">🎬 Presentación Institucional · Solo en Escritorio</span>
          <h2 className="desktop-video-title">Conocé la Calidad Mix Point por Dentro</h2>
          <p className="desktop-video-subtitle">
            Mirá cómo seleccionamos, cuidamos y fraccionamos los mejores frutos secos y alimentos naturales de Argentina directo desde los productores hasta tu mesa.
          </p>
        </div>

        <div className="desktop-video-card">
          <div className="desktop-video-player-wrapper">
            {!videoError ? (
              <video
                controls
                playsInline
                preload="metadata"
                poster="/assets/fondo.frutos.jpg"
                className="desktop-video-player"
                onError={() => setVideoError(true)}
              >
                <source src="/assets/video-presentacion.mp4" type="video/mp4" />
                Tu navegador no soporta la reproducción de video HTML5.
              </video>
            ) : (
              <div className="desktop-video-placeholder">
                <img
                  src="/assets/fondo.frutos.jpg"
                  alt="Presentación Mix Point"
                  className="desktop-video-placeholder-img"
                />
                <div className="desktop-video-placeholder-overlay">
                  <div className="desktop-video-placeholder-content">
                    <span className="play-icon-badge">▶</span>
                    <h3>Video Institucional en Proceso</h3>
                    <p>
                      Para colocar tu video de presentación, guardá tu archivo como <code>public/assets/video-presentacion.mp4</code> o consultanos para integrar tu enlace de YouTube.
                    </p>
                    <button
                      type="button"
                      className="btn-video-action"
                      onClick={handleConsultarCatalogoVideo}
                    >
                      Pedir Video y Catálogo por WhatsApp 📱
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="desktop-video-features">
            <div className="video-feature-col">
              <span className="video-feat-icon">🌾</span>
              <h4>Selección en Origen</h4>
              <p>Trato directo con fincas y productores de Mendoza, Catamarca y Entre Ríos.</p>
            </div>

            <div className="video-feature-col">
              <span className="video-feat-icon">🔒</span>
              <h4>Sellado Hermético</h4>
              <p>Fraccionamiento que conserva aceites esenciales, crocancia y aromas naturales.</p>
            </div>

            <div className="video-feature-col">
              <span className="video-feat-icon">🚚</span>
              <h4>Despachos Seguros</h4>
              <p>Cajas reforzadas y envíos con seguimiento en tiempo real a todo el país.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
