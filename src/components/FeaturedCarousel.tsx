import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import type { Product, Precios } from '../types';
import { ProductDetailModal } from './ProductDetailModal';

interface Props {
  products: Product[];
  addToCart: (product: Product, peso: keyof Precios, cantidad: number) => void;
  title?: string;
  subtitle?: string;
}

interface OfferProductItem {
  product: Product;
  tituloDisplay: string;
  precioReal: number;
  precioOriginal?: number;
  precioMayorista?: number;
  badgeLabel: string;
}

export function FeaturedCarousel({
  products,
  addToCart,
  title = "Productos Destacados de la Semana",
  subtitle = "Los frutos secos y mixes más pedidos con precios oficiales directos de origen."
}: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const isInteractingRef = useRef(false);
  const resumeTimeoutRef = useRef<number | null>(null);

  // Estado para el modal de detalle / compra rápida al hacer clic en una tarjeta
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [agregadoId, setAgregadoId] = useState<number | null>(null);

  const handleQuickAdd = (product: Product, precioReal: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const esUnidad = product.tipoVenta === 'unidad';
    const escala: keyof Precios = esUnidad
      ? 'unidad'
      : (product.precios.kg ?? 0) > 0
      ? 'kg'
      : (Object.keys(product.precios) as Array<keyof Precios>).find(
          (k) => (product.precios[k] ?? 0) > 0
        ) || 'kg';

    // Si tiene precio promocional, lo reflejamos en el producto añadido al carrito
    let productoFinal = product;
    if (precioReal && precioReal > 0) {
      productoFinal = {
        ...product,
        precios: {
          ...product.precios,
          [escala]: precioReal,
        },
      };
    }

    addToCart(productoFinal, escala, 1);
    setAgregadoId(product.id);
    setTimeout(() => {
      setAgregadoId(null);
    }, 1400);
  };

  // 1. Filtramos y preparamos los productos destacados respetando fielmente la base de datos de gestión
  const offerItems: OfferProductItem[] = useMemo(() => {
    if (!products || products.length === 0) return [];

    // Priorizamos los productos marcados dinámicamente en la base de gestión
    const dinamicos = products
      .filter((p) => Boolean(p.destacado_carrusel))
      .sort((a, b) => (a.orden_carrusel ?? 0) - (b.orden_carrusel ?? 0));

    let picked: Product[] = [...dinamicos];

    // Si aún no hay configurados en la base o hay menos de 4, completamos con los insignia de respaldo
    if (picked.length < 4) {
      const targetIds = [358, 5, 800, 7, 26, 22, 4, 400];
      for (const tid of targetIds) {
        const found = products.find((p) => p.id === tid);
        if (found && !picked.some((p) => p.id === found.id)) {
          picked.push(found);
        }
      }
    }

    // Si faltan, completar con los primeros del catálogo que tengan precio válido
    if (picked.length < 4) {
      for (const p of products) {
        if (!picked.some((item) => item.id === p.id) && ((p.precios.kg ?? 0) > 0 || (p.precios.unidad ?? 0) > 0)) {
          picked.push(p);
          if (picked.length >= 8) break;
        }
      }
    }

    return picked.map((product, idx) => {
      const esUnidad = product.tipoVenta === 'unidad';
      const precioBase = esUnidad
        ? (product.precios.unidad ?? product.precios.kg ?? 0)
        : (product.precios.kg ?? 0);

      // Si tiene precio de oferta promocional configurado en la base, lo aplicamos
      const tieneOferta = typeof product.precio_oferta === 'number' && product.precio_oferta > 0 && product.precio_oferta < precioBase;
      const precioReal = tieneOferta ? product.precio_oferta! : precioBase;
      const precioOriginal = tieneOferta ? precioBase : undefined;

      // Limpiamos y formateamos el nombre en mayúsculas
      let nombreLimpio = product.nombre
        .replace(/2026/g, '')
        .replace(/Nacionales/gi, '')
        .replace(/Mariposa/gi, '')
        .trim();

      const tituloDisplay = nombreLimpio;

      // Precio mayorista por kilo si existe cargado (escala 5kg o 10kg)
      const precioMayorista = product.precios.cincoKg || product.precios.diezKg;

      const defaultBadges = ['🔥 MÁS PEDIDO', '⭐ DESTACADO', '🌿 SELECCIÓN', '✨ PREMIUM', '📦 MAYORISTA'];
      const badgeLabel = product.badge_carrusel?.trim() || defaultBadges[idx % defaultBadges.length];

      return {
        product,
        tituloDisplay,
        precioReal,
        precioOriginal,
        precioMayorista,
        badgeLabel,
      };
    });
  }, [products]);

  // Duplicamos los elementos para lograr un marquee horizontal infinito y sin cortes
  const marqueeItems = useMemo(() => {
    if (offerItems.length === 0) return [];
    return [...offerItems, ...offerItems];
  }, [offerItems]);

  // 2. Loop continuo suave con requestAnimationFrame y delta-time (60fps/120fps constante)
  useEffect(() => {
    const el = trackRef.current;
    if (!el || marqueeItems.length === 0) return;

    let animId: number;
    let lastTime: number | null = null;
    const pixelsPerSecond = 32;

    const step = (time: number) => {
      if (lastTime === null) lastTime = time;
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      if (!isPaused && !isInteractingRef.current && el) {
        el.scrollLeft += pixelsPerSecond * delta;

        const halfWidth = el.scrollWidth / 2;
        if (el.scrollLeft >= halfWidth) {
          el.scrollLeft -= halfWidth;
        }
      }

      animId = requestAnimationFrame(step);
    };

    animId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isPaused, marqueeItems.length]);

  // Manejo de eventos táctiles para pausar durante el toque y reanudar tras 3.5 segundos
  const handleTouchStart = () => {
    isInteractingRef.current = true;
    setIsPaused(true);
    if (resumeTimeoutRef.current) window.clearTimeout(resumeTimeoutRef.current);
  };

  const handleTouchEnd = () => {
    if (resumeTimeoutRef.current) window.clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = window.setTimeout(() => {
      isInteractingRef.current = false;
      setIsPaused(false);
    }, 3500);
  };

  // Desplazamiento manual mediante flechas de navegación
  const scrollManual = useCallback((direction: 'left' | 'right') => {
    const el = trackRef.current;
    if (!el) return;

    setIsPaused(true);
    isInteractingRef.current = true;

    const card = el.querySelector<HTMLElement>('.offer-card');
    const stepOffset = card ? card.offsetWidth + 18 : 260;
    const offset = direction === 'left' ? -stepOffset : stepOffset;

    el.scrollBy({ left: offset, behavior: 'smooth' });

    if (resumeTimeoutRef.current) window.clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = window.setTimeout(() => {
      isInteractingRef.current = false;
      setIsPaused(false);
    }, 4500);
  }, []);

  if (offerItems.length === 0) return null;

  return (
    <>
      <section
        className="offers-carousel-section"
        aria-label="Carrusel continuo de productos destacados"
      >
        <div className="offers-carousel-container">
          {/* HEADER CENTRADO BOUTIQUE */}
          <div className="offers-carousel-header">
            <span className="offers-carousel-badge">
              <span className="offers-badge-flame" aria-hidden="true">🔥</span>
              Selección Exclusiva de la Semana
            </span>
            <h2 className="offers-carousel-title">{title}</h2>
            <p className="offers-carousel-subtitle">{subtitle}</p>
          </div>

          {/* CONTENEDOR DEL TRACK CON FLECHAS FLOTANTES */}
          <div
            className="offers-carousel-wrapper"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => {
              if (!isInteractingRef.current) setIsPaused(false);
            }}
          >
            {/* Flecha Izquierda Desktop */}
            <button
              type="button"
              className="offers-nav-arrow offers-nav-arrow--prev"
              onClick={() => scrollManual('left')}
              aria-label="Ver productos anteriores"
            >
              ‹
            </button>

            {/* TRACK DESLIZABLE INFINITO */}
            <div
              className="offers-carousel-track"
              ref={trackRef}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              onTouchCancel={handleTouchEnd}
            >
              {marqueeItems.map((item, idx) => (
                <article
                  key={`${item.product.id}-${idx}`}
                  className="offer-card"
                  onClick={() => setSelectedProduct(item.product)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedProduct(item.product);
                    }
                  }}
                  aria-label={`${item.tituloDisplay} a $${item.precioReal.toLocaleString('es-AR')}`}
                >
                  {/* TAG FLOTANTE DE LA SEMANA */}
                  <div className="offer-card-ribbon">
                    <span className="offer-ribbon-text">{item.badgeLabel}</span>
                  </div>

                  {/* IMAGEN CENTRAL */}
                  <div className="offer-card-image-box">
                    <img
                      src={item.product.imagen || '/assets/Flyer-mix-point.png'}
                      alt={item.product.nombre}
                      className="offer-card-img"
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = '/assets/Flyer-mix-point.png';
                      }}
                    />
                  </div>

                  {/* CUERPO INFERIOR CON TÍTULO Y PRECIOS */}
                  <div className="offer-card-footer">
                    <h3 className="offer-card-title" title={item.tituloDisplay}>
                      {item.tituloDisplay}
                    </h3>

                    <div className="offer-card-price-pill">
                      {item.precioOriginal && (
                        <span style={{ textDecoration: 'line-through', opacity: 0.6, fontSize: '0.82em', marginRight: 5 }}>
                          ${item.precioOriginal.toLocaleString('es-AR')}
                        </span>
                      )}
                      <span className="offer-price-current">
                        ${item.precioReal.toLocaleString('es-AR')}
                      </span>
                      <span className="offer-price-unit-tag">
                        {item.product.tipoVenta === 'unidad' ? 'c/u' : 'x kg'}
                      </span>
                    </div>

                    {item.precioMayorista && item.precioMayorista < item.precioReal && (
                      <span className="offer-card-wholesale-hint">
                        Bulto: ${item.precioMayorista.toLocaleString('es-AR')}/kg
                      </span>
                    )}

                    {/* BOTONES DE COMPRA Y OPCIONES */}
                    <div className="offer-card-actions">
                      <button
                        type="button"
                        className={`offer-btn-add ${agregadoId === item.product.id ? 'offer-btn-add--added' : ''}`}
                        onClick={(e) => handleQuickAdd(item.product, item.precioReal, e)}
                        disabled={agregadoId === item.product.id}
                        aria-label={`Agregar ${item.tituloDisplay} al carrito`}
                      >
                        {agregadoId === item.product.id ? (
                          <>
                            <span className="btn-add-check" aria-hidden="true">✓</span>
                            <span>¡Agregado!</span>
                          </>
                        ) : (
                          <>
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                              <circle cx="9" cy="21" r="1" />
                              <circle cx="20" cy="21" r="1" />
                              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                            </svg>
                            <span>Agregar al carrito</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        className="offer-btn-detail"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setSelectedProduct(item.product);
                        }}
                      >
                        Ver opciones / bulto →
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Flecha Derecha Desktop */}
            <button
              type="button"
              className="offers-nav-arrow offers-nav-arrow--next"
              onClick={() => scrollManual('right')}
              aria-label="Ver siguientes productos"
            >
              ›
            </button>
          </div>

          {/* INDICADOR DE INTERACCIÓN MÓVIL Y DESKTOP */}
          <div className="offers-carousel-footer-note">
            <span className="offers-footer-hint">
              <span className="offers-pulse-icon" aria-hidden="true" />
              Deslizá o hacé clic sobre cualquier producto para comprar o ver opciones mayoristas
            </span>
          </div>
        </div>
      </section>

      {/* MODAL DE DETALLE Y COMPRA RÁPIDA AL CLICKEAR CUALQUIER TARJETA */}
      {selectedProduct && (
        <ProductDetailModal
          key={selectedProduct.id}
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          addToCart={addToCart}
        />
      )}
    </>
  );
}
