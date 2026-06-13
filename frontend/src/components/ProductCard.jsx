import { Link } from 'react-router-dom';

export default function ProductCard({ prod }) {
  const nombre = prod.nombre || prod.name || 'Producto';
  const imagen = prod.imagen || prod.imageUrl || null;
  const precioAntes = prod.precioAntes ?? prod.originalPrice ?? null;
  const precio = prod.precio ?? prod.price ?? 0;
  const categoria = prod.categoria || prod.category || 'Sin categoría';
  const status = prod.status || prod.estado || '';
  const productId = prod.id || prod.productId;

  return (
    <article className="product-card">
      <div className="product-img">
        {imagen ? <img src={imagen} alt={nombre} /> : <div className="product-img-placeholder">Sin imagen</div>}
        <div className="product-badges">
          {status && <span className={`badge ${status === 'oferta' ? 'badge-sale' : 'badge-new'}`}>{status}</span>}
        </div>
      </div>
      <div className="product-info">
        <p className="product-category">{categoria}</p>
        <p className="product-name">{nombre}</p>
        <div className="product-bottom">
          <p className="product-price">{precioAntes ? <span className="product-price-old">${precioAntes.toLocaleString()}</span> : null}${precio.toLocaleString()}</p>
          <div className="product-actions">
            <Link to={`/producto/${productId}`} className="btn-view">Ver</Link>
          </div>
        </div>
      </div>
    </article>
  );
}
