import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';

interface Slide {
  id: number;
  src: string;
  alt: string;
  link: string;
}

const SLIDES: Slide[] = [
  {
    id: 1,
    src: '/banners/banner-1.jpg',
    alt: 'Mix Point - Alimentos Saludables por Mayor. Venta mayorista, pago contra entrega y sin seña previa.',
    link: '/catalogo',
  },
  {
    id: 2,
    src: '/banners/banner-2.jpg',
    alt: 'Mix Point - Los mixes que más rotan en tu local. Mix Patagonia, Premium, Económico, Cervecero y más.',
    link: '/catalogo?buscar=Mix',
  },
  {
    id: 3,
    src: '/banners/banner-3.jpg',
    alt: 'Mix Point - Abastecé tu producción y mostrador. Calidad seleccionada y frescura garantizada.',
    link: '/catalogo',
  },
  {
    id: 4,
    src: '/banners/banner-4.jpg',
    alt: 'Mix Point - Pedí sin seña y pagás contra entrega. Envíos en el día CABA y GBA.',
    link: '/catalogo',
  },
];

export function HeroSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Autoplay cada 5 segundos
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [nextSlide, isPaused]);

  // Soporte de gestos táctiles (Swipe en celulares)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 45) {
      nextSlide(); // Deslizar hacia la izquierda -> siguiente
    } else if (diff < -45) {
      prevSlide(); // Deslizar hacia la derecha -> anterior
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <section
      className="relative w-full overflow-hidden bg-[#121415] select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-label="Campañas destacadas Mix Point"
    >
      {/* Contenedor con ratio panorámico optimizado para no cortar textos */}
      <div className="w-full relative aspect-[16/9] sm:aspect-[16/8] md:aspect-[16/7] lg:aspect-[16/6] max-h-[560px] flex items-center justify-center">
        {SLIDES.map((slide, index) => {
          const isActive = index === currentIndex;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
                isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <Link
                to={slide.link}
                className="block w-full h-full focus:outline-none"
                tabIndex={isActive ? 0 : -1}
                title={slide.alt}
              >
                <img
                  src={slide.src}
                  alt={slide.alt}
                  className="w-full h-full object-contain md:object-cover object-left md:object-center"
                  loading={index === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                />
              </Link>
            </div>
          );
        })}

        {/* Flecha Lateral Izquierda */}
        <button
          onClick={(e) => {
            e.preventDefault();
            prevSlide();
          }}
          className="absolute left-2 md:left-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-black/40 hover:bg-[#76A33E] text-white backdrop-blur-sm transition-all duration-200 shadow-md hover:scale-105 active:scale-95"
          aria-label="Slide anterior"
        >
          <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Flecha Lateral Derecha */}
        <button
          onClick={(e) => {
            e.preventDefault();
            nextSlide();
          }}
          className="absolute right-2 md:right-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-black/40 hover:bg-[#76A33E] text-white backdrop-blur-sm transition-all duration-200 shadow-md hover:scale-105 active:scale-95"
          aria-label="Siguiente slide"
        >
          <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Indicadores de Posición (Dots) */}
        <div className="absolute bottom-3 md:bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-black/35 backdrop-blur-md px-3 py-1.5 rounded-full">
          {SLIDES.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 rounded-full ${
                currentIndex === index
                  ? 'w-7 h-2.5 bg-[#76A33E]'
                  : 'w-2.5 h-2.5 bg-white/60 hover:bg-white'
              }`}
              aria-label={`Ir al slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
export default HeroSlider;
