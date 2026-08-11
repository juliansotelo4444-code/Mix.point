import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Sin esto, al navegar a una página nueva el usuario aparece en la mitad
// de la pantalla (donde quedó el scroll de la página anterior).
export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}