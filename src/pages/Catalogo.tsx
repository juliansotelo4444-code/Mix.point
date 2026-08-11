import { useState, useMemo } from 'react';
import { useProducts } from '../hooks/useProducts';
import { ProductCard } from '../components/ProductCard';
import { useCartContext } from '../context/CartContext';
import { PageCTA } from '../components/PageCTA';

const PRODUCTOS_POR_PAGINA = 28;

export function Catalogo() {
  const { products, loading, error } = useProducts();
  const { addToCart } = useCartContext();

  const [query, setQuery] = useState("");
  const [pagina, setPagina] = useState(1);

  const productosFiltrados = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return products;
    return products.filter((p) =>
      p.nombre.toLowerCase().includes(q) ||
      p.categoria.toLowerCase().includes(q) ||
      p.descripcion?.toLowerCase().includes(q)
    );
  }, [query, products]);

  const totalPaginas = Math.ceil(productosFiltrados.length / PRODUCTOS_POR_PAGINA);

  const productosPagina = useMemo(() => {
    const inicio = (pagina - 1) * PRODUCTOS_POR_PAGINA;
    return productosFiltrados.slice(inicio, inicio + PRODUCTOS_POR_PAGINA);
  }, [productosFiltrados, pagina]);

  const handleQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setPagina(1);
  };

  const handlePagina = (nueva: number) => {
    setPagina(nueva);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <h2 className="catalog-title" id="catalogo">Nuestro Catálogo</h2>

      <div className="search-wrapper">
        <input
          type="text"
          placeholder="Buscar productos..."
          value={query}
          onChange={handleQuery}
          className="search-input"
        />
      </div>

      {loading && <p className="status-msg">Cargando productos...</p>}
      {error && <p className="status-msg status-msg--error">Error al cargar productos. Intentá recargar la página.</p>}

      {query && !loading && (
        <p className="status-msg">
          {productosFiltrados.length} resultado{productosFiltrados.length !== 1 ? 's' : ''} para "{query}"
        </p>
      )}

      <section className="product-grid">
        {productosPagina.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            addToCart={addToCart}
          />
        ))}
      </section>

      {totalPaginas > 1 && (
        <div className="paginacion">
          <button
            className="pag-btn"
            onClick={() => handlePagina(pagina - 1)}
            disabled={pagina === 1}
          >
            ← Anterior
          </button>

          {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              className={`pag-btn ${n === pagina ? 'pag-btn--active' : ''}`}
              onClick={() => handlePagina(n)}
            >
              {n}
            </button>
          ))}

          <button
            className="pag-btn"
            onClick={() => handlePagina(pagina + 1)}
            disabled={pagina === totalPaginas}
          >
            Siguiente →
          </button>
        </div>
      )}

      <PageCTA
        texto="¿Compra grande o sos revendedor?"
        linkTexto="Pedí asesoramiento comercial"
        to="/contacto"
        icono="📦"
      />
    </>
  );
}