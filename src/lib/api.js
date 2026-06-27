// Centralized API client — handles auth header, timeout, and error normalization.
// All fetch calls to /api/* should go through apiFetch or apiGet/apiPost helpers.

const DEFAULT_TIMEOUT_MS = 10_000;

export class ApiError extends Error {
  constructor(status, message, body) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

export async function apiFetch(url, { token, signal, timeout = DEFAULT_TIMEOUT_MS, ...options } = {}) {
  const controller = new AbortController();
  const timer = timeout > 0 ? setTimeout(() => controller.abort(), timeout) : null;
  const combined = signal
    ? (() => {
        signal.addEventListener('abort', () => controller.abort());
        return controller.signal;
      })()
    : controller.signal;

  const headers = {
    ...(options.body && typeof options.body === 'string' && { 'Content-Type': 'application/json' }),
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    const res = await fetch(url, { ...options, headers, signal: combined });
    if (timer) clearTimeout(timer);
    if (!res.ok) {
      let msg = res.statusText;
      try { const j = await res.json(); msg = j.error || j.message || msg; } catch { /* no json body */ }
      throw new ApiError(res.status, msg, null);
    }
    const ct = res.headers.get('content-type') || '';
    return ct.includes('application/json') ? res.json() : res.text();
  } catch (err) {
    if (timer) clearTimeout(timer);
    if (err.name === 'AbortError') throw new ApiError(0, 'Request timed out or cancelled', null);
    throw err;
  }
}

export function apiPost(url, body, opts = {}) {
  return apiFetch(url, { ...opts, method: 'POST', body: JSON.stringify(body) });
}

export function apiGet(url, opts = {}) {
  return apiFetch(url, { ...opts, method: 'GET' });
}
