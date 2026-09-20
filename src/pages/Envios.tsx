import { useEffect } from 'react';
import { PageCTA } from '../components/PageCTA';

export function Envios() {
  useEffect(() => {
    document.title = 'Envíos y Entregas a Todo el País | Mix Point';
  }, []);

  return (
    <>
      <div className="section-header">
        <span className="section-tag">Logística Eficiente</span>
        <h1 className="section-title" id="envios">Envíos y Entregas</h1>
        <p className="section-subtitle">
          Llegamos a tu comercio o domicilio en todo el país con la máxima rapidez y cuidado de la mercadería.
        </p>
      </div>

      <section className="envios-section">
        <div className="info-grid">
          <div className="info-card">
            <span className="info-icon">📦</span>
            <h3>Todo el País</h3>
            <p>Despachos al interior por Correo Argentino y Andreani con número de seguimiento online.</p>
          </div>

          <div className="info-card">
            <span className="info-icon">🚚</span>
            <h3>Zona Oeste</h3>
            <p>Entregas programadas y sin cargo según volumen y localidad.</p>
          </div>

          <div className="info-card">
            <span className="info-icon">🛵</span>
            <h3>Zona Norte</h3>
            <p>Reparto semanal fijo para dietéticas, comercios y pedidos familiares.</p>
          </div>

          <div className="info-card">
            <span className="info-icon">🌿</span>
            <h3>Zona Sur y CABA</h3>
            <p>Logística propia coordinada directamente vía WhatsApp tras tu compra.</p>
          </div>
        </div>

        <div className="info-card" style={{ marginTop: '30px', border: '2px solid var(--accent-gold)' }}>
          <span className="info-icon">💰</span>
          <h3>Garantía de Satisfacción 100%</h3>
          <p>
            Si algún producto no llega en óptimas condiciones o no cumple tus expectativas, te devolvemos el dinero sin complicaciones.
          </p>
        </div>
      </section>

      <PageCTA
        texto="¿Ya elegiste tus productos favoritos?"
        linkTexto="Ir al catálogo online"
        to="/catalogo"
        icono="🛒"
      />
    </>
  );
}