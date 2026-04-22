import type { Produkt } from '@/lib/queries';
import type { ReactElement } from 'react';

type Props = {
  kommunenName: string;
  produkteVerfuegbar: Produkt[];
  produktePlanned: Produkt[];
};

const ICONS: Record<string, ReactElement> = {
  bauen: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="10" width="20" height="6" rx="0.5" />
      <line x1="2" y1="13" x2="22" y2="13" />
    </svg>
  ),
  gebaeudebrueter: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="5" y="6" width="14" height="14" rx="1" />
      <circle cx="12" cy="12" r="2.5" />
      <path d="M9 4l3-2 3 2" />
    </svg>
  ),
  fledermaus: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 6l2 12c0 0 3-3 7-3s7 3 7 3l2-12-4 3-2-5-3 3-3-3-2 5z" />
    </svg>
  ),
  reptil: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 18c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
      <path d="M3 14c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
    </svg>
  ),
  saeugetier: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 12c0-4 4-7 8-7s8 3 8 7-4 7-8 7-8-3-8-7z" />
    </svg>
  ),
  insekt: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="4" width="18" height="16" rx="1" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <line x1="3" y1="14" x2="21" y2="14" />
    </svg>
  ),
  default: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="4" y="4" width="16" height="16" rx="1" />
    </svg>
  ),
};

function iconFor(p: Produkt) {
  if (p.kontext_tag && ICONS[p.kontext_tag]) return ICONS[p.kontext_tag];
  if (p.artengruppe && ICONS[p.artengruppe]) return ICONS[p.artengruppe];
  return ICONS.default;
}

function fmtPrice(p: Produkt) {
  if (p.preis_ab == null) return null;
  const n = new Intl.NumberFormat('de-DE', { maximumFractionDigits: 0 }).format(p.preis_ab);
  const prefix = p.preis_einheit === 'lfm' || p.preis_einheit === 'm²' ? 'ab ' : '';
  return { prefix, n, einheit: p.preis_einheit };
}

function ProductCard({ p, planned }: { p: Produkt; planned: boolean }) {
  const price = fmtPrice(p);
  const url = p.produkt_url || (p.sw6_product_number ? `https://artgerecht-bauen.com/detail/${p.sw6_product_number}` : 'https://artgerecht-bauen.com');

  const Wrap = planned ? 'div' : 'a';
  const wrapProps = planned ? {} : ({ href: url } as { href: string });

  return (
    <Wrap
      {...wrapProps}
      className={`bg-white border border-border rounded-2xl overflow-hidden flex flex-col relative no-underline text-ink hover:no-underline ${
        planned
          ? 'opacity-85'
          : 'hover:-translate-y-0.5 hover:shadow-lg hover:border-moss transition-all'
      }`}
    >
      <span
        className={`absolute top-2.5 right-2.5 text-[9.5px] px-2 py-0.5 rounded font-semibold tracking-wider z-[2] uppercase ${
          planned
            ? 'bg-[#fff5e8] text-[#8a5a15]'
            : p.kontext_label?.includes('QNG')
            ? 'bg-clay text-white'
            : 'bg-moss text-white'
        }`}
      >
        {planned ? 'Bald verfügbar' : p.kontext_label || 'Verfügbar'}
      </span>

      <div className={`aspect-[4/3] ${planned ? 'bg-gradient-to-br from-[#f7ede0] to-[#ebe0cd] text-amber/80' : 'bg-gradient-to-br from-sand to-sand-warm text-moss'} flex items-center justify-center`}>
        <span className="w-16 h-16 max-md:w-12 max-md:h-12 opacity-55">{iconFor(p)}</span>
      </div>

      <div className="px-5 pt-4 pb-5 max-md:px-4 max-md:pt-3 max-md:pb-4 flex flex-col flex-1">
        <div className="text-[10.5px] uppercase tracking-wider text-text-dim font-semibold mb-1.5">
          {p.hersteller || '—'}
        </div>
        <div className="text-[14.5px] max-md:text-[13px] font-medium text-ink leading-snug mb-1.5">
          {p.produkt_name}
        </div>
        {p.beschreibung_kurz && (
          <div className="text-[12.5px] max-md:hidden text-text-muted leading-relaxed mb-3">
            {p.beschreibung_kurz}
          </div>
        )}
        <div className="flex items-center justify-between border-t border-border pt-3 mt-auto">
          <div>
            {planned ? (
              <span className="font-serif italic text-[13px] text-amber">Demnächst</span>
            ) : price ? (
              <div className="font-serif text-[1.15rem] max-md:text-[1rem] text-ink leading-none">
                {price.prefix}{price.n} €
                <small className="block text-[11px] max-md:text-[10px] text-text-muted font-sans font-normal mt-0.5">
                  pro {price.einheit}
                </small>
              </div>
            ) : null}
          </div>
          <span className="text-[12px] max-md:text-[11px] text-moss font-medium">
            {planned ? 'Infos →' : 'Konfigurieren →'}
          </span>
        </div>
      </div>
    </Wrap>
  );
}

export default function SolutionsSection({
  kommunenName,
  produkteVerfuegbar,
  produktePlanned,
}: Props) {
  return (
    <section
      id="loesungen"
      className="bg-gradient-to-b from-cream to-sand py-16 max-md:pt-10 max-md:pb-24 relative"
    >
      <div className="max-w-[1280px] mx-auto px-8 max-md:px-4">
        <div className="max-w-[720px] mx-auto mb-10 max-md:mb-7 text-center">
          <div className="inline-flex items-center gap-2 text-[12px] font-semibold text-clay uppercase tracking-wider mb-4">
            <span className="w-6 h-px bg-clay" />
            Aus unserem Shop
            <span className="w-6 h-px bg-clay" />
          </div>
          <h2 className="font-serif text-[2.5rem] max-md:text-[1.75rem] leading-tight text-ink mb-4 max-md:mb-3">
            Artgerecht bauen für <em className="text-moss not-italic">{kommunenName}</em>
          </h2>
          <p className="text-[17px] max-md:text-[15px] text-text-muted leading-relaxed font-serif font-light">
            QNG-zertifizierte Bauteile direkt aus unserem Sortiment — plus unser wachsender Katalog
            an CEF-konformen Artenschutz-Produkten für Ihr Bauvorhaben.
          </p>
        </div>

        {produkteVerfuegbar.length > 0 && (
          <>
            <div className="text-[11px] font-semibold tracking-wider text-text-dim flex items-center gap-2 mt-8 mb-4 uppercase">
              <span className="w-8 h-px bg-border-strong" />
              🏗️ QNG-Ready Bauteile · sofort lieferbar
            </div>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(230px,1fr))] max-md:grid-cols-2 max-[400px]:grid-cols-1 gap-4 max-md:gap-3 max-w-[1100px] mx-auto">
              {produkteVerfuegbar.map((p) => (
                <ProductCard key={p.id} p={p} planned={false} />
              ))}
            </div>
          </>
        )}

        {produktePlanned.length > 0 && (
          <>
            <div className="text-[11px] font-semibold tracking-wider text-text-dim flex items-center gap-2 mt-10 mb-4 uppercase">
              <span className="w-8 h-px bg-border-strong" />
              🪺 CEF-Ersatzquartiere · Sortiment im Aufbau
            </div>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(230px,1fr))] max-md:grid-cols-2 max-[400px]:grid-cols-1 gap-4 max-md:gap-3 max-w-[1100px] mx-auto">
              {produktePlanned.map((p) => (
                <ProductCard key={p.id} p={p} planned={true} />
              ))}
            </div>
          </>
        )}

        <div className="text-center mt-10 max-md:mt-7">
          <a
            href="https://artgerecht-bauen.com"
            className="inline-flex items-center gap-2.5 bg-moss text-white px-7 py-3.5 max-md:px-5 max-md:py-3 rounded-lg text-[14px] font-medium no-underline hover:bg-moss-dark hover:text-white hover:no-underline shadow-card transition-all"
          >
            Alle verfügbaren Produkte ansehen
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
          <p className="mt-4 text-[13px] text-text-muted font-serif italic">
            Bei konkretem Bedarf:{' '}
            <a href="mailto:info@artgerecht-bauen.com" className="text-moss font-medium hover:no-underline">
              info@artgerecht-bauen.com
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
