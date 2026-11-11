import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import type { Product, Precios } from '../types';
import { ProductCard } from './ProductCard';

interface Props {
  products: Product[];
  addToCart: (product: Product, peso: keyof Precios, cantidad: number) => void;
  title?: string;
  subtitle?: string;
}

export function FeaturedCarousel({
  products,
  addToCart,
  title = "Destacados de la Semana",
  subtitle = "Los frutos secos y mixes más elegidos por su calidad y frescura superior."
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  // Tomamos los primeros 5 productos según el orden del Excel base oficial
  const topProducts = useMemo(() => {
    if (!products || products.length === 0) return [];
    // Priorizamos los primeros IDs de la planilla base (1, 800, 2, 3, 4, 5)
    const targetIds = [1, 800, 2, 3, 4, 5];
    const picked = targetIds
      .map(id => products.find(p => p.id === id))
      .filter((p): p is Product => Boolean(p));

    return picked.length >= 4 ? picked.slice(0, 5) : products.slice(0, 5);
  }, [products]);

  const checkScrollButtons = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);

    // Calcular índice activo
    const cardWidth = 320;
    const index = Math.round(el.scrollLeft / cardWidth);
    setActiveIndex(Math.min(topProducts.length - 1, Math.max(0, index)));
  }, [topProducts.length]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScrollButtons();
    el.addEventListener('scroll', checkScrollButtons, { passive: true });
    window.addEventListener('resize', checkScrollButtons);
    return () => {
      el.removeEventListener('scroll', checkScrollButtons);
      window.removeEventListener('resize', checkScrollButtons);
    };
  }, [checkScrollButtons]);

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.querySelector<HTMLElement>('.featured-carousel-item')?.offsetWidth || 300;
    const offset = direction === 'left' ? -(cardWidth + 20) : (cardWidth + 20);
    el.scrollBy({ left: offset, behavior: 'smooth' });
  };

  const scrollToSlide = (index: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const items = el.querySelectorAll<HTMLElement>('.featured-carousel-item');
    if (items[index]) {
      items[index].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  };

  if (topProducts.length === 0) return null;

  return (
    <section className="featured-carousel-section" aria-label="Productos destacados de la semana">
      <div className="featured-carousel-header">
        <span className="featured-carousel-tag">
          <span className="featured-tag-dot" aria-hidden="true" />
          ⭐ Selección Exclusiva de la Semana
        </span>
        <h2 className="featured-carousel-title">{title}</h2>
        <p className="featured-carousel-sub">{subtitle}</p>
      </div>

      {/* Contenedor del carrusel con flechas laterales */}
      <div className="featured-carousel-wrapper">
        <button
          type="button"
          className="carousel-arrow carousel-arrow--prev"
          onClick={() => scroll('left')}
          disabled={!canScrollLeft}
          aria-label="Ver productos anteriores"
        >
          ‹
        </button>

        {/* Riel deslizable de tarjetas con scroll-snap */}
        <div className="featured-carousel-track" ref={scrollRef}>
          {topProducts.map((product, idx) => (
            <div key={product.id} className="featured-carousel-item">
              <div className="featured-item-rank-badge" title={`Puesto #${idx + 1} en favoritos`}>
                #{idx + 1} Más Pedido
              </div>
              <ProductCard product={product} addToCart={addToCart} />
            </div>
          ))}
        </div>

        <button
          type="button"
          className="carousel-arrow carousel-arrow--next"
          onClick={() => scroll('right')}
          disabled={!canScrollRight}
          aria-label="Ver siguientes productos"
        >
          ›
        </button>
      </div>

      {/* Indicadores de puntos (Dots) */}
      <div className="featured-carousel-dots" role="tablist" aria-label="Paginación de destacados">
        {topProducts.map((_, idx) => (
          <button
            key={idx}
            type="button"
            role="tab"
            aria-selected={activeIndex === idx}
            onClick={() => scrollToSlide(idx)}
            className={`carousel-dot ${activeIndex === idx ? 'carousel-dot--active' : ''}`}
            aria-label={`Ir al producto ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
