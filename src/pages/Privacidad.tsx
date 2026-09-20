import { Link } from 'react-router-dom';
import { PageCTA } from '../components/PageCTA';

export function Privacidad() {
  return (
    <div className="privacy-page">
      <div className="section-header">
        <span className="section-tag">Transparencia y Seguridad</span>
        <h1 className="section-title">Política de Privacidad y Cookies</h1>
        <p className="section-subtitle">
          En Mix Point valoramos tu confianza. Te explicamos de forma clara qué datos recolectamos, cómo los protegemos, para qué los usamos y cómo podés gestionar las cookies.
        </p>
        <span className="privacy-last-update">Última actualización: Septiembre 2026</span>
      </div>

      <div className="privacy-container">
        <article className="privacy-card">
          <section className="privacy-section">
            <h2>1. Responsable del Tratamiento de Datos</h2>
            <p>
              El responsable del tratamiento de los datos personales recopilados a través del sitio web{' '}
              <a href="https://mix-point.vercel.app/" target="_blank" rel="noopener noreferrer">
                mix-point.vercel.app
              </a>{' '}
              es <strong>Mix Point</strong>, distribuidora de frutos secos y alimentos naturales con base de operaciones en la Provincia de Buenos Aires, República Argentina.
            </p>
            <p>
              Para cualquier duda, modificación o solicitud vinculada a tu privacidad, podés comunicarte directamente con nuestro equipo por WhatsApp al{' '}
              <a href="https://wa.me/5491131469587" target="_blank" rel="noopener noreferrer" className="privacy-link">
                +54 9 11 3146-9587
              </a>{' '}
              o a través de nuestro canal de Instagram oficial{' '}
              <a href="https://www.instagram.com/mixpoint.frutossecos/" target="_blank" rel="noopener noreferrer" className="privacy-link">
                @mixpoint.frutossecos
              </a>.
            </p>
          </section>

          <hr className="privacy-divider" />

          <section className="privacy-section">
            <h2>2. ¿Qué Datos Personales Recolectamos?</h2>
            <p>
              Recolectamos únicamente la información necesaria para gestionar tus pedidos y brindarte una atención comercial ágil:
            </p>
            <ul className="privacy-list">
              <li>
                <strong>Datos de entrega y facturación:</strong> Nombre y apellido, número de teléfono o WhatsApp, dirección de entrega completa y zona o barrio (ingresados voluntariamente al confirmar un pedido en nuestro carrito de compras o al completar el formulario de contacto).
              </li>
              <li>
                <strong>Datos de pedidos:</strong> Detalle de los productos seleccionados, cantidades, presentaciones (kilogramos, bolsas mayoristas o unidades) y monto total de la compra.
              </li>
              <li>
                <strong>Opiniones y reseñas:</strong> Nombre, localidad/comercio, calificación y comentario que decidís compartir de manera pública en nuestra sección de comunidad.
              </li>
              <li>
                <strong>Datos técnicos de navegación:</strong> Dirección IP, tipo de navegador, sistema operativo y páginas visitadas dentro del sitio web, recopilados de forma anónima o estadística para asegurar la estabilidad técnica.
              </li>
            </ul>
          </section>

          <hr className="privacy-divider" />

          <section className="privacy-section">
            <h2>3. ¿Con Qué Finalidad Usamos tus Datos?</h2>
            <p>Tus datos son utilizados exclusivamente con los siguientes propósitos legítimos:</p>
            <ul className="privacy-list">
              <li>
                <strong>Procesamiento y coordinación de entregas:</strong> Coordinar el reparto de mercadería a tu domicilio o comercio mediante logística propia o empresas de transporte autorizadas (Correo Argentino, Andreani).
              </li>
              <li>
                <strong>Atención al cliente vía WhatsApp:</strong> Contactarte para confirmar la disponibilidad de stock, coordinar días y horarios de entrega, informar costos de flete o resolver inquietudes comerciales.
              </li>
              <li>
                <strong>Registro administrativo de pedidos:</strong> Mantener un historial interno y ordenado de los pedidos ingresados para asegurar que cada paquete sea preparado correctamente.
              </li>
              <li>
                <strong>Experiencia de usuario:</strong> Si marcás la opción <em>"Recordar mis datos en este dispositivo"</em>, guardamos tu nombre y dirección en el navegador para que no tengas que escribirlos de nuevo en futuras compras.
              </li>
            </ul>
          </section>

          <hr className="privacy-divider" />

          <section className="privacy-section">
            <h2>4. Compartición de Datos con Terceros (Google, Meta y Proveedores)</h2>
            <p>
              <strong>Mix Point no vende, alquila ni comercializa tus datos personales bajo ninguna circunstancia.</strong> Sin embargo, para operar el servicio interactuamos con las siguientes plataformas de terceros reconocidas:
            </p>
            <div className="privacy-subgrid">
              <div className="privacy-subcard">
                <h3>Google (Google Workspace & Scripts)</h3>
                <p>
                  Utilizamos Google Apps Script y Google Sheets como sistema administrativo en la nube para registrar automáticamente los pedidos que ingresan desde la web y organizar la preparación de paquetes. Los datos viajan cifrados bajo los estándares de seguridad de Google.
                </p>
              </div>

              <div className="privacy-subcard">
                <h3>Meta (WhatsApp, Instagram y Facebook)</h3>
                <p>
                  Nuestra plataforma utiliza la API de enlace directo a <strong>WhatsApp</strong> (servicio de Meta Platforms, Inc.) para que puedas enviar tu pedido final directamente a nuestra línea de atención. Asimismo, contamos con enlaces e integraciones a nuestros perfiles oficiales de Instagram y Facebook para soporte publicitario y comunitario.
                </p>
              </div>

              <div className="privacy-subcard">
                <h3>Empresas de Logística y Envíos</h3>
                <p>
                  Para envíos a larga distancia compartimos únicamente con las empresas de correo (como Andreani o Correo Argentino) los datos estrictamente necesarios para confeccionar la guía de transporte (nombre, teléfono de contacto y domicilio postal de destino).
                </p>
              </div>
            </div>
          </section>

          <hr className="privacy-divider" />

          <section className="privacy-section">
            <h2>5. Política de Cookies y Almacenamiento Local (LocalStorage)</h2>
            <p>
              Una <strong>cookie</strong> es un pequeño archivo de texto que un sitio web almacena en tu dispositivo al navegar. En Mix Point utilizamos tecnologías de cookies y almacenamiento local (<code>localStorage</code>) para optimizar tu experiencia:
            </p>

            <div className="privacy-table-wrapper">
              <table className="privacy-table">
                <thead>
                  <tr>
                    <th>Tecnología</th>
                    <th>Tipo</th>
                    <th>Finalidad</th>
                    <th>Duración</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code>mixpoint_datos_entrega</code></td>
                    <td>Almacenamiento Local</td>
                    <td>Guarda tu nombre, teléfono y dirección si seleccionás la casilla "Recordar mis datos" para agilizar futuras compras.</td>
                    <td>Persistente (hasta que decidas borrarlo)</td>
                  </tr>
                  <tr>
                    <td><code>mixpoint_customer_reviews</code></td>
                    <td>Almacenamiento Local</td>
                    <td>Mantiene visible en tu navegador la reseña que publicás en tiempo real sobre nuestros productos.</td>
                    <td>Persistente</td>
                  </tr>
                  <tr>
                    <td>Cookies de Sesión</td>
                    <td>Técnicas / Esenciales</td>
                    <td>Permiten el correcto funcionamiento de las rutas, el catálogo interactivo y el carrito de compras.</td>
                    <td>Sesión (se borran al cerrar el navegador)</td>
                  </tr>
                  <tr>
                    <td>Cookies de Análisis y Terceros</td>
                    <td>Google / Meta</td>
                    <td>Permiten medir el rendimiento del sitio web y optimizar campañas publicitarias en Meta Ads o Google Ads.</td>
                    <td>Definida por el proveedor</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <hr className="privacy-divider" />

          <section className="privacy-section">
            <h2>6. ¿Cómo Desactivar o Administrar las Cookies en tu Navegador?</h2>
            <p>
              Podés permitir, bloquear o eliminar las cookies instaladas en tu equipo mediante la configuración de las opciones de tu navegador web. A continuación te dejamos los enlaces a las instrucciones oficiales de los navegadores más utilizados:
            </p>
            <ul className="privacy-list">
              <li>
                <strong>Google Chrome:</strong>{' '}
                <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="privacy-link">
                  Administrar cookies en Chrome
                </a>
              </li>
              <li>
                <strong>Mozilla Firefox:</strong>{' '}
                <a href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias" target="_blank" rel="noopener noreferrer" className="privacy-link">
                  Habilitar y deshabilitar cookies en Firefox
                </a>
              </li>
              <li>
                <strong>Apple Safari (Mac / iOS):</strong>{' '}
                <a href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="privacy-link">
                  Gestionar cookies en Safari
                </a>
              </li>
              <li>
                <strong>Microsoft Edge:</strong>{' '}
                <a href="https://support.microsoft.com/es-es/microsoft-edge/eliminar-las-cookies-en-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="privacy-link">
                  Eliminar cookies en Edge
                </a>
              </li>
            </ul>
            <p className="privacy-note">
              <em>Nota:</em> Si desactivás por completo el almacenamiento local o las cookies esenciales, algunas funciones de conveniencia (como recordar tus datos de entrega en el checkout) podrían no estar disponibles, aunque aún podrás navegar por el catálogo y contactarnos directamente por WhatsApp.
            </p>
          </section>

          <hr className="privacy-divider" />

          <section className="privacy-section">
            <h2>7. Tus Derechos (Protección de Datos Personales)</h2>
            <p>
              En cumplimiento con la <strong>Ley N° 25.326 de Protección de los Datos Personales de la República Argentina</strong>, tenés derecho a acceder en forma gratuita a tus datos personales, rectificarlos o solicitar su supresión cuando lo desees.
            </p>
            <p>
              Para ejercer cualquiera de estos derechos, podés presionar el botón <em>"¿No sos vos? Borrar datos guardados"</em> ubicado en la ventana de confirmación de tu pedido, o bien solicitárnoslo directamente por cualquiera de nuestros canales de contacto.
            </p>
          </section>

          <hr className="privacy-divider" />

          <section className="privacy-section">
            <h2>8. Modificaciones a esta Política</h2>
            <p>
              Mix Point se reserva el derecho de actualizar esta Política de Privacidad y Cookies cuando sea necesario para reflejar cambios legales, tecnológicos o de nuestros servicios. Cualquier cambio será publicado en esta misma sección indicando la fecha de última actualización.
            </p>
          </section>
        </article>

        <div className="privacy-actions">
          <Link to="/" className="btn-primary">
            ← Volver al Inicio
          </Link>
          <Link to="/catalogo" className="btn-secondary">
            Ver Catálogo de Productos 🛒
          </Link>
        </div>
      </div>

      <PageCTA
        texto="¿Tenés dudas sobre cómo manejamos tus datos o querés hacer un pedido especial?"
        linkTexto="Escribinos por WhatsApp"
        to="/contacto"
        icono="🔒"
      />
    </div>
  );
}
