
const BASE_URL = import.meta.env.VITE_API_URL ?? '';

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) throw new Error(`API error ${res.status} on ${path}`);
  return res.json() as Promise<T>;
}

export const api = {
  profile:    () => get('/aditya/profile'),
  posts:      () => get('/aditya/posts'),
  projects:   () => get('/aditya/projects'),
  experience: () => get('/aditya/experience'),
  skills:     () => get('/aditya/skills'),
  stats:      () => get('/aditya/stats'),
  education:  () => get('/aditya/education'),
  uiConfig:   () => get('/aditya/ui-config'),
};
