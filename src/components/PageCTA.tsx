import { Link } from 'react-router-dom';

interface Props {
  texto: string;
  linkTexto: string;
  to: string;
  icono?: string;
}

// "¿Y ahora qué?" — se pone al final de cada página para que la
// navegación no termine en seco y empuje a seguir explorando el sitio.
export function PageCTA({ texto, linkTexto, to, icono = '💬' }: Props) {
  return (
    <div className="page-cta">
      <span className="page-cta-icon">{icono}</span>
      <div className="page-cta-body">
        <p>{texto}</p>
        <Link to={to} className="page-cta-link">{linkTexto} →</Link>
      </div>
    </div>
  );
}