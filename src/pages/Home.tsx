import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useCartContext } from '../context/CartContext';
import { HeroSlider } from '../components/HeroSlider';
import { ProductCard } from '../components/ProductCard';
import { FeaturedCarousel } from '../components/FeaturedCarousel';
import { WHATSAPP_NUMERO, WHATSAPP_DISPLAY } from '../config/constants';

const CATEGORIAS_RAPIDAS = [
  'Todos',
  'Frutos Secos',
  'Mixes',
  'Semillas',
  'Cereales',
  'Repostería',
  'Legumbres',
  'Herboristería',
  'Aceites'
];

export function Home() {
  const { products, loading } = useProducts();
  const { addToCart } = useCartContext();
  const navigate = useNavigate();

  const [categoriaActiva, setCategoriaActiva] = useState('Todos');
  const [filtroTexto, setFiltroTexto] = useState('');

  useEffect(() => {
    document.title = 'Mix Point | Distribuidora Mayorista de Frutos Secos y Alimentos Naturales';
  }, []);

  // Filtrado reactivo en tiempo real para la sección de catálogo
  const productosFiltrados = useMemo(() => {
    return products.filter((p) => {
      const matchCat =
        categoriaActiva === 'Todos' ||
        (p.categoria && p.categoria.toLowerCase().includes(categoriaActiva.toLowerCase()));

      const matchTexto =
        !filtroTexto.trim() ||
        p.nombre.toLowerCase().includes(filtroTexto.toLowerCase()) ||
        (p.descripcion && p.descripcion.toLowerCase().includes(filtroTexto.toLowerCase()));

      return matchCat && matchTexto;
    });
  }, [products, categoriaActiva, filtroTexto]);

  // Tomamos los primeros 12 para la vista rápida de la Home
  const productosMuestra = productosFiltrados.slice(0, 12);

  const handleVerMas = () => {
    const params = new URLSearchParams();
    if (categoriaActiva !== 'Todos') params.set('categoria', categoriaActiva);
    if (filtroTexto.trim()) params.set('buscar', filtroTexto.trim());
    navigate(`/catalogo?${params.toString()}`);
  };

  return (
    <div className="w-full bg-white font-sans text-gray-900">
      {/* 1. SLIDER PRINCIPAL DE CAMPAÑA (HERO SLIDER - FULL-WIDTH) */}
      <HeroSlider />

      {/* 2. BARRA DE BENEFICIOS MAYORISTAS (ESTILO INDUSTRIAL & CONFIANZA) */}
      <section className="w-full bg-[#f8fafc] border-y border-gray-200 py-6 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {/* Beneficio 1 */}
          <div className="flex items-center gap-3 bg-white p-3.5 rounded-xl border border-gray-200/80 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-[#f0fdf4] text-[#76A33E] flex items-center justify-center text-xl shrink-0">
              🚚
            </div>
            <div>
              <h3 className="text-xs md:text-sm font-bold text-gray-900 uppercase tracking-tight">
                Venta Mayorista
              </h3>
              <p className="text-[11px] md:text-xs text-gray-500 line-clamp-1">
                Bulto cerrado y fraccionado
              </p>
            </div>
          </div>

          {/* Beneficio 2 */}
          <div className="flex items-center gap-3 bg-white p-3.5 rounded-xl border border-gray-200/80 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-[#f0fdf4] text-[#76A33E] flex items-center justify-center text-xl shrink-0">
              🤝
            </div>
            <div>
              <h3 className="text-xs md:text-sm font-bold text-gray-900 uppercase tracking-tight">
                Pago Contra Entrega
              </h3>
              <p className="text-[11px] md:text-xs text-gray-500 line-clamp-1">
                Abonás en puerta al recibir
              </p>
            </div>
          </div>

          {/* Beneficio 3 */}
          <div className="flex items-center gap-3 bg-white p-3.5 rounded-xl border border-gray-200/80 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-[#f0fdf4] text-[#76A33E] flex items-center justify-center text-xl shrink-0">
              🚫
            </div>
            <div>
              <h3 className="text-xs md:text-sm font-bold text-gray-900 uppercase tracking-tight">
                Sin Seña Previa
              </h3>
              <p className="text-[11px] md:text-xs text-gray-500 line-clamp-1">
                Cero adelantos para tu local
              </p>
            </div>
          </div>

          {/* Beneficio 4 */}
          <div className="flex items-center gap-3 bg-white p-3.5 rounded-xl border border-gray-200/80 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-[#f0fdf4] text-[#76A33E] flex items-center justify-center text-xl shrink-0">
              ⚡
            </div>
            <div>
              <h3 className="text-xs md:text-sm font-bold text-gray-900 uppercase tracking-tight">
                Envíos en el Día
              </h3>
              <p className="text-[11px] md:text-xs text-gray-500 line-clamp-1">
                Reparto propio CABA y GBA
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CARRUSEL DE OFERTAS & MÁS VENDIDOS */}
      {!loading && products.length > 0 && (
        <div className="py-4 bg-white">
          <FeaturedCarousel
            products={products}
            addToCart={addToCart}
            title="Los Mixes y Productos que Más Rotan"
            subtitle="Precios preferenciales por kilogramo y bulto cerrado con entrega inmediata."
          />
        </div>
      )}

      {/* 4. SECCIÓN DE CATÁLOGO DIRECTO DE PRODUCTOS CON FILTROS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-4 border-b border-gray-200">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#76A33E]/10 text-[#76A33E] text-xs font-bold uppercase tracking-wider mb-2">
              <span className="w-2 h-2 rounded-full bg-[#76A33E] animate-pulse" />
              Catálogo Mayorista Mix Point
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
              Nuestros Productos por Mayor
            </h2>
            <p className="text-sm md:text-base text-gray-500 mt-1">
              Seleccioná el formato que necesitás (1kg, 5kg, 10kg, 25kg) y agregalo directo a tu pedido.
            </p>
          </div>

          {/* Buscador Integrado en la Grilla */}
          <div className="w-full md:w-72">
            <div className="relative">
              <input
                type="text"
                value={filtroTexto}
                onChange={(e) => setFiltroTexto(e.target.value)}
                placeholder="Filtrar por nombre..."
                className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 rounded-lg border border-gray-300 focus:border-[#76A33E] focus:outline-none focus:bg-white"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                🔍
              </span>
            </div>
          </div>
        </div>

        {/* Píldoras de Categorías con Acento Verde Oliva (#76A33E) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-thin">
          {CATEGORIAS_RAPIDAS.map((cat) => {
            const isSelected = categoriaActiva === cat;
            return (
              <button
                key={cat}
                onClick={() => setCategoriaActiva(cat)}
                className={`whitespace-nowrap px-4 py-2 rounded-lg text-xs md:text-sm font-bold transition-all duration-150 ${
                  isSelected
                    ? 'bg-[#76A33E] text-white shadow-sm shadow-[#76A33E]/30 scale-[1.02]'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200/80'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Grilla de Productos */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="inline-block w-8 h-8 border-4 border-gray-200 border-t-[#76A33E] rounded-full animate-spin mb-3" />
            <p className="text-sm text-gray-500">Cargando catálogo mayorista actualizado...</p>
          </div>
        ) : productosMuestra.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {productosMuestra.map((p) => (
                <ProductCard key={p.id} product={p} addToCart={addToCart} />
              ))}
            </div>

            {/* Botón Ver Más Productos */}
            <div className="mt-12 text-center">
              <button
                onClick={handleVerMas}
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gray-900 hover:bg-[#76A33E] text-white font-bold text-sm md:text-base transition-all duration-200 shadow-md hover:scale-105"
              >
                <span>Ver catálogo completo ({products.length} productos)</span>
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </>
        ) : (
          <div className="py-16 text-center bg-gray-50 rounded-2xl border border-gray-200">
            <span className="text-4xl block mb-2">🥜</span>
            <h3 className="text-base font-bold text-gray-800">No encontramos productos en esta búsqueda</h3>
            <p className="text-xs text-gray-500 mt-1 mb-4">
              Probá seleccionando otra categoría o limpiando el filtro.
            </p>
            <button
              onClick={() => {
                setCategoriaActiva('Todos');
                setFiltroTexto('');
              }}
              className="px-4 py-2 bg-[#76A33E] text-white text-xs font-bold rounded-lg"
            >
              Restablecer filtros
            </button>
          </div>
        )}
      </section>

      {/* 5. SECCIÓN B2B: ABASTECIMIENTO A DIETÉTICAS, GASTRONOMÍA & COMERCIOS */}
      <section className="w-full bg-[#1b2e24] text-white py-14 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#76A33E]/30 text-[#a3d968] text-xs font-bold uppercase tracking-wider mb-4">
              Atención Comercial Directa
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
              Abastecemos tu dietética, fábrica de alfajores, panadería o restaurante
            </h2>
            <p className="text-gray-300 mt-4 text-base leading-relaxed">
               Te ofrecemos lista de precios mayorista actualizada semanalmente, trazabilidad de lotes y entregas coordinadas sin seña previa.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <a
                href={`https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(
                  '¡Hola Mix Point! Tengo un comercio y quisiera recibir la lista de precios mayorista por bulto cerrado.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-[#76A33E] hover:bg-[#689136] text-white font-bold rounded-xl shadow-lg transition-all text-sm md:text-base"
              >
                <span>💬</span> Solicitar Lista Mayorista ({WHATSAPP_DISPLAY})
              </a>

              <Link
                to="/contacto"
                className="inline-flex items-center justify-center px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 transition-all text-sm md:text-base"
              >
                Formulario de Contacto
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
              <div className="text-2xl mb-2">🌰</div>
              <h4 className="font-bold text-base text-white">Nueces & Almendras</h4>
              <p className="text-xs text-gray-300 mt-1">
                Chandler Extra Light, Guara y Nonpareil de origen mendocino y chileno.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
              <div className="text-2xl mb-2">🍇</div>
              <h4 className="font-bold text-base text-white">Mixes a Granel</h4>
              <p className="text-xs text-gray-300 mt-1">
                Elaboración artesanal propia con máxima rotación para tu mostrador.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
              <div className="text-2xl mb-2">🌾</div>
              <h4 className="font-bold text-base text-white">Semillas & Harinas</h4>
              <p className="text-xs text-gray-300 mt-1">
                Chía, lino, sésamo, harina de almendras y avena tradicional pura.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
              <div className="text-2xl mb-2">🍫</div>
              <h4 className="font-bold text-base text-white">Chocolates & Drops</h4>
              <p className="text-xs text-gray-300 mt-1">
                Chips semiamargos, cacao alcalino y materia prima para repostería.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
export default Home;
