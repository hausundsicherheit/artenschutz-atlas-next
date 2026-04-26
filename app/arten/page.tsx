import type { Metadata } from 'next';
import Link from 'next/link';
import { getAlleArten, artengruppeLabel } from '@/lib/queries';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Geschützte Arten am Gebäude — Steckbriefe | Artenschutz-Atlas',
  description:
    'Alle 45 geschützten Arten im Artenschutz-Atlas: Gebäudebrüter, Fledermäuse, Reptilien, Säugetiere und mehr. Mit Steckbriefen, Bauzeitfenstern und CEF-Maßnahmen.',
  alternates: { canonical: '/arten' },
};

const GROUP_COLORS: Record<string, { bg: string; text: string; ring: string; bgHover: string }> = {
  gebaeudebrueter: { bg: 'bg-[#fef4ed]', text: 'text-[#a85c2a]', ring: 'ring-[#e8a575]', bgHover: 'hover:bg-[#fdebdc]' },
  gartenvogel: { bg: 'bg-[#fff8e1]', text: 'text-[#9d7a1a]', ring: 'ring-[#dcc56a]', bgHover: 'hover:bg-[#fef0c8]' },
  fledermaus: { bg: 'bg-[#ede4f5]', text: 'text-[#6a3d8c]', ring: 'ring-[#b395cf]', bgHover: 'hover:bg-[#e3d6ed]' },
  reptil: { bg: 'bg-[#e6f1e9]', text: 'text-[#2d5a3d]', ring: 'ring-[#86b394]', bgHover: 'hover:bg-[#d8e8dc]' },
  amphibie: { bg: 'bg-[#e1eef5]', text: 'text-[#1f5778]', ring: 'ring-[#7eaecc]', bgHover: 'hover:bg-[#d1e3ed]' },
  saeugetier: { bg: 'bg-[#f4ebe0]', text: 'text-[#8a5a15]', ring: 'ring-[#c8a070]', bgHover: 'hover:bg-[#ecdfcd]' },
  insekt: { bg: 'bg-[#fdecec]', text: 'text-[#a8423a]', ring: 'ring-[#d68f88]', bgHover: 'hover:bg-[#f8dcdc]' },
  eule: { bg: 'bg-[#e8e0d0]', text: 'text-[#5a4a2c]', ring: 'ring-[#a89368]', bgHover: 'hover:bg-[#ddd1bb]' },
};

const GROUP_DESCRIPTIONS: Record<string, string> = {
  gebaeudebrueter: 'Vögel, die in oder an Gebäuden brüten — die kritischsten Arten beim Bauen.',
  gartenvogel: 'Vögel, die Gärten und gebäudenahe Strukturen als Lebensraum nutzen.',
  fledermaus: 'Streng geschützte Säugetiere mit Quartieren in Dächern und Spalten.',
  reptil: 'Eidechsen und Schlangen, die südexponierte Mauern und Steinanlagen besiedeln.',
  amphibie: 'Frösche, Kröten und Molche — wichtig für Garten- und Teichplanung.',
  saeugetier: 'Säugetiere abseits der Fledermäuse — mit Lebensraum in Siedlungen.',
  insekt: 'Streng geschützte Insektenarten mit speziellen Habitatansprüchen.',
  eule: 'Streng geschützte Greifvögel der Nacht — oft in Dachstühlen und Türmen.',
};

export default async function ArtenIndex() {
  const arten = await getAlleArten();

  // Gruppieren
  const grouped: Record<string, typeof arten> = {};
  for (const a of arten) {
    const key = a.artengruppe || 'sonstige';
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(a);
  }

  // Gebäudebrüter zuerst (kritischste Gruppe), dann nach Anzahl
  const ORDER = ['gebaeudebrueter', 'fledermaus', 'eule', 'gartenvogel', 'saeugetier', 'reptil', 'amphibie', 'insekt'];
  const groups = ORDER.filter((g) => grouped[g]?.length)
    .map((g) => ({ key: g, arten: grouped[g] }))
    .concat(
      Object.keys(grouped)
        .filter((g) => !ORDER.includes(g))
        .map((g) => ({ key: g, arten: grouped[g] }))
    );

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-cream to-[#fdfbf6] pt-12 pb-10 max-md:pt-8 max-md:pb-7 border-b border-border">
        <div className="max-w-[1280px] mx-auto px-8 max-md:px-4">
          <div className="flex items-center gap-2 text-[13px] max-md:text-[12px] text-text-muted mb-3">
            <Link href="/" className="hover:text-ink hover:no-underline">Atlas</Link>
            <span>·</span>
            <span>Arten</span>
          </div>
          <h1 className="font-serif text-[3rem] max-md:text-[2rem] leading-[1.05] text-ink mb-3">
            Geschützte <em className="text-moss not-italic font-serif italic">Arten</em> am Gebäude
          </h1>
          <p className="text-[17px] max-md:text-[15.5px] text-text-muted leading-relaxed max-w-2xl">
            {arten.length} Arten, die Sie kennen sollten, bevor Sie sanieren oder bauen. Mit Steckbriefen,
            Bauzeitfenstern, CEF-Maßnahmen und Verbreitungs-Karten.
          </p>
        </div>
      </section>

      {/* Anker-Navigation */}
      <section className="bg-white border-b border-border sticky top-0 z-10 backdrop-blur-sm bg-white/95">
        <div className="max-w-[1280px] mx-auto px-8 max-md:px-4 py-3 max-md:py-2.5 overflow-x-auto">
          <div className="flex gap-1.5 max-md:gap-1 whitespace-nowrap">
            {groups.map(({ key, arten: items }) => {
              const c = GROUP_COLORS[key] || GROUP_COLORS.gartenvogel;
              return (
                <a
                  key={key}
                  href={`#${key}`}
                  className={`inline-flex items-center gap-1.5 ${c.bg} ${c.text} ${c.bgHover} px-3 py-1.5 max-md:px-2.5 max-md:py-1 rounded-full text-[12.5px] max-md:text-[12px] font-medium no-underline hover:no-underline transition-colors`}
                >
                  {artengruppeLabel(key)}
                  <span className="opacity-60">·</span>
                  <span className="opacity-80">{items.length}</span>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* Gruppen */}
      {groups.map(({ key, arten: items }) => {
        const c = GROUP_COLORS[key] || GROUP_COLORS.gartenvogel;
        return (
          <section key={key} id={key} className="py-12 max-md:py-9 odd:bg-cream/30 scroll-mt-20">
            <div className="max-w-[1280px] mx-auto px-8 max-md:px-4">
              <div className="mb-8 max-md:mb-6 max-w-2xl">
                <div className={`inline-flex items-center gap-1.5 ${c.bg} ${c.text} px-3 py-1 rounded-full text-[11px] uppercase tracking-wider font-semibold mb-3`}>
                  {items.length} Arten
                </div>
                <h2 className="font-serif text-[2rem] max-md:text-[1.6rem] leading-tight text-ink mb-2">
                  {artengruppeLabel(key)}
                </h2>
                <p className="text-[15px] max-md:text-[14px] text-text-muted leading-relaxed">
                  {GROUP_DESCRIPTIONS[key] || ''}
                </p>
              </div>

              <div className="grid grid-cols-4 max-[1100px]:grid-cols-3 max-[800px]:grid-cols-2 max-[500px]:grid-cols-1 gap-4 max-md:gap-3">
                {items.map((a) => (
                  <Link
                    key={a.slug}
                    href={`/arten/${a.slug}`}
                    className="group bg-white border border-border rounded-2xl overflow-hidden flex flex-col no-underline text-ink hover:text-ink hover:no-underline hover:shadow-card hover:border-border-strong transition-all"
                  >
                    {a.foto_url ? (
                      <div className={`aspect-[4/3] ${c.bg} overflow-hidden`}>
                        <img
                          src={a.foto_url}
                          alt={a.name_deutsch}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    ) : (
                      <div className={`aspect-[4/3] ${c.bg} flex items-center justify-center`}>
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={c.text}>
                          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0116 0z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                      </div>
                    )}
                    <div className="p-4 max-md:p-3 flex flex-col flex-1">
                      <div className="font-serif text-[1.1rem] max-md:text-[1.02rem] text-ink leading-tight mb-1 group-hover:text-moss-dark transition-colors">
                        {a.name_deutsch}
                      </div>
                      <div className="font-serif italic text-[12px] text-text-muted mb-2">
                        {a.name_wissenschaftlich}
                      </div>
                      {a.beschreibung_kurz && (
                        <p className="text-[12.5px] text-text-muted leading-relaxed line-clamp-2 mb-3">
                          {a.beschreibung_kurz}
                        </p>
                      )}
                      <div className="mt-auto pt-2 border-t border-border flex items-center justify-between text-[11px]">
                        {a.schutzstatus && (
                          <span className={`${c.text} font-medium`}>
                            {a.schutzstatus === 'streng' ? 'Streng geschützt' : 'Besonders geschützt'}
                          </span>
                        )}
                        <span className="text-moss">→</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        );
      })}
    </>
  );
}
