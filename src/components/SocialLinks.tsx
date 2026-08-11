// Barra compacta de íconos, pensada para ir pegada arriba de todo (en el layout)
export function SocialBarTop() {
  return (
    <div className="social-bar-top">
      <a href="https://www.instagram.com/mixpoint.frutossecos/" target="_blank" rel="noopener noreferrer" aria-label="Seguinos en Instagram" className="social-icon-link">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="2" width="20" height="20" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
        </svg>
      </a>
      <a href="https://www.facebook.com/profile.php?id=61590546509535&locale=es_LA" target="_blank" rel="noopener noreferrer" aria-label="Seguinos en Facebook" className="social-icon-link">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      </a>
      <a href="https://wa.me/5491131469587" target="_blank" rel="noopener noreferrer" aria-label="Escribinos por WhatsApp" className="social-icon-link">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
      </a>
    </div>
  );
}

// Sección completa con tarjetas, pensada para ir al final de una página (ej: Nosotros)
export function SocialSection() {
  return (
    <section className="social-section" id="redes">
      <h2 className="section-title">Seguinos en redes</h2>
      <p className="social-subtitle">Enterate primero de ofertas, nueva cosecha y novedades.</p>
      <div className="social-grid">
        <a href="https://www.instagram.com/mixpoint.frutossecos/" target="_blank" rel="noopener noreferrer" className="social-card">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="2" width="20" height="20" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
          </svg>
          <span className="social-card-title">Instagram</span>
          <span className="social-card-handle">@mixpoint.frutossecos</span>
        </a>

        <a href="https://www.facebook.com/profile.php?id=61590546509535&locale=es_LA" target="_blank" rel="noopener noreferrer" className="social-card">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
          </svg>
          <span className="social-card-title">Facebook</span>
          <span className="social-card-handle">Mix Point</span>
        </a>

        <a href="https://wa.me/5491131469587" target="_blank" rel="noopener noreferrer" className="social-card">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
          <span className="social-card-title">WhatsApp</span>
          <span className="social-card-handle">Escribinos</span>
        </a>
      </div>
    </section>
  );
}