const WHATSAPP_NUMERO = '5491131469587';

interface PromoOffer {
  id: string;
  titulo: string;
  badge: string;
  descripcion: string;
  detalles: string[];
  imagen: string;
  precioAntes: string;
  precioOferta: string;
  ahorro: string;
}

const PROMOS: PromoOffer[] = [
  {
    id: 'gourmet-premium',
    titulo: 'Pack Gourmet Premium',
    badge: '⭐ El Más Elegido',
    descripcion: 'Lo mejor de la selección, en un solo pack con frutos secos seleccionados extra light y pistachos tostados.',
    detalles: [
      'Nuez Mariposa Chandler 250g',
      'Almendras Non Pareil 250g',
      'Pistacho tostado 250g',
    ],
    imagen: '/assets/promos/promo-gourmet-premium.jpg',
    precioAntes: '$42.850',
    precioOferta: '$36.000',
    ahorro: 'Ahorrás $6.850',
  },
  {
    id: 'merienda-fit',
    titulo: 'Pack Merienda Fit',
    badge: '💪 Tu Merienda con Más Fibra',
    descripcion: 'Energía limpia y saciedad natural sin culpas para tus desayunos, meriendas y colaciones de entrenamiento.',
    detalles: [
      'Granola Artesanal 500g',
      'Mix Banana Chips y Frutos Secos 250g',
      'Arándanos Frescos de Cultivo 250g',
    ],
    imagen: '/assets/promos/promo-merienda-fit.jpg',
    precioAntes: '$29.760',
    precioOferta: '$25.000',
    ahorro: 'Súper ahorro de $4.760',
  },
  {
    id: 'pack-previa',
    titulo: '¡Pack Previa!',
    badge: '🍻 Picada Rica para Compartir',
    descripcion: 'El mix perfecto para juntadas, picadas familiares y previa de fin de semana con sabores salados y crocantes.',
    detalles: [
      'Mix Cervecero especial 500g',
      'Maní Saborizado 250g',
      'Garrapiñadas 250g',
      'Palito Salado 250g',
    ],
    imagen: '/assets/promos/promo-pack-previa.jpg',
    precioAntes: '$23.040',
    precioOferta: '$19.000',
    ahorro: '¡Te ahorrás $4.040!',
  },
  {
    id: 'semillas-funcionales',
    titulo: 'Pack Semillas Funcionales',
    badge: '🌱 Nutrí tu Intestino, Cuidá tu Energía',
    descripcion: 'Superalimentos naturales con alto aporte de Omega 3, proteínas vegetales, minerales y fibra prebiótica.',
    detalles: [
      'Chía seleccionada 500g',
      'Quinoa perlada 500g',
      'Mix de Semillas (Lino, Girasol, Calabaza) 500g',
    ],
    imagen: '/assets/promos/promo-semillas-funcionales.jpg',
    precioAntes: '$24.660',
    precioOferta: '$20.500',
    ahorro: 'Ahorro efectivo de $4.160',
  },
];

export function PromosOffers() {
  const handlePedirPromo = (promo: PromoOffer) => {
    const texto = `Hola Mix Point! Quiero pedir la oferta del *${promo.titulo}* por ${promo.precioOferta} (${promo.ahorro}). ¿Tienen stock disponible para envío?`;
    window.open(`https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(texto)}`, '_blank');
  };

  return (
    <section className="promos-offers-section" id="ofertas-destacadas">
      <div className="section-header">
        <span className="section-tag">🔥 Oportunidades Especiales</span>
        <h2 className="section-title">Ofertas y Combos Destacados</h2>
        <p className="section-subtitle">
          Packs promocionales armados con nuestros productos más pedidos al mejor precio mayorista y minorista.
        </p>
      </div>

      <div className="promos-offers-grid">
        {PROMOS.map((promo) => (
          <article key={promo.id} className="promo-offer-card">
            {/* Burbuja / Cinta fuera de la imagen para no tapar nada */}
            <div className="promo-card-top-bar">
              <span className="promo-card-badge">{promo.badge}</span>
            </div>

            {/* Imagen del flyer completa, sin recortar ni tapar */}
            <div className="promo-offer-image-wrap">
              <img
                src={promo.imagen}
                alt={promo.titulo}
                className="promo-offer-image"
                loading="lazy"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (target.src !== window.location.origin + '/assets/Flyer-mix-point.png') {
                    target.src = '/assets/Flyer-mix-point.png';
                  }
                }}
              />
            </div>

            <div className="promo-offer-body">
              <h3 className="promo-offer-title">{promo.titulo}</h3>
              <p className="promo-offer-desc">{promo.descripcion}</p>

              <ul className="promo-offer-items">
                {promo.detalles.map((item, idx) => (
                  <li key={idx}>
                    <span className="item-bullet">✓</span> {item}
                  </li>
                ))}
              </ul>

              <div className="promo-offer-pricing">
                <div className="pricing-box">
                  <span className="price-label">Antes</span>
                  <span className="price-old">{promo.precioAntes}</span>
                </div>
                <div className="pricing-box pricing-box--highlight">
                  <span className="price-label">Precio Promocional</span>
                  <span className="price-current">{promo.precioOferta}</span>
                </div>
              </div>

              <div className="promo-offer-tag-ahorro">
                <span>🎉</span> {promo.ahorro}
              </div>

              <button
                type="button"
                className="btn-promo-whatsapp"
                onClick={() => handlePedirPromo(promo)}
              >
                <span>Pedir Oferta por WhatsApp</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
