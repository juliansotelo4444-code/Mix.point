import { NavLink } from 'react-router-dom';
import './Navbar.css';

const navClass = ({ isActive }: { isActive: boolean }) =>
  isActive ? 'nav-link nav-link--active' : 'nav-link';

export function Navbar() {
  return (
    <nav className="navbar">
      <ul className="nav-links">
        <li>
          <NavLink to="/" end className={navClass}>Inicio</NavLink>
        </li>
        <li>
          <NavLink to="/catalogo" className={navClass}>Catálogo</NavLink>
        </li>
        <li>
          <NavLink to="/envios" className={navClass}>Envíos</NavLink>
        </li>
        <li>
          <NavLink to="/contacto" className={navClass}>Contacto</NavLink>
        </li>
        <li>
          <NavLink to="/nosotros" className={navClass}>Sobre nosotros</NavLink>
        </li>
      </ul>
    </nav>
  );
}