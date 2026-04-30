import { useState } from 'react';
import type { Product, Precios } from '../types';

interface Props {
  product: Product;
  // Actualizamos la firma para que acepte cantidad
  addToCart: (product: Product, peso: keyof Precios, cantidad: number) => void;
}

export const ProductCard = ({ product, addToCart }: Props) => {
  const [pesoSeleccionado, setPesoSeleccionado] = useState<keyof Precios>("kg");
  // Nuevo estado para la cantidad
  const [cantidad, setCantidad] = useState(1);

  const incrementar = () => setCantidad(prev => prev + 1);
  const decrementar = () => setCantidad(prev => (prev > 1 ? prev - 1 : 1));

  return (
    <div className="product-card">
      <img src={product.imagen} alt={product.nombre} className="product-img" />
      <div className="product-info">
        <h3>{product.nombre}</h3>
        {product.descripcion && <p className="description">{product.descripcion}</p>}
        
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

        <p className="price">
          Precio: <strong>${product.precios[pesoSeleccionado]?.toLocaleString()}</strong>
        </p>

        {/* Controles de cantidad integrados */}
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