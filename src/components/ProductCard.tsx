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

  // Si el producto es por unidad, arrancamos con "unidad" seleccionado
  // directo (no hay dropdown que elegir). Si es por peso, "kg" como antes.
  const [pesoSeleccionado, setPesoSeleccionado] = useState<keyof Precios>(
    esPorUnidad ? 'unidad' : 'kg'
  );
  const [cantidad, setCantidad] = useState(1);

  const incrementar = () => setCantidad(prev => prev + 1);
  const decrementar = () => setCantidad(prev => (prev > 1 ? prev - 1 : 1));

  return (
    <div className="product-card">
      <img src={product.imagen} alt={product.nombre} className="product-img" />
      <div className="product-info">
        <h3>{product.nombre}</h3>
        {product.descripcion && <p className="description">{product.descripcion}</p>}

        {esPorUnidad ? (
          // Producto por unidad: sin selector de formato, mensaje simple
          <div className="selector-container">
            <span className="selector-label">Precio por unidad</span>
          </div>
        ) : (
          // Producto por peso: selector de formato, igual que siempre
          <div className="selector-container">
            <span className="selector-label">Formato de venta</span>
            <select
              id={`peso-${product.id}`}
              className="select-formato"
              value={pesoSeleccionado}
              onChange={(e) => setPesoSeleccionado(e.target.value as keyof Precios)}
            >
              <option value="kg">Por Kilogramo</option>
              {product.precios.cincoKg && <option value="cincoKg">Bolsa 5kg (Mayorista)</option>}
              {product.precios.diezKg && <option value="diezKg">Bolsa 10kg (Mayorista)</option>}
              {product.precios.veinticincoKg && <option value="veinticincoKg">Bolsa 25kg (Bulto)</option>}
              {product.precios.treintaKg && <option value="treintaKg">Bolsa 30kg (Bulto)</option>}
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
          <button type="button" onClick={decrementar} className="qty-btn">-</button>
          <span className="qty-number">{cantidad}</span>
          <button type="button" onClick={incrementar} className="qty-btn">+</button>
        </div>

        <button
          className="btn-add"
          onClick={() => {
            addToCart(product, pesoSeleccionado, cantidad);
            setCantidad(1);
          }}
        >
          Agregar al carrito
        </button>
      </div>
    </div>
  );
};