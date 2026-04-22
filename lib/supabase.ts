/**
 * Atlas Public Data Client — Edge Function Only
 * 
 * Alle Daten kommen über EINEN Endpoint:
 *   https://wsubvpdyakzpnapgsrnm.supabase.co/functions/v1/atlas-public-data/...
 * 
 * Das vermeidet DNS-Cache-Overflow auf Vercel, weil nur 1 Domain
 * aufgelöst wird statt mehrere parallele PostgREST-Calls.
 */

const EF_BASE =
  'https://wsubvpdyakzpnapgsrnm.supabase.co/functions/v1/atlas-public-data';

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * Einziger Fetch-Helper. Ruft die Edge Function auf.
 * Retry bei 502/503/504 mit Exponential Backoff.
 */
export async function efGet<T = unknown>(
  path: string,
  revalidate = 86400
): Promise<T> {
  const url = `${EF_BASE}/${path}`;
  const MAX_RETRIES = 3;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const r = await fetch(url, {
        headers: { Accept: 'application/json' },
        next: { revalidate },
      });

      if (r.status === 502 || r.status === 503 || r.status === 504) {
        if (attempt < MAX_RETRIES) {
          await sleep(300 * Math.pow(2, attempt));
          continue;
        }
      }

      if (!r.ok) {
        const body = await r.text().catch(() => '');
        console.error(`EF ${path} failed: ${r.status} ${body}`);
        throw new Error(`EF ${path}: ${r.status}`);
      }

      return r.json();
    } catch (err) {
      if (attempt < MAX_RETRIES) {
        await sleep(300 * Math.pow(2, attempt));
        continue;
      }
      console.error(`EF ${path} error after ${MAX_RETRIES} retries:`, err);
      throw err;
    }
  }

  throw new Error(`EF ${path}: exhausted retries`);
}
