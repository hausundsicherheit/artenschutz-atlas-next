import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import {
  getKommunePageData,
  groupArtenByArtengruppe,
  getProdukte,
  getTopKommunen,
} from '@/lib/queries';
import HeroSection from '@/components/HeroSection';
import ArtGrid from '@/components/ArtGrid';
import SolutionsSection from '@/components/SolutionsSection';
import MobileShopBar from '@/components/MobileShopBar';

export const revalidate = 86400;
export const dynamicParams = true;

export async function generateStaticParams() {
  // Pre-render nur Top-5 zur Build-Zeit (DNS-Limits vermeiden).
  // Alles andere kommt on-demand via ISR (revalidate=86400).
  const top = await getTopKommunen(5);
  return top.map((k) => ({ slug: k.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const data = await getKommunePageData(slug);
  if (!data) return { title: 'Nicht gefunden' };

  const { kommune } = data;
  const title = `Artenschutz in ${kommune.name}`;
  const description = `Geschützte Arten, Pflichten beim Bauen, Förderprogramme und konkrete Lösungen für ${kommune.name}${kommune.bundesland ? `, ${kommune.bundesland}` : ''}. Der Artenschutz-Atlas Deutschland.`;

  return {
    title,
    description,
    openGraph: { title, description, type: 'article' },
    alternates: { canonical: `/${kommune.slug}` },
  };
}

export default async function KommunePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getKommunePageData(slug);
  if (!data) notFound();

  const { kommune, kreis, arten } = data;
  const artGroups = groupArtenByArtengruppe(arten);
  const artengruppen = artGroups.map((g) => g.artengruppe);

  const allProdukte = await getProdukte({
    artengruppen,
    kontextTags: ['bauen'],
  });

  const verfuegbar = allProdukte.filter((p) => p.status === 'available').slice(0, 4);
  const planned = allProdukte.filter((p) => p.status === 'planned').slice(0, 4);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `Artenschutz in ${kommune.name}`,
    about: {
      '@type': 'Place',
      name: kommune.name,
      ...(kommune.bundesland ? { addressRegion: kommune.bundesland } : {}),
      ...(kommune.latitude && kommune.longitude
        ? {
            geo: {
              '@type': 'GeoCoordinates',
              latitude: kommune.latitude,
              longitude: kommune.longitude,
            },
          }
        : {}),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HeroSection
        kommune={kommune}
        kreis={kreis}
        artenAnzahl={arten.length}
        artengruppenAnzahl={artGroups.length}
        foerderprogrammeAnzahl={7}
      />
      <ArtGrid groups={artGroups} kommunenName={kommune.name} />
      <SolutionsSection
        kommunenName={kommune.name}
        produkteVerfuegbar={verfuegbar}
        produktePlanned={planned}
      />
      <MobileShopBar kommunenName={kommune.name} />
    </>
  );
}
