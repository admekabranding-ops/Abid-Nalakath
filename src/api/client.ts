const API_BASE = '/api';

export function getAuthToken(): string | null {
  return localStorage.getItem('abid_admin_token');
}

export function setAuthToken(token: string) {
  localStorage.setItem('abid_admin_token', token);
}

export function clearAuthToken() {
  localStorage.removeItem('abid_admin_token');
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();
  const headers = new Headers(options.headers || {});

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401 && window.location.pathname.startsWith('/admin')) {
      clearAuthToken();
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/admin/login';
      }
    }
    const errorData = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(errorData.error || `HTTP ${response.status}`);
  }

  return response.json();
}
