import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { ProductCard } from '../components/ProductCard';
import { FeaturedCarousel } from '../components/FeaturedCarousel';
import { useCartContext } from '../context/CartContext';
import { PageCTA } from '../components/PageCTA';
import type { Product } from '../types';

const PRODUCTOS_POR_PAGINA = 24;

const BUSQUEDAS_POPULARES = [
  'Nueces',
  'Almendras',
  'Mix Patagonia',
  'Castañas',
  'Aceite de Oliva',
  'Granola',
  'Chía',
  'Avena',
];

type TipoOrden = 'relevancia' | 'precio-menor' | 'precio-mayor' | 'nombre-az';

const getPrecioBase = (p: Product): number => {
  if (p.tipoVenta === 'unidad') {
    return p.precios.unidad ?? p.precios.kg ?? 0;
  }
  if ((p.precios.kg ?? 0) > 0) {
    return p.precios.kg;
  }
  // Si no tiene precio por kg pero sí tiene bulto mayorista (ej: 5kg, 10kg)
  const primerPrecioValido = (Object.values(p.precios) as Array<number | undefined>).find(v => (v ?? 0) > 0);
  return primerPrecioValido ?? 0;
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
  const [searchParams] = useSearchParams();

  const [query, setQuery] = useState(searchParams.get('buscar') || "");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(searchParams.get('categoria') || "Todos");
  const [prevParamsString, setPrevParamsString] = useState(searchParams.toString());
  const [filtroTipoVenta, setFiltroTipoVenta] = useState<'todos' | 'peso' | 'unidad'>('todos');
  const [orden, setOrden] = useState<TipoOrden>("relevancia");

  // Sincronizar de forma segura si los parámetros de la URL cambian (ej: al navegar desde la Home)
  const currentParamsString = searchParams.toString();
  if (currentParamsString !== prevParamsString) {
    setPrevParamsString(currentParamsString);
    const cat = searchParams.get('categoria');
    const b = searchParams.get('buscar');
    if (cat !== null) {
      setCategoriaSeleccionada(cat);
    }
    if (b !== null) {
      setQuery(b);
    }
  }

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
    const tokens = qNorm.split(/\s+/).filter(Boolean);

    return products.filter((p) => {
      // Filtro por categoría
      const matchCategoria =
        categoriaSeleccionada === "Todos" || p.categoria === categoriaSeleccionada;

      // Filtro por tipo de venta
      const matchTipo =
        filtroTipoVenta === 'todos' ||
        (filtroTipoVenta === 'peso' && p.tipoVenta === 'peso') ||
        (filtroTipoVenta === 'unidad' && p.tipoVenta === 'unidad');

      if (!matchCategoria || !matchTipo) return false;
      if (tokens.length === 0) return true;

      // Búsqueda insensible a tildes, mayúsculas y orden de palabras (ej: 'mariposa nuez')
      const targetText = normalizarTexto(`${p.nombre} ${p.categoria || ''} ${p.descripcion || ''}`);
      return tokens.every((token) => targetText.includes(token));
    });
  }, [query, categoriaSeleccionada, filtroTipoVenta, products]);

  const productosOrdenados = useMemo(() => {
    const list = [...productosFiltrados];
    if (orden === 'precio-menor') {
      return list.sort((a, b) => {
        const pA = getPrecioBase(a);
        const pB = getPrecioBase(b);
        if (pA === 0 && pB > 0) return 1;
        if (pB === 0 && pA > 0) return -1;
        return pA - pB;
      });
    }
    if (orden === 'precio-mayor') {
      return list.sort((a, b) => getPrecioBase(b) - getPrecioBase(a));
    }
    if (orden === 'nombre-az') {
      return list.sort((a, b) => a.nombre.localeCompare(b.nombre));
    }
    return list;
  }, [productosFiltrados, orden]);

  const [limiteVisible, setLimiteVisible] = useState(PRODUCTOS_POR_PAGINA);

  const productosPagina = useMemo(() => {
    return productosOrdenados.slice(0, limiteVisible);
  }, [productosOrdenados, limiteVisible]);

  const handleCargarMas = () => {
    setLimiteVisible((prev) => prev + PRODUCTOS_POR_PAGINA);
  };

  const handleQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setLimiteVisible(PRODUCTOS_POR_PAGINA);
  };

  const handleClearQuery = () => {
    setQuery("");
    setLimiteVisible(PRODUCTOS_POR_PAGINA);
  };

  const handleCategoria = (cat: string) => {
    setCategoriaSeleccionada(cat);
    setLimiteVisible(PRODUCTOS_POR_PAGINA);
  };

  const hayFiltrosActivos = query || categoriaSeleccionada !== "Todos" || filtroTipoVenta !== 'todos';

  return (
    <div className="catalog-page-container">
      {/* HEADER DE SECCIÓN ESTILO BOUTIQUE NATURAL */}
      <header className="catalog-hero-header">
        <span className="catalog-eyebrow">Directo de Productores Nacionales</span>
        <h1 className="catalog-main-title" id="catalogo">Catálogo Completo</h1>
        <p className="catalog-lead-text">
          Frutos secos, mixes artesanales y alimentos naturales. Venta al por menor, bolsas mayoristas y bultos cerrados para dietéticas y hogares.
        </p>
      </header>

      {/* CARRUSEL DE PRODUCTOS DESTACADOS DE LA SEMANA */}
      {!loading && !hayFiltrosActivos && (
        <div style={{ maxWidth: '1240px', margin: '0 auto 20px', padding: '0 20px' }}>
          <FeaturedCarousel
            products={products}
            addToCart={addToCart}
            title="Destacados de la Semana"
            subtitle="Los 5 frutos secos y mixes más pedidos de nuestro catálogo con precios mayoristas directos."
          />
        </div>
      )}

      {/* ZONA DE BUSCADOR Y FILTROS DESTACADA */}
      <section className="catalog-search-panel" aria-label="Búsqueda y filtros del catálogo">
        <div className="search-wrapper">
          <div className="search-container search-container--featured">
            <span className="search-icon" aria-hidden="true">🔍</span>
            <input
              type="text"
              placeholder="Buscar por fruto, mix, especia, aceite (ej: almendras, chía)..."
              value={query}
              onChange={handleQuery}
              className="search-input"
              aria-label="Buscar productos en el catálogo"
            />
            {query && (
              <button
                type="button"
                onClick={handleClearQuery}
                className="search-clear-btn"
                aria-label="Borrar búsqueda actual"
                title="Borrar búsqueda"
              >
                ✕
              </button>
            )}
          </div>

          <div className="filter-controls-group">
            {/* Selector de Modalidad */}
            <div className="type-filter-container">
              <label htmlFor="tipo-venta-select" className="sort-label">Formato:</label>
              <select
                id="tipo-venta-select"
                value={filtroTipoVenta}
                onChange={(e) => {
                  setFiltroTipoVenta(e.target.value as 'todos' | 'peso' | 'unidad');
                  setLimiteVisible(PRODUCTOS_POR_PAGINA);
                }}
                className="sort-select"
                aria-label="Filtrar por formato de venta"
              >
                <option value="todos">Todos los formatos</option>
                <option value="peso">⚖️ Por Granel / Peso</option>
                <option value="unidad">📦 Envasado / Unidad</option>
              </select>
            </div>

            {/* Selector de Orden */}
            <div className="sort-container">
              <label htmlFor="sort-select" className="sort-label">Ordenar:</label>
              <select
                id="sort-select"
                value={orden}
                onChange={(e) => {
                  setOrden(e.target.value as TipoOrden);
                  setLimiteVisible(PRODUCTOS_POR_PAGINA);
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

        {/* ETIQUETAS DE BÚSQUEDA RÁPIDA / POPULARES */}
        <div className="search-quick-tags" aria-label="Búsquedas sugeridas">
          <span className="search-quick-label">Populares:</span>
          <div className="search-quick-list">
            {BUSQUEDAS_POPULARES.map((term) => (
              <button
                key={term}
                type="button"
                className={`search-quick-btn ${query.toLowerCase() === term.toLowerCase() ? 'search-quick-btn--active' : ''}`}
                onClick={() => {
                  setQuery(term);
                  setLimiteVisible(PRODUCTOS_POR_PAGINA);
                }}
              >
                {term}
              </button>
            ))}
          </div>
        </div>

        {/* PILLS DE CATEGORÍAS CON CONTEO */}
        {!loading && categoriasConConteo.length > 1 && (
          <nav className="category-pills-wrapper" aria-label="Categorías de productos">
            {categoriasConConteo.map((cat) => (
              <button
                key={cat.nombre}
                onClick={() => handleCategoria(cat.nombre)}
                className={`category-pill ${categoriaSeleccionada === cat.nombre ? 'category-pill--active' : ''}`}
                aria-pressed={categoriaSeleccionada === cat.nombre}
              >
                <span className="category-pill-name">{cat.nombre}</span>
                <span className="category-pill-count">{cat.total}</span>
              </button>
            ))}
          </nav>
        )}

        {/* FILTROS ACTIVOS CON BOTÓN DE LIMPIAR */}
        {hayFiltrosActivos && !loading && (
          <div className="active-filters-strip">
            <span className="active-filters-indicator">
              Mostrando <strong>{productosOrdenados.length}</strong> producto{productosOrdenados.length !== 1 ? 's' : ''}
            </span>
            <div className="active-chips-wrapper">
              {categoriaSeleccionada !== "Todos" && (
                <span className="active-chip">
                  Categoría: <strong>{categoriaSeleccionada}</strong>
                  <button type="button" onClick={() => handleCategoria("Todos")} aria-label="Quitar filtro de categoría">✕</button>
                </span>
              )}
              {filtroTipoVenta !== 'todos' && (
                <span className="active-chip">
                  Formato: <strong>{filtroTipoVenta === 'peso' ? 'Granel' : 'Envasado'}</strong>
                  <button type="button" onClick={() => setFiltroTipoVenta("todos")} aria-label="Quitar filtro de formato">✕</button>
                </span>
              )}
              {query && (
                <span className="active-chip">
                  Búsqueda: <strong>"{query}"</strong>
                  <button type="button" onClick={handleClearQuery} aria-label="Quitar filtro de búsqueda">✕</button>
                </span>
              )}
              <button
                type="button"
                className="btn-clear-filters-mini"
                onClick={() => {
                  setQuery("");
                  setCategoriaSeleccionada("Todos");
                  setFiltroTipoVenta("todos");
                  setLimiteVisible(PRODUCTOS_POR_PAGINA);
                }}
              >
                Limpiar todos
              </button>
            </div>
          </div>
        )}
      </section>

      {/* SKELETON CARDS DURANTE CARGA */}
      {loading && (
        <div className="catalog-loading-section">
          <p className="status-msg">Cargando catálogo actualizado desde la lista oficial...</p>
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

      {error && (
        <div className="catalog-error-box">
          <p className="status-msg status-msg--error">
            Hubo un inconveniente al cargar el catálogo de productos.
          </p>
          <button
            type="button"
            className="btn-reload-catalog"
            onClick={() => window.location.reload()}
          >
            Reintentar recargar
          </button>
        </div>
      )}

      {/* ESTADO VACÍO (SIN RESULTADOS) */}
      {!loading && !error && productosOrdenados.length === 0 && (
        <div className="no-products-found">
          <span className="no-products-icon" aria-hidden="true">🌿</span>
          <p className="no-products-title">No encontramos productos con ese criterio</p>
          <p className="no-products-sub">
            Probá escribiendo el nombre de otra forma o seleccionando otra categoría para explorar nuestra cosecha.
          </p>
          <button
            type="button"
            className="btn-reset-filters"
            onClick={() => {
              setQuery("");
              setCategoriaSeleccionada("Todos");
              setFiltroTipoVenta("todos");
              setLimiteVisible(PRODUCTOS_POR_PAGINA);
            }}
          >
            Restablecer todos los filtros
          </button>
        </div>
      )}

      {/* GRILLA PRINCIPAL DE PRODUCTOS */}
      {!loading && !error && productosOrdenados.length > 0 && (
        <main className="product-grid" id="lista-productos" aria-label="Lista de productos del catálogo">
          {productosPagina.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              addToCart={addToCart}
            />
          ))}
        </main>
      )}

      {/* CARGAR MÁS PRODUCTOS / PAGINACIÓN PROGRESSIVA */}
      {productosOrdenados.length > PRODUCTOS_POR_PAGINA && (
        <div className="load-more-wrapper">
          <div className="load-more-status">
            <span>
              Mostrando <strong>{productosPagina.length}</strong> de <strong>{productosOrdenados.length}</strong> productos
            </span>
            <div className="load-more-progress-bar">
              <div
                className="load-more-progress-fill"
                style={{
                  width: `${Math.min(100, Math.round((productosPagina.length / productosOrdenados.length) * 100))}%`
                }}
              />
            </div>
          </div>

          {productosPagina.length < productosOrdenados.length && (
            <button
              type="button"
              className="btn-load-more"
              onClick={handleCargarMas}
            >
              Ver más productos (+{Math.min(PRODUCTOS_POR_PAGINA, productosOrdenados.length - productosPagina.length)}) ↓
            </button>
          )}
        </div>
      )}

      <PageCTA
        texto="¿Precisás cotización por pallets, bultos cerrados o grandes volúmenes?"
        linkTexto="Contactá a nuestro equipo comercial mayorista"
        to="/contacto"
        icono="📦"
      />
    </div>
  );
}
