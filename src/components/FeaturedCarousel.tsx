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

  // 1. Filtramos y preparamos los productos destacados respetando fielmente el Excel base
  const offerItems: OfferProductItem[] = useMemo(() => {
    if (!products || products.length === 0) return [];

    // Priorizamos los productos insignia con sus IDs oficiales de la planilla:
    // 358: Mix Patagonia ($19.800)
    // 5: Almendras Guara ($23.900)
    // 800: Nueces Chandler Extra Light ($16.900)
    // 7: Castañas de Cajú W4 ($16.500)
    // 26: Mix Cervecero ($7.440)
    // 22: Mix Premium ($17.900)
    // 4: Nueces Con Cáscara ($8.280)
    // 400: Almendras Carmel Chilenas ($26.900)
    const targetIds = [358, 5, 800, 7, 26, 22, 4, 400];
    const picked: Product[] = [];

    // Buscar los productos por id preferido
    for (const tid of targetIds) {
      const found = products.find((p) => p.id === tid);
      if (found && !picked.some((p) => p.id === found.id)) {
        picked.push(found);
      }
    }

    // Si faltan, completar con los primeros del catálogo que tengan precio válido
    if (picked.length < 5) {
      for (const p of products) {
        if (!picked.some((item) => item.id === p.id) && ((p.precios.kg ?? 0) > 0 || (p.precios.unidad ?? 0) > 0)) {
          picked.push(p);
          if (picked.length >= 8) break;
        }
      }
    }

    return picked.map((product, idx) => {
      const esUnidad = product.tipoVenta === 'unidad';
      // Precio oficial exacto de la planilla de Google Sheets
      const precioReal = esUnidad
        ? (product.precios.unidad ?? product.precios.kg ?? 0)
        : (product.precios.kg ?? 0);

      // Limpiamos y formateamos el nombre en mayúsculas con su presentación
      let nombreLimpio = product.nombre
        .replace(/2026/g, '')
        .replace(/Nacionales/gi, '')
        .replace(/Mariposa/gi, '')
        .trim();

      if (nombreLimpio.toLowerCase().includes('chandler')) {
        nombreLimpio = 'NUECES CHANDLER';
      } else if (nombreLimpio.toLowerCase().includes('guara')) {
        nombreLimpio = 'ALMENDRAS GUARA';
      } else if (nombreLimpio.toLowerCase().includes('patagonia')) {
        nombreLimpio = 'MIX PATAGONIA';
      } else if (nombreLimpio.toLowerCase().includes('caju') || nombreLimpio.toLowerCase().includes('cajú')) {
        nombreLimpio = 'CASTAÑAS DE CAJÚ';
      } else if (nombreLimpio.toLowerCase().includes('cervecero')) {
        nombreLimpio = 'MIX CERVECERO';
      } else if (nombreLimpio.toLowerCase().includes('premium')) {
        nombreLimpio = 'MIX PREMIUM';
      } else if (nombreLimpio.toLowerCase().includes('cascara') || nombreLimpio.toLowerCase().includes('cáscara')) {
        nombreLimpio = 'NUEZ CON CÁSCARA';
      } else if (nombreLimpio.toLowerCase().includes('carmel') || nombreLimpio.toLowerCase().includes('chilenas')) {
        nombreLimpio = 'ALMENDRAS CHILENAS';
      }

      const presentacion = esUnidad ? 'X UNIDAD' : 'X 1 KG';
      const tituloDisplay = `${nombreLimpio.toUpperCase()} ${presentacion}`;

      // Precio mayorista por kilo si existe cargado en el Excel (ej: escala 5kg o 10kg)
      const precioMayorista = product.precios.cincoKg || product.precios.diezKg;

      const badges = ['🔥 MÁS PEDIDO', '⭐ DESTACADO', '🌿 SELECCIÓN', '✨ PREMIUM', '📦 MAYORISTA'];
      const badgeLabel = badges[idx % badges.length];

      return {
        product,
        tituloDisplay,
        precioReal,
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

                  {/* TÍTULO SUPERIOR */}
                  <div className="offer-card-top-badge">
                    <h3 className="offer-card-title">{item.tituloDisplay}</h3>
                  </div>

                  {/* IMAGEN CENTRAL */}
                  <div className="offer-card-image-box">
                    <img
                      src={item.product.imagen || '/assets/Flyer-mix-point.png'}
                      alt={item.product.nombre}
                      className="offer-card-img"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>

                  {/* ETIQUETA DE PRECIO INFERIOR: RESPETA EL PRECIO OFICIAL DEL EXCEL */}
                  <div className="offer-card-footer">
                    <div className="offer-card-price-pill">
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

                    <span className="offer-card-click-hint">
                      Tocar para ver detalle / comprar
                    </span>
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
