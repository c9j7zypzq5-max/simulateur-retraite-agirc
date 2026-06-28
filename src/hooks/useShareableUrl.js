const MAX_ENCODE_LENGTH = 8192;

export function encodeParams(params) {
  const encoded = btoa(JSON.stringify(params));
  if (encoded.length > MAX_ENCODE_LENGTH) throw new Error('params_too_large');
  return encoded;
}

export function decodeParams(encoded) {
  try { return JSON.parse(atob(encoded)); } catch { return null; }
}

export function buildShareUrl(params) {
  const base = window.location.origin + window.location.pathname;
  return `${base}?s=${encodeParams(params)}`;
}

export function readShareParams() {
  const url = new URLSearchParams(window.location.search);
  const s = url.get('s');
  return s ? decodeParams(s) : null;
}
