type ArtGroup = {
  artengruppe: string;
  label: string;
  count: number;
  arten: { name_deutsch: string }[];
};

const COLOR_MAP: Record<string, { bg: string; text: string; ring: string }> = {
  gebaeudebrueter: { bg: 'bg-[#fef4ed]', text: 'text-[#a85c2a]', ring: 'ring-[#e8a575]' },
  gartenvogel:     { bg: 'bg-[#fff8e1]', text: 'text-[#9d7a1a]', ring: 'ring-[#dcc56a]' },
  fledermaus:      { bg: 'bg-[#ede4f5]', text: 'text-[#6a3d8c]', ring: 'ring-[#b395cf]' },
  reptil:          { bg: 'bg-[#e6f1e9]', text: 'text-[#2d5a3d]', ring: 'ring-[#86b394]' },
  amphibie:        { bg: 'bg-[#e1eef5]', text: 'text-[#1f5778]', ring: 'ring-[#7eaecc]' },
  saeugetier:      { bg: 'bg-[#f4ebe0]', text: 'text-[#8a5a15]', ring: 'ring-[#c8a070]' },
  insekt:          { bg: 'bg-[#fdecec]', text: 'text-[#a8423a]', ring: 'ring-[#d68f88]' },
  eule:            { bg: 'bg-[#e8e0d0]', text: 'text-[#5a4a2c]', ring: 'ring-[#a89368]' },
};

export default function ArtGrid({ groups, kommunenName }: { groups: ArtGroup[]; kommunenName: string }) {
  return (
    <section id="arten" className="py-12 max-md:py-8">
      <div className="max-w-[1280px] mx-auto px-8 max-md:px-4">
        <div className="mb-6 max-md:mb-5 max-w-2xl">
          <div className="text-[11px] uppercase tracking-wider text-clay font-semibold mb-2">Geschützte Arten</div>
          <h2 className="font-serif text-[2rem] max-md:text-[1.6rem] text-ink mb-2">
            {groups.reduce((s, g) => s + g.count, 0)} Arten in {kommunenName} und Umgebung
          </h2>
          <p className="text-[15px] text-text-muted leading-relaxed">
            Welche Arten leben hier — und was bedeutet das konkret für ein Bauvorhaben?
          </p>
        </div>

        <div className="grid grid-cols-3 max-[900px]:grid-cols-2 max-[600px]:grid-cols-1 gap-3">
          {groups.map((g) => {
            const c = COLOR_MAP[g.artengruppe] || COLOR_MAP.gartenvogel;
            const namen = g.arten.map((a) => a.name_deutsch).slice(0, 8).join(', ');
            return (
              <div
                key={g.artengruppe}
                className="bg-white border border-border rounded-xl p-4 max-md:p-3.5 hover:shadow-card hover:border-border-strong transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className={`inline-flex items-center justify-center w-9 h-9 rounded-lg ${c.bg} ${c.text}`}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0116 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </span>
                  <div className={`font-serif text-[1.4rem] ${c.text}`}>{g.count}</div>
                </div>
                <div className={`font-medium text-[14.5px] ${c.text} mb-1.5`}>{g.label}</div>
                <div className="text-[12.5px] text-text-muted leading-relaxed">{namen}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
