import { useState } from 'react';
import type { Product, Precios } from '../types';
import { calcularPrecioUnitario } from '../utils/precios';

const WHATSAPP_NUMERO = '5491131469587';

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
  const [cantidad, setCantidad] = useState(1);

  const incrementar = () => setCantidad(prev => prev + 1);
  const decrementar = () => setCantidad(prev => (prev > 1 ? prev - 1 : 1));

  const precioUnitario = calcularPrecioUnitario(product.precios, pesoSeleccionado);
  const tienePrecioValido = precioUnitario > 0;

  const handleConsultarWhatsApp = () => {
    const texto = `Hola Mix Point! Me interesa consultar por el producto: *${product.nombre}*. ¿Tienen stock o lista actualizada?`;
    window.open(`https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(texto)}`, '_blank');
  };

  return (
    <div className="product-card">
      <div className="product-card-img-container">
        <img
          src={product.imagen?.trim() || '/assets/Flyer-mix-point.png'}
          alt={product.nombre}
          className="product-img"
          loading="lazy"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (target.src !== window.location.origin + '/assets/Flyer-mix-point.png') {
              target.src = '/assets/Flyer-mix-point.png';
            }
          }}
        />
        {product.categoria && (
          <span className="product-category-tag">{product.categoria}</span>
        )}
      </div>

      <div className="product-info">
        <h3>{product.nombre}</h3>
        {product.descripcion && <p className="description">{product.descripcion}</p>}

        {esPorUnidad ? (
          // Producto por unidad: sin selector de formato, mensaje simple
          <div className="selector-container">
            <span className="selector-label">Precio por unidad</span>
          </div>
        ) : (
          // Producto por peso: selector de formato mostrando solo escalas con precio válido
          <div className="selector-container">
            <span className="selector-label">Formato de venta</span>
            {escalasDisponibles.length > 0 ? (
              <select
                id={`peso-${product.id}`}
                className="select-formato"
                value={pesoSeleccionado}
                onChange={(e) => setPesoSeleccionado(e.target.value as keyof Precios)}
              >
                {(product.precios.kg ?? 0) > 0 && <option value="kg">Por Kilogramo</option>}
                {(product.precios.cincoKg ?? 0) > 0 && <option value="cincoKg">Bolsa 5kg (Mayorista)</option>}
                {(product.precios.diezKg ?? 0) > 0 && <option value="diezKg">Bolsa 10kg (Mayorista)</option>}
                {(product.precios.veinticincoKg ?? 0) > 0 && <option value="veinticincoKg">Bolsa 25kg (Bulto)</option>}
                {(product.precios.treintaKg ?? 0) > 0 && <option value="treintaKg">Bolsa 30kg (Bulto)</option>}
              </select>
            ) : (
              <span className="format-unavailable">Consultar formatos disponibles</span>
            )}
          </div>
        )}

        <p className="price">
          Precio:{' '}
          {tienePrecioValido ? (
            <strong>${precioUnitario.toLocaleString("es-AR")}</strong>
          ) : (
            <span className="price-consultar">Consultar precio</span>
          )}
        </p>

        {tienePrecioValido ? (
          <>
            <div className="quantity-controls">
              <button type="button" onClick={decrementar} className="qty-btn" aria-label="Restar una unidad">-</button>
              <span className="qty-number">{cantidad}</span>
              <button type="button" onClick={incrementar} className="qty-btn" aria-label="Sumar una unidad">+</button>
            </div>

            <div className="product-actions-group">
              <button
                className="btn-add"
                onClick={() => {
                  addToCart(product, pesoSeleccionado, cantidad);
                  setCantidad(1);
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
                Agregar al carrito
              </button>

              <button
                type="button"
                className="btn-quick-wa"
                onClick={handleConsultarWhatsApp}
                title="Consultar por WhatsApp"
                aria-label={`Consultar por ${product.nombre} en WhatsApp`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
              </button>
            </div>
          </>
        ) : (
          <button
            type="button"
            className="btn-consultar-wa-card"
            onClick={handleConsultarWhatsApp}
          >
            Consultar Precio por WhatsApp 💬
          </button>
        )}
      </div>
    </div>
  );
};