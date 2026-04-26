type Props = {
  kommunenName: string;
};

type Kategorie = {
  slug: string;
  name: string;
  badge: string;
  badgeColor: 'clay' | 'moss';
  beschreibung: string;
  hersteller: string;
  url: string;
  iconKey: 'aluminium' | 'gussmarmor-aussen' | 'gussmarmor-innen' | 'werzalit';
  features: string[];
};

const KATEGORIEN: Kategorie[] = [
  {
    slug: 'aluminium-aussen',
    name: 'Aluminium Außenfensterbänke',
    badge: 'QNG-ready',
    badgeColor: 'clay',
    beschreibung:
      'Klimafreundlich gebaut: 100 % recyclebar, langlebig, witterungsbeständig. Made in Germany.',
    hersteller: 'RBB',
    url: 'https://artgerecht-bauen.com/Aluminium-Fensterbaenke-Aussen',
    iconKey: 'aluminium',
    features: ['DGNB Position 4', 'BNB Niveau 5', '100 % recyclebar'],
  },
  {
    slug: 'gussmarmor-aussen',
    name: 'Gussmarmor Außenfensterbänke',
    badge: 'HW 5 · Hagelfest',
    badgeColor: 'clay',
    beschreibung:
      'Helopal Gussmarmor: hält 5 cm Hagel aus. Hagelwiderstandsklasse HW 5, frostsicher, alterungsbeständig.',
    hersteller: 'Helopal',
    url: 'https://artgerecht-bauen.com/Gussmarmor-Fensterbaenke-Aussen',
    iconKey: 'gussmarmor-aussen',
    features: ['HW 5 zertifiziert', '4 Linien · 18 Dekore', 'Maßanfertigung'],
  },
  {
    slug: 'gussmarmor-innen',
    name: 'Gussmarmor Innenfensterbänke',
    badge: 'QNG-ready',
    badgeColor: 'moss',
    beschreibung:
      'Schadstoffgeprüft, kratzfest, edel. Helopal-Linien: linea, woodline, classic, puritamo.',
    hersteller: 'Helopal',
    url: 'https://artgerecht-bauen.com/Gussmarmor-Fensterbaenke-Innen',
    iconKey: 'gussmarmor-innen',
    features: ['Schadstoffgeprüft', 'Wohngesund', '4 Designlinien'],
  },
  {
    slug: 'werzalit-innen',
    name: 'Werzalit Innenfensterbänke',
    badge: 'Wohngesund',
    badgeColor: 'moss',
    beschreibung:
      'Der bewährte Klassiker: compact, exclusiv und expona. Schadstoffgeprüft, vielseitig, langlebig.',
    hersteller: 'Werzalit',
    url: 'https://artgerecht-bauen.com/Werzalit-Fensterbaenke-Innen',
    iconKey: 'werzalit',
    features: ['compact · exclusiv · expona', 'Schadstoffgeprüft', 'Bewährter Klassiker'],
  },
];

function CategoryIcon({ k }: { k: Kategorie['iconKey'] }) {
  const c = 'w-14 h-14 max-md:w-12 max-md:h-12 opacity-65';
  switch (k) {
    case 'aluminium':
      return (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5" className={c}>
          <rect x="6" y="22" width="52" height="20" rx="1" />
          <line x1="6" y1="32" x2="58" y2="32" strokeOpacity="0.4" />
          <line x1="14" y1="22" x2="14" y2="42" strokeOpacity="0.3" />
          <line x1="50" y1="22" x2="50" y2="42" strokeOpacity="0.3" />
          <path d="M10 18 L 32 8 L 54 18" strokeWidth="1.8" />
        </svg>
      );
    case 'gussmarmor-aussen':
      return (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5" className={c}>
          <rect x="6" y="22" width="52" height="20" rx="1.5" />
          <path d="M14 28 q 6 -3 12 0 t 12 0 t 12 0" strokeWidth="1.5" strokeOpacity="0.5" />
          <path d="M14 36 q 6 -2 12 0 t 12 0 t 12 0" strokeWidth="1.5" strokeOpacity="0.5" />
          <circle cx="20" cy="14" r="2" fill="currentColor" stroke="none" opacity="0.6" />
          <circle cx="32" cy="10" r="2" fill="currentColor" stroke="none" opacity="0.6" />
          <circle cx="44" cy="14" r="2" fill="currentColor" stroke="none" opacity="0.6" />
        </svg>
      );
    case 'gussmarmor-innen':
      return (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5" className={c}>
          <rect x="6" y="22" width="52" height="20" rx="1.5" />
          <path d="M14 28 q 6 -3 12 0 t 12 0 t 12 0" strokeWidth="1.5" strokeOpacity="0.5" />
          <path d="M14 36 q 6 -2 12 0 t 12 0 t 12 0" strokeWidth="1.5" strokeOpacity="0.5" />
          <path d="M6 50 L 58 50" strokeOpacity="0.3" />
          <path d="M6 56 L 58 56" strokeOpacity="0.2" />
        </svg>
      );
    case 'werzalit':
      return (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5" className={c}>
          <rect x="6" y="22" width="52" height="20" rx="1" />
          <path d="M10 28 q 4 0 4 4 t 4 -4 t 4 4 t 4 -4 t 4 4 t 4 -4 t 4 4 t 4 -4 t 4 4 t 4 -4" strokeWidth="1.4" strokeOpacity="0.45" />
          <path d="M10 36 q 5 -2 10 0 t 10 0 t 10 0 t 10 0" strokeWidth="1.4" strokeOpacity="0.4" />
        </svg>
      );
  }
}

function CategoryCard({ k }: { k: Kategorie }) {
  const badgeClasses =
    k.badgeColor === 'clay' ? 'bg-clay text-white' : 'bg-moss text-white';

  return (
    <a
      href={k.url}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-white border border-border rounded-2xl overflow-hidden flex flex-col relative no-underline text-ink hover:no-underline hover:-translate-y-0.5 hover:shadow-lg hover:border-moss transition-all"
    >
      <span
        className={`absolute top-3 right-3 text-[10px] px-2.5 py-1 rounded font-semibold tracking-wider z-[2] uppercase ${badgeClasses}`}
      >
        {k.badge}
      </span>

      <div className="aspect-[5/3] bg-gradient-to-br from-sand to-sand-warm text-moss flex items-center justify-center">
        <CategoryIcon k={k.iconKey} />
      </div>

      <div className="px-5 pt-4 pb-5 max-md:px-4 max-md:pt-3.5 max-md:pb-4 flex flex-col flex-1">
        <div className="text-[10.5px] uppercase tracking-wider text-text-dim font-semibold mb-1.5">
          {k.hersteller}
        </div>
        <div className="font-serif text-[1.15rem] max-md:text-[1.05rem] text-ink leading-snug mb-2">
          {k.name}
        </div>
        <div className="text-[13px] max-md:text-[12.5px] text-text-muted leading-relaxed mb-3">
          {k.beschreibung}
        </div>

        <ul className="space-y-1 mb-4">
          {k.features.map((f) => (
            <li
              key={f}
              className="text-[12px] text-text-muted flex items-start gap-1.5 leading-snug"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                className="text-moss shrink-0 mt-1"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>{f}</span>
            </li>
          ))}
        </ul>

        <div className="flex items-center justify-between border-t border-border pt-3 mt-auto">
          <span className="text-[12px] text-text-muted font-serif italic">Sortiment ansehen</span>
          <span className="text-[13px] text-moss font-medium">→</span>
        </div>
      </div>
    </a>
  );
}

export default function SolutionsSection({ kommunenName }: Props) {
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
            QNG-zertifizierte Fensterbänke aus vier Sortimenten — von Helopal Gussmarmor mit
            Hagelschutz HW 5 bis Werzalit, dem bewährten Klassiker für gesundes Wohnen.
          </p>
        </div>

        <div className="grid grid-cols-2 max-md:grid-cols-1 gap-5 max-md:gap-4 max-w-[1100px] mx-auto">
          {KATEGORIEN.map((k) => (
            <CategoryCard key={k.slug} k={k} />
          ))}
        </div>

        <div className="text-center mt-10 max-md:mt-7">
          <a
            href="https://artgerecht-bauen.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 bg-moss text-white px-7 py-3.5 max-md:px-5 max-md:py-3 rounded-lg text-[14px] font-medium no-underline hover:bg-moss-dark hover:text-white hover:no-underline shadow-card transition-all"
          >
            Zum kompletten Sortiment
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
          <p className="mt-4 text-[13px] text-text-muted font-serif italic">
            Beratung &amp; Planung:{' '}
            <a href="mailto:info@artgerecht-bauen.com" className="text-moss font-medium hover:no-underline">
              info@artgerecht-bauen.com
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
