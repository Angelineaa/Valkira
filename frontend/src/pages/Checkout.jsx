import React, { useEffect, useState, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import '../styles/valkira-cart.css';
import { useNavigate } from 'react-router-dom';
import { API_BASE } from '../services/api';

export default function Checkout() {
  const { cart, loadCart } = useStore();
  const [addresses, setAddresses] = useState([]);
  const [selected, setSelected] = useState(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ country: '', state: '', city: '', addressLine1: '', addressLine2: '', postalCode: '', references: '' });
  const [paymentMethod, setPaymentMethod] = useState('CREDIT_CARD');
  const [paymentDetails, setPaymentDetails] = useState({ cardNumber: '', cardHolder: '', expiry: '', cvv: '', bank: '', documentType: 'CC', documentNumber: '' });
  const [paymentErrors, setPaymentErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [creatingLoading, setCreatingLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [serverError, setServerError] = useState(null);
  const [createdMessage, setCreatedMessage] = useState(null);
  const [paymentMessage, setPaymentMessage] = useState(null);
  const navigate = useNavigate();
  const firstInputRef = useRef(null);

  useEffect(() => {
    async function load() {
      const token = localStorage.getItem('token');
      if (!token) { navigate('/login'); return; }
      const res = await fetch(`${API_BASE}/api/addresses`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        const addresses = await res.json();
        setAddresses(addresses);
        if (!selected && addresses.length > 0) {
          setSelected(addresses[0].id);
        }
      }
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (creating) {
      setTimeout(() => firstInputRef.current && firstInputRef.current.focus(), 50);
    }
  }, [creating]);

  function handleChange(e) { setForm({ ...form, [e.target.name]: e.target.value }); }
  function handlePaymentChange(e) { setPaymentDetails({ ...paymentDetails, [e.target.name]: e.target.value }); }

  function validateAddressPayload(payload) {
    const errs = {};
    if (!payload.addressLine1 || payload.addressLine1.trim().length < 3) errs.addressLine1 = 'Dirección inválida';
    if (!payload.city || payload.city.trim().length < 2) errs.city = 'Ciudad requerida';
    if (!payload.country || payload.country.trim().length < 2) errs.country = 'País requerido';

    const postal = payload.postalCode ? payload.postalCode.trim() : '';
    const country = (payload.country || '').toLowerCase();
    let ok = true;
    if (country.includes('chile')) {
      ok = /^[0-9]{7}$/.test(postal);
    } else if (country.includes('espa') || country.includes('spain')) {
      ok = /^[0-9]{5}$/.test(postal);
    } else if (country.includes('arg') || country.includes('argentina')) {
      ok = /^[0-9]{4,8}$/.test(postal);
    } else if (country.includes('usa') || country.includes('united') || country.includes('estados')) {
      ok = /^[0-9]{5}(-[0-9]{4})?$/.test(postal);
    } else {
      ok = /^[0-9A-Za-z\-\s]{3,10}$/.test(postal);
    }

    if (!postal || !ok) errs.postalCode = 'Código postal inválido para el país elegido';
    return errs;
  }

  async function createAddress() {
    const errs = validateAddressPayload(form);
    setFormErrors(errs);
    if (Object.keys(errs).length) return;
    setCreatingLoading(true);
    setServerError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/api/addresses`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(form) });
      const respText = await res.text();
      try { console.debug('POST /api/addresses status:', res.status, 'body:', respText); } catch (e) { /* ignore */ }
      if (res.ok) {
        const a = JSON.parse(respText || '{}');
        setAddresses((s) => [...s, a]);
        setSelected(a.id);
        setCreating(false);
        setForm({ country: '', state: '', city: '', addressLine1: '', addressLine2: '', postalCode: '', references: '' });
        setCreatedMessage('Dirección guardada');
        setTimeout(() => setCreatedMessage(null), 3000);
      } else {
        const msg = `Error ${res.status}: ${respText || res.statusText}`;
        console.error(msg);
        setServerError(msg);
      }
    } catch (e) {
      setServerError('Error de red');
    } finally {
      setCreatingLoading(false);
    }
  }

  function validatePaymentDetails() {
    const errs = {};
    if (paymentMethod === 'CREDIT_CARD' || paymentMethod === 'DEBIT_CARD') {
      if (!paymentDetails.cardNumber || !/^[0-9]{16}$/.test(paymentDetails.cardNumber.replace(/\s+/g, ''))) {
        errs.cardNumber = 'Número de tarjeta inválido';
      }
      if (!paymentDetails.cardHolder || paymentDetails.cardHolder.trim().length < 3) {
        errs.cardHolder = 'Titular inválido';
      }
      if (!paymentDetails.expiry || !/^(0[1-9]|1[0-2])\/(\d{2})$/.test(paymentDetails.expiry)) {
        errs.expiry = 'Fecha de expiración inválida (MM/AA)';
      }
      if (!paymentDetails.cvv || !/^[0-9]{3,4}$/.test(paymentDetails.cvv)) {
        errs.cvv = 'CVV inválido';
      }
    } else if (paymentMethod === 'PSE') {
      if (!paymentDetails.bank || paymentDetails.bank.trim().length < 3) {
        errs.bank = 'Banco requerido';
      }
      if (!paymentDetails.documentNumber || paymentDetails.documentNumber.trim().length < 6) {
        errs.documentNumber = 'Número de documento inválido';
      }
    }
    return errs;
  }

  function buildPaymentPayload() {
    const items = cart.items.map((it) => ({ productId: it.productId, size: it.size, color: it.color, quantity: it.quantity }));
    return { paymentMethod, items, addressId: selected };
  }

  async function simulatePayment() {
    const errs = validatePaymentDetails();
    setPaymentErrors(errs);
    if (Object.keys(errs).length) {
      setPaymentMessage(null);
      return false;
    }

    setPaymentMessage('Simulando pago...');
    await new Promise((resolve) => setTimeout(resolve, 1200));
    if (paymentMethod === 'PSE') {
      setPaymentMessage('Pago PSE simulado exitoso. Verifica tu banco para continuar.');
    } else {
      setPaymentMessage(`${paymentMethod === 'CREDIT_CARD' ? 'Tarjeta de crédito' : 'Tarjeta de débito'} validada exitosamente.`);
    }
    return true;
  }

  async function confirm() {
    setServerError(null);
    if (!selected) {
      setServerError('Selecciona o crea una dirección antes de confirmar');
      return;
    }
    if (!cart.items || cart.items.length === 0) {
      setServerError('Tu carrito está vacío. Agrega productos antes de confirmar el pedido.');
      return;
    }
    setLoading(true);
    setPaymentMessage(null);
    try {
      if (!(await simulatePayment())) {
        setLoading(false);
        setPaymentMessage('Corrige los datos de pago antes de continuar.');
        return;
      }
      const token = localStorage.getItem('token');
      if (!token) { setLoading(false); navigate('/login'); return; }
      const payload = buildPaymentPayload();
      console.debug('Checkout token present:', Boolean(token));
      console.debug('Checkout payload:', payload);
      const res = await fetch(`${API_BASE}/api/cart/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const contentType = res.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          await res.json();
        }
        try { localStorage.removeItem('vk_cart'); } catch (e) { /* ignore */ }
        await loadCart();
        navigate('/orders');
      } else if (res.status === 401 || res.status === 403) {
        const text = await res.text();
        const message = text || 'No autorizado. Por favor inicia sesión de nuevo.';
        console.warn('Checkout unauthorized', message);
        setServerError(message);
      } else {
        const text = await res.text();
        let message = 'Error al procesar pedido';
        if (text) {
          try {
            const json = JSON.parse(text);
            if (json.error) message = json.error;
            else message = JSON.stringify(json);
          } catch (err) {
            message = text;
          }
        }
        console.error('Checkout failed', res.status, message);
        setServerError(message);
      }
    } catch (e) {
      console.error(e);
      setServerError('Error de red');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="vk-cart-page">
      <h1>Checkout</h1>
      <div style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>
        Autenticado: {localStorage.getItem('token') ? 'Sí' : 'No'}
      </div>
      <div className="vk-cart-grid">
        <div className="vk-cart-items">
          <h2>Dirección de envío</h2>
          {addresses.length === 0 && !creating && <p>No tienes direcciones guardadas.</p>}
          {addresses.map((a) => (
            <div key={a.id} style={{ border: selected === a.id ? '2px solid #333' : '1px solid #ddd', padding: 8, marginBottom: 8 }} onClick={() => setSelected(a.id)}>
              <div>{a.addressLine1} {a.addressLine2}</div>
              <div>{a.city} - {a.state} - {a.country}</div>
              <div>{a.postalCode}</div>
            </div>
          ))}

          {serverError && <div className="error" style={{ color: 'crimson', marginBottom: 8 }}>{serverError}</div>}
          {createdMessage && <div style={{ color: 'green', marginBottom: 8 }}>{createdMessage}</div>}

          <div style={{ marginTop: 16, padding: 16, border: '1px solid #ddd', borderRadius: 10, background: '#fafafa' }}>
            <h3 style={{ marginTop: 0 }}>Simulación de pago</h3>
            <label style={{ display: 'block', marginBottom: 8, fontSize: 12 }}>Elige un método de pago</label>
            <select value={paymentMethod} onChange={(e) => {
              const method = e.target.value;
              setPaymentMethod(method);
              setPaymentErrors({});
              setPaymentMessage(null);
              setPaymentDetails((prev) => ({
                ...prev,
                cardNumber: method === 'PSE' ? '' : prev.cardNumber,
                cardHolder: method === 'PSE' ? '' : prev.cardHolder,
                expiry: method === 'PSE' ? '' : prev.expiry,
                cvv: method === 'PSE' ? '' : prev.cvv,
                bank: method !== 'PSE' ? '' : prev.bank,
                documentNumber: method !== 'PSE' ? '' : prev.documentNumber,
              }));
            }} style={{ width: '100%', padding: 8, marginBottom: 12 }}>
              <option value="CREDIT_CARD">Tarjeta de crédito</option>
              <option value="DEBIT_CARD">Tarjeta de débito</option>
              <option value="PSE">PSE</option>
            </select>

            {(paymentMethod === 'CREDIT_CARD' || paymentMethod === 'DEBIT_CARD') && (
              <>
                <label style={{ fontSize: 12 }}>Número de tarjeta</label>
                <input name="cardNumber" value={paymentDetails.cardNumber} onChange={handlePaymentChange} placeholder="1234 5678 9012 3456" />
                {paymentErrors.cardNumber && <div className="error">{paymentErrors.cardNumber}</div>}

                <label style={{ fontSize: 12 }}>Titular de la tarjeta</label>
                <input name="cardHolder" value={paymentDetails.cardHolder} onChange={handlePaymentChange} placeholder="Nombre del titular" />
                {paymentErrors.cardHolder && <div className="error">{paymentErrors.cardHolder}</div>}

                <div style={{ display: 'flex', gap: 8 }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: 12 }}>Expiración (MM/AA)</label>
                    <input name="expiry" value={paymentDetails.expiry} onChange={handlePaymentChange} placeholder="MM/AA" />
                    {paymentErrors.expiry && <div className="error">{paymentErrors.expiry}</div>}
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: 12 }}>CVV</label>
                    <input name="cvv" value={paymentDetails.cvv} onChange={handlePaymentChange} placeholder="123" />
                    {paymentErrors.cvv && <div className="error">{paymentErrors.cvv}</div>}
                  </div>
                </div>
              </>
            )}

            {paymentMethod === 'PSE' && (
              <>
                <label style={{ fontSize: 12 }}>Banco</label>
                <input name="bank" value={paymentDetails.bank} onChange={handlePaymentChange} placeholder="Nombre del banco" />
                {paymentErrors.bank && <div className="error">{paymentErrors.bank}</div>}

                <label style={{ fontSize: 12 }}>Tipo de documento</label>
                <select name="documentType" value={paymentDetails.documentType} onChange={handlePaymentChange} style={{ width: '100%', padding: 8, marginBottom: 12 }}>
                  <option value="CC">Cédula</option>
                  <option value="CE">Cédula de extranjería</option>
                  <option value="NIT">NIT</option>
                </select>

                <label style={{ fontSize: 12 }}>Número de documento</label>
                <input name="documentNumber" value={paymentDetails.documentNumber} onChange={handlePaymentChange} placeholder="Número de documento" />
                {paymentErrors.documentNumber && <div className="error">{paymentErrors.documentNumber}</div>}
              </>
            )}

            {paymentMessage && <div style={{ marginTop: 12, color: '#166534', background: '#ecfdf5', padding: 10, borderRadius: 8 }}>{paymentMessage}</div>}
          </div>

          {!creating ? (
            <button className="btn-ghost" onClick={() => setCreating(true)}>Agregar dirección</button>
          ) : (
            <div style={{ marginTop: 8 }}>
                  <label style={{ fontSize: 12 }}>País <span style={{ color: '#c00' }}>*</span></label>
                  <select ref={firstInputRef} name="country" value={form.country} onChange={handleChange}>
                    <option value="">Seleccionar país</option>
                    <option value="Colombia">Colombia</option>
                    <option value="USA">USA</option>
                    <option value="Mexico">Mexico</option>
                    <option value="Argentina">Argentina</option>
                    <option value="Brasil">Brasil</option>
                  </select>
              {formErrors.country && <div className="error">{formErrors.country}</div>}

              <label style={{ fontSize: 12 }}>Estado / Provincia</label>
              <input name="state" placeholder="Estado / Provincia (opcional)" value={form.state} onChange={handleChange} />

              <label style={{ fontSize: 12 }}>Ciudad <span style={{ color: '#c00' }}>*</span></label>
              <input name="city" placeholder="Ciudad" value={form.city} onChange={handleChange} />
              {formErrors.city && <div className="error">{formErrors.city}</div>}

              <label style={{ fontSize: 12 }}>Dirección <span style={{ color: '#c00' }}>*</span></label>
              <input name="addressLine1" placeholder="Ej: Calle 23 #45-67" value={form.addressLine1} onChange={handleChange} />
              {formErrors.addressLine1 && <div className="error">{formErrors.addressLine1}</div>}

              <label style={{ fontSize: 12 }}>Detalle (opcional)</label>
              <input name="addressLine2" placeholder="Piso, apto, torre (opcional)" value={form.addressLine2 || ''} onChange={handleChange} />

              <label style={{ fontSize: 12 }}>Código postal <span style={{ color: '#c00' }}>*</span></label>
              <input name="postalCode" placeholder="Ej: 755141" value={form.postalCode} onChange={handleChange} />
              {formErrors.postalCode && <div className="error">{formErrors.postalCode}</div>}

              <label style={{ fontSize: 12 }}>Referencias (opcional)</label>
              <textarea name="references" placeholder="Indicaciones para el repartidor" value={form.references} onChange={handleChange} />

              <div style={{ marginTop: 8 }}>
                <button className="btn-primary" onClick={createAddress} disabled={creatingLoading}>{creatingLoading ? 'Guardando...' : 'Guardar dirección'}</button>
                <button className="btn-ghost" onClick={() => { setCreating(false); setFormErrors({}); setServerError(null); setCreatedMessage(null); }}>Cancelar</button>
              </div>
            </div>
          )}
        </div>

        <aside className="vk-cart-summary">
          <h2>Resumen</h2>
          <div className="summary-row"><span>Subtotal</span><span>${(cart.subtotal || 0).toLocaleString()}</span></div>
          <div className="summary-row"><span>Impuestos</span><span>${(cart.tax || 0).toLocaleString()}</span></div>
          <div className="summary-row"><span>Envío</span><span>${(cart.shipping || 0).toLocaleString()}</span></div>
          <div className="summary-total"><span>Total</span><strong>${(cart.total || 0).toLocaleString()}</strong></div>
          <button className="btn-primary" onClick={confirm} disabled={loading || !selected || !cart.items || cart.items.length === 0}>{loading ? 'Procesando...' : 'Confirmar pedido'}</button>
          {!selected && <div style={{ fontSize: 12, color: '#666', marginTop: 6 }}>Selecciona una dirección para continuar.</div>}
        </aside>
      </div>
    </div>
  );
}
