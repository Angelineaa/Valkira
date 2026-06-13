import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { API_BASE } from '../services/api';

const StoreContext = createContext(null);

export function useStore() {
  return useContext(StoreContext);
}

const emptyCart = { items: [], subtotal: 0, tax: 0, shipping: 0, total: 0 };

export function StoreProvider({ children }) {
  const [cart, setCart] = useState(emptyCart);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tokenState, setTokenState] = useState(() => (typeof window !== 'undefined' ? localStorage.getItem('token') : null));
  const navigate = useNavigate();
  const location = useLocation();

  const getToken = () => (typeof window !== 'undefined' ? localStorage.getItem('token') : null);
  const token = tokenState;

  useEffect(() => {
    const handleAuthChange = () => setTokenState(getToken());
    window.addEventListener('storage', handleAuthChange);
    window.addEventListener('auth-changed', handleAuthChange);
    return () => {
      window.removeEventListener('storage', handleAuthChange);
      window.removeEventListener('auth-changed', handleAuthChange);
    };
  }, []);

  useEffect(() => {
    setTokenState(getToken());
  }, [location.pathname]);

  useEffect(() => {
    async function init() {
      if (token) {
        // sync local cart if exists
        try {
          const rawCart = localStorage.getItem('vk_cart');
          if (rawCart) {
            const parsed = JSON.parse(rawCart);
            const items = parsed.items || [];
            const syncRes = await fetch(`${API_BASE}/api/sync/cart`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
              body: JSON.stringify(items),
            });
            if (syncRes.ok) {
              localStorage.removeItem('vk_cart');
            } else {
              console.warn('sync cart failed', syncRes.status, await syncRes.text());
            }
          }
        } catch (e) {
          console.error('sync cart failed', e);
        }

        // sync local favorites if exists
        try {
          const rawFavs = localStorage.getItem('vk_favs');
          if (rawFavs) {
            const parsed = JSON.parse(rawFavs);
            const ids = parsed.map((f) => f.id || f.productId).filter(Boolean);
            if (ids.length) {
              const syncRes = await fetch(`${API_BASE}/api/sync/favorites`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(ids),
              });
              if (syncRes.ok) {
                localStorage.removeItem('vk_favs');
              } else {
                console.warn('sync favs failed', syncRes.status, await syncRes.text());
              }
            }
          }
        } catch (e) {
          console.error('sync favs failed', e);
        }

        await loadFavorites();
        await loadCart();
      } else {
        await loadFavorites();
        await loadCart();
      }
    }

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, location.pathname]);

  const cartCount = useMemo(() => {
    return cart.items.reduce((s, it) => s + (it.quantity || 0), 0);
  }, [cart]);

  const favoritesCount = useMemo(() => favorites.length, [favorites]);

  async function loadCart() {
    const token = getToken();
    const localRaw = localStorage.getItem('vk_cart');
    if (token) {
      try {
        const res = await fetch(`${API_BASE}/api/cart`, { headers: { Authorization: `Bearer ${token}` } });
        if (res.ok) {
          const data = await res.json();
          setCart(data);
          return;
        }
        console.warn('loadCart failed', res.status);
      } catch (e) {
        console.error('loadCart catch', e);
      }
    }

    if (localRaw) {
      try {
        setCart(JSON.parse(localRaw));
        return;
      } catch (e) {
        console.error('loadCart fallback parse error', e);
      }
    }

    setCart(emptyCart);
  }

  async function saveLocalCart(c) {
    localStorage.setItem('vk_cart', JSON.stringify(c));
    setCart(c);
  }

  async function addToCart(payload) {
    setLoading(true);
    console.debug('addToCart called', payload);
    try {
      const token = getToken();
      if (token) {
        const url = `${API_BASE}/api/cart`;
        console.debug('addToCart sending authenticated request', { url, token: token ? 'present' : 'missing' });
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          await loadCart();
          console.debug('addToCart -> loadCart completed');
          return true;
        }
        const body = await res.text();
        console.warn('addToCart failed server response', res.status, body);
        // Fallback to local cart when authenticated request fails
        return await addToLocalCart(payload);
      }

      return await addToLocalCart(payload);
    } finally {
      setLoading(false);
    }
  }

  async function addToLocalCart(payload) {
    const existing = cart.items.find(
      (i) => i.productId === payload.productId && i.size === payload.size && i.color === payload.color
    );
    let newCart = { ...cart };
    if (existing) {
      existing.quantity = existing.quantity + (payload.quantity || 1);
    } else {
      const id = Date.now();
      newCart.items = [...newCart.items, { id, productId: payload.productId, name: payload.name || payload.nombre || '', imageUrl: payload.imageUrl || payload.imagen || '', size: payload.size, color: payload.color, quantity: payload.quantity || 1, unitPrice: payload.unitPrice || payload.price || payload.precio || 0 }];
    }
    const subtotal = newCart.items.reduce((s, it) => s + (it.unitPrice || 0) * (it.quantity || 0), 0);
    newCart.subtotal = subtotal;
    newCart.tax = +(subtotal * 0.19).toFixed(2);
    newCart.shipping = subtotal >= 150000 ? 0 : 10000;
    newCart.total = newCart.subtotal + newCart.tax + newCart.shipping;
    await saveLocalCart(newCart);
    console.debug('addToLocalCart saved local cart', newCart);
    return true;
  }

  async function updateItemQuantity(itemId, qty) {
    setLoading(true);
    try {
      const token = getToken();
      if (token) {
        const res = await fetch(`${API_BASE}/api/cart/item/${itemId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(qty),
        });
        if (res.ok) await loadCart();
      } else {
        const newCart = { ...cart };
        const it = newCart.items.find((i) => i.id === itemId);
        if (it) it.quantity = qty;
        const subtotal = newCart.items.reduce((s, it) => s + (it.unitPrice || 0) * (it.quantity || 0), 0);
        newCart.subtotal = subtotal;
        newCart.tax = +(subtotal * 0.19).toFixed(2);
        newCart.shipping = subtotal >= 150000 ? 0 : 10000;
        newCart.total = newCart.subtotal + newCart.tax + newCart.shipping;
        await saveLocalCart(newCart);
      }
    } finally {
      setLoading(false);
    }
  }

  async function removeItem(itemId) {
    setLoading(true);
    try {
      const token = getToken();
      if (token) {
        await fetch(`${API_BASE}/api/cart/item/${itemId}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
        await loadCart();
      } else {
        const newCart = { ...cart };
        newCart.items = newCart.items.filter((i) => i.id !== itemId);
        const subtotal = newCart.items.reduce((s, it) => s + (it.unitPrice || 0) * (it.quantity || 0), 0);
        newCart.subtotal = subtotal;
        newCart.tax = +(subtotal * 0.19).toFixed(2);
        newCart.shipping = subtotal >= 150000 ? 0 : 10000;
        newCart.total = newCart.subtotal + newCart.tax + newCart.shipping;
        await saveLocalCart(newCart);
      }
    } finally {
      setLoading(false);
    }
  }

  async function loadFavorites() {
    const token = getToken();
    const localRaw = localStorage.getItem('vk_favs');
    if (token) {
      try {
        const res = await fetch(`${API_BASE}/api/favorites`, { headers: { Authorization: `Bearer ${token}` } });
        if (res.ok) {
          const data = await res.json();
          setFavorites(data || []);
          return;
        }
        console.warn('loadFavorites failed', res.status);
      } catch (e) {
        console.error('loadFavorites catch', e);
      }
    }

    if (localRaw) {
      try {
        setFavorites(JSON.parse(localRaw));
        return;
      } catch (e) {
        console.error('loadFavorites fallback parse error', e);
      }
    }

    setFavorites([]);
  }

  async function toggleFavorite(product) {
    const productId = typeof product === 'number' ? product : product.id;
    setLoading(true);
    console.debug('toggleFavorite called', { productId, product });
    try {
      const token = getToken();
      const exists = favorites.find((f) => f.id === productId || f.productId === productId);
      if (token) {
        const url = `${API_BASE}/api/favorites/${productId}`;
        if (exists) {
          console.debug('toggleFavorite removing favorite', { url, token: token ? 'present' : 'missing' });
          const res = await fetch(url, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
          if (res.ok) {
            await loadFavorites();
            console.debug('toggleFavorite -> removed and reloaded favorites');
            return;
          }
          const body = await res.text();
          console.warn('removeFavorite failed', res.status, body);
        } else {
          console.debug('toggleFavorite adding favorite', { url, token: token ? 'present' : 'missing' });
          const res = await fetch(url, { method: 'POST', headers: { Authorization: `Bearer ${token}` } });
          if (res.ok) {
            await loadFavorites();
            console.debug('toggleFavorite -> added and reloaded favorites');
            return;
          }
          const body = await res.text();
          console.warn('addFavorite failed', res.status, body);
        }
        return toggleFavoriteLocal(product);
      }

      return toggleFavoriteLocal(product);
    } finally {
      setLoading(false);
    }
  }

  function toggleFavoriteLocal(product) {
    const productId = typeof product === 'number' ? product : product.id;
    let newFavs = [...favorites];
    const idx = newFavs.findIndex((f) => f.id === productId || f.productId === productId);
    if (idx >= 0) {
      newFavs.splice(idx, 1);
    } else {
      const normalized = typeof product === 'number' ? { id: productId, productId } : {
        id: product.id || product.productId,
        productId: product.id || product.productId,
        name: product.name || product.nombre || product.title || '',
        price: product.price || product.precio || product.unitPrice || 0,
        unitPrice: product.unitPrice || product.price || product.precio || 0,
        imageUrl: product.imageUrl || product.imagen || product.image || '',
      };
      newFavs.push(normalized);
    }
    setFavorites(newFavs);
    localStorage.setItem('vk_favs', JSON.stringify(newFavs));
    console.debug('toggleFavoriteLocal updated local favorites', newFavs);
    return newFavs;
  }

  async function moveFavoriteToCart(product, qty = 1) {
    await addToCart({ productId: product.id || product.productId, size: null, color: null, quantity: qty, unitPrice: product.price || 0, name: product.name, imageUrl: product.imageUrl });
    // remove favorite
    await toggleFavorite(product);
    // navigate to cart
    navigate('/cart');
  }

  return (
    <StoreContext.Provider value={{ cart, favorites, cartCount, favoritesCount, loading, addToCart, updateItemQuantity, removeItem, toggleFavorite, moveFavoriteToCart, loadCart, loadFavorites }}>
      {children}
    </StoreContext.Provider>
  );
}

export default StoreContext;
