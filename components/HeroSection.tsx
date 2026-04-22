import Link from 'next/link';
import type { Kommune, Kreis } from '@/lib/queries';

type Props = {
  kommune: Kommune;
  kreis: Kreis | null;
  artenAnzahl: number;
  artengruppenAnzahl: number;
  foerderprogrammeAnzahl: number;
};

export default function HeroSection({
  kommune,
  kreis,
  artenAnzahl,
  artengruppenAnzahl,
  foerderprogrammeAnzahl,
}: Props) {
  const stats = [
    { val: artenAnzahl.toString(), lb: 'Arten im Kreis' },
    { val: kommune.einwohner ? new Intl.NumberFormat('de-DE').format(kommune.einwohner) : '—', lb: 'Einwohner' },
    { val: artengruppenAnzahl.toString(), lb: 'Tiergruppen' },
    { val: foerderprogrammeAnzahl.toString(), lb: 'Förderprogramme' },
  ];

  return (
    <section className="bg-gradient-to-b from-cream to-[#fdfbf6] pt-12 pb-12 max-md:pt-8 max-md:pb-8">
      <div className="max-w-[1280px] mx-auto px-8 max-md:px-4">
        <div className="grid grid-cols-[1.3fr_1fr] max-[900px]:grid-cols-1 gap-12 max-md:gap-6 items-center">
          <div>
            <div className="flex items-center gap-2 text-[13px] max-md:text-[12px] text-text-muted mb-3 flex-wrap">
              <Link href="/" className="hover:text-ink hover:no-underline">Atlas</Link>
              {kommune.bundesland && (
                <>
                  <span>·</span>
                  <span>{kommune.bundesland}</span>
                </>
              )}
              {kreis && (
                <>
                  <span>·</span>
                  <span>{kreis.name}</span>
                </>
              )}
            </div>
            <h1 className="font-serif text-[3.5rem] max-md:text-[2rem] leading-[1.1] text-ink mb-4 max-md:mb-3">
              Artenschutz in <em className="text-moss not-italic font-serif italic">{kommune.name}</em>
            </h1>
            <p className="text-[18px] max-md:text-[16px] text-text-muted leading-relaxed mb-6 max-md:mb-5 max-w-xl">
              {artenAnzahl} geschützte Arten{kommune.bundesland ? ` in ${kommune.bundesland}` : ''}. Was Bauherren, Architekten und
              Planer wissen müssen — kompakt, fundiert, mit Lösungen aus unserem Sortiment.
            </p>

            <div className="flex flex-wrap gap-3 mb-8 max-md:mb-5">
              <Link
                href="#loesungen"
                className="inline-flex items-center gap-2 bg-clay text-white px-5 py-3 rounded-lg text-[14px] font-medium hover:bg-[#a04638] hover:text-white hover:no-underline shadow-card transition-all"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
                </svg>
                Lösungen für {kommune.name}
              </Link>
              <Link
                href="#arten"
                className="inline-flex items-center gap-2 bg-white text-moss px-5 py-3 rounded-lg text-[14px] font-medium border border-border-strong hover:bg-cream hover:text-moss-dark hover:no-underline"
              >
                Atlas durchstöbern →
              </Link>
            </div>

            <div className="grid grid-cols-4 max-md:grid-cols-2 gap-6 max-md:gap-5 pt-6 border-t border-border max-w-2xl">
              {stats.map((s) => (
                <div key={s.lb}>
                  <div className="font-serif text-[1.75rem] max-md:text-[1.5rem] text-ink leading-none">{s.val}</div>
                  <div className="text-[11px] max-md:text-[10.5px] text-text-dim uppercase tracking-wider mt-1.5">{s.lb}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 max-md:p-5 shadow-card border border-border">
            <div className="text-[11px] uppercase tracking-wider text-text-dim mb-2">Pflichten beim Bauen</div>
            <h3 className="font-serif text-[1.4rem] max-md:text-[1.2rem] mb-4">
              § 44 BNatSchG <em className="text-moss not-italic">gilt überall</em>
            </h3>
            <div className="space-y-2.5">
              {[
                'Vor Sanierung: Bestandsaufnahme der Brutquartiere',
                'Bauzeitfenster außerhalb der Brutsaison einhalten',
                'CEF-konforme Ersatzquartiere bei Verlust',
                'Förderfähige Materialien (z.B. QNG-Ready) bevorzugen',
              ].map((tip) => (
                <div
                  key={tip}
                  className="bg-cream px-3 py-2.5 rounded-lg text-[12.5px] text-ink border-l-2 border-moss"
                >
                  ▸ {tip}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
