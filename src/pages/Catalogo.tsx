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

const normalizarTexto = (txt: string): string =>
  txt
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();

export function Catalogo() {
  const { products, loading, error } = useProducts();
  const { addToCart } = useCartContext();

  const [query, setQuery] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todos");
  const [filtroTipoVenta, setFiltroTipoVenta] = useState<'todos' | 'peso' | 'unidad'>('todos');
  const [orden, setOrden] = useState<TipoOrden>("relevancia");
  const [pagina, setPagina] = useState(1);

  useEffect(() => {
    document.title = 'Catálogo Mayorista & Minorista | Mix Point';
  }, []);

  // Lista de categorías únicas con conteo exacto de productos
  const categoriasConConteo = useMemo(() => {
    const counts: Record<string, number> = {};
    products.forEach((p) => {
      if (p.categoria) {
        counts[p.categoria] = (counts[p.categoria] || 0) + 1;
      }
    });

    const lista = Object.keys(counts).sort().map((cat) => ({
      nombre: cat,
      total: counts[cat],
    }));

    return [{ nombre: "Todos", total: products.length }, ...lista];
  }, [products]);

  const productosFiltrados = useMemo(() => {
    const qNorm = normalizarTexto(query);

    return products.filter((p) => {
      // Filtro por categoría
      const matchCategoria =
        categoriaSeleccionada === "Todos" || p.categoria === categoriaSeleccionada;

      // Filtro por tipo de venta
      const matchTipo =
        filtroTipoVenta === 'todos' ||
        (filtroTipoVenta === 'peso' && p.tipoVenta === 'peso') ||
        (filtroTipoVenta === 'unidad' && p.tipoVenta === 'unidad');

      // Búsqueda insensible a tildes y mayúsculas
      const matchQuery =
        !qNorm ||
        normalizarTexto(p.nombre).includes(qNorm) ||
        normalizarTexto(p.categoria).includes(qNorm) ||
        (p.descripcion && normalizarTexto(p.descripcion).includes(qNorm));

      return matchCategoria && matchTipo && matchQuery;
    });
  }, [query, categoriaSeleccionada, filtroTipoVenta, products]);

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

  const handleClearQuery = () => {
    setQuery("");
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

      {/* BUSCADOR ELEGANTE, FILTROS Y ORDEN */}
      <div className="search-wrapper">
        <div className="search-container">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Buscar por nombre, tipo de fruto, mix o especia (ej: castañas, chía)..."
            value={query}
            onChange={handleQuery}
            className="search-input"
            aria-label="Buscar productos"
          />
          {query && (
            <button
              type="button"
              onClick={handleClearQuery}
              className="search-clear-btn"
              aria-label="Borrar búsqueda"
              title="Borrar búsqueda"
            >
              ✕
            </button>
          )}
        </div>

        <div className="filter-controls-group">
          {/* Selector de Tipo de Venta */}
          <div className="type-filter-container">
            <label htmlFor="tipo-venta-select" className="sort-label">Modalidad:</label>
            <select
              id="tipo-venta-select"
              value={filtroTipoVenta}
              onChange={(e) => {
                setFiltroTipoVenta(e.target.value as 'todos' | 'peso' | 'unidad');
                setPagina(1);
              }}
              className="sort-select"
              aria-label="Filtrar por modalidad de venta"
            >
              <option value="todos">Todos los formatos</option>
              <option value="peso">⚖️ Por Peso / Granel</option>
              <option value="unidad">📦 Por Unidad / Envasado</option>
            </select>
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
      </div>

      {/* PILLS DE CATEGORÍAS CON CONTEO */}
      {!loading && categoriasConConteo.length > 1 && (
        <div className="category-pills-wrapper">
          {categoriasConConteo.map((cat) => (
            <button
              key={cat.nombre}
              onClick={() => handleCategoria(cat.nombre)}
              className={`category-pill ${categoriaSeleccionada === cat.nombre ? 'category-pill--active' : ''}`}
            >
              <span>{cat.nombre}</span>
              <span className="category-pill-count">{cat.total}</span>
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

      {!loading && !error && productosOrdenados.length === 0 && (
        <div className="no-products-found">
          <p className="no-products-title">🔍 No encontramos productos que coincidan</p>
          <p className="no-products-sub">Probá cambiando el término de búsqueda o seleccionando otra categoría.</p>
          <button
            type="button"
            className="btn-reset-filters"
            onClick={() => {
              setQuery("");
              setCategoriaSeleccionada("Todos");
              setFiltroTipoVenta("todos");
              setPagina(1);
            }}
          >
            Restablecer todos los filtros
          </button>
        </div>
      )}

      {!loading && !error && productosOrdenados.length > 0 && (
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