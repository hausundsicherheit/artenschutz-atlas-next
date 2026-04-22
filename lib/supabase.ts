/**
 * Atlas Public Data Client
 * Nutzt Edge Function `atlas-public-data` (verify_jwt=false) — kein Anon-Key nötig.
 */

const SUPABASE_URL = 'https://wsubvpdyakzpnapgsrnm.supabase.co';
const PUBLIC_API = `${SUPABASE_URL}/functions/v1/atlas-public-data`;

// Direkte Tabellen-Reads via PostgREST (anon key, RLS-geschützt)
const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  ''; // wird via Vercel ENV gesetzt
const REST_BASE = `${SUPABASE_URL}/rest/v1`;

export async function restGet<T = unknown>(
  table: string,
  query: string,
  revalidate = 86400
): Promise<T[]> {
  const url = `${REST_BASE}/${table}?${query}`;
  const r = await fetch(url, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      Accept: 'application/json',
    },
    next: { revalidate },
  });
  if (!r.ok) {
    console.error(`Supabase REST ${table} failed: ${r.status} ${await r.text()}`);
    return [];
  }
  return r.json();
}

export async function publicApiGet<T = unknown>(
  path: string,
  revalidate = 86400
): Promise<T | null> {
  const r = await fetch(`${PUBLIC_API}${path}`, {
    next: { revalidate },
  });
  if (!r.ok) {
    console.error(`Atlas public API ${path} failed: ${r.status}`);
    return null;
  }
  return r.json();
}
