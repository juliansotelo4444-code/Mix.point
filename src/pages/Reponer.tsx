import { useEffect, useState, useRef } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useCartContext } from '../context/CartContext';
import type { CartItem } from '../types';
import {
  DATOS_VACIOS,
  cargarDatosGuardados,
  guardarDatosEntrega,
} from '../utils/datosEntrega';

interface ReponerApiResponse {
  ok: boolean;
  error?: string;
  remito?: {
    id: number;
    numero: string;
    fecha: string;
    cliente_nombre: string;
    telefono: string;
    direccion: string;
    zona: string;
  };
  items?: CartItem[];
  cuponValido?: boolean;
  cupon?: {
    id: number;
    codigo: string;
    tipo_descuento: 'porcentaje' | 'monto_fijo';
    valor_descuento: number;
    valido_hasta?: string;
  } | null;
  errorCupon?: string | null;
}

export function Reponer() {
  const { pedidoId } = useParams<{ pedidoId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { replaceCart, setShowCart, setCuponDirecto, setRemitoOrigenId, cuponAplicado } = useCartContext();

  const [estado, setEstado] = useState<'cargando' | 'listo' | 'error'>('cargando');
  const [detalle, setDetalle] = useState<ReponerApiResponse | null>(null);
  const [mensajeError, setMensajeError] = useState('');
  const loadedKeyRef = useRef<string>('');

  useEffect(() => {
    const cuponParam = (searchParams.get('cupon') || '').trim().toUpperCase();
    const key = `${pedidoId || ''}|${cuponParam}`;
    if (!pedidoId || loadedKeyRef.current === key) return;
    loadedKeyRef.current = key;

    let cancelado = false;

    async function cargarReposicion() {
      setEstado('cargando');
      try {
        const url = `/api/reponer?pedidoId=${encodeURIComponent(pedidoId || '')}${cuponParam ? `&cupon=${encodeURIComponent(cuponParam)}` : ''}`;
        const resp = await fetch(url);
        const data: ReponerApiResponse = await resp.json();
        if (cancelado) return;

        if (!resp.ok || !data.ok) {
          setEstado('error');
          setMensajeError(data.error || 'No se pudo cargar tu pedido anterior.');
          return;
        }

        const loadedItems = Array.isArray(data.items) ? data.items : [];
        if (loadedItems.length > 0) {
          replaceCart(loadedItems);
        }

        if (data.remito?.id) {
          setRemitoOrigenId(data.remito.id);
        }

        if (data.cuponValido && data.cupon) {
          setCuponDirecto(data.cupon);
        }

        if (data.remito) {
          const prev = cargarDatosGuardados();
          if (!prev.telefono && !prev.nombre) {
            guardarDatosEntrega({
              ...DATOS_VACIOS,
              nombre: data.remito.cliente_nombre || '',
              telefono: data.remito.telefono || '',
              direccion: data.remito.direccion || '',
              zona: data.remito.zona || '',
            });
          }
        }

        setDetalle(data);
        setEstado('listo');
        setTimeout(() => {
          if (!cancelado && loadedItems.length > 0) {
            setShowCart(true);
          }
        }, 250);
      } catch {
        if (!cancelado) {
          setEstado('error');
          setMensajeError('Error de conexión al recuperar tu pedido.');
        }
      }
    }

    cargarReposicion();
    return () => {
      cancelado = true;
    };
  }, [pedidoId, searchParams, replaceCart, setCuponDirecto, setRemitoOrigenId, setShowCart]);

  return (
    <section style={{
      minHeight: '72vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 16px'
    }}>
      <div style={{
        maxWidth: 620,
        width: '100%',
        background: 'rgba(20, 26, 23, 0.94)',
        border: '1px solid rgba(212, 175, 55, 0.35)',
        borderRadius: 16,
        padding: '32px 24px',
        color: '#f5f2ea',
        textAlign: 'center',
        boxShadow: '0 20px 45px rgba(0, 0, 0, 0.35)'
      }}>
        {estado === 'cargando' && (
          <>
            <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🌰</div>
            <h1 style={{ fontSize: '1.5rem', margin: '0 0 8px', color: '#D4AF37' }}>
              Preparando tu reposición...
            </h1>
            <p style={{ opacity: 0.85, margin: 0 }}>
              Estamos cargando los productos de tu último pedido con los precios vigentes.
            </p>
          </>
        )}

        {estado === 'error' && (
          <>
            <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>⚠️</div>
            <h1 style={{ fontSize: '1.45rem', margin: '0 0 10px', color: '#fca5a5' }}>
              No pudimos cargar ese enlace
            </h1>
            <p style={{ opacity: 0.85, margin: '0 0 22px' }}>{mensajeError}</p>
            <button
              type="button"
              className="btn-whatsapp"
              onClick={() => navigate('/catalogo')}
            >
              Ir al Catálogo Completo
            </button>
          </>
        )}

        {estado === 'listo' && detalle && (
          <>
            <div style={{ fontSize: '2.6rem', marginBottom: 10 }}>🎉</div>
            <h1 style={{ fontSize: '1.6rem', margin: '0 0 8px', color: '#D4AF37' }}>
              ¡Hola {detalle.remito?.cliente_nombre || 'cliente'}!
            </h1>
            <p style={{ opacity: 0.9, margin: '0 0 18px', lineHeight: 1.5 }}>
              Cargamos <strong>{detalle.items?.length || 0} producto(s)</strong> de tu pedido{' '}
              <strong>#{detalle.remito?.numero}</strong> directamente en tu carrito.
            </p>

            {(detalle.cuponValido || cuponAplicado) && (
              <div style={{
                background: 'rgba(16, 185, 129, 0.14)',
                border: '1px solid rgba(16, 185, 129, 0.45)',
                color: '#a7f3d0',
                padding: '12px 14px',
                borderRadius: 10,
                marginBottom: 18,
                fontSize: '0.95rem'
              }}>
                🎟️ Cupón <strong>{(detalle.cupon || cuponAplicado)?.codigo}</strong> aplicado (
                {(detalle.cupon || cuponAplicado)?.tipo_descuento === 'monto_fijo'
                  ? `$${(detalle.cupon || cuponAplicado)?.valor_descuento.toLocaleString('es-AR')} OFF`
                  : `${(detalle.cupon || cuponAplicado)?.valor_descuento}% OFF`}
                )
              </div>
            )}

            {detalle.errorCupon && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.14)',
                border: '1px solid rgba(239, 68, 68, 0.45)',
                color: '#fca5a5',
                padding: '10px 14px',
                borderRadius: 10,
                marginBottom: 18,
                fontSize: '0.88rem'
              }}>
                ⚠️ {detalle.errorCupon} Igual tenés todos tus productos listos en el carrito.
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button
                type="button"
                className="btn-whatsapp"
                onClick={() => setShowCart(true)}
              >
                Ver mi Carrito y Confirmar Pedido 🛒
              </button>
              <button
                type="button"
                onClick={() => navigate('/catalogo')}
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(212, 175, 55, 0.4)',
                  color: '#f5f2ea',
                  borderRadius: 10,
                  padding: '11px 16px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Agregar o cambiar productos en el Catálogo
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
