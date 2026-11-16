import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Product, Precios } from '../types';
import { calcularPrecioUnitario, getEscalaLabel } from '../utils/precios';
import { WHATSAPP_NUMERO } from '../config/constants';

interface Props {
  product: Product | null;
  onClose: () => void;
  addToCart: (product: Product, peso: keyof Precios, cantidad: number) => void;
}

export function ProductDetailModal({ product, onClose, addToCart }: Props) {
  const navigate = useNavigate();
  const [cantidad, setCantidad] = useState(1);
  const [agregado, setAgregado] = useState(false);

  // Escalas disponibles del producto
  const esPorUnidad = product?.tipoVenta === 'unidad';
  const escalasDisponibles = product
    ? (Object.keys(product.precios) as Array<keyof Precios>).filter(
        (k) => (product.precios[k] ?? 0) > 0
      )
    : [];

  const escalaInicial: keyof Precios = esPorUnidad
    ? 'unidad'
    : (product?.precios.kg ?? 0) > 0
    ? 'kg'
    : escalasDisponibles[0] || 'kg';

  const [pesoSeleccionado, setPesoSeleccionado] = useState<keyof Precios>(escalaInicial);

  // Manejo de tecla Escape y bloqueo de scroll
  useEffect(() => {
    if (!product) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [product, onClose]);

  if (!product) return null;

  const precioUnitario = calcularPrecioUnitario(product.precios, pesoSeleccionado);
  const precioAnterior = Math.round((precioUnitario * 1.15) / 100) * 100;
  const precioTotal = precioUnitario * cantidad;

  const handleIncrementar = () => setCantidad((prev) => prev + 1);
  const handleDecrementar = () => setCantidad((prev) => (prev > 1 ? prev - 1 : 1));

  const handleAdd = () => {
    addToCart(product, pesoSeleccionado, cantidad);
    setAgregado(true);
    setTimeout(() => {
      setAgregado(false);
      onClose();
    }, 900);
  };

  const handleConsultarWhatsApp = () => {
    const escalaTexto = getEscalaLabel(pesoSeleccionado, product.tipoVenta);
    const mensaje = `Hola Mix Point! Me interesa la oferta de *${product.nombre}* (${escalaTexto}) x ${cantidad} unidad/es por un total de $${precioTotal.toLocaleString('es-AR')}. ¿Tienen stock disponible?`;
    window.open(`https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensaje)}`, '_blank');
  };

  const handleVerEnCatalogo = () => {
    onClose();
    navigate(`/catalogo?buscar=${encodeURIComponent(product.nombre)}`);
  };

  return (
    <div
      className="product-modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Detalle de oferta de ${product.nombre}`}
    >
      <div
        className="product-modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="product-modal-close-btn"
          onClick={onClose}
          aria-label="Cerrar ventana"
        >
          ✕
        </button>

        <div className="product-modal-grid">
          {/* FOTO DESTACADA */}
          <div className="product-modal-media">
            <span className="product-modal-badge-float">🔥 Oferta Destacada</span>
            <img
              src={product.imagen || '/assets/Flyer-mix-point.png'}
              alt={product.nombre}
              className="product-modal-img"
              loading="eager"
            />
          </div>

          {/* INFORMACIÓN Y ACCIONES */}
          <div className="product-modal-body">
            <div className="product-modal-header">
              <span className="product-modal-category">{product.categoria}</span>
              <h2 className="product-modal-title">{product.nombre}</h2>
              {product.descripcion && (
                <p className="product-modal-desc">{product.descripcion}</p>
              )}
            </div>

            {/* SELECTOR DE PRESENTACIÓN / ESCALA */}
            {escalasDisponibles.length > 1 && (
              <div className="product-modal-scale-selector">
                <label className="product-modal-label">Seleccioná Presentación:</label>
                <div className="product-modal-pills">
                  {escalasDisponibles.map((esc) => {
                    const label = getEscalaLabel(esc, product.tipoVenta);
                    const pUnit = calcularPrecioUnitario(product.precios, esc);
                    const isSelected = pesoSeleccionado === esc;
                    return (
                      <button
                        key={esc}
                        type="button"
                        className={`product-scale-pill ${isSelected ? 'product-scale-pill--active' : ''}`}
                        onClick={() => setPesoSeleccionado(esc)}
                      >
                        <span className="scale-pill-name">{label}</span>
                        <span className="scale-pill-price">${pUnit.toLocaleString('es-AR')}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* PRECIO DE OFERTA CON COMPARATIVA */}
            <div className="product-modal-price-box">
              <div className="product-modal-price-main">
                <span className="product-modal-current-price">
                  ${precioUnitario.toLocaleString('es-AR')}
                </span>
                <span className="product-modal-old-price">
                  ${precioAnterior.toLocaleString('es-AR')}
                </span>
                <span className="product-modal-discount-tag">15% OFF</span>
              </div>
              <p className="product-modal-format-note">
                Presentación: <strong>{getEscalaLabel(pesoSeleccionado, product.tipoVenta)}</strong>
              </p>
            </div>

            {/* CONTROL DE CANTIDAD Y TOTAL */}
            <div className="product-modal-qty-row">
              <div className="product-modal-qty-control">
                <button
                  type="button"
                  onClick={handleDecrementar}
                  className="product-modal-qty-btn"
                  aria-label="Restar una unidad"
                >
                  −
                </button>
                <span className="product-modal-qty-val">{cantidad}</span>
                <button
                  type="button"
                  onClick={handleIncrementar}
                  className="product-modal-qty-btn"
                  aria-label="Sumar una unidad"
                >
                  +
                </button>
              </div>

              <div className="product-modal-subtotal">
                <span className="subtotal-label">Subtotal:</span>
                <strong className="subtotal-value">${precioTotal.toLocaleString('es-AR')}</strong>
              </div>
            </div>

            {/* BOTONES DE COMPRA Y WHATSAPP */}
            <div className="product-modal-actions">
              <button
                type="button"
                className={`btn-modal-add-cart ${agregado ? 'btn-modal-add-cart--added' : ''}`}
                onClick={handleAdd}
              >
                {agregado ? '✓ ¡Agregado al Carrito!' : 'Agregar al Carrito 🛒'}
              </button>

              <button
                type="button"
                className="btn-modal-wa-cta"
                onClick={handleConsultarWhatsApp}
              >
                Pedir por WhatsApp 💬
              </button>
            </div>

            <button
              type="button"
              className="product-modal-view-cat-link"
              onClick={handleVerEnCatalogo}
            >
              Ver este producto en el catálogo general →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
