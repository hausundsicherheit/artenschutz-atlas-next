import { efGet } from './supabase';

// ========================================================================
// Types
// ========================================================================

export type Kommune = {
  id: number;
  slug: string;
  name: string;
  einwohner: number | null;
  kreis_id: number;
  bundesland_id: number;
  latitude: number | null;
  longitude: number | null;
  bundesland?: string;
  kreis_name?: string;
  // Atlas-Pilot-Felder (Phase 1, ab April 2026 befüllt)
  hat_eigene_satzung?: boolean | null;
  hat_bplan_festsetzung?: boolean | null;
  hat_foerderprogramm?: boolean | null;
  hat_kartierung?: boolean | null;
  hat_nabu_kooperation?: boolean | null;
  hat_gutachter_pflicht?: boolean | null;
  hat_aad_projekt?: boolean | null;
  satzung_details?: string | null;
  bplan_beispiel?: string | null;
  foerder_name?: string | null;
  foerder_betrag_min?: number | null;
  foerder_betrag_max?: number | null;
  foerder_url?: string | null;
  kartierung_seit?: number | null;
  kartierung_partner?: string | null;
  aad_projekt_name?: string | null;
  nabu_ortsgruppe?: string | null;
  nabu_url?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  daten_status?: string | null;
  letzte_verifizierung?: string | null;
};

export type Kreis = {
  id: number;
  name: string;
  name_full?: string;
  bundesland_id: number;
  unb_name: string | null;
  unb_url: string | null;
  unb_email: string | null;
  unb_telefon?: string | null;
  unb_adresse?: string | null;
  artenschutz_url?: string | null;
  nabu_name?: string | null;
  nabu_url?: string | null;
};

export type Bundesland = {
  id: number;
  name: string;
  kuerzel: string;
  landesamt_name: string | null;
  landesamt_url: string | null;
  verordnung_name: string | null;
  verordnung_url: string | null;
  hat_eigene_verordnung: string | null;
  besonderheiten: string | null;
};

export type Art = {
  id: number;
  slug: string;
  name_deutsch: string;
  name_wissenschaftlich: string;
  artengruppe: string;
  schutzstatus: string | null;
  rote_liste_deutschland: string | null;
  beschreibung_kurz: string | null;
  foto_url: string | null;
  bild_attribution: string | null;
  bild_lizenz: string | null;
  konflikt_bauvorhaben?: string[] | null;
  bauzeitfenster?: string | null;
  haeufigkeit?: string | null;
  verifiziert?: boolean;
};

export type Produkt = {
  id: number;
  art_id: number | null;
  artengruppe: string | null;
  kontext_tag: string | null;
  produkt_name: string;
  produkt_url: string | null;
  preis_ab: number | null;
  preis_einheit: string;
  hersteller: string | null;
  beschreibung_kurz: string | null;
  relevanz: 'primary' | 'related' | 'alternative';
  kontext_label: string | null;
  status: 'available' | 'planned' | 'discontinued' | 'coming_soon';
  bild_url: string | null;
  sw6_product_number: string | null;
};

// ========================================================================
// Artengruppen Labels
// ========================================================================

const ARTENGRUPPEN_LABEL: Record<string, string> = {
  gebaeudebrueter: 'Gebäudebrüter',
  gartenvogel: 'Gartenvögel',
  fledermaus: 'Fledermäuse',
  reptil: 'Reptilien',
  amphibie: 'Amphibien',
  saeugetier: 'Säugetiere',
  insekt: 'Insekten',
  eule: 'Eulen',
};

export const artengruppeLabel = (key: string) => ARTENGRUPPEN_LABEL[key] || key;

// ========================================================================
// Edge Function Data Fetching — EIN Call pro Page
// ========================================================================

type GemeindeResponse = {
  gemeinde: Record<string, unknown>;
  kreis: Record<string, unknown> | null;
  bundesland: Record<string, unknown> | null;
  arten: Art[];
  produkte: Produkt[];
  error?: string;
};

export type KommunePageData = {
  kommune: Kommune;
  kreis: Kreis | null;
  bundesland: Bundesland | null;
  arten: Art[];
  produkte: Produkt[];
};

export async function getKommunePageData(
  slug: string
): Promise<KommunePageData | null> {
  try {
    const data = await efGet<GemeindeResponse>(
      `gemeinde/${encodeURIComponent(slug)}`
    );

    if (data.error || !data.gemeinde) return null;

    const g = data.gemeinde;
    const kommune: Kommune = {
      id: g.id as number,
      slug: g.slug as string,
      name: g.name as string,
      einwohner: g.einwohner as number | null,
      kreis_id: g.kreis_id as number,
      bundesland_id: g.bundesland_id as number,
      latitude: g.latitude as number | null,
      longitude: g.longitude as number | null,
      bundesland: data.bundesland?.name as string | undefined,
      kreis_name: data.kreis?.name as string | undefined,
      // Atlas-Pilot-Felder
      hat_eigene_satzung: g.hat_eigene_satzung as boolean | null | undefined,
      hat_bplan_festsetzung: g.hat_bplan_festsetzung as boolean | null | undefined,
      hat_foerderprogramm: g.hat_foerderprogramm as boolean | null | undefined,
      hat_kartierung: g.hat_kartierung as boolean | null | undefined,
      hat_nabu_kooperation: g.hat_nabu_kooperation as boolean | null | undefined,
      hat_gutachter_pflicht: g.hat_gutachter_pflicht as boolean | null | undefined,
      hat_aad_projekt: g.hat_aad_projekt as boolean | null | undefined,
      satzung_details: g.satzung_details as string | null | undefined,
      bplan_beispiel: g.bplan_beispiel as string | null | undefined,
      foerder_name: g.foerder_name as string | null | undefined,
      foerder_betrag_min: g.foerder_betrag_min as number | null | undefined,
      foerder_betrag_max: g.foerder_betrag_max as number | null | undefined,
      foerder_url: g.foerder_url as string | null | undefined,
      kartierung_seit: g.kartierung_seit as number | null | undefined,
      kartierung_partner: g.kartierung_partner as string | null | undefined,
      aad_projekt_name: g.aad_projekt_name as string | null | undefined,
      nabu_ortsgruppe: g.nabu_ortsgruppe as string | null | undefined,
      nabu_url: g.nabu_url as string | null | undefined,
      meta_title: g.meta_title as string | null | undefined,
      meta_description: g.meta_description as string | null | undefined,
      daten_status: g.daten_status as string | null | undefined,
      letzte_verifizierung: g.letzte_verifizierung as string | null | undefined,
    };

    return {
      kommune,
      kreis: (data.kreis as Kreis) || null,
      bundesland: (data.bundesland as Bundesland) || null,
      arten: data.arten || [],
      produkte: data.produkte || [],
    };
  } catch (err) {
    console.error(`getKommunePageData(${slug}) failed:`, err);
    return null;
  }
}

// ========================================================================
// Gruppen-Helper
// ========================================================================

export function groupArtenByArtengruppe(arten: Art[]) {
  const grouped: Record<string, Art[]> = {};
  for (const a of arten) {
    const key = a.artengruppe || 'sonstige';
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(a);
  }
  return Object.entries(grouped)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([artengruppe, items]) => ({
      artengruppe,
      label: artengruppeLabel(artengruppe),
      arten: items,
      count: items.length,
    }));
}

// ========================================================================
// Top-Kommunen (für generateStaticParams)
// ========================================================================

type TopKommunenResponse = { kommunen: Kommune[] };

export async function getTopKommunen(limit = 20): Promise<Kommune[]> {
  try {
    const data = await efGet<TopKommunenResponse>(
      `top-kommunen?limit=${limit}`,
      3600 // 1h revalidate für Build
    );
    return data.kommunen || [];
  } catch (err) {
    console.error('getTopKommunen failed:', err);
    return [];
  }
}

// ========================================================================
// Art-Detail (für /arten/[slug])
// ========================================================================

export type ArtDetail = {
  id: number;
  slug: string;
  name_deutsch: string;
  name_wissenschaftlich: string;
  artengruppe: string;
  schutzstatus: string | null;
  rote_liste_deutschland: string | null;
  beschreibung_kurz: string | null;
  beschreibung_lang: string | null;
  foto_url: string | null;
  bild_attribution: string | null;
  bild_lizenz: string | null;
  konflikt_bauvorhaben?: string[] | null;
  bauzeitfenster?: string | null;
  cef_massnahmen?: string | null;
  nisthilfen?: string[] | null;
  anzeichen_am_gebaeude?: string | null;
  erkennungsmerkmale?: string | null;
  wikipedia_url?: string | null;
  nabu_url?: string | null;
  lebensweise?: string | null;
  relevante_strukturen?: string | null;
  erkennen_aktivitaet?: string | null;
  nahrung?: string | null;
  bestand_trend?: string | null;
  verbreitung?: string | null;
  stimme_url?: string | null;
  steckbrief_pdf_url?: string | null;
  nisthilfen_typen?: Array<{ typ: string; name: string; vorteil?: string }> | null;
  nisthilfen_masse?: string | null;
  nisthilfen_platzierung?: string | null;
  bauzeit_optimal?: string | null;
  praxis_beispiele?: Array<{ ort: string; jahr?: string; lehre: string }> | null;
  quellen?: Array<{ doi?: string; url: string; titel?: string }> | null;
};

export type KommuneVorkommen = {
  slug: string;
  name: string;
  einwohner: number | null;
  haeufigkeit?: string | null;
};

type ArtResponse = { art: ArtDetail };

const SUPABASE_URL = 'https://wsubvpdyakzpnapgsrnm.supabase.co';
// Anon-Key (öffentlich, RLS-geschützt). Wird über fetch direkt verwendet.
const SUPABASE_ANON =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndzdWJ2cGR5YWt6cG5hcGdzcm5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0NTk5NTgsImV4cCI6MjA3MjAzNTk1OH0.9MWXI1aBa6YCG0dFOShqz8mMzd2L45mOvt4T4dueN-0';

/**
 * Holt eine Art mit allen Detail-Feldern aus der EF.
 */
export async function getArt(slug: string): Promise<ArtDetail | null> {
  try {
    const data = await efGet<ArtResponse>(`art/${encodeURIComponent(slug)}`);
    return data.art || null;
  } catch (err) {
    console.error(`getArt(${slug}) failed:`, err);
    return null;
  }
}

/**
 * Holt die Top-Kommunen (≥100k EW), in deren Kreis diese Art vorkommt.
 * Direct-PostgREST-Call, weil die EF keinen entsprechenden Endpunkt hat.
 */
export async function getKommunenForArt(
  artId: number,
  limit = 12
): Promise<KommuneVorkommen[]> {
  try {
    // PostgREST-Query: atlas_arten_kreise → atlas_kommunen mit kreis_id IN (...)
    // Da PostgREST kein direktes JOIN unterstützt, machen wir 2 Calls.
    const r1 = await fetch(
      `${SUPABASE_URL}/rest/v1/atlas_arten_kreise?art_id=eq.${artId}&select=kreis_id,haeufigkeit`,
      {
        headers: { apikey: SUPABASE_ANON, Authorization: `Bearer ${SUPABASE_ANON}` },
        next: { revalidate: 86400 },
      }
    );
    if (!r1.ok) return [];
    const kreisRows = (await r1.json()) as Array<{ kreis_id: number; haeufigkeit: string | null }>;
    if (!kreisRows.length) return [];

    const kreisIds = Array.from(new Set(kreisRows.map((r) => r.kreis_id))).slice(0, 200);
    const haeufigkeitByKreis = new Map(kreisRows.map((r) => [r.kreis_id, r.haeufigkeit]));

    const inList = kreisIds.join(',');
    const r2 = await fetch(
      `${SUPABASE_URL}/rest/v1/atlas_kommunen?kreis_id=in.(${inList})&einwohner=gte.100000&select=slug,name,einwohner,kreis_id&order=einwohner.desc&limit=${limit}`,
      {
        headers: { apikey: SUPABASE_ANON, Authorization: `Bearer ${SUPABASE_ANON}` },
        next: { revalidate: 86400 },
      }
    );
    if (!r2.ok) return [];
    const kommunen = (await r2.json()) as Array<{
      slug: string;
      name: string;
      einwohner: number | null;
      kreis_id: number;
    }>;

    return kommunen.map((k) => ({
      slug: k.slug,
      name: k.name,
      einwohner: k.einwohner,
      haeufigkeit: haeufigkeitByKreis.get(k.kreis_id) || null,
    }));
  } catch (err) {
    console.error(`getKommunenForArt(${artId}) failed:`, err);
    return [];
  }
}

/**
 * Liste aller Arten (für /arten Übersichtsseite + generateStaticParams).
 */
type ArtenListResponse = { arten: ArtDetail[] };
export async function getAlleArten(): Promise<ArtDetail[]> {
  try {
    const data = await efGet<ArtenListResponse>('arten', 3600);
    return data.arten || [];
  } catch (err) {
    console.error('getAlleArten failed:', err);
    return [];
  }
}

// ========================================================================
// Blog (Phase 1)
// ========================================================================

export type BlogPost = {
  id: number;
  slug: string;
  title: string;
  subtitle: string | null;
  excerpt: string;
  body_md: string;
  hero_image_url: string | null;
  hero_image_alt: string | null;
  kommune_slugs: string[];
  art_slugs: string[];
  topic_tags: string[];
  source_url: string | null;
  source_label: string | null;
  ai_generated: boolean;
  ai_model: string | null;
  published_at: string | null;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
};

export type BlogPostListItem = Omit<BlogPost, 'body_md'>;

const BLOG_SELECT_LIST =
  'id,slug,title,subtitle,excerpt,hero_image_url,hero_image_alt,kommune_slugs,art_slugs,topic_tags,source_url,source_label,ai_generated,ai_model,published_at,meta_title,meta_description,created_at';

const BLOG_SELECT_FULL = BLOG_SELECT_LIST + ',body_md';

/**
 * Liste aller veröffentlichten Posts, neueste zuerst.
 */
export async function getBlogPosts(limit = 50): Promise<BlogPostListItem[]> {
  try {
    const r = await fetch(
      `${SUPABASE_URL}/rest/v1/atlas_blog_posts?status=eq.published&select=${BLOG_SELECT_LIST}&order=published_at.desc&limit=${limit}`,
      {
        headers: { apikey: SUPABASE_ANON, Authorization: `Bearer ${SUPABASE_ANON}` },
        next: { revalidate: 3600 },
      }
    );
    if (!r.ok) return [];
    return (await r.json()) as BlogPostListItem[];
  } catch (err) {
    console.error('getBlogPosts failed:', err);
    return [];
  }
}

/**
 * Single Post by slug.
 */
export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const r = await fetch(
      `${SUPABASE_URL}/rest/v1/atlas_blog_posts?slug=eq.${encodeURIComponent(
        slug
      )}&status=eq.published&select=${BLOG_SELECT_FULL}&limit=1`,
      {
        headers: { apikey: SUPABASE_ANON, Authorization: `Bearer ${SUPABASE_ANON}` },
        next: { revalidate: 3600 },
      }
    );
    if (!r.ok) return null;
    const arr = (await r.json()) as BlogPost[];
    return arr[0] || null;
  } catch (err) {
    console.error(`getBlogPost(${slug}) failed:`, err);
    return null;
  }
}

/**
 * Posts die zu einer Kommune gehören (für Stadtseiten-Block).
 */
export async function getBlogPostsForKommune(
  kommuneSlug: string,
  limit = 3
): Promise<BlogPostListItem[]> {
  try {
    const r = await fetch(
      `${SUPABASE_URL}/rest/v1/atlas_blog_posts?status=eq.published&kommune_slugs=cs.{${kommuneSlug}}&select=${BLOG_SELECT_LIST}&order=published_at.desc&limit=${limit}`,
      {
        headers: { apikey: SUPABASE_ANON, Authorization: `Bearer ${SUPABASE_ANON}` },
        next: { revalidate: 3600 },
      }
    );
    if (!r.ok) return [];
    return (await r.json()) as BlogPostListItem[];
  } catch (err) {
    console.error(`getBlogPostsForKommune(${kommuneSlug}) failed:`, err);
    return [];
  }
}

/**
 * Posts die zu einer Art gehören (für Art-Detailseiten-Block).
 */
export async function getBlogPostsForArt(
  artSlug: string,
  limit = 3
): Promise<BlogPostListItem[]> {
  try {
    const r = await fetch(
      `${SUPABASE_URL}/rest/v1/atlas_blog_posts?status=eq.published&art_slugs=cs.{${artSlug}}&select=${BLOG_SELECT_LIST}&order=published_at.desc&limit=${limit}`,
      {
        headers: { apikey: SUPABASE_ANON, Authorization: `Bearer ${SUPABASE_ANON}` },
        next: { revalidate: 3600 },
      }
    );
    if (!r.ok) return [];
    return (await r.json()) as BlogPostListItem[];
  } catch (err) {
    console.error(`getBlogPostsForArt(${artSlug}) failed:`, err);
    return [];
  }
}
