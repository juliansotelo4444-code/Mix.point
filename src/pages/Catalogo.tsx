import { useState, useMemo } from 'react';
import { useProducts } from '../hooks/useProducts';
import { ProductCard } from '../components/ProductCard';
import { useCartContext } from '../context/CartContext';
import { PageCTA } from '../components/PageCTA';

const PRODUCTOS_POR_PAGINA = 24;

export function Catalogo() {
  const { products, loading, error } = useProducts();
  const { addToCart } = useCartContext();

  const [query, setQuery] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todos");
  const [pagina, setPagina] = useState(1);

  // Lista de categorías únicas extraídas de los productos
  const categorias = useMemo(() => {
    const list = Array.from(new Set(products.map((p) => p.categoria).filter(Boolean)));
    return ["Todos", ...list];
  }, [products]);

  const productosFiltrados = useMemo(() => {
    const q = query.toLowerCase().trim();
    return products.filter((p) => {
      const matchCategoria =
        categoriaSeleccionada === "Todos" || p.categoria === categoriaSeleccionada;
      const matchQuery =
        !q ||
        p.nombre.toLowerCase().includes(q) ||
        p.categoria.toLowerCase().includes(q) ||
        p.descripcion?.toLowerCase().includes(q);
      return matchCategoria && matchQuery;
    });
  }, [query, categoriaSeleccionada, products]);

  const totalPaginas = Math.ceil(productosFiltrados.length / PRODUCTOS_POR_PAGINA);

  const productosPagina = useMemo(() => {
    const inicio = (pagina - 1) * PRODUCTOS_POR_PAGINA;
    return productosFiltrados.slice(inicio, inicio + PRODUCTOS_POR_PAGINA);
  }, [productosFiltrados, pagina]);

  const handleQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setPagina(1);
  };

  const handleCategoria = (cat: string) => {
    setCategoriaSeleccionada(cat);
    setPagina(1);
  };

  const handlePagina = (nueva: number) => {
    setPagina(nueva);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <div className="section-header">
        <span className="section-tag">Directo de Productores</span>
        <h1 className="catalog-title" id="catalogo">Catálogo Completo</h1>
        <p className="section-subtitle">
          Precios por kilogramo, bolsas mayoristas y bultos cerrados para dietéticas y hogares.
        </p>
      </div>

      {/* BUSCADOR ELEGANTE */}
      <div className="search-wrapper">
        <div className="search-container">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Buscar por nombre, tipo de fruto, mix o especia..."
            value={query}
            onChange={handleQuery}
            className="search-input"
          />
        </div>
      </div>

      {/* PILLS DE CATEGORÍAS */}
      {!loading && categorias.length > 1 && (
        <div className="category-pills-wrapper">
          {categorias.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoria(cat)}
              className={`category-pill ${categoriaSeleccionada === cat ? 'category-pill--active' : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {loading && <p className="status-msg">Cargando productos de la huerta...</p>}
      {error && <p className="status-msg status-msg--error">Error al cargar productos. Intentá recargar la página.</p>}

      {(query || categoriaSeleccionada !== "Todos") && !loading && (
        <p className="status-msg">
          {productosFiltrados.length} producto{productosFiltrados.length !== 1 ? 's' : ''} encontrado{productosFiltrados.length !== 1 ? 's' : ''}
          {categoriaSeleccionada !== "Todos" && ` en "${categoriaSeleccionada}"`}
          {query && ` para "${query}"`}
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
        texto="¿Precisás una cotización por pallets o grandes volúmenes?"
        linkTexto="Contactá a nuestro equipo comercial"
        to="/contacto"
        icono="📦"
      />
    </>
  );
}