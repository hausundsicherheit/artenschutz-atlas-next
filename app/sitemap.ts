import type { MetadataRoute } from 'next';
import { efGet } from '@/lib/supabase';

// Wird täglich neu generiert
export const revalidate = 86400;

type SitemapEntry = MetadataRoute.Sitemap[number];

type KommuneSitemapResponse = {
  kommunen: Array<{ slug: string; updated_at?: string | null }>;
};

const SITE = 'https://atlas.artgerecht-bauen.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: SitemapEntry[] = [
    {
      url: SITE,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
  ];

  // Alle Kommunen mit daten_status >= 'recherchiert' aus der EF holen
  // Skaliert bis zu mehreren Sitemap-Files (jede ≤50.000 URLs).
  // Aktuell: alle Kommunen, sortiert nach Einwohner abwärts.
  try {
    // Top 1000 für den Anfang — wird später bei Bedarf paginiert
    const data = await efGet<KommuneSitemapResponse>(
      `top-kommunen?limit=1000`,
      86400
    );
    for (const k of data.kommunen || []) {
      entries.push({
        url: `${SITE}/${k.slug}`,
        lastModified: k.updated_at ? new Date(k.updated_at) : new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    }
  } catch (err) {
    console.error('Sitemap: failed to load Kommunen', err);
  }

  return entries;
}
