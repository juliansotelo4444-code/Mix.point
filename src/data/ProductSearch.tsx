import { useState, useMemo } from "react";
import { products } from "./products";
import type { Product } from "../types";

export default function ProductSearch() {
const [query, setQuery] = useState("");

const resultados = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return products;
    return products.filter(
    (p: Product) =>
        p.nombre.toLowerCase().includes(q) ||
        p.categoria.toLowerCase().includes(q) ||
        p.descripcion?.toLowerCase().includes(q),
    );
}, [query]);

return (
    <div>
    <input
        type="text"
        placeholder="Buscar productos..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
    />

    <p>{resultados.length} productos encontrados</p>

    <ul>
        {resultados.map((producto) => (
        <li key={producto.id}>
            <strong>{producto.nombre}</strong> — {producto.categoria}
            <br />
            Precio x1kg: ${producto.precios.kg?.toLocaleString("es-AR")}
        </li>
        ))}
    </ul>
    </div>
);
}
