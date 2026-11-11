import { useState } from 'react';
import type { Product, Precios } from '../types';
import { calcularPrecioUnitario } from '../utils/precios';
import { WHATSAPP_NUMERO } from '../config/constants';

interface Props {
  product: Product;
  addToCart: (product: Product, peso: keyof Precios, cantidad: number) => void;
}

export const ProductCard = ({ product, addToCart }: Props) => {
  const esPorUnidad = product.tipoVenta === 'unidad';

  // Obtenemos solo las escalas que tienen precio válido (> 0)
  const escalasDisponibles = (Object.keys(product.precios) as Array<keyof Precios>).filter(
    (k) => (product.precios[k] ?? 0) > 0
  );

  // Seleccionamos por defecto la primera escala válida disponible
  const escalaInicial: keyof Precios = esPorUnidad
    ? 'unidad'
    : ((product.precios.kg ?? 0) > 0 ? 'kg' : escalasDisponibles[0] || 'kg');

  const [pesoSeleccionado, setPesoSeleccionado] = useState<keyof Precios>(escalaInicial);
  const [prevId, setPrevId] = useState(product.id);
  const [cantidad, setCantidad] = useState(1);
  const [agregado, setAgregado] = useState(false);

  // Mantener sincronizada la escala si el producto cambia
  if (product.id !== prevId) {
    setPrevId(product.id);
    setPesoSeleccionado(escalaInicial);
  }

  const incrementar = () => setCantidad(prev => prev + 1);
  const decrementar = () => setCantidad(prev => (prev > 1 ? prev - 1 : 1));

  const precioUnitario = calcularPrecioUnitario(product.precios, pesoSeleccionado);
  const tienePrecioValido = precioUnitario > 0;

  // Verificamos si tiene opciones mayoristas cargadas en la planilla
  const tieneMayorista = (product.precios.cincoKg ?? 0) > 0 ||
    (product.precios.diezKg ?? 0) > 0 ||
    (product.precios.veinticincoKg ?? 0) > 0 ||
    (product.precios.treintaKg ?? 0) > 0;

  // Calculamos ahorro si seleccionó un formato mayorista respecto al precio base
  let ahorroPorcentaje = 0;
  if (!esPorUnidad && pesoSeleccionado !== 'kg') {
    const pKg = product.precios.kg ?? 0;
    const pActual = product.precios[pesoSeleccionado] ?? 0;
    if (pKg > 0 && pActual > 0 && pActual < pKg) {
      ahorroPorcentaje = Math.round(((pKg - pActual) / pKg) * 100);
    }
  } else if (esPorUnidad && pesoSeleccionado !== 'unidad') {
    const pUnidad = product.precios.unidad ?? 0;
    const pPack = product.precios[pesoSeleccionado] ?? 0;
    if (pUnidad > 0 && pPack > 0 && pPack < pUnidad) {
      ahorroPorcentaje = Math.round(((pUnidad - pPack) / pUnidad) * 100);
    }
  }

  // Texto explicativo del formato seleccionado
  const getDetalleFormato = () => {
    if (!tienePrecioValido) return null;
    if (esPorUnidad) {
      if (pesoSeleccionado === 'cincoKg') return `Pack x5 unidades • $${(product.precios.cincoKg ?? 0).toLocaleString('es-AR')} c/u`;
      if (pesoSeleccionado === 'diezKg') return `Pack x10 unidades • $${(product.precios.diezKg ?? 0).toLocaleString('es-AR')} c/u`;
      return 'Precio por unidad';
    }
    if (pesoSeleccionado === 'cincoKg') return `Bolsa cerrada 5kg • $${(product.precios.cincoKg ?? 0).toLocaleString('es-AR')}/kg`;
    if (pesoSeleccionado === 'diezKg') return `Bolsa cerrada 10kg • $${(product.precios.diezKg ?? 0).toLocaleString('es-AR')}/kg`;
    if (pesoSeleccionado === 'veinticincoKg') return `Bulto 25kg • $${(product.precios.veinticincoKg ?? 0).toLocaleString('es-AR')}/kg`;
    if (pesoSeleccionado === 'treintaKg') return `Bulto 30kg • $${(product.precios.treintaKg ?? 0).toLocaleString('es-AR')}/kg`;
    return 'Precio por Kilogramo';
  };

  const handleAddToCart = () => {
    addToCart(product, pesoSeleccionado, cantidad);
    setCantidad(1);
    setAgregado(true);
    setTimeout(() => setAgregado(false), 1400);
  };

  const handleConsultarWhatsApp = () => {
    const texto = `Hola Mix Point! Me interesa consultar por el producto: *${product.nombre}*. ¿Tienen stock o lista actualizada?`;
    window.open(`https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(texto)}`, '_blank');
  };

  return (
    <article className="product-card">
      <div className="product-card-img-container">
        <img
          src={product.imagen?.trim() || '/assets/Flyer-mix-point.png'}
          alt={product.nombre}
          className="product-img"
          loading="lazy"
          decoding="async"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = '/assets/Flyer-mix-point.png';
          }}
        />

        {/* Badges superiores */}
        <div className="product-badges-row">
          {product.categoria && (
            <span className="product-category-tag">{product.categoria}</span>
          )}
          {tieneMayorista && (
            <span className="product-wholesale-badge" title="Disponible para compra mayorista con descuento">
              ⭐ Mayorista
            </span>
          )}
        </div>

        {/* Tag de ahorro en bulto mayorista */}
        {ahorroPorcentaje > 0 && (
          <span className="product-savings-badge">
            🏷️ -{ahorroPorcentaje}% por bulto
          </span>
        )}
      </div>

      <div className="product-info">
        <h3 title={product.nombre}>{product.nombre}</h3>
        {product.descripcion ? (
          <p className="description">{product.descripcion}</p>
        ) : (
          <p className="description description--empty">Directo de productores agropecuarios seleccionados.</p>
        )}

        {/* Selector de escala de compra */}
        <div className="selector-container">
          <label htmlFor={`peso-${product.id}`} className="selector-label">
            {esPorUnidad ? 'Presentación' : 'Formato de Venta'}
          </label>

          {esPorUnidad ? (
            escalasDisponibles.length > 1 ? (
              <div className="select-wrapper">
                <select
                  id={`peso-${product.id}`}
                  className="select-formato"
                  value={pesoSeleccionado}
                  onChange={(e) => setPesoSeleccionado(e.target.value as keyof Precios)}
                >
                  <option value="unidad">Por Unidad Individual</option>
                  {(product.precios.cincoKg ?? 0) > 0 && (
                    <option value="cincoKg">Pack Mayorista x5 unidades</option>
                  )}
                  {(product.precios.diezKg ?? 0) > 0 && (
                    <option value="diezKg">Pack Mayorista x10 unidades</option>
                  )}
                </select>
                <span className="select-arrow" aria-hidden="true">▾</span>
              </div>
            ) : (
              <div className="format-static-badge">
                <span>📦 Envasado Individual</span>
              </div>
            )
          ) : (
            escalasDisponibles.length > 0 ? (
              <div className="select-wrapper">
                <select
                  id={`peso-${product.id}`}
                  className="select-formato"
                  value={pesoSeleccionado}
                  onChange={(e) => setPesoSeleccionado(e.target.value as keyof Precios)}
                >
                  {(product.precios.kg ?? 0) > 0 && <option value="kg">Por 1 Kilogramo</option>}
                  {(product.precios.cincoKg ?? 0) > 0 && (
                    <option value="cincoKg">Bolsa 5kg (Mayorista)</option>
                  )}
                  {(product.precios.diezKg ?? 0) > 0 && (
                    <option value="diezKg">Bolsa 10kg (Mayorista)</option>
                  )}
                  {(product.precios.veinticincoKg ?? 0) > 0 && (
                    <option value="veinticincoKg">Bolsa 25kg (Bulto)</option>
                  )}
                  {(product.precios.treintaKg ?? 0) > 0 && (
                    <option value="treintaKg">Bolsa 30kg (Bulto)</option>
                  )}
                </select>
                <span className="select-arrow" aria-hidden="true">▾</span>
              </div>
            ) : (
              <div className="format-static-badge">
                <span>Consultar formatos disponibles</span>
              </div>
            )
          )}
        </div>

        {/* Bloque de Precio */}
        <div className="price-block">
          <div className="price-row">
            <span className="price-label">Precio:</span>
            {tienePrecioValido ? (
              <span className="price-value">
                <strong>${precioUnitario.toLocaleString("es-AR")}</strong>
              </span>
            ) : (
              <span className="price-consultar">A cotizar</span>
            )}
          </div>
          {tienePrecioValido && (
            <span className="price-subdetail">
              {getDetalleFormato()}
            </span>
          )}
        </div>

        {/* Acciones de Compra */}
        {tienePrecioValido ? (
          <div className="card-actions-wrapper">
            <div className="quantity-controls" aria-label="Cantidad a comprar">
              <button
                type="button"
                onClick={decrementar}
                className="qty-btn"
                disabled={cantidad <= 1}
                aria-label="Restar una unidad"
              >
                -
              </button>
              <span className="qty-number" aria-live="polite">{cantidad}</span>
              <button
                type="button"
                onClick={incrementar}
                className="qty-btn"
                aria-label="Sumar una unidad"
              >
                +
              </button>
            </div>

            <div className="product-actions-group">
              <button
                type="button"
                className={`btn-add ${agregado ? 'btn-add--added' : ''}`}
                onClick={handleAddToCart}
                disabled={agregado}
                aria-label={`Agregar ${cantidad} ${product.nombre} al carrito`}
              >
                {agregado ? (
                  <>
                    <span className="btn-add-check" aria-hidden="true">✓</span>
                    <span>¡Agregado!</span>
                  </>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <circle cx="9" cy="21" r="1" />
                      <circle cx="20" cy="21" r="1" />
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                    </svg>
                    <span>Agregar al carrito</span>
                  </>
                )}
              </button>

              <button
                type="button"
                className="btn-quick-wa"
                onClick={handleConsultarWhatsApp}
                title="Consultar por WhatsApp a un asesor"
                aria-label={`Consultar por ${product.nombre} en WhatsApp`}
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            className="btn-consultar-wa-card"
            onClick={handleConsultarWhatsApp}
          >
            <span>Consultar por WhatsApp</span>
            <span aria-hidden="true">💬</span>
          </button>
        )}
      </div>
    </article>
  );
};
