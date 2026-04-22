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
