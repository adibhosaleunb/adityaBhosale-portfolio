/**
 * All API calls go through this module.
 *
 * - In development (via Vite dev server): requests go to /api/...
 *   which Vite proxies to http://localhost:4000 — no CORS needed.
 * - In production (built static files served by a CDN/Nginx):
 *   VITE_API_URL must be set at build time to the backend's public URL,
 *   e.g. https://api.yourdomain.com
 */

const BASE_URL = import.meta.env.VITE_API_URL ?? '';

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) throw new Error(`API error ${res.status} on ${path}`);
  return res.json() as Promise<T>;
}

export const api = {
  profile:    () => get('/api/profile'),
  posts:      () => get('/api/posts'),
  projects:   () => get('/api/projects'),
  experience: () => get('/api/experience'),
  skills:     () => get('/api/skills'),
  stats:      () => get('/api/stats'),
  education:  () => get('/api/education'),
  uiConfig:   () => get('/api/ui-config'),
};
