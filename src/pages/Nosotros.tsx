import { SocialSection } from '../components/SocialLinks';
import { PageCTA } from '../components/PageCTA';

export function Nosotros() {
  return (
    <>
      <section className="nosotros-section" id="nosotros">
        <h2 className="section-title">Sobre nosotros</h2>
        <div className="nosotros-card">
          <p>
            Somos una distribuidora joven que trabaja en familia. Compramos directo a productores mercadería fresca, granos enteros, bien cuidados, con la maduración
            justa para que conserven todos sus nutrientes y propiedades.
          </p>
        </div>
      </section>

      <SocialSection />

      <PageCTA
        texto="¿Ya viste todo lo que tenemos para vos?"
        linkTexto="Ver catálogo mayorista"
        to="/catalogo"
        icono="✨"
      />
    </>
  );
}