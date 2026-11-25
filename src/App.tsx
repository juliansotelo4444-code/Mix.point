import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { Home } from './pages/Home';
import { Mantenimiento } from './pages/Mantenimiento';
import { MODO_MANTENIMIENTO } from './config/constants';

// Lazy loading de rutas secundarias para acelerar la carga inicial
const Catalogo = lazy(() => import('./pages/Catalogo').then(m => ({ default: m.Catalogo })));
const Nosotros = lazy(() => import('./pages/Nosotros').then(m => ({ default: m.Nosotros })));
const Contacto = lazy(() => import('./pages/Contacto').then(m => ({ default: m.Contacto })));
const Envios = lazy(() => import('./pages/Envios').then(m => ({ default: m.Envios })));
const Privacidad = lazy(() => import('./pages/Privacidad').then(m => ({ default: m.Privacidad })));
const Reponer = lazy(() => import('./pages/Reponer').then(m => ({ default: m.Reponer })));

function RouteFallback() {
  return (
    <div style={{
      minHeight: '60vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--text-muted, #666)',
      fontSize: '1rem'
    }}>
      <p>Cargando página...</p>
    </div>
  );
}

function App() {
  if (MODO_MANTENIMIENTO) {
    return <Mantenimiento />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route
            path="/catalogo"
            element={
              <Suspense fallback={<RouteFallback />}>
                <Catalogo />
              </Suspense>
            }
          />
          <Route
            path="/nosotros"
            element={
              <Suspense fallback={<RouteFallback />}>
                <Nosotros />
              </Suspense>
            }
          />
          <Route
            path="/contacto"
            element={
              <Suspense fallback={<RouteFallback />}>
                <Contacto />
              </Suspense>
            }
          />
          <Route
            path="/envios"
            element={
              <Suspense fallback={<RouteFallback />}>
                <Envios />
              </Suspense>
            }
          />
          <Route
            path="/privacidad"
            element={
              <Suspense fallback={<RouteFallback />}>
                <Privacidad />
              </Suspense>
            }
          />
          <Route
            path="/reponer/:pedidoId"
            element={
              <Suspense fallback={<RouteFallback />}>
                <Reponer />
              </Suspense>
            }
          />
          <Route path="*" element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
