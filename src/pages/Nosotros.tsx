import { SocialSection } from '../components/SocialLinks';
import { PageCTA } from '../components/PageCTA';

export function Nosotros() {
  return (
    <>
      <section
        className="hero-nosotros"
        style={{ backgroundImage: "url('/assets/fondo.frutos.jpg')" }}
      >
        <div className="hero-nosotros-overlay">
          <p className="hero-nosotros-badge">DISTRIBUIDORA FAMILIAR · ARGENTINA</p>
          <h1 className="hero-nosotros-title">Pasión por la Calidad Natural</h1>

          <div className="hero-nosotros-social">
            <a
              href="https://www.instagram.com/mixpoint.frutossecos/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Seguinos en Instagram"
              className="hero-social-icon"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
              </svg>
            </a>
            <a
              href="https://www.facebook.com/profile.php?id=61590546509535&locale=es_LA"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Seguinos en Facebook"
              className="hero-social-icon"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      <section className="nosotros-section" id="nosotros">
        <div className="nosotros-card">
          <p>
            Somos una distribuidora familiar nacida con el propósito de conectar a los mejores productores agropecuarios del país con comercios, dietéticas y familias que valoran la frescura auténtica.
          </p>
          <p style={{ marginTop: '16px', color: 'var(--text-muted)', fontSize: '1rem' }}>
            Seleccionamos granos enteros, nueces mariposa extra light, almendras crocantes y frutas desecadas sin agregados artificiales, cuidando cada etapa del fraccionamiento para mantener intactas todas sus propiedades nutricionales.
          </p>
        </div>
      </section>

      <SocialSection />

      <PageCTA
        texto="¿Querés conocer toda nuestra variedad de frutos y mixes?"
        linkTexto="Explorar el catálogo mayorista"
        to="/catalogo"
        icono="✨"
      />
    </>
  );
}