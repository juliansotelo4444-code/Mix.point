import { useState } from 'react';
import type { Product, Precios } from '../types';

interface Props {
  product: Product;
  addToCart: (product: Product, peso: keyof Precios, cantidad: number) => void;
}

const multiplicadores: Record<string, number> = {
  kg: 1,
  cincoKg: 5,
  diezKg: 10,
  veinticincoKg: 25,
  treintaKg: 30,
  unidad: 1,
};

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

  return (
    <div className="product-card">
      <div className="product-card-img-container">
        <img
          src={product.imagen}
          alt={product.nombre}
          className="product-img"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/assets/Flyer-mix-point.png';
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
          </div>
        )}

        <p className="price">
          Precio: <strong>
            ${(() => {
              const precioUnitario = product.precios[pesoSeleccionado] ?? 0;
              const total = precioUnitario * multiplicadores[pesoSeleccionado];
              return total.toLocaleString("es-AR");
            })()}
          </strong>
        </p>

        <div className="quantity-controls">
          <button type="button" onClick={decrementar} className="qty-btn" aria-label="Restar una unidad">-</button>
          <span className="qty-number">{cantidad}</span>
          <button type="button" onClick={incrementar} className="qty-btn" aria-label="Sumar una unidad">+</button>
        </div>

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
      </div>
    </div>
  );
};