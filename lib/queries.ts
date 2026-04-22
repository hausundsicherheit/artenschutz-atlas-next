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

// ========================================================================
// KOMMUNEN-DATA: EIN einziger REST-Call mit tiefem Embedding
// ========================================================================
// Statt 4 parallele Requests (→ DNS Cache Overflow auf Vercel) holen wir
// Kommune + Bundesland + Kreis + alle Arten über die Kreis-Junction in EINEM Call.

type KommuneFull = {
  id: number;
  slug: string;
  name: string;
  einwohner: number | null;
  kreis_id: number;
  bundesland_id: number;
  latitude: number | null;
  longitude: number | null;
  atlas_bundeslaender: { name: string } | null;
  atlas_kreise: {
    id: number;
    name: string;
    bundesland_id: number;
    unb_name: string | null;
    unb_url: string | null;
    unb_email: string | null;
    atlas_arten_kreise: {
      atlas_arten: Art;
    }[];
  } | null;
};

export type KommunePageData = {
  kommune: Kommune;
  kreis: Kreis | null;
  arten: Art[];
};

export async function getKommunePageData(slug: string): Promise<KommunePageData | null> {
  const select =
    'id,slug,name,einwohner,kreis_id,bundesland_id,latitude,longitude,' +
    'atlas_bundeslaender(name),' +
    'atlas_kreise(id,name,bundesland_id,unb_name,unb_url,unb_email,' +
      'atlas_arten_kreise(' +
        'atlas_arten(id,slug,name_deutsch,name_wissenschaftlich,artengruppe,' +
          'schutzstatus,rote_liste_deutschland,beschreibung_kurz,foto_url,bild_attribution,bild_lizenz)' +
      ')' +
    ')';

  const rows = await restGet<KommuneFull>(
    'atlas_kommunen',
    `slug=eq.${encodeURIComponent(slug)}&select=${encodeURIComponent(select)}&limit=1`
  );
  const r = rows[0];
  if (!r) return null;

  const kommune: Kommune = {
    id: r.id,
    slug: r.slug,
    name: r.name,
    einwohner: r.einwohner,
    kreis_id: r.kreis_id,
    bundesland_id: r.bundesland_id,
    latitude: r.latitude,
    longitude: r.longitude,
    bundesland: r.atlas_bundeslaender?.name,
    kreis_name: r.atlas_kreise?.name,
  };

  const kreis: Kreis | null = r.atlas_kreise
    ? {
        id: r.atlas_kreise.id,
        name: r.atlas_kreise.name,
        bundesland_id: r.atlas_kreise.bundesland_id,
        unb_name: r.atlas_kreise.unb_name,
        unb_url: r.atlas_kreise.unb_url,
        unb_email: r.atlas_kreise.unb_email,
      }
    : null;

  const arten: Art[] = (r.atlas_kreise?.atlas_arten_kreise || [])
    .map((j) => j.atlas_arten)
    .filter(Boolean);

  return { kommune, kreis, arten };
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
  const select =
    'id,slug,name,einwohner,kreis_id,bundesland_id,latitude,longitude,atlas_bundeslaender(name)';
  const rows = await restGet<
    Omit<Kommune, 'bundesland' | 'kreis_name'> & {
      atlas_bundeslaender?: { name: string } | null;
    }
  >(
    'atlas_kommunen',
    `select=${encodeURIComponent(select)}&einwohner=not.is.null&order=einwohner.desc.nullslast&limit=${limit}`
  );
  return rows.map((r) => ({
    ...r,
    bundesland: r.atlas_bundeslaender?.name,
  }));
}

