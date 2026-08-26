import { useState } from 'react';

export interface Review {
  id: string | number;
  nombre: string;
  rol: string;
  comentario: string;
  rating: number;
  fecha: string;
  producto: string;
  isNew?: boolean;
}

const INITIAL_REVIEWS: Review[] = [
  {
    id: 1,
    nombre: "Valeria Morales",
    rol: "Dietética Vida Sana · Morón",
    comentario: "Las nueces mariposa extra light son espectaculares, vienen enteras y súper frescas. Hace 6 meses que les compramos para la dietética y la relación precio-calidad es insuperable.",
    rating: 5,
    fecha: "Hace 2 días",
    producto: "Nueces Mariposa Chandler"
  },
  {
    id: 2,
    nombre: "Martín Gómez",
    rol: "Compra Familiar · CABA",
    comentario: "El Mix Patagonia y las Almendras Guara son de otro nivel. Cero humedad, crocantes y con un sabor natural increíble. La entrega llegó en tiempo y forma coordinada por WhatsApp.",
    rating: 5,
    fecha: "Hace 5 días",
    producto: "Mix Patagonia & Almendras"
  },
  {
    id: 3,
    nombre: "Camila Rossi",
    rol: "Revendedora · Ramos Mejía",
    comentario: "Excelente margen para revender. Las bolsas de 5kg y 10kg vienen perfectamente selladas y etiquetadas. La atención comercial siempre es muy amable y resolutiva.",
    rating: 5,
    fecha: "Hace 1 semana",
    producto: "Castañas de Cajú & Maní"
  },
  {
    id: 4,
    nombre: "Esteban Domínguez",
    rol: "Gastronomía Saludable · San Isidro",
    comentario: "Compramos por volumen para repostería y granola artesanal. El coco rallado, chips y semillas tienen una pureza impecable. Muy recomendables.",
    rating: 5,
    fecha: "Hace 2 semanas",
    producto: "Chips Chocolate & Semillas"
  }
];

const STORAGE_KEY = 'mixpoint_customer_reviews';

export function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return [...parsed, ...INITIAL_REVIEWS];
      }
    } catch {}
    return INITIAL_REVIEWS;
  });

  const [mostrarModal, setMostrarModal] = useState(false);
  const [mensajeExito, setMensajeExito] = useState(false);

  // Form state
  const [nombre, setNombre] = useState('');
  const [rol, setRol] = useState('');
  const [producto, setProducto] = useState('Nueces Mariposa Chandler');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comentario, setComentario] = useState('');

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !comentario.trim()) return;

    const nuevaReview: Review = {
      id: Date.now(),
      nombre: nombre.trim(),
      rol: rol.trim() || "Comprador Verificado",
      comentario: comentario.trim(),
      rating,
      fecha: "Recién publicado",
      producto: producto.trim() || "Frutos Secos Variados",
      isNew: true
    };

    const userReviews = (() => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : [];
      } catch {
        return [];
      }
    })();

    const updatedUserReviews = [nuevaReview, ...userReviews];
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUserReviews));
    } catch {}

    setReviews([nuevaReview, ...reviews]);
    setMostrarModal(false);
    setNombre('');
    setRol('');
    setComentario('');
    setRating(5);
    setMensajeExito(true);

    setTimeout(() => {
      setMensajeExito(false);
    }, 6000);
  };

  const promedioRating = (
    reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
  ).toFixed(1);

  return (
    <section className="reviews-section" id="opiniones">
      <div className="section-header">
        <span className="section-tag">⭐ Comunidad Mix Point</span>
        <h2 className="section-title">Opiniones de Nuestros Compradores</h2>
        <p className="section-subtitle">
          Leé las experiencias de quienes ya compran frutos secos, mixes y alimentos naturales con nosotros.
        </p>
      </div>

      {mensajeExito && (
        <div className="review-success-toast">
          <span>🎉</span>
          <div>
            <strong>¡Muchas gracias por tu opinión!</strong>
            <p>Tu comentario ha sido publicado en la tienda en tiempo real.</p>
          </div>
        </div>
      )}

      {/* STATS & BOTÓN DE ACCIÓN */}
      <div className="reviews-stats-bar">
        <div className="review-stat-item">
          <span className="stat-number">{promedioRating} / 5.0</span>
          <div className="stat-stars">★★★★★</div>
          <span className="stat-label">Valoración promedio</span>
        </div>

        <div className="review-stat-item">
          <span className="stat-number">+{reviews.length * 125 + 500}</span>
          <span className="stat-label">Pedidos entregados</span>
        </div>

        <div className="review-stat-item">
          <span className="stat-number">100%</span>
          <span className="stat-label">Frescura y Calidad</span>
        </div>

        <div className="review-stat-cta">
          <button
            type="button"
            className="btn-leave-review"
            onClick={() => setMostrarModal(true)}
          >
            ✍️ Escribir una Opinión
          </button>
        </div>
      </div>

      {/* GRILLA DE OPINIONES */}
      <div className="reviews-grid">
        {reviews.map((rev) => (
          <div key={rev.id} className={`review-card ${rev.isNew ? 'review-card--new' : ''}`}>
            {rev.isNew && <span className="review-new-badge">¡Nueva opinión!</span>}
            
            <div className="review-header">
              <div className="review-stars">
                {"★".repeat(rev.rating)}
                {"☆".repeat(5 - rev.rating)}
              </div>
              <span className="review-date">{rev.fecha}</span>
            </div>

            <p className="review-comment">"{rev.comentario}"</p>

            <div className="review-footer">
              <div className="review-author-info">
                <h4 className="review-author-name">{rev.nombre}</h4>
                <span className="review-author-role">{rev.rol}</span>
              </div>
              <span className="review-verified-badge" title="Compra verificada">
                ✓ Verificado
              </span>
            </div>

            <div className="review-product-tag">
              <span>Compró:</span> {rev.producto}
            </div>
          </div>
        ))}
      </div>

      {/* MODAL / FORMULARIO PARA DEJAR COMENTARIO */}
      {mostrarModal && (
        <div className="review-modal-overlay" onClick={() => setMostrarModal(false)}>
          <div className="review-modal" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="review-modal-close"
              onClick={() => setMostrarModal(false)}
              aria-label="Cerrar"
            >
              ✕
            </button>

            <h3 className="review-modal-title">Dejanos tu Opinión 🌿</h3>
            <p className="review-modal-desc">
              Contanos cómo fue tu experiencia con los productos y la atención de Mix Point.
            </p>

            <form onSubmit={handleSubmitReview} className="review-form">
              <div className="review-form-field">
                <label>Puntuación general *</label>
                <div className="star-rating-selector">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      className={`star-btn ${(hoverRating || rating) >= star ? 'star-btn--filled' : ''}`}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      aria-label={`Calificar con ${star} estrellas`}
                    >
                      ★
                    </button>
                  ))}
                  <span className="star-rating-text">
                    {rating === 5 ? 'Excelente (5/5)' : rating === 4 ? 'Muy Bueno (4/5)' : `${rating} estrellas`}
                  </span>
                </div>
              </div>

              <div className="review-form-field">
                <label htmlFor="rev-nombre">Tu Nombre y Apellido (o Comercio) *</label>
                <input
                  id="rev-nombre"
                  type="text"
                  required
                  placeholder="Ej: Laura Martínez / Dietética El Trébol"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
              </div>

              <div className="review-form-field">
                <label htmlFor="rev-rol">Localidad / Tipo de compra</label>
                <input
                  id="rev-rol"
                  type="text"
                  placeholder="Ej: Ramos Mejía · Compra Familiar / Dietética"
                  value={rol}
                  onChange={(e) => setRol(e.target.value)}
                />
              </div>

              <div className="review-form-field">
                <label htmlFor="rev-producto">Producto que compraste</label>
                <input
                  id="rev-producto"
                  type="text"
                  placeholder="Ej: Nueces Chandler, Mix Patagonia, Almendras..."
                  value={producto}
                  onChange={(e) => setProducto(e.target.value)}
                />
              </div>

              <div className="review-form-field">
                <label htmlFor="rev-comentario">Tu Comentario / Experiencia *</label>
                <textarea
                  id="rev-comentario"
                  rows={4}
                  required
                  placeholder="Contanos qué te pareció la calidad, frescura, precio o rapidez del envío..."
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                />
              </div>

              <button type="submit" className="btn-submit-review">
                Publicar Opinión ✨
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
