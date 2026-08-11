import { PageCTA } from '../components/PageCTA';

export function Envios() {
  return (
    <>
      <section className="envios-section" id="envios">
        <h2 className="section-title">Envíos y entregas</h2>
        <div className="info-grid">
          <div className="info-card">
            <span className="info-icon">📦</span>
            <h3>Correo Argentino / Andreani</h3>
            <p>Enviamos al interior del país por Correo Argentino y Andreani.</p>
          </div>
          <div className="info-card">
            <span className="info-icon">🌎</span>
            <h3>Zona oeste</h3>
            <p>Entrega sin cargo según disponibilidad.</p>
          </div>
          <div className="info-card">
            <span className="info-icon">🚚</span>
            <h3>Zona norte</h3>
            <p>Entrega sin cargo una vez por semana en zona norte.</p>
          </div>
          <div className="info-card">
            <span className="info-icon">🛵</span>
            <h3>Zona sur</h3>
            <p>Entrega por logística propia en zona sur.</p>
          </div>
        </div>
      </section>

      <div className="info-card" style={{ maxWidth: '1200px', margin: '20px auto' }}>
        <span className="info-icon">💰</span>
        <h3>Garantía</h3>
        <p>Cualquier inconveniente con tu pedido, te devolvemos el dinero. Sin preguntas.</p>
      </div>

      <PageCTA
        texto="¿Ya elegiste tus productos?"
        linkTexto="Ir al catálogo"
        to="/catalogo"
        icono="🛒"
      />
    </>
  );
}