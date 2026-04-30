import { useState } from 'react';
import type { Product, Precios } from '../types';

interface Props {
  product: Product;
  addToCart: (product: Product, peso: keyof Precios) => void;
}

export const ProductCard = ({ product, addToCart }: Props) => {
  // Iniciamos el estado en 'kg' para que sea el precio base por defecto
  const [pesoSeleccionado, setPesoSeleccionado] = useState<keyof Precios>("kg");

  return (
    <div className="product-card">
      <img src={product.imagen} alt={product.nombre} className="product-img" />
      <div className="product-info">
        <h3>{product.nombre}</h3>
        {product.descripcion && <p className="description">{product.descripcion}</p>}
        
        <div className="selector-container">
          <label htmlFor={`peso-${product.id}`}>Seleccionar Formato:</label>
          <select 
            id={`peso-${product.id}`}
            value={pesoSeleccionado} 
            onChange={(e) => setPesoSeleccionado(e.target.value as keyof Precios)}
          >
            {/* Renderizamos las opciones solo si existen en el objeto precios de este producto */}
            <option value="kg">1 Kilogramo</option>
            {product.precios.cincoKg && <option value="cincoKg">Bolsa 5kg</option>}
            {product.precios.diezKg && <option value="diezKg">Bolsa 10kg</option>}
            {product.precios.veinticincoKg && <option value="veinticincoKg">Bolsa 25kg</option>}
            {product.precios.treintaKg && <option value="treintaKg">Bolsa 30kg</option>}
          </select>
        </div>

        <p className="price">
          {/* Accedemos al valor numérico usando el peso seleccionado como llave */}
          Precio x kg: <strong>${product.precios[pesoSeleccionado]?.toLocaleString()}</strong>
        </p>
        
        <button 
          className="btn-add" 
          onClick={() => addToCart(product, pesoSeleccionado)}
        >
          Agregar al carrito
        </button>
      </div>
    </div>
  );
};