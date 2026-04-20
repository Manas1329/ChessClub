const API_ORIGIN = (process.env.REACT_APP_API_ORIGIN || '').replace(/\/+$/, '');

export const API_BASE = API_ORIGIN ? `${API_ORIGIN}/api` : '/api';

export function apiUrl(path = '') {
  if (!path) return API_BASE;
  return `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`;
}

export function assetUrl(path = '') {
  if (!path) return '';
  if (/^https?:\/\//i.test(path)) return path;
  if (!API_ORIGIN) return path;
  return `${API_ORIGIN}${path.startsWith('/') ? path : `/${path}`}`;
}

export function toArrayResponse(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.events)) return payload.events;
  if (Array.isArray(payload?.items)) return payload.items;
  return [];
}