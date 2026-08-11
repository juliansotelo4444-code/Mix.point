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
      <section className="contacto-mayoristas" style={{ backgroundColor: '#1a1a1a', color: '#fff', padding: '40px 20px', borderTop: '2px solid #d4af37', borderBottom: '2px solid #d4af37', margin: '20px 0' }}>
        <div className="container" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ color: '#d4af37', marginBottom: '10px' }}>¿Querés comprar por mayor o tenés dudas?</h2>
          <p style={{ marginBottom: '30px', color: '#ccc' }}>Completá tus datos y un asesor comercial se pondrá en contacto con vos a la brevedad.</p>

          <form onSubmit={handleSubmitAsesoramiento} style={{ display: 'flex', flexDirection: 'column', gap: '15px', textAlign: 'left' }}>
            <div>
              <label htmlFor="nombre" style={{ fontSize: '14px', display: 'block', marginBottom: '5px' }}>Nombre o Razón Social</label>
              <input type="text" id="nombre" name="nombre" value={formData.nombre} onChange={handleFormChange} required placeholder="Ej: Distribuidora Los Amigos" style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #444', background: '#2a2a2a', color: '#fff', boxSizing: 'border-box' }} />
            </div>

            <div>
              <label htmlFor="telefono" style={{ fontSize: '14px', display: 'block', marginBottom: '5px' }}>Teléfono / WhatsApp</label>
              <input type="tel" id="telefono" name="telefono" value={formData.telefono} onChange={handleFormChange} required placeholder="Ej: 11 1234 5678" style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #444', background: '#2a2a2a', color: '#fff', boxSizing: 'border-box' }} />
            </div>

            <div>
              <label htmlFor="tipo_compra" style={{ fontSize: '14px', display: 'block', marginBottom: '5px' }}>Tipo de compra</label>
              <select id="tipo_compra" name="tipo_compra" value={formData.tipo_compra} onChange={handleFormChange} style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #444', background: '#2a2a2a', color: '#fff', boxSizing: 'border-box' }}>
                <option value="familiar">Familiar</option>
                <option value="revendedor">Revendedor</option>
                <option value="comercio">Comercio / Dietética</option>
              </select>
            </div>

            <div>
              <label htmlFor="zona" style={{ fontSize: '14px', display: 'block', marginBottom: '5px' }}>Barrio / Localidad</label>
              <input type="text" id="zona" name="zona" value={formData.zona} onChange={handleFormChange} required placeholder="Ej: Ituzaingo" style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #444', background: '#2a2a2a', color: '#fff', boxSizing: 'border-box' }} />
            </div>

            <button type="submit" style={{ backgroundColor: '#d4af37', color: '#000', fontWeight: 'bold', padding: '12px', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '10px' }}>
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