import { env as publicEnv } from "$env/dynamic/public";

export interface LookupOption { value: string; label: string; }
function apiBase() { return publicEnv.PUBLIC_TOPOGRAM_API_BASE_URL || "http://localhost:3000"; }

export async function listLookupOptions(fetcher: typeof fetch, route: string): Promise<LookupOption[]> {
  const response = await fetcher(new URL(route, apiBase()).toString());
  if (!response.ok) return [];
  const payload = await response.json();
  const items = Array.isArray(payload) ? payload : Array.isArray(payload.items) ? payload.items : [];
  return items.map((item: any) => ({
    value: String(item.id ?? item.value ?? ""),
    label: String(item.name ?? item.title ?? item.label ?? item.id ?? item.value ?? "")
  })).filter((item: LookupOption) => item.value && item.label);
}
