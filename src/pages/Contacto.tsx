import { useState } from 'react';
import { PageCTA } from '../components/PageCTA';

const WHATSAPP_NUMERO = '5491131469587';

export function Contacto() {
  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    zona: "",
    tipo_compra: "familiar",
  });

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitAsesoramiento = (e: React.FormEvent) => {
    e.preventDefault();
    const mensaje = `Hola Mix Point! Me interesa recibir asesoramiento:%0A- Nombre/Comercio: ${formData.nombre}%0A- Teléfono: ${formData.telefono}%0A- Tipo de compra: ${formData.tipo_compra}%0A- Barrio/Localidad: ${formData.zona}`;
    window.open(`https://wa.me/${WHATSAPP_NUMERO}?text=${mensaje}`, '_blank');
  };

  return (
    <>
      <div className="section-header">
        <span className="section-tag">Atención Personalizada</span>
        <h1 className="section-title">Contacto Comercial</h1>
        <p className="section-subtitle">
          Asesoramiento para compras mayoristas, comercios, dietéticas y pedidos familiares especiales.
        </p>
      </div>

      <section className="contacto-section">
        <div className="contacto-card">
          <h2>¿Querés comprar por mayor o tenés dudas?</h2>
          <p>Completá tus datos y un asesor comercial se pondrá en contacto directo por WhatsApp.</p>

          <form onSubmit={handleSubmitAsesoramiento} className="contacto-form">
            <div className="contacto-field">
              <label htmlFor="nombre">Nombre o Razón Social</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleFormChange}
                required
                placeholder="Ej: Distribuidora Los Amigos / Juan Pérez"
              />
            </div>

            <div className="contacto-field">
              <label htmlFor="telefono">Teléfono / WhatsApp</label>
              <input
                type="tel"
                id="telefono"
                name="telefono"
                value={formData.telefono}
                onChange={handleFormChange}
                required
                placeholder="Ej: 11 1234 5678"
              />
            </div>

            <div className="contacto-field">
              <label htmlFor="tipo_compra">Tipo de compra</label>
              <select
                id="tipo_compra"
                name="tipo_compra"
                value={formData.tipo_compra}
                onChange={handleFormChange}
              >
                <option value="familiar">Familiar / Consumo propio</option>
                <option value="revendedor">Revendedor independiente</option>
                <option value="comercio">Comercio / Dietética / Gastronomía</option>
              </select>
            </div>

            <div className="contacto-field">
              <label htmlFor="zona">Barrio / Localidad / Provincia</label>
              <input
                type="text"
                id="zona"
                name="zona"
                value={formData.zona}
                onChange={handleFormChange}
                required
                placeholder="Ej: Ituzaingó, Buenos Aires"
              />
            </div>

            <button type="submit" className="btn-whatsapp-submit">
              Solicitar Asesoramiento por WhatsApp 📱
            </button>
          </form>
        </div>
      </section>

      <PageCTA
        texto="Mientras esperás nuestra respuesta"
        linkTexto="Mirá el catálogo completo"
        to="/catalogo"
        icono="🥜"
      />
    </>
  );
}