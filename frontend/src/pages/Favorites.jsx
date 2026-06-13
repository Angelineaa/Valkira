import { useStore } from '../context/StoreContext';
import '../styles/valkira-favorites.css';
import { useEffect } from 'react';

export default function Favorites() {
  const { favorites, moveFavoriteToCart, toggleFavorite, loadFavorites } = useStore();

  useEffect(() => {
    loadFavorites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="vk-favs-page">
      <h1>Favoritos</h1>
      <div className="vk-favs-grid">
        {favorites.length === 0 ? (
          <p>No tienes productos en favoritos.</p>
        ) : (
          favorites.map((p) => (
            <div className="vk-fav-card" key={p.id || p.productId}>
              <div className="img-wrap">
                {p.imageUrl ? <img src={p.imageUrl} alt={p.name} /> : <div className="img-placeholder">Sin imagen</div>}
              </div>
              <div className="fav-body">
                <h3>{p.name}</h3>
                <p className="price">${(p.price || p.unitPrice || 0).toLocaleString()}</p>
                <div className="fav-actions">
                  <button className="btn-ghost" onClick={() => moveFavoriteToCart(p)}>Agregar al carrito</button>
                  <button className="btn-ghost" onClick={() => toggleFavorite(p)}>Quitar</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
