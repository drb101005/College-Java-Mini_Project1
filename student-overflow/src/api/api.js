const API_BASE = 'http://localhost:4000/api';

export async function apiFetch(path, opts = {}) {
  const token = localStorage.getItem('token');
  const headers = opts.headers || {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, {...opts, headers: {...headers, 'Content-Type': 'application/json'}});
  if (!res.ok) {
    const err = await res.json().catch(()=>({error: 'Unknown'}));
    throw err;
  }
  return res.json();
}
