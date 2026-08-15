import { useState } from 'react';
import {
  type DatosEntrega,
  DATOS_VACIOS,
  cargarDatosGuardados,
  guardarDatosEntrega,
  borrarDatosEntrega,
} from '../utils/datosEntrega';

interface Props {
  onConfirm: (datos: DatosEntrega) => void;
  onClose: () => void;
  enviando: boolean;
}

export function CheckoutModal({ onConfirm, onClose, enviando }: Props) {
  const [datos, setDatos] = useState<DatosEntrega>(cargarDatosGuardados);
  const [errores, setErrores] = useState<Partial<DatosEntrega>>({});
  const [recordar, setRecordar] = useState(true);

  const validar = (): boolean => {
    const nuevosErrores: Partial<DatosEntrega> = {};
    if (!datos.nombre.trim()) nuevosErrores.nombre = 'Ingresá tu nombre y apellido';
    if (!datos.telefono.trim() || datos.telefono.replace(/\D/g, '').length < 8) {
      nuevosErrores.telefono = 'Ingresá un teléfono válido';
    }
    if (!datos.direccion.trim()) nuevosErrores.direccion = 'Ingresá tu dirección completa';
    if (!datos.zona.trim()) nuevosErrores.zona = 'Ingresá tu zona o barrio';

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validar()) return;

    if (recordar) {
      guardarDatosEntrega(datos);
    } else {
      borrarDatosEntrega();
    }

    onConfirm(datos);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDatos(prev => ({ ...prev, [name]: value }));
    if (errores[name as keyof DatosEntrega]) {
      setErrores(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleBorrarDatosGuardados = () => {
    borrarDatosEntrega();
    setDatos(DATOS_VACIOS);
    setErrores({});
  };

  const hayDatosGuardados = datos.nombre || datos.telefono || datos.direccion || datos.zona;

  return (
    <div className="checkout-modal-overlay" onClick={onClose}>
      <div className="checkout-modal" onClick={(e) => e.stopPropagation()}>
        <button className="checkout-modal-close" onClick={onClose} aria-label="Cerrar">✕</button>
        <h2 className="checkout-modal-title">Datos de entrega</h2>
        <p className="checkout-modal-subtitle">
          Necesitamos estos datos para confirmar tu pedido y coordinar la entrega.
        </p>

        <form onSubmit={handleSubmit} className="checkout-form">
          <div className="checkout-field">
            <label htmlFor="nombre">Nombre y apellido *</label>
            <input
              id="nombre"
              name="nombre"
              value={datos.nombre}
              onChange={handleChange}
              placeholder="Ej: Juan Pérez"
              className={errores.nombre ? 'input-error' : ''}
            />
            {errores.nombre && <span className="field-error">{errores.nombre}</span>}
          </div>

          <div className="checkout-field">
            <label htmlFor="telefono">Teléfono *</label>
            <input
              id="telefono"
              name="telefono"
              type="tel"
              value={datos.telefono}
              onChange={handleChange}
              placeholder="Ej: 11 1234 5678"
              className={errores.telefono ? 'input-error' : ''}
            />
            {errores.telefono && <span className="field-error">{errores.telefono}</span>}
          </div>

          <div className="checkout-field">
            <label htmlFor="direccion">Dirección completa *</label>
            <input
              id="direccion"
              name="direccion"
              value={datos.direccion}
              onChange={handleChange}
              placeholder="Calle, número, piso/depto"
              className={errores.direccion ? 'input-error' : ''}
            />
            {errores.direccion && <span className="field-error">{errores.direccion}</span>}
          </div>

          <div className="checkout-field">
            <label htmlFor="zona">Zona / Barrio *</label>
            <input
              id="zona"
              name="zona"
              value={datos.zona}
              onChange={handleChange}
              placeholder="Ej: Ituzaingó, zona oeste"
              className={errores.zona ? 'input-error' : ''}
            />
            {errores.zona && <span className="field-error">{errores.zona}</span>}
          </div>

          <label className="checkout-remember">
            <input
              type="checkbox"
              checked={recordar}
              onChange={(e) => setRecordar(e.target.checked)}
            />
            Recordar mis datos en este dispositivo para el próximo pedido
          </label>

          <button type="submit" className="checkout-submit-btn" disabled={enviando}>
            {enviando ? 'Confirmando pedido...' : 'Confirmar pedido y continuar 📱'}
          </button>

          {hayDatosGuardados && (
            <button
              type="button"
              className="checkout-clear-link"
              onClick={handleBorrarDatosGuardados}
            >
              ¿No sos vos? Borrar datos guardados
            </button>
          )}
        </form>
      </div>
    </div>
  );
}