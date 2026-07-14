import './Navbar.css';

export function Navbar() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className="navbar">
      <img src="/assets/logo_mixpoint.png" alt="Logo" className="nav-logo" />
      <ul className="nav-links">
        <li><button onClick={() => scrollTo('inicio')}>Inicio</button></li>
        <li><button onClick={() => scrollTo('catalogo')}>Catálogo</button></li>
        <li><button onClick={() => scrollTo('envios')}>Envíos</button></li>
        <li><button onClick={() => scrollTo('nosotros')}>Sobre nosotros</button></li>
      </ul>
    </nav>
  );
}