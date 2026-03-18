export const BASE_URL = 'http://localhost:5000';
const API_BASE = `${BASE_URL}/api`;

function getToken() {
  return localStorage.getItem('zs_token');
}

function setAuth(token, user) {
  localStorage.setItem('zs_token', token);
  localStorage.setItem('zs_user', JSON.stringify(user));
  // Default to false on new login, unless user object specifies it
  localStorage.setItem('zs_isVerified', user?.isVerified ? 'true' : 'false');
}

function getUser() {
  const u = localStorage.getItem('zs_user');
  return u ? JSON.parse(u) : null;
}

function getIsVerified() {
  return localStorage.getItem('zs_isVerified') === 'true';
}

function setIsVerified(status) {
  localStorage.setItem('zs_isVerified', status ? 'true' : 'false');
}

function clearAuth() {
  localStorage.removeItem('zs_token');
  localStorage.removeItem('zs_user');
  localStorage.removeItem('zs_isVerified');
}

async function apiFetch(path, options = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  try {
    const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
    
    const contentType = res.headers.get("content-type");
    let data;
    if (contentType && contentType.indexOf("application/json") !== -1) {
      data = await res.json();
    } else {
      data = await res.text();
    }

    if (!res.ok) {
      const errorMsg = (data && data.error) ? data.error : (typeof data === 'string' ? data : 'Request failed');
      throw new Error(errorMsg);
    }
    return data;
  } catch (err) {
    if (err.name === 'TypeError' && err.message === 'Failed to fetch') {
      throw new Error('Network Error: Unable to connect to the backend server. Please ensure the server is running on http://localhost:5000.');
    }
    throw err;
  }
}

export { apiFetch, setAuth, getUser, getToken, clearAuth, getIsVerified, setIsVerified };
