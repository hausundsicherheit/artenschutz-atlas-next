import type { Kommune, Kreis, Bundesland } from '@/lib/queries';

type Props = {
  kommune: Kommune & {
    hat_eigene_satzung?: boolean | null;
    hat_bplan_festsetzung?: boolean | null;
    hat_foerderprogramm?: boolean | null;
    hat_kartierung?: boolean | null;
    hat_nabu_kooperation?: boolean | null;
    hat_gutachter_pflicht?: boolean | null;
    hat_aad_projekt?: boolean | null;
    satzung_details?: string | null;
    bplan_beispiel?: string | null;
    foerder_name?: string | null;
    foerder_betrag_min?: number | null;
    foerder_betrag_max?: number | null;
    foerder_url?: string | null;
    kartierung_seit?: number | null;
    kartierung_partner?: string | null;
    aad_projekt_name?: string | null;
    nabu_ortsgruppe?: string | null;
    nabu_url?: string | null;
    daten_status?: string | null;
  };
  kreis: Kreis | null;
  bundesland: Bundesland | null;
};

function fmtEUR(min: number | null | undefined, max: number | null | undefined): string | null {
  if (!min && !max) return null;
  if (min && max) return `${min.toLocaleString('de-DE')} – ${max.toLocaleString('de-DE')} €`;
  if (max) return `bis ${max.toLocaleString('de-DE')} €`;
  if (min) return `ab ${min.toLocaleString('de-DE')} €`;
  return null;
}

export default function KommuneFaktenSection({ kommune, kreis, bundesland }: Props) {
  const hasAnyAtlas =
    kommune.hat_eigene_satzung ||
    kommune.hat_foerderprogramm ||
    kommune.hat_nabu_kooperation ||
    kommune.hat_kartierung ||
    kommune.hat_aad_projekt ||
    kommune.daten_status === 'verifiziert_web' ||
    kommune.daten_status === 'verifiziert_unb';

  // Wenn keine Atlas-Daten vorhanden, zeige nur Stub-Hinweis
  if (!hasAnyAtlas) {
    return (
      <section id="pflichten" className="bg-cream/40 border-y border-border py-12 max-md:py-8">
        <div className="max-w-[1280px] mx-auto px-8 max-md:px-4">
          <div className="text-[12px] uppercase tracking-wider text-clay font-semibold mb-2">Stadt-Atlas</div>
          <h2 className="font-serif text-[2rem] max-md:text-[1.5rem] mb-3">
            Pflichten und Förderungen für <em className="text-moss not-italic italic">{kommune.name}</em>
          </h2>
          <p className="text-text-muted max-w-2xl text-[15px]">
            Für diese Kommune liegen aktuell nur Grunddaten vor. Wir reichern den Atlas laufend an —
            geben Sie uns einen Hinweis, wenn Sie örtliche Programme oder Pflichten kennen.
          </p>
        </div>
      </section>
    );
  }

  const foerderRange = fmtEUR(kommune.foerder_betrag_min, kommune.foerder_betrag_max);

  return (
    <section id="pflichten" className="bg-cream/40 border-y border-border py-14 max-md:py-10">
      <div className="max-w-[1280px] mx-auto px-8 max-md:px-4">
        <div className="text-[12px] uppercase tracking-wider text-clay font-semibold mb-2">Stadt-Atlas</div>
        <h2 className="font-serif text-[2.2rem] max-md:text-[1.7rem] leading-tight mb-3">
          Pflichten & Förderungen für <em className="text-moss not-italic italic">{kommune.name}</em>
        </h2>
        <p className="text-text-muted max-w-2xl text-[15.5px] mb-8 max-md:mb-6 leading-relaxed">
          Was bei Bauvorhaben und Sanierungen in {kommune.name} zu beachten ist — verifiziert aus städtischen Quellen.
          {kommune.daten_status === 'verifiziert_web' && (
            <span className="text-[12px] block mt-1 text-text-dim">Stand: zuletzt aus Web-Quellen verifiziert</span>
          )}
        </p>

        {/* Quick-Facts Grid: Booleans als Chips */}
        <div className="flex flex-wrap gap-2 mb-8 max-md:mb-6">
          {kommune.hat_eigene_satzung && (
            <span className="inline-flex items-center gap-1.5 bg-moss/10 text-moss-dark px-3 py-1.5 rounded-full text-[13px] font-medium">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              Eigene Satzung
            </span>
          )}
          {kommune.hat_bplan_festsetzung && (
            <span className="inline-flex items-center gap-1.5 bg-moss/10 text-moss-dark px-3 py-1.5 rounded-full text-[13px] font-medium">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              B-Plan-Festsetzungen
            </span>
          )}
          {kommune.hat_foerderprogramm && (
            <span className="inline-flex items-center gap-1.5 bg-clay/10 text-clay px-3 py-1.5 rounded-full text-[13px] font-medium">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              Förderprogramm
            </span>
          )}
          {kommune.hat_kartierung && (
            <span className="inline-flex items-center gap-1.5 bg-moss/10 text-moss-dark px-3 py-1.5 rounded-full text-[13px] font-medium">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              Kartierung
            </span>
          )}
          {kommune.hat_nabu_kooperation && (
            <span className="inline-flex items-center gap-1.5 bg-moss/10 text-moss-dark px-3 py-1.5 rounded-full text-[13px] font-medium">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              NABU/LBV-Kooperation
            </span>
          )}
          {kommune.hat_gutachter_pflicht && (
            <span className="inline-flex items-center gap-1.5 bg-amber/15 text-amber px-3 py-1.5 rounded-full text-[13px] font-medium">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg>
              Gutachter empfohlen
            </span>
          )}
          {kommune.hat_aad_projekt && (
            <span className="inline-flex items-center gap-1.5 bg-moss/10 text-moss-dark px-3 py-1.5 rounded-full text-[13px] font-medium">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              Artenschutz-am-Gebäude
            </span>
          )}
        </div>

        {/* Detail-Karten Grid (3 Spalten): Förderung, Satzung, NABU */}
        <div className="grid grid-cols-3 max-[900px]:grid-cols-1 gap-5 mb-6">

          {/* FÖRDERUNG (Highlight wenn vorhanden) */}
          {kommune.hat_foerderprogramm && (
            <div className="bg-white border border-clay/30 rounded-xl p-6 max-md:p-5 shadow-soft relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-clay text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-lg">Förderung</div>
              <div className="text-[12px] uppercase tracking-wider text-text-dim mb-3 mt-1">Stadt {kommune.name}</div>
              {kommune.foerder_name && (
                <h3 className="font-serif text-[1.15rem] leading-tight mb-3 text-ink">{kommune.foerder_name}</h3>
              )}
              {foerderRange && (
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="font-serif text-[1.6rem] text-clay leading-none">{foerderRange}</span>
                </div>
              )}
              {kommune.foerder_url && (
                <a
                  href={kommune.foerder_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[13px] text-moss hover:text-moss-dark font-medium"
                >
                  Programm-Details ↗
                </a>
              )}
            </div>
          )}

          {/* SATZUNG */}
          {(kommune.hat_eigene_satzung || kommune.satzung_details) && (
            <div className="bg-white border border-border rounded-xl p-6 max-md:p-5 shadow-soft">
              <div className="flex items-center gap-2 mb-3">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-moss">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
                <h3 className="font-serif text-[1.15rem] text-ink">Lokales Recht</h3>
              </div>
              {kommune.satzung_details && (
                <p className="text-[14px] text-text-muted leading-relaxed">{kommune.satzung_details}</p>
              )}
            </div>
          )}

          {/* NABU/LBV */}
          {kommune.hat_nabu_kooperation && (
            <div className="bg-white border border-border rounded-xl p-6 max-md:p-5 shadow-soft">
              <div className="flex items-center gap-2 mb-3">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-moss">
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                </svg>
                <h3 className="font-serif text-[1.15rem] text-ink">Naturschutzpartner</h3>
              </div>
              {kommune.nabu_ortsgruppe && (
                <p className="text-[14px] text-ink mb-2 font-medium">{kommune.nabu_ortsgruppe}</p>
              )}
              {kommune.nabu_url && (
                <a
                  href={kommune.nabu_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[13px] text-moss hover:text-moss-dark font-medium"
                >
                  {new URL(kommune.nabu_url).hostname.replace('www.', '')} ↗
                </a>
              )}
            </div>
          )}

          {/* AaD-Projekt (falls vorhanden) */}
          {kommune.hat_aad_projekt && kommune.aad_projekt_name && (
            <div className="bg-moss/5 border border-moss/20 rounded-xl p-6 max-md:p-5">
              <div className="flex items-center gap-2 mb-3">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-moss">
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
                <h3 className="font-serif text-[1.15rem] text-ink">Artenschutz am Gebäude</h3>
              </div>
              <p className="text-[14px] text-text-muted leading-relaxed">{kommune.aad_projekt_name}</p>
            </div>
          )}

          {/* KARTIERUNG (falls vorhanden) */}
          {kommune.hat_kartierung && (kommune.kartierung_seit || kommune.kartierung_partner) && (
            <div className="bg-white border border-border rounded-xl p-6 max-md:p-5 shadow-soft">
              <div className="flex items-center gap-2 mb-3">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-moss">
                  <polygon points="12 2 2 7 12 12 22 7 12 2"/>
                  <polyline points="2 17 12 22 22 17"/>
                  <polyline points="2 12 12 17 22 12"/>
                </svg>
                <h3 className="font-serif text-[1.15rem] text-ink">Biotop-/Artenkartierung</h3>
              </div>
              <div className="text-[14px] text-text-muted leading-relaxed">
                {kommune.kartierung_seit && (<span>seit <strong className="text-ink">{kommune.kartierung_seit}</strong>. </span>)}
                {kommune.kartierung_partner && <span>{kommune.kartierung_partner}</span>}
              </div>
            </div>
          )}

          {/* B-PLAN (falls explizit Beispiel vorhanden) */}
          {kommune.hat_bplan_festsetzung && kommune.bplan_beispiel && (
            <div className="bg-white border border-border rounded-xl p-6 max-md:p-5 shadow-soft">
              <div className="flex items-center gap-2 mb-3">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-moss">
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                  <line x1="9" y1="3" x2="9" y2="21"/>
                </svg>
                <h3 className="font-serif text-[1.15rem] text-ink">B-Plan-Festsetzungen</h3>
              </div>
              <p className="text-[14px] text-text-muted leading-relaxed">{kommune.bplan_beispiel}</p>
            </div>
          )}

        </div>

        {/* Bundesland-Block: Landesweite Pflichten + Landesamt */}
        {bundesland && (bundesland.landesamt_url || bundesland.verordnung_url || bundesland.besonderheiten) && (
          <div className="bg-cream/50 border border-border rounded-xl p-6 max-md:p-5 mt-4">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-moss/15 flex items-center justify-center text-moss-dark shrink-0 max-md:w-9 max-md:h-9">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="2" y1="12" x2="22" y2="12"/>
                  <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
                </svg>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wider text-clay font-semibold mb-1">Landesrecht & Behörden</div>
                <h3 className="font-serif text-[1.2rem] text-ink leading-tight">
                  {bundesland.name}
                  {bundesland.kuerzel && <span className="text-text-dim font-sans text-[14px] ml-2">({bundesland.kuerzel})</span>}
                </h3>
              </div>
            </div>

            {bundesland.besonderheiten && (
              <p className="text-[14px] text-text-muted leading-relaxed mb-4">
                {bundesland.besonderheiten}
              </p>
            )}

            <div className="grid grid-cols-2 max-[700px]:grid-cols-1 gap-3">
              {bundesland.verordnung_name && (
                <div className="bg-white border border-border rounded-lg p-3.5">
                  <div className="text-[10.5px] uppercase tracking-wider text-text-dim font-semibold mb-1.5">Landesnaturschutzgesetz</div>
                  <div className="text-[13.5px] text-ink leading-snug mb-2">{bundesland.verordnung_name}</div>
                  {bundesland.verordnung_url && (
                    <a href={bundesland.verordnung_url} target="_blank" rel="noopener noreferrer" className="text-[12px] text-moss hover:text-moss-dark underline-offset-2 no-underline hover:no-underline">
                      Gesetzestext ↗
                    </a>
                  )}
                </div>
              )}

              {bundesland.landesamt_name && (
                <div className="bg-white border border-border rounded-lg p-3.5">
                  <div className="text-[10.5px] uppercase tracking-wider text-text-dim font-semibold mb-1.5">Zuständiges Landesamt</div>
                  <div className="text-[13.5px] text-ink leading-snug mb-2">{bundesland.landesamt_name}</div>
                  {bundesland.landesamt_url && (
                    <a href={bundesland.landesamt_url} target="_blank" rel="noopener noreferrer" className="text-[12px] text-moss hover:text-moss-dark underline-offset-2 no-underline hover:no-underline">
                      Webseite ↗
                    </a>
                  )}
                </div>
              )}

              {bundesland.landesbauordnung_ref && (
                <div className="bg-white border border-border rounded-lg p-3.5">
                  <div className="text-[10.5px] uppercase tracking-wider text-text-dim font-semibold mb-1.5">Landesbauordnung</div>
                  <div className="text-[13px] text-ink leading-snug">{bundesland.landesbauordnung_ref}</div>
                </div>
              )}

              {bundesland.leitfaden_url && (
                <div className="bg-white border border-border rounded-lg p-3.5">
                  <div className="text-[10.5px] uppercase tracking-wider text-text-dim font-semibold mb-1.5">Artenschutz-Leitfaden</div>
                  <div className="text-[13px] text-ink leading-snug mb-2">Fachinformationen zum Artenschutz im Land</div>
                  <a href={bundesland.leitfaden_url} target="_blank" rel="noopener noreferrer" className="text-[12px] text-moss hover:text-moss-dark underline-offset-2 no-underline hover:no-underline">
                    Zum Leitfaden ↗
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {/* UNB-Kontakt-Block (kommt aus dem Kreis) */}
        {kreis && (kreis.unb_name || kreis.unb_url || kreis.unb_telefon || kreis.unb_email) && (
          <div className="bg-ink text-cream rounded-xl p-6 max-md:p-5 mt-4">
            <div className="grid grid-cols-[auto_1fr_auto] max-md:grid-cols-1 gap-6 max-md:gap-3 items-center">
              <div className="w-12 h-12 rounded-full bg-cream/10 flex items-center justify-center text-cream max-md:w-10 max-md:h-10">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wider text-cream/60 mb-1">Untere Naturschutzbehörde</div>
                <div className="font-serif text-[1.1rem] text-cream">{kreis.unb_name || `Landratsamt ${kreis.name}`}</div>
                <div className="text-[13px] text-cream/80 mt-1 flex flex-wrap gap-x-4 gap-y-1">
                  {kreis.unb_telefon && <span>📞 {kreis.unb_telefon}</span>}
                  {kreis.unb_email && <a href={`mailto:${kreis.unb_email}`} className="text-cream/90 hover:text-white underline-offset-2">{kreis.unb_email}</a>}
                </div>
              </div>
              {kreis.unb_url && (
                <a
                  href={kreis.unb_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-cream/10 hover:bg-cream/20 text-cream px-4 py-2.5 rounded-lg text-[13px] font-medium transition-colors no-underline whitespace-nowrap"
                >
                  Behörden-Webseite ↗
                </a>
              )}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
