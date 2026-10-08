import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Observa elementos al scrollear y agrega la clase .revealed
 * para activar animaciones fluidas y elegantes de entrada.
 */
export function ScrollRevealController() {
  const location = useLocation();

  useEffect(() => {
    // Elementos que deben animarse al aparecer en pantalla
    const selectors = [
      'section:not(.hero-premium):not(.hero-nosotros):not(.social-bar-top)',
      '.product-card',
      '.feature-item',
      '.nosotros-card',
      '.social-card',
      '.review-card',
      '.teaser-info-card',
      '.page-cta-container',
      '.desktop-video-container'
    ].join(', ');

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            // Dejar de observar una vez que ya apareció para no re-animar innecesariamente
            obs.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    const observeElements = () => {
      const elements = document.querySelectorAll(selectors);
      elements.forEach((el) => {
        // Evitar que el hero superior se oculte
        if (!el.classList.contains('revealed')) {
          el.classList.add('reveal-on-scroll');
          observer.observe(el);
        }
      });
    };

    // Ejecutar tras el render inicial
    const timeoutId = setTimeout(observeElements, 60);

    // Observar inserciones dinámicas en el DOM (ej: productos cargados por fetch)
    const mutationObserver = new MutationObserver(() => {
      observeElements();
    });

    const mainEl = document.querySelector('main');
    if (mainEl) {
      mutationObserver.observe(mainEl, { childList: true, subtree: true });
    }

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, [location.pathname]);

  return null;
}
