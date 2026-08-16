// Vite provides import.meta.env at runtime; cast to any to avoid TS complaints in some editors
const viteEnv = (import.meta as any)?.env ?? {};
export const API_BASE: string = viteEnv.VITE_API_BASE || "http://localhost:8008/api/v1";

export async function getJSON<T>(path: string): Promise<T> {
  const r = await fetch(`${API_BASE}${path}`);
  if (!r.ok) throw new Error(`GET ${path} ${r.status}`);
  return r.json();
}

export async function postJSON<T>(path: string, body: any): Promise<T> {
  const r = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error(`POST ${path} ${r.status}`);
  return r.json();
}
