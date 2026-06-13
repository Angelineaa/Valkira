// Central API base URL for fetch calls. Uses Vite env var VITE_API_URL if provided.
export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';
// Log at module load so devtools shows which base is used.
try {
  // eslint-disable-next-line no-console
  console.debug('API_BASE resolved to:', API_BASE);
} catch (e) {
  // ignore
}

const getToken = () => localStorage.getItem("token");

const getHeaders = (includeAuth = true) => {
  const headers = { "Content-Type": "application/json" };
  if (includeAuth && getToken()) {
    headers["Authorization"] = `Bearer ${getToken()}`;
  }
  return headers;
};

const handleResponse = async (response, fallbackMessage) => {
  if (!response.ok) {
    let message = fallbackMessage;
    try {
      const text = await response.text();
      if (text) message = text;
    } catch (e) {
      // ignore parse failure
    }
    throw new Error(message || `Request failed with status ${response.status}`);
  }
  return response.json();
};

// Auth endpoints
export const login = async (email, password) => {
  const url = `${API_BASE}/api/auth/login`;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: getHeaders(false),
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(response, "Error al iniciar sesión");
  } catch (err) {
    // network-level failure (CORS, connection refused, DNS)
    const errMsg = err && err.message ? err.message : String(err);
    // eslint-disable-next-line no-console
    console.error('login network error', { url, error: errMsg });
    throw new Error('Network error: no se pudo conectar al servidor');
  }
};

export const register = async (email, password, firstName, lastName, acceptedPrivacyPolicy) => {
  const response = await fetch(`${API_BASE}/api/auth/register`, {
    method: "POST",
    headers: getHeaders(false),
    body: JSON.stringify({
      email,
      password,
      firstName,
      lastName,
      acceptedPrivacyPolicy,
    }),
  });
  return handleResponse(response, "Error al registrarse");
};

export const forgotPassword = async (email) => {
  const response = await fetch(`${API_BASE}/api/auth/forgot-password`, {
    method: "POST",
    headers: getHeaders(false),
    body: JSON.stringify({ email }),
  });
  return handleResponse(response, "Error al solicitar recuperación");
};

export const resetPassword = async (token, newPassword) => {
  const response = await fetch(`${API_BASE}/api/auth/reset-password`, {
    method: "POST",
    headers: getHeaders(false),
    body: JSON.stringify({ token, newPassword }),
  });
  return handleResponse(response, "Error al restablecer contraseña");
};

// User endpoints
export const getMe = async () => {
  const response = await fetch(`${API_BASE}/api/user/me`, {
    method: "GET",
    headers: getHeaders(true),
  });
  return handleResponse(response, "Error al cargar usuario");
};

export const updateProfile = async (userData) => {
  const response = await fetch(`${API_BASE}/api/user/me`, {
    method: "PUT",
    headers: getHeaders(true),
    body: JSON.stringify(userData),
  });
  return handleResponse(response, "Error al actualizar perfil");
};

// Preferences endpoints
export const getPreferences = async () => {
  const response = await fetch(`${API_BASE}/api/user/preferences`, {
    method: "GET",
    headers: getHeaders(true),
  });
  return handleResponse(response, "Error al cargar preferencias");
};

export const updatePreferences = async (preferences) => {
  const response = await fetch(`${API_BASE}/api/user/preferences`, {
    method: "PUT",
    headers: getHeaders(true),
    body: JSON.stringify(preferences),
  });
  return handleResponse(response, "Error al actualizar preferencias");
};

export const getRecommendations = async () => {
  const response = await fetch(`${API_BASE}/api/recommendations`, {
    method: "GET",
    headers: getHeaders(true),
  });
  return handleResponse(response, "Error al cargar recomendaciones");
};

export const recordProductView = async (productId) => {
  const response = await fetch(`${API_BASE}/api/products/${productId}/view`, {
    method: "POST",
    headers: getHeaders(true),
  });
  if (!response.ok) {
    throw new Error(`Error al registrar vista de producto: ${response.status}`);
  }
  return;
};

export const getOrders = async () => {
  const response = await fetch(`${API_BASE}/api/orders`, {
    method: "GET",
    headers: getHeaders(true),
  });
  return handleResponse(response, "Error al cargar pedidos");
};

export const getOrder = async (orderId) => {
  const response = await fetch(`${API_BASE}/api/orders/${orderId}`, {
    method: "GET",
    headers: getHeaders(true),
  });
  return handleResponse(response, "Error al cargar el pedido");
};

// Firebase login exchange: send Firebase ID token to backend and receive app JWT
export const firebaseLogin = async (idToken) => {
  const response = await fetch(`${API_BASE}/api/auth/firebase`, {
    method: 'POST',
    headers: getHeaders(false),
    body: JSON.stringify({ idToken }),
  });
  return handleResponse(response, 'Error al iniciar sesión con Firebase');
};
// Health check endpoint
export const getHealth = async () => {
  const url = `${API_BASE}/health`;
  try {
    const response = await fetch(url);
    const data = await response.text();
    return data;
  } catch (err) {
    console.error('Error al verificar el estado del backend:', err);
    throw new Error('No se pudo conectar al backend');
  }
};