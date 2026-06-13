import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { useStore } from '../context/StoreContext';
import { PRODUCTOS, getProductoById as getLocalProductoById } from '../data/valkira-products';
import '../styles/valkira-producto.css';
import { API_BASE, getRecommendations, recordProductView } from '../services/api';

function mapApiProduct(product) {
  if (!product) return null;
  return {
    id: product.id,
    nombre: product.name || product.nombre || 'Producto',
    precio: product.price || product.precio || 0,
    precioAntes: product.originalPrice || product.precioAntes || null,
    imagen: product.imageUrl || product.imagen || null,
    categoria: product.category || product.categoria || 'Sin categoría',
    descripcion: product.description || product.descripcion || 'Descripción no disponible.',
    material: product.material || product.material || 'Material no especificado',
    tallas: product.sizes || product.tallas || [],
    status: product.status || product.estado || null,
  };
}

export default function Producto(){
  const { id } = useParams();
  const navigate = useNavigate();
  const [prod, setProd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('Negro');
  const [qty, setQty] = useState(1);
  const [openSections, setOpenSections] = useState({ descripcion: true, cuidados: false, envio: false });
  const [recommended, setRecommended] = useState([]);
  const [recommendationsLoading, setRecommendationsLoading] = useState(false);
  const [recommendError, setRecommendError] = useState('');

  const { favorites, addToCart, toggleFavorite } = useStore();
  const isLoggedIn = !!localStorage.getItem('token');

  useEffect(() => {
    async function loadProduct() {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/products/${id}`);
        if (res.ok) {
          const data = await res.json();
          const apiProduct = mapApiProduct(data);
          const categoryKey = apiProduct?.categoria?.toLowerCase?.() || '';
          const isApiAccessory = ['accesorios', 'accessories'].includes(categoryKey);
          if ((!Array.isArray(apiProduct?.tallas) || apiProduct.tallas.length === 0) && !isApiAccessory) {
            const local = getLocalProductoById(id);
            if (local?.tallas?.length) {
              apiProduct.tallas = local.tallas;
            }
          }
          setProd(apiProduct);
        } else {
          const local = getLocalProductoById(id);
          setProd(local || null);
        }
      } catch (error) {
        const local = getLocalProductoById(id);
        setProd(local || null);
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [id]);

  const categoryKey = prod?.categoria?.toLowerCase?.() || '';
  const isAccessory = ['accesorios', 'accessories'].includes(categoryKey);
  const productSizes = Array.isArray(prod?.tallas)
    ? prod.tallas
    : typeof prod?.tallas === 'string'
      ? prod.tallas.split(',').map((size) => size.trim()).filter(Boolean)
      : [];
  const hasSizeOptions = productSizes.length > 0;

  useEffect(() => {
    if (!prod) return;
    if (hasSizeOptions && !isAccessory) {
      setSelectedSize(productSizes[0]);
    } else if (isAccessory) {
      setSelectedSize('Única');
    } else {
      setSelectedSize('');
    }
  }, [prod, hasSizeOptions, isAccessory, productSizes]);

  useEffect(() => {
    if (!prod || !isLoggedIn) {
      return;
    }

    async function recordAndLoad() {
      try {
        await recordProductView(prod.id);
      } catch (err) {
        // ignore errors for view registration
      }

      try {
        setRecommendationsLoading(true);
        setRecommendError('');
        const items = await getRecommendations();
        setRecommended(items.map(mapApiProduct).filter(Boolean));
      } catch (err) {
        setRecommendError('No se pudieron cargar las recomendaciones');
      } finally {
        setRecommendationsLoading(false);
      }
    }

    recordAndLoad();
  }, [prod, isLoggedIn]);

  const related = useMemo(
    () => (recommended.length ? recommended : PRODUCTOS.filter((p) => p.id !== prod?.id).slice(0, 4)),
    [recommended, prod],
  );

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const isFavorite = favorites.some((f) => f.id === prod?.id || f.productId === prod?.id);

  const handleBuyNow = async () => {
    const added = await addToCart({ productId: prod.id, size: selectedSize, color: selectedColor, quantity: qty, unitPrice: prod.precio, name: prod.nombre, imageUrl: prod.imagen });
    if (added) {
      navigate('/checkout');
    }
  };

  if (loading) return <div className="product-loading">Cargando producto...</div>;
  if (!prod) return <div className="product-missing">Producto no encontrado</div>;

  return (
    <div className="vk-product-page">
      <div className="breadcrumb">
        <Link to="/">Inicio</Link>
        <span>/</span>
        <Link to="/catalogo">Catálogo</Link>
        <span>/</span>
        <span id="bc-nombre">{prod.nombre}</span>
      </div>

      <div className="product-layout">
        <div className="gallery">
          <div className="product-img">
            {prod.imagen ? <img src={prod.imagen} alt={prod.nombre} /> : <div className="product-img-placeholder">Sin imagen</div>}
          </div>
          <div className="thumbs" id="thumbs">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className={`thumb ${item === 1 ? 'active' : ''}`}>
                <span className="thumb-placeholder">vista {item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="product-info">
          <p className="product-category">{prod.categoria || '—'}</p>
          <h1 className="product-name">{prod.nombre}</h1>

          <div className="product-rating">
            <span className="stars">★★★★☆</span>
            <span className="rating-text">4.2 · 18 reseñas</span>
          </div>

          <div className="product-price-block">
            <span className="price-main">${prod.precio.toLocaleString()}</span>
          </div>

          <div>
            <div className="section-label">
              Talla <span className="guia-link">Guía de tallas</span>
            </div>
            <div className="sizes-grid">
              {hasSizeOptions && !isAccessory ? (
                productSizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    className={`size-dot ${selectedSize === size ? 'selected' : ''}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))
              ) : (
                <span className="size-dot selected">Única</span>
              )}
            </div>
          </div>

          <div>
            <div className="section-label">Color — <span id="color-nombre">{selectedColor}</span></div>
            <div className="colors-row">
              {[
                { color: '#1A1A1A', label: 'Negro' },
                { color: '#C4998A', label: 'Blush' },
                { color: '#F0EDE7', label: 'Hueso' },
                { color: '#6B6560', label: 'Gris cálido' },
              ].map((item) => (
                <button
                  key={item.label}
                  type="button"
                  className={`color-dot ${selectedColor === item.label ? 'selected' : ''}`}
                  style={{ background: item.color }}
                  onClick={() => setSelectedColor(item.label)}
                  title={item.label}
                />
              ))}
            </div>
          </div>

          <div className="qty-row">
            <span className="qty-label">Cantidad</span>
            <div className="qty-control">
              <button type="button" className="qty-btn" onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
              <input className="qty-display" type="number" value={qty} readOnly />
              <button type="button" className="qty-btn" onClick={() => setQty((q) => Math.min(10, q + 1))}>+</button>
            </div>
          </div>

          <div className="cta-row">
            <button className="btn-cart" type="button" onClick={() => addToCart({ productId: prod.id, size: selectedSize, color: selectedColor, quantity: qty, unitPrice: prod.precio, name: prod.nombre, imageUrl: prod.imagen })}>Agregar al carrito</button>
            <button className={`btn-fav ${isFavorite ? 'active' : ''}`} type="button" aria-label="Guardar en favoritos" onClick={() => toggleFavorite(prod)}>
              {isFavorite ? '♥' : '♡'} Favoritos
            </button>
          </div>
          <button className="btn-buy" type="button" onClick={handleBuyNow}>Comprar ahora</button>

          <div className="guarantees">
            <div className="guarantee-item">
              <div className="guarantee-icon">🚚</div>
              <div className="guarantee-text">Envío gratis<br />desde $150.000</div>
            </div>
            <div className="guarantee-item">
              <div className="guarantee-icon">↩</div>
              <div className="guarantee-text">Devolución<br />sin costo</div>
            </div>
            <div className="guarantee-item">
              <div className="guarantee-icon">🔒</div>
              <div className="guarantee-text">Pago 100%<br />seguro</div>
            </div>
          </div>

          <div className="accordion">
            <div className="accordion-item">
              <button type="button" className="accordion-header" onClick={() => toggleSection('descripcion')}>
                Descripción
                <span className="accordion-icon">{openSections.descripcion ? '−' : '+'}</span>
              </button>
              {openSections.descripcion && (
                <div className="accordion-body" id="desc-body">
                  <p>{prod.descripcion}</p>
                </div>
              )}
            </div>
            <div className="accordion-item">
              <button type="button" className="accordion-header" onClick={() => toggleSection('cuidados')}>
                Composición y cuidados
                <span className="accordion-icon">{openSections.cuidados ? '−' : '+'}</span>
              </button>
              {openSections.cuidados && (
                <div className="accordion-body">
                  <table className="specs-table">
                    <tbody>
                      <tr><td>Material</td><td>{prod.material || '—'}</td></tr>
                      <tr><td>Lavado</td><td>Lavar a mano o en ciclo delicado</td></tr>
                      <tr><td>Secado</td><td>No usar secadora</td></tr>
                      <tr><td>Planchado</td><td>Temperatura baja</td></tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            <div className="accordion-item">
              <button type="button" className="accordion-header" onClick={() => toggleSection('envio')}>
                Envío y devoluciones
                <span className="accordion-icon">{openSections.envio ? '−' : '+'}</span>
              </button>
              {openSections.envio && (
                <div className="accordion-body">
                  <p>Envío estándar 3–5 días hábiles. Envío gratis en pedidos superiores a $150.000.</p>
                  <p>Devoluciones gratuitas dentro de los 15 días siguientes a la recepción del pedido.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <section className="related">
        <div className="section-header">
          <h2 className="section-title">También te puede gustar</h2>
          <Link to="/catalogo" className="section-link">Ver catálogo</Link>
        </div>
        <div className="related-grid" id="related-grid">
          {related.map((item) => (
            <Link key={item.id} to={`/producto/${item.id}`} className="related-card">
              {item.imagen ? <img src={item.imagen} alt={item.nombre} /> : <div className="product-img-placeholder">Sin imagen</div>}
              <div className="related-info">
                <p>{item.nombre}</p>
                <strong>${item.precio.toLocaleString()}</strong>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
