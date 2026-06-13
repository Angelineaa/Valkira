import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/valkira-cart.css';
import { API_BASE } from '../services/api';

export default function OrderConfirmation() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      const token = localStorage.getItem('token');
      if (!token) { navigate('/login'); return; }
      try {
        const res = await fetch(`${API_BASE}/api/orders/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        if (res.ok) {
          setOrder(await res.json());
        } else if (res.status === 401) {
          const txt = await res.text();
          setError(txt || 'No autorizado. Revisa tu sesión o intenta ingresar de nuevo.');
        } else {
          const txt = await res.text();
          setError(txt || `Error ${res.status} al cargar pedido`);
        }
      } catch (e) {
        setError('Error de red al cargar pedido');
      }
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (!order && !error) return <div className="vk-cart-page"><p>Cargando pedido...</p></div>;

  if (error) return <div className="vk-cart-page"><p className="error-message">{error}</p></div>;

  return (
    <div className="vk-cart-page">
      <h1>Confirmación de pedido #{order.orderId || order.id}</h1>
      <p>Estado: {order.status}</p>
      <div>
        <h3>Items</h3>
        {order.items.map((it, index) => (
          <div key={it.productId || index} style={{ borderBottom: '1px solid #eee', padding: 8 }}>
            <div>Producto: {it.productId}</div>
            <div>Cantidad: {it.quantity}</div>
            <div>Precio unitario: ${it.unitPrice}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 16 }}>
        <div>Subtotal: ${order.subtotal}</div>
        <div>Impuestos: ${order.tax}</div>
        <div>Envío: ${order.shippingCost}</div>
        <div><strong>Total: ${order.total}</strong></div>
      </div>
    </div>
  );
}
