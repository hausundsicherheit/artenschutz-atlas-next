/**
 * Atlas Public Data Client
 * Nutzt direkte PostgREST-Calls mit Anon-Key (RLS-geschützt).
 */

const SUPABASE_URL = 'https://wsubvpdyakzpnapgsrnm.supabase.co';
const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  '';
const REST_BASE = `${SUPABASE_URL}/rest/v1`;

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function restGet<T = unknown>(
  table: string,
  query: string,
  revalidate = 86400
): Promise<T[]> {
  const url = `${REST_BASE}/${table}?${query}`;
  const MAX_RETRIES = 3;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const r = await fetch(url, {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          Accept: 'application/json',
        },
        next: { revalidate },
      });

      // DNS-Overflow oder Upstream-Fehler → retry
      if (r.status === 503 || r.status === 502 || r.status === 504) {
        if (attempt < MAX_RETRIES) {
          await sleep(250 * Math.pow(2, attempt)); // 250ms, 500ms, 1000ms
          continue;
        }
      }

      if (!r.ok) {
        console.error(`Supabase REST ${table} failed: ${r.status} ${await r.text()}`);
        return [];
      }
      return r.json();
    } catch (err) {
      if (attempt < MAX_RETRIES) {
        await sleep(250 * Math.pow(2, attempt));
        continue;
      }
      console.error(`Supabase REST ${table} error:`, err);
      return [];
    }
  }
  return [];
}
