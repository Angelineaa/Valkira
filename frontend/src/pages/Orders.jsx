import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_BASE, getOrders } from '../services/api';
import '../styles/valkira-orders.css';

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'pending':
    case 'pendiente':
      return '#f59e0b';
    case 'confirmed':
    case 'confirmado':
      return '#3b82f6';
    case 'delivered':
    case 'entregado':
      return '#10b981';
    case 'cancelled':
    case 'cancelado':
      return '#ef4444';
    default:
      return '#6b7280';
  }
};

const getStatusLabel = (status) => {
  const statusMap = {
    'pending': 'Pendiente',
    'confirmed': 'Confirmado',
    'shipped': 'Enviado',
    'delivered': 'Entregado',
    'cancelled': 'Cancelado',
    'pendiente': 'Pendiente',
    'confirmado': 'Confirmado',
    'enviado': 'Enviado',
    'entregado': 'Entregado',
    'cancelado': 'Cancelado',
  };
  return statusMap[status?.toLowerCase()] || status || 'Pendiente';
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function loadOrders() {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }
        const res = await fetch(`${API_BASE}/api/orders`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 401) {
          const txt = await res.text();
          setError(txt || 'No autorizado. Revisa tu sesión o intenta ingresar de nuevo.');
          return;
        }
        if (!res.ok) {
          const txt = await res.text();
          setError(txt || `Error ${res.status} al cargar pedidos`);
          return;
        }
        const data = await res.json();
        setOrders(data || []);
      } catch (err) {
        setError(err.message || 'Error al cargar pedidos');
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="orders-container">
        <div className="orders-header">
          <h1>Mis Pedidos</h1>
        </div>
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Cargando tus pedidos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="orders-container">
        <div className="orders-header">
          <h1>Mis Pedidos</h1>
        </div>
        <div className="error-state">
          <p className="error-message">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <div className="orders-header">
        <h1>Mis Pedidos</h1>
        <p className="orders-count">{orders.length} {orders.length === 1 ? 'pedido' : 'pedidos'}</p>
      </div>

      {orders.length === 0 ? (
        <div className="empty-state">
          <h2>No tienes pedidos aún</h2>
          <p>Cuando realices tu primer compra, aparecerá aquí</p>
          <Link to="/catalogo" className="btn-primary">
            Ver Catálogo
          </Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-item">
              <div className="order-item-left">
                <div className="order-header-row">
                  <div className="order-number">
                    <span className="label">Pedido</span>
                    <span className="value">#{order.id}</span>
                  </div>
                  <div 
                    className="order-status"
                    style={{ backgroundColor: getStatusColor(order.status) + '20', borderLeft: `4px solid ${getStatusColor(order.status)}` }}
                  >
                    <span className="status-badge" style={{ color: getStatusColor(order.status) }}>
                      {getStatusLabel(order.status)}
                    </span>
                  </div>
                </div>

                <div className="order-info-grid">
                  <div className="info-item">
                    <span className="info-label">Fecha</span>
                    <span className="info-value">
                      {new Date(order.createdAt).toLocaleDateString('es-CO', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>

                  <div className="info-item">
                    <span className="info-label">Artículos</span>
                    <span className="info-value">
                      {order.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0}
                    </span>
                  </div>

                  <div className="info-item">
                    <span className="info-label">Envío</span>
                    <span className="info-value">
                      ${parseFloat(order.shippingCost || 0).toFixed(2)}
                    </span>
                  </div>

                  <div className="info-item">
                    <span className="info-label">Total</span>
                    <span className="info-value total">
                      ${parseFloat(order.total || 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="order-item-right">
                <Link to={`/order/${order.id}`} className="btn-view-details">
                  Ver Detalle →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
