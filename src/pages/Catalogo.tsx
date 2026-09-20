import { useState, useMemo, useEffect } from 'react';
import { useProducts } from '../hooks/useProducts';
import { ProductCard } from '../components/ProductCard';
import { useCartContext } from '../context/CartContext';
import { PageCTA } from '../components/PageCTA';
import type { Product } from '../types';

const PRODUCTOS_POR_PAGINA = 24;

type TipoOrden = 'relevancia' | 'precio-menor' | 'precio-mayor' | 'nombre-az';

const getPrecioBase = (p: Product): number => {
  if (p.tipoVenta === 'unidad') {
    return p.precios.unidad ?? p.precios.kg ?? 0;
  }
  return p.precios.kg ?? 0;
};

export function Catalogo() {
  const { products, loading, error } = useProducts();
  const { addToCart } = useCartContext();

  const [query, setQuery] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todos");
  const [orden, setOrden] = useState<TipoOrden>("relevancia");
  const [pagina, setPagina] = useState(1);

  useEffect(() => {
    document.title = 'Catálogo Mayorista & Minorista | Mix Point';
  }, []);

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

  const productosOrdenados = useMemo(() => {
    const list = [...productosFiltrados];
    if (orden === 'precio-menor') {
      return list.sort((a, b) => getPrecioBase(a) - getPrecioBase(b));
    }
    if (orden === 'precio-mayor') {
      return list.sort((a, b) => getPrecioBase(b) - getPrecioBase(a));
    }
    if (orden === 'nombre-az') {
      return list.sort((a, b) => a.nombre.localeCompare(b.nombre));
    }
    return list;
  }, [productosFiltrados, orden]);

  const totalPaginas = Math.ceil(productosOrdenados.length / PRODUCTOS_POR_PAGINA);

  const productosPagina = useMemo(() => {
    const inicio = (pagina - 1) * PRODUCTOS_POR_PAGINA;
    return productosOrdenados.slice(inicio, inicio + PRODUCTOS_POR_PAGINA);
  }, [productosOrdenados, pagina]);

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

      {/* BUSCADOR ELEGANTE Y ORDEN */}
      <div className="search-wrapper">
        <div className="search-container">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Buscar por nombre, tipo de fruto, mix o especia..."
            value={query}
            onChange={handleQuery}
            className="search-input"
            aria-label="Buscar productos"
          />
        </div>

        <div className="sort-container">
          <label htmlFor="sort-select" className="sort-label">Ordenar por:</label>
          <select
            id="sort-select"
            value={orden}
            onChange={(e) => {
              setOrden(e.target.value as TipoOrden);
              setPagina(1);
            }}
            className="sort-select"
            aria-label="Ordenar productos"
          >
            <option value="relevancia">Relevancia / Destacados</option>
            <option value="precio-menor">Precio: Menor a Mayor</option>
            <option value="precio-mayor">Precio: Mayor a Menor</option>
            <option value="nombre-az">Nombre: A - Z</option>
          </select>
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

      {/* SKELETON CARDS DURANTE CARGA */}
      {loading && (
        <div className="catalog-loading-section">
          <p className="status-msg">Cargando productos frescos de la huerta...</p>
          <div className="product-grid skeleton-grid">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div key={idx} className="product-card skeleton-card" aria-hidden="true">
                <div className="product-card-img-container skeleton-box skeleton-img" />
                <div className="skeleton-content">
                  <div className="skeleton-box skeleton-line skeleton-title" />
                  <div className="skeleton-box skeleton-line skeleton-desc" />
                  <div className="skeleton-box skeleton-line skeleton-price" />
                  <div className="skeleton-box skeleton-button" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {error && <p className="status-msg status-msg--error">Error al cargar productos. Intentá recargar la página.</p>}

      {(query || categoriaSeleccionada !== "Todos") && !loading && (
        <p className="status-msg">
          {productosOrdenados.length} producto{productosOrdenados.length !== 1 ? 's' : ''} encontrado{productosOrdenados.length !== 1 ? 's' : ''}
          {categoriaSeleccionada !== "Todos" && ` en "${categoriaSeleccionada}"`}
          {query && ` para "${query}"`}
        </p>
      )}

      {!loading && !error && (
        <section className="product-grid">
          {productosPagina.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              addToCart={addToCart}
            />
          ))}
        </section>
      )}

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