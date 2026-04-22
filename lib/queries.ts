import { restGet } from './supabase';

export type Kommune = {
  id: number;
  slug: string;
  name: string;
  einwohner: number | null;
  kreis_id: number;
  bundesland_id: number;
  latitude: number | null;
  longitude: number | null;
  bundesland?: string;          // aus Embed
  kreis_name?: string;          // aus Embed
};

export type Kreis = {
  id: number;
  name: string;
  bundesland_id: number;
  unb_name: string | null;
  unb_url: string | null;
  unb_email: string | null;
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

type KommuneRaw = Omit<Kommune, 'bundesland' | 'kreis_name'> & {
  atlas_bundeslaender?: { name: string } | null;
  atlas_kreise?: { name: string } | null;
};

export async function getKommune(slug: string): Promise<Kommune | null> {
  const select = 'id,slug,name,einwohner,kreis_id,bundesland_id,latitude,longitude,atlas_bundeslaender(name),atlas_kreise(name)';
  const rows = await restGet<KommuneRaw>(
    'atlas_kommunen',
    `slug=eq.${encodeURIComponent(slug)}&select=${encodeURIComponent(select)}&limit=1`
  );
  const r = rows[0];
  if (!r) return null;
  return {
    ...r,
    bundesland: r.atlas_bundeslaender?.name,
    kreis_name: r.atlas_kreise?.name,
  };
}

export async function getKreis(kreisId: number): Promise<Kreis | null> {
  const rows = await restGet<Kreis>(
    'atlas_kreise',
    `id=eq.${kreisId}&select=id,name,bundesland_id,unb_name,unb_url,unb_email&limit=1`
  );
  return rows[0] || null;
}

export async function getArtenForKreis(kreisId: number): Promise<Art[]> {
  const rows = await restGet<{ atlas_arten: Art }>(
    'atlas_arten_kreise',
    `kreis_id=eq.${kreisId}&select=atlas_arten(id,slug,name_deutsch,name_wissenschaftlich,artengruppe,schutzstatus,rote_liste_deutschland,beschreibung_kurz,foto_url,bild_attribution,bild_lizenz)`
  );
  return rows.map((r) => r.atlas_arten).filter(Boolean);
}

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

export async function getProdukte(opts: {
  artengruppen?: string[];
  kontextTags?: string[];
}): Promise<Produkt[]> {
  const orParts: string[] = [];
  if (opts.artengruppen?.length) {
    orParts.push(`artengruppe.in.(${opts.artengruppen.join(',')})`);
  }
  if (opts.kontextTags?.length) {
    orParts.push(`kontext_tag.in.(${opts.kontextTags.join(',')})`);
  }
  if (!orParts.length) return [];

  const orQuery = `or=(${orParts.join(',')})`;
  const rows = await restGet<Produkt>(
    'atlas_art_produkte',
    `${orQuery}&aktiv=eq.true&order=sort_order.asc&select=*`
  );
  return rows;
}

export async function getTopKommunen(limit = 20): Promise<Kommune[]> {
  const select = 'id,slug,name,einwohner,kreis_id,bundesland_id,latitude,longitude,atlas_bundeslaender(name)';
  const rows = await restGet<KommuneRaw>(
    'atlas_kommunen',
    `select=${encodeURIComponent(select)}&einwohner=not.is.null&order=einwohner.desc.nullslast&limit=${limit}`
  );
  return rows.map((r) => ({
    ...r,
    bundesland: r.atlas_bundeslaender?.name,
  }));
}
