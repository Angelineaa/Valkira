import { useStore } from '../context/StoreContext';
import '../styles/valkira-cart.css';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Cart() {
  const { cart, updateItemQuantity, removeItem, loadCart } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    loadCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="vk-cart-page">
      <h1>Carrito de compras</h1>
      <div className="vk-cart-grid">
        <div className="vk-cart-items">
          {cart.items.length === 0 ? (
            <p>Tu carrito está vacío.</p>
          ) : (
            cart.items.map((it) => (
              <div className="vk-cart-item" key={it.id}>
                <div className="vk-cart-item-media">
                  {it.imageUrl ? <img src={it.imageUrl} alt={it.name} /> : <div className="img-placeholder">Sin imagen</div>}
                </div>
                <div className="vk-cart-item-body">
                  <h3>{it.name}</h3>
                  <p className="meta">Talla: {it.size || '—'} • Color: {it.color || '—'}</p>
                  <div className="qty-row">
                    <label>Cantidad</label>
                    <input type="number" min="1" value={it.quantity} onChange={(e) => updateItemQuantity(it.id, parseInt(e.target.value || '1', 10))} />
                  </div>
                </div>
                <div className="vk-cart-item-actions">
                  <p className="price">${(it.unitPrice || 0).toLocaleString()}</p>
                  <button className="btn-ghost" onClick={() => removeItem(it.id)}>Eliminar</button>
                </div>
              </div>
            ))
          )}
        </div>

        <aside className="vk-cart-summary">
          <h2>Resumen</h2>
          <div className="summary-row"><span>Subtotal</span><span>${(cart.subtotal || 0).toLocaleString()}</span></div>
          <div className="summary-row"><span>Impuestos</span><span>${(cart.tax || 0).toLocaleString()}</span></div>
          <div className="summary-row"><span>Envío</span><span>${(cart.shipping || 0).toLocaleString()}</span></div>
          <div className="summary-total"><span>Total</span><strong>${(cart.total || 0).toLocaleString()}</strong></div>
          <button className="btn-primary" onClick={() => navigate('/checkout')}>Ir a pagar</button>
        </aside>
      </div>
    </div>
  );
}
