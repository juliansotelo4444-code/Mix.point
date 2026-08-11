// import { Link } from 'react-router-dom';
import { SocialSection } from '../components/SocialLinks';
import { PageCTA } from '../components/PageCTA';

export function Nosotros() {
  return (
    <>
      {/* HERO a página completa: foto de fondo + overlay oscuro + título grande */}
      <section
        className="hero-nosotros"
        style={{ backgroundImage: "url('/assets/fondo.frutos.jpg')" }}
      >
        <div className="hero-nosotros-overlay">
          <p className="hero-nosotros-badge">DISTRIBUIDORA FAMILIAR · ARGENTINA</p>
          <h1 className="hero-nosotros-title">Somos sinónimo de calidad</h1>

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
            Somos una distribuidora joven que trabaja en familia. Compramos directo a productores mercadería fresca, granos enteros, bien cuidados, con la maduración
            justa para que conserven todos sus nutrientes y propiedades.
          </p>
        </div>
      </section>

      <SocialSection />

      <PageCTA
        texto="¿Ya viste todo lo que tenemos para vos?"
        linkTexto="Ver catálogo mayorista"
        to="/catalogo"
        icono="✨"
      />
    </>
  );
}