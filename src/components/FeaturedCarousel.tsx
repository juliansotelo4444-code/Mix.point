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
  precioOferta: number;
  precioAnterior: number;
  ahorroPorcentaje: number;
}

export function FeaturedCarousel({
  products,
  addToCart,
  title = "Ofertas Destacadas de la Semana",
  subtitle = "Los frutos secos y mixes más pedidos con precios de oferta directa por kilo y bulto."
}: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const isInteractingRef = useRef(false);
  const resumeTimeoutRef = useRef<number | null>(null);

  // Estado para el modal de detalle / compra rápida al hacer clic en una tarjeta
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // 1. Filtramos y preparamos las ofertas destacadas del catálogo
  const offerItems: OfferProductItem[] = useMemo(() => {
    if (!products || products.length === 0) return [];

    // Priorizamos los productos insignia de alta demanda pedidos por el usuario:
    // 358: Mix Patagonia
    // 5: Almendras Guara
    // 800: Nueces Chandler Extra Light
    // 7: Castañas de Cajú
    // 26: Mix Cervecero
    // 22: Mix Premium
    // 3: Nueces Cuarto
    // 400: Almendras Carmel Chilenas
    const targetIds = [358, 5, 800, 7, 26, 22, 3, 400];
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

    return picked.map((product) => {
      const esUnidad = product.tipoVenta === 'unidad';
      const precioBase = esUnidad
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
      }

      const presentacion = esUnidad ? 'X UNIDAD' : 'X 1 KG';
      const tituloDisplay = `${nombreLimpio.toUpperCase()} ${presentacion}`;

      // Precio anterior tachado (si es Patagonia $19.800 -> $22.500 exacto como en el prompt)
      let precioAnterior = Math.round((precioBase * 1.15) / 100) * 100;
      if (product.id === 358 && precioBase === 19800) {
        precioAnterior = 22500;
      } else if (product.id === 5 && precioBase === 23900) {
        precioAnterior = 27500;
      }

      const ahorro = Math.max(10, Math.round(((precioAnterior - precioBase) / precioAnterior) * 100));

      return {
        product,
        tituloDisplay,
        precioOferta: precioBase,
        precioAnterior,
        ahorroPorcentaje: ahorro,
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
    const pixelsPerSecond = 32; // Velocidad pausada, elegante y legible

    const step = (time: number) => {
      if (lastTime === null) lastTime = time;
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      if (!isPaused && !isInteractingRef.current && el) {
        el.scrollLeft += pixelsPerSecond * delta;

        // Cuando recorre la primera mitad de la lista duplicada, reinicia imperceptiblemente a 0
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
        aria-label="Carrusel continuo de ofertas destacadas"
      >
        <div className="offers-carousel-container">
          {/* HEADER CENTRADO BOUTIQUE */}
          <div className="offers-carousel-header">
            <span className="offers-carousel-badge">
              <span className="offers-badge-flame" aria-hidden="true">🔥</span>
              Ofertas & Destacados de la Semana
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
              aria-label="Ver ofertas anteriores"
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
                  aria-label={`${item.tituloDisplay} a $${item.precioOferta.toLocaleString('es-AR')}, precio regular $${item.precioAnterior.toLocaleString('es-AR')}`}
                >
                  {/* TAG FLOTANTE DE DESCUENTO */}
                  <div className="offer-card-ribbon">
                    <span className="offer-ribbon-text">{item.ahorroPorcentaje}% OFF</span>
                  </div>

                  {/* TÍTULO SUPERIOR: ETIQUETA SEMI-TRANSPARENTE EN LA PARTE SUPERIOR DE LA IMAGEN */}
                  <div className="offer-card-top-badge">
                    <h3 className="offer-card-title">{item.tituloDisplay}</h3>
                  </div>

                  {/* IMAGEN CENTRAL: OCUPA LA MAYOR PARTE DE LA TARJETA */}
                  <div className="offer-card-image-box">
                    <img
                      src={item.product.imagen || '/assets/Flyer-mix-point.png'}
                      alt={item.product.nombre}
                      className="offer-card-img"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>

                  {/* ETIQUETA DE PRECIO INFERIOR: PÍLDORA FLOTANTE CON PRECIO OFERTA Y TACHADO */}
                  <div className="offer-card-footer">
                    <div className="offer-card-price-pill">
                      <span className="offer-price-current">
                        ${item.precioOferta.toLocaleString('es-AR')}
                      </span>
                      <span className="offer-price-old">
                        ${item.precioAnterior.toLocaleString('es-AR')}
                      </span>
                    </div>

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
              aria-label="Ver siguientes ofertas"
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
