// Wrapper around fetch that attaches the API auth header.
// Use for every call to an internal /api/* route.
export function apiFetch(path: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers);
  headers.set('x-igi-auth', process.env.NEXT_PUBLIC_DRILLS_API_SECRET || '');
  return fetch(path, { ...init, headers });
}
