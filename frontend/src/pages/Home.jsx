import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { PRODUCTOS } from '../data/valkira-products';
import { getRecommendations } from '../services/api';
import '../styles/valkira-home.css';

const mapApiProduct = (product) => {
  if (!product) return null;
  return {
    id: product.id,
    nombre: product.name || product.nombre || 'Producto',
    precio: product.price || product.precio || 0,
    imagen: product.imageUrl || product.imagen || null,
    categoria: product.category || product.categoria || 'Sin categoría',
    descripcion: product.description || product.descripcion || 'Descripción no disponible.',
    status: product.status || product.estado || null,
    recommendationReason: product.recommendationReason || '',
  };
};

export default function Home() {
  const navigate = useNavigate();
  const [recommended, setRecommended] = useState([]);
  const [recommendationsLoading, setRecommendationsLoading] = useState(false);
  const [recommendationsError, setRecommendationsError] = useState('');
  const featured = useMemo(() => PRODUCTOS.slice(0, 3), []);
  const isLoggedIn = !!localStorage.getItem('token');

  const goToCatalog = (categoria) => {
    navigate(categoria ? `/catalogo?cat=${categoria}` : '/catalogo');
  };

  const { favorites, toggleFavorite } = useStore();

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }

    async function loadRecommendations() {
      setRecommendationsLoading(true);
      setRecommendationsError('');
      try {
        const items = await getRecommendations();
        setRecommended(items.map(mapApiProduct).filter(Boolean));
      } catch (err) {
        setRecommendationsError('No se pudieron cargar las recomendaciones');
      } finally {
        setRecommendationsLoading(false);
      }
    }

    loadRecommendations();
  }, [isLoggedIn]);

  return (
    <div className="vk-home-page">
      <section className="hero">
        <div className="hero-left">
          <p className="hero-eyebrow">Nueva colección — Otoño 2026</p>
          <h1 className="hero-title">
            Moda que<br />
            te <em>define,</em><br />
            no te limita.
          </h1>
          <p className="hero-desc">
            Piezas cuidadosamente seleccionadas para la mujer que vive con intención.
            Cada prenda, una declaración.
          </p>
          <div className="hero-cta">
            <button className="btn-primary" onClick={() => goToCatalog()}>Ver catálogo</button>
            <button className="btn-ghost" onClick={() => navigate('/nosotros')}>Nuestra historia</button>
          </div>
        </div>
        <div className="hero-right">
          <div className="hero-image-placeholder">
            <img src="/img/vestido_atardecer.jpg" alt="Look principal Valkira" />
          </div>
          <div className="hero-badge">
            <p>piezas disponibles</p>
            <strong>+340</strong>
          </div>
        </div>
      </section>

      <div className="marquee-strip" aria-hidden="true">
        <div className="marquee-inner">
          <span className="marquee-item">Envío gratis +$150k</span><span className="marquee-dot"> ✦ </span>
          <span className="marquee-item">Nueva colección disponible</span><span className="marquee-dot"> ✦ </span>
          <span className="marquee-item">Tallas XS – XXL</span><span className="marquee-dot"> ✦ </span>
          <span className="marquee-item">Devoluciones sin costo</span><span className="marquee-dot"> ✦ </span>
          <span className="marquee-item">Pagos en cuotas</span><span className="marquee-dot"> ✦ </span>
        </div>
      </div>

      {isLoggedIn && (
        <section className="section recommendations-section">
          <div className="section-header">
            <h2 className="section-title">Tus recomendaciones personalizadas</h2>
            <button className="section-link" onClick={() => goToCatalog()}>Ver catálogo</button>
          </div>

          {recommendationsLoading ? (
            <p className="recommendation-loading">Cargando recomendaciones...</p>
          ) : recommendationsError ? (
            <p className="recommendation-error">{recommendationsError}</p>
          ) : (
            <div className="recommendations-grid">
              {recommended.length ? (
                recommended.slice(0, 4).map((product) => (
                  <div key={product.id} className="recommendation-card" onClick={() => navigate(`/producto/${product.id}`)}>
                    {product.imagen ? <img src={product.imagen} alt={product.nombre} /> : <div className="product-img-placeholder">Sin imagen</div>}
                    <div className="recommendation-info">
                      <p className="recommendation-name">{product.nombre}</p>
                      <strong className="recommendation-price">${product.precio.toLocaleString()}</strong>
                      {product.recommendationReason ? <p className="recommendation-reason">{product.recommendationReason}</p> : null}
                    </div>
                  </div>
                ))
              ) : (
                <p className="recommendation-empty">Actualiza tus preferencias para obtener recomendaciones personalizadas.</p>
              )}
            </div>
          )}
        </section>
      )}

      <section className="section categories-section">
        <div className="section-header">
          <h2 className="section-title">Explorar por categoría</h2>
          <button className="section-link" onClick={() => goToCatalog()}>Ver todo</button>
        </div>
        <div className="categories-grid">
          <div className="cat-card" onClick={() => goToCatalog('vestidos')}>
            <p className="cat-number">01</p>
            <p className="cat-name">Vestidos</p>
            <p className="cat-count">48 prendas</p>
            <span className="cat-arrow">→</span>
          </div>
          <div className="cat-card" onClick={() => goToCatalog('blusas')}>
            <p className="cat-number">02</p>
            <p className="cat-name">Blusas & Tops</p>
            <p className="cat-count">72 prendas</p>
            <span className="cat-arrow">→</span>
          </div>
          <div className="cat-card" onClick={() => goToCatalog('faldas')}>
            <p className="cat-number">03</p>
            <p className="cat-name">Faldas</p>
            <p className="cat-count">29 prendas</p>
            <span className="cat-arrow">→</span>
          </div>
          <div className="cat-card" onClick={() => goToCatalog('accesorios')}>
            <p className="cat-number">04</p>
            <p className="cat-name">Accesorios</p>
            <p className="cat-count">61 prendas</p>
            <span className="cat-arrow">→</span>
          </div>
        </div>
      </section>

      <section className="featured">
        <div className="section-header">
          <h2 className="section-title">Destacados de la semana</h2>
          <button className="section-link" onClick={() => goToCatalog()}>Ver catálogo completo</button>
        </div>
        <div className="products-grid">
          {featured.map((product) => (
            <div key={product.id} className="product-card" onClick={() => goToCatalog()}>
              <div className="product-img">
                <span className={`product-tag ${product.status === 'oferta' ? 'sale' : ''}`}>
                  {product.status === 'oferta' ? '−20%' : 'Nuevo'}
                </span>
                {product.imagen ? (
                  <img src={product.imagen} alt={product.nombre} />
                ) : (
                  <div className="product-img-placeholder">Sin imagen</div>
                )}
              </div>
              <div className="product-info">
                <p className="product-name">{product.nombre}</p>
                <div className="product-meta">
                  <p className="product-price">
                    {product.precioAntes ? <span>${product.precioAntes.toLocaleString()}</span> : null}
                    ${product.precio.toLocaleString()}
                  </p>
                  <button className="product-fav" aria-label="Guardar en favoritos" onClick={(e) => { e.stopPropagation(); toggleFavorite(product); }}>
                    {favorites.find((f) => f.id === product.id || f.productId === product.id) ? '♥' : '♡'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {!isLoggedIn && (
        <section className="banner banner-compact">
          <button className="btn-light" onClick={() => navigate('/register')}>Crear mi cuenta</button>
        </section>
      )}
    </div>
  );
}
