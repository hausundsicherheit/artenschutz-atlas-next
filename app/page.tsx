import Link from 'next/link';
import { getTopKommunen } from '@/lib/queries';

export const revalidate = 3600;

export default async function Home() {
  const topKommunen = await getTopKommunen(12);

  return (
    <>
      <section className="bg-gradient-to-b from-cream to-[#fdfbf6] py-20 max-md:py-12">
        <div className="max-w-[1280px] mx-auto px-8 max-md:px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="text-[12px] uppercase tracking-wider text-clay font-semibold mb-4">
              Bundesweiter Atlas
            </div>
            <h1 className="font-serif text-[3.5rem] max-md:text-[2.25rem] leading-tight text-ink mb-5">
              Artenschutz <em className="text-moss not-italic">artgerecht</em> bauen
            </h1>
            <p className="text-[18px] max-md:text-[16px] text-text-muted leading-relaxed mb-8 max-md:mb-6">
              Pflichten, Förderprogramme und Lösungen für alle 10.953 Kommunen Deutschlands.
              Welche Arten leben in Ihrer Region — und was bedeutet das für Ihr Bauvorhaben?
            </p>
          </div>

          <div className="max-w-3xl mx-auto mt-12">
            <div className="text-[11px] uppercase tracking-wider text-text-dim font-semibold mb-4 text-center">
              Beliebte Städte
            </div>
            <div className="grid grid-cols-3 max-md:grid-cols-2 gap-3">
              {topKommunen.map((k) => (
                <Link
                  key={k.id}
                  href={`/${k.slug}`}
                  className="bg-white border border-border rounded-xl px-4 py-3 hover:border-moss hover:shadow-card hover:no-underline transition-all"
                >
                  <div className="text-[14.5px] font-medium text-ink">{k.name}</div>
                  <div className="text-[11.5px] text-text-muted mt-0.5">{k.bundesland}</div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 max-md:py-10">
        <div className="max-w-[1280px] mx-auto px-8 max-md:px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-serif text-[2rem] max-md:text-[1.6rem] text-ink mb-4">
              Mehr als nur Information
            </h2>
            <p className="text-[16px] text-text-muted leading-relaxed mb-8">
              Der Atlas verbindet Behörden-Daten, Förderprogramme und konkrete Produkte
              aus unserem Shop — damit aus „Pflicht" eine machbare Lösung wird.
            </p>
            <a
              href="https://artgerecht-bauen.com"
              className="inline-flex items-center gap-2 bg-moss text-white px-6 py-3 rounded-lg text-[14px] font-medium no-underline hover:bg-moss-dark hover:text-white hover:no-underline shadow-card"
            >
              Zum Shop
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
