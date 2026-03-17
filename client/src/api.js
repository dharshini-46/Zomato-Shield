const API_BASE = 'http://localhost:5000/api';

function getToken() {
  return localStorage.getItem('zs_token');
}

function setAuth(token, user) {
  localStorage.setItem('zs_token', token);
  localStorage.setItem('zs_user', JSON.stringify(user));
}

function getUser() {
  const u = localStorage.getItem('zs_user');
  return u ? JSON.parse(u) : null;
}

function clearAuth() {
  localStorage.removeItem('zs_token');
  localStorage.removeItem('zs_user');
}

async function apiFetch(path, options = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

export { apiFetch, setAuth, getUser, getToken, clearAuth };
