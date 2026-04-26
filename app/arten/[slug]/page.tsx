import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  getArt,
  getKommunenForArt,
  getAlleArten,
  artengruppeLabel,
} from '@/lib/queries';
import SolutionsSection from '@/components/SolutionsSection';

export const revalidate = 86400;
export const dynamicParams = true;

export async function generateStaticParams() {
  const arten = await getAlleArten();
  return arten.slice(0, 15).map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const art = await getArt(slug);
  if (!art) return { title: 'Art nicht gefunden' };

  const title = `${art.name_deutsch} (${art.name_wissenschaftlich}) — Artenschutz beim Bauen | Atlas`;
  const description =
    art.beschreibung_kurz ||
    `Steckbrief ${art.name_deutsch}: Schutzstatus, Bauzeitfenster, Konflikte mit Bauvorhaben und passende CEF-Maßnahmen aus dem Artenschutz-Atlas.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      ...(art.foto_url ? { images: [{ url: art.foto_url }] } : {}),
    },
    alternates: { canonical: `/arten/${art.slug}` },
  };
}

const STATUS_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  besonders: { bg: 'bg-amber/15', text: 'text-amber', label: 'Besonders geschützt' },
  streng: { bg: 'bg-clay/15', text: 'text-clay', label: 'Streng geschützt' },
};

export default async function ArtPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const art = await getArt(slug);
  if (!art) notFound();

  const kommunen = await getKommunenForArt(art.id, 12);

  const statusInfo = art.schutzstatus
    ? STATUS_COLORS[art.schutzstatus] || { bg: 'bg-moss/15', text: 'text-moss-dark', label: art.schutzstatus }
    : null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: art.name_deutsch,
    description: art.beschreibung_kurz,
    ...(art.foto_url ? { image: art.foto_url } : {}),
    about: { '@type': 'Thing', name: art.name_wissenschaftlich },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* HERO */}
      <section className="bg-gradient-to-b from-cream to-[#fdfbf6] pt-12 pb-12 max-md:pt-8 max-md:pb-8">
        <div className="max-w-[1280px] mx-auto px-8 max-md:px-4">
          <div className="grid grid-cols-[1.3fr_1fr] max-[900px]:grid-cols-1 gap-12 max-md:gap-6 items-start">
            <div>
              <div className="flex items-center gap-2 text-[13px] max-md:text-[12px] text-text-muted mb-3 flex-wrap">
                <Link href="/" className="hover:text-ink hover:no-underline">Atlas</Link>
                <span>·</span>
                <Link href="/arten" className="hover:text-ink hover:no-underline">Arten</Link>
                <span>·</span>
                <span>{artengruppeLabel(art.artengruppe)}</span>
              </div>

              <h1 className="font-serif text-[3.5rem] max-md:text-[2rem] leading-[1.05] text-ink mb-2 max-md:mb-1">
                <em className="text-moss not-italic font-serif italic">{art.name_deutsch}</em>
              </h1>
              <div className="font-serif italic text-[1.15rem] max-md:text-[1rem] text-text-muted mb-5">
                {art.name_wissenschaftlich}
              </div>

              {art.beschreibung_kurz && (
                <p className="text-[18px] max-md:text-[16px] text-text leading-relaxed mb-6 max-md:mb-5 max-w-xl">
                  {art.beschreibung_kurz}
                </p>
              )}

              <div className="flex flex-wrap gap-2 mb-6">
                {statusInfo && (
                  <span className={`inline-flex items-center gap-1.5 ${statusInfo.bg} ${statusInfo.text} px-3 py-1.5 rounded-full text-[13px] font-medium`}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M12 22s-8-4-8-12V5l8-3 8 3v5c0 8-8 12-8 12z"/>
                    </svg>
                    {statusInfo.label}
                  </span>
                )}
                {art.rote_liste_deutschland && (
                  <span className="inline-flex items-center gap-1.5 bg-clay/10 text-clay px-3 py-1.5 rounded-full text-[13px] font-medium">
                    Rote Liste DE: {art.rote_liste_deutschland}
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5 bg-moss/10 text-moss-dark px-3 py-1.5 rounded-full text-[13px] font-medium">
                  {artengruppeLabel(art.artengruppe)}
                </span>
              </div>

              {art.stimme_url && (
                <a
                  href={art.stimme_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[13.5px] text-moss hover:text-moss-dark hover:no-underline border border-moss/30 hover:border-moss px-3 py-1.5 rounded-full transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                  </svg>
                  Stimme anhören (Xeno-Canto)
                </a>
              )}
            </div>

            {/* Foto rechts */}
            {art.foto_url && (
              <div className="bg-white rounded-2xl shadow-card border border-border overflow-hidden">
                <img
                  src={art.foto_url}
                  alt={art.name_deutsch}
                  className="w-full aspect-[4/3] object-cover"
                />
                {art.bild_attribution && (
                  <div className="px-3 py-2 text-[10.5px] text-text-dim leading-snug bg-cream/30">
                    {art.bild_attribution}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ART-FAKTEN */}
      <section className="bg-cream/40 border-y border-border py-14 max-md:py-10">
        <div className="max-w-[1280px] mx-auto px-8 max-md:px-4">
          <div className="text-[12px] uppercase tracking-wider text-clay font-semibold mb-2">Art-Atlas</div>
          <h2 className="font-serif text-[2.2rem] max-md:text-[1.7rem] leading-tight mb-3">
            Was Sie über den <em className="text-moss not-italic italic">{art.name_deutsch}</em> wissen müssen
          </h2>
          <p className="text-text-muted max-w-2xl text-[15.5px] mb-8 max-md:mb-6 leading-relaxed">
            Lebensweise, betroffene Bauvorhaben, optimale Bauzeitfenster und konkrete Schutzmaßnahmen — verifiziert aus Fachliteratur und Praxis.
          </p>

          <div className="grid grid-cols-2 max-[900px]:grid-cols-1 gap-5 mb-6">
            {art.lebensweise && (
              <div className="bg-white border border-border rounded-xl p-6 max-md:p-5 shadow-soft">
                <div className="flex items-center gap-2 mb-3">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-moss">
                    <path d="M12 2v6M12 18v4M4.93 4.93l4.24 4.24M14.83 14.83l4.24 4.24M2 12h6M18 12h4M4.93 19.07l4.24-4.24M14.83 9.17l4.24-4.24" />
                  </svg>
                  <h3 className="font-serif text-[1.15rem] text-ink">Lebensweise</h3>
                </div>
                <p className="text-[14px] text-text-muted leading-relaxed">{art.lebensweise}</p>
              </div>
            )}

            {art.relevante_strukturen && (
              <div className="bg-white border border-border rounded-xl p-6 max-md:p-5 shadow-soft">
                <div className="flex items-center gap-2 mb-3">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-moss">
                    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                    <polyline points="9 22 9 12 15 12 15 22"/>
                  </svg>
                  <h3 className="font-serif text-[1.15rem] text-ink">Relevante Gebäudestrukturen</h3>
                </div>
                <p className="text-[14px] text-text-muted leading-relaxed">{art.relevante_strukturen}</p>
              </div>
            )}

            {/* Konflikt-Bauvorhaben — Highlight */}
            {art.konflikt_bauvorhaben && art.konflikt_bauvorhaben.length > 0 && (
              <div className="bg-white border border-clay/30 rounded-xl p-6 max-md:p-5 shadow-soft relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-clay text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-lg">
                  Bau-Risiko
                </div>
                <div className="flex items-center gap-2 mb-3 mt-2">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-clay">
                    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                    <line x1="12" y1="9" x2="12" y2="13"/>
                    <line x1="12" y1="17" x2="12.01" y2="17"/>
                  </svg>
                  <h3 className="font-serif text-[1.15rem] text-ink">Bauvorhaben mit Konflikt-Risiko</h3>
                </div>
                <ul className="space-y-1.5">
                  {art.konflikt_bauvorhaben.map((kb) => (
                    <li key={kb} className="text-[14px] text-text flex items-start gap-2">
                      <span className="text-clay mt-1 leading-none">▸</span>
                      <span>{kb}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Bauzeitfenster */}
            {(art.bauzeit_optimal || art.bauzeitfenster) && (
              <div className="bg-moss/5 border border-moss/30 rounded-xl p-6 max-md:p-5">
                <div className="flex items-center gap-2 mb-3">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-moss">
                    <rect x="3" y="4" width="18" height="18" rx="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  <h3 className="font-serif text-[1.15rem] text-ink">Optimales Bauzeitfenster</h3>
                </div>
                <p className="text-[14px] text-text leading-relaxed">{art.bauzeit_optimal || art.bauzeitfenster}</p>
              </div>
            )}

            {art.anzeichen_am_gebaeude && (
              <div className="bg-white border border-border rounded-xl p-6 max-md:p-5 shadow-soft">
                <div className="flex items-center gap-2 mb-3">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-moss">
                    <circle cx="11" cy="11" r="8"/>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                  <h3 className="font-serif text-[1.15rem] text-ink">Anzeichen am Gebäude</h3>
                </div>
                <p className="text-[14px] text-text-muted leading-relaxed">{art.anzeichen_am_gebaeude}</p>
              </div>
            )}

            {art.bestand_trend && (
              <div className="bg-white border border-border rounded-xl p-6 max-md:p-5 shadow-soft">
                <div className="flex items-center gap-2 mb-3">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-moss">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                    <polyline points="17 6 23 6 23 12"/>
                  </svg>
                  <h3 className="font-serif text-[1.15rem] text-ink">Bestand & Trend</h3>
                </div>
                <p className="text-[14px] text-text-muted leading-relaxed">{art.bestand_trend}</p>
              </div>
            )}
          </div>

          {/* Nisthilfen / CEF-Maßnahmen */}
          {(art.nisthilfen?.length || art.nisthilfen_typen?.length || art.nisthilfen_masse) && (
            <div className="bg-ink text-cream rounded-xl p-6 max-md:p-5 mt-6">
              <div className="flex items-center gap-2 mb-4">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                  <circle cx="12" cy="14" r="2.5"/>
                </svg>
                <h3 className="font-serif text-[1.3rem] text-cream">CEF-Maßnahmen & Nisthilfen</h3>
              </div>

              {art.nisthilfen && art.nisthilfen.length > 0 && (
                <div className="mb-4">
                  <div className="text-[11px] uppercase tracking-wider text-cream/60 mb-2">Bewährte Modelle</div>
                  <div className="flex flex-wrap gap-2">
                    {art.nisthilfen.map((n) => (
                      <span key={n} className="bg-cream/10 text-cream px-3 py-1.5 rounded-full text-[13px]">{n}</span>
                    ))}
                  </div>
                </div>
              )}

              {art.nisthilfen_masse && (
                <div className="mb-3">
                  <div className="text-[11px] uppercase tracking-wider text-cream/60 mb-1">Maße</div>
                  <p className="text-[13.5px] text-cream/90 leading-relaxed">{art.nisthilfen_masse}</p>
                </div>
              )}
              {art.nisthilfen_platzierung && (
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-cream/60 mb-1">Platzierung</div>
                  <p className="text-[13.5px] text-cream/90 leading-relaxed">{art.nisthilfen_platzierung}</p>
                </div>
              )}
            </div>
          )}

          {/* Praxis-Beispiele */}
          {art.praxis_beispiele && art.praxis_beispiele.length > 0 && (
            <div className="mt-6">
              <div className="text-[11px] uppercase tracking-wider text-clay font-semibold mb-3">Aus der Praxis</div>
              <div className="grid grid-cols-3 max-[900px]:grid-cols-1 gap-4">
                {art.praxis_beispiele.map((p, i) => (
                  <div key={i} className="bg-white border border-border rounded-xl p-5 shadow-soft">
                    <div className="font-serif text-[1.05rem] text-ink mb-1">{p.ort}</div>
                    {p.jahr && <div className="text-[11.5px] text-text-dim mb-2">{p.jahr}</div>}
                    <p className="text-[13.5px] text-text-muted leading-relaxed">{p.lehre}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quellen */}
          {art.quellen && art.quellen.length > 0 && (
            <div className="mt-6 pt-6 border-t border-border">
              <div className="text-[11px] uppercase tracking-wider text-text-dim font-semibold mb-2">Quellen</div>
              <ul className="space-y-1">
                {art.quellen.map((q, i) => (
                  <li key={i} className="text-[12.5px] text-text-muted">
                    <a href={q.url} target="_blank" rel="noopener noreferrer" className="hover:text-moss hover:no-underline underline-offset-2">
                      {q.titel || q.url}
                    </a>
                    {q.doi && <span className="text-text-dim ml-2">DOI: {q.doi}</span>}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* WO LEBT DIE ART — Stadt-Querverlinkung */}
      {kommunen.length > 0 && (
        <section className="py-14 max-md:py-10">
          <div className="max-w-[1280px] mx-auto px-8 max-md:px-4">
            <div className="text-[12px] uppercase tracking-wider text-clay font-semibold mb-2">Vorkommen</div>
            <h2 className="font-serif text-[2rem] max-md:text-[1.6rem] leading-tight mb-3">
              Wo der <em className="text-moss not-italic italic">{art.name_deutsch}</em> in deutschen Großstädten lebt
            </h2>
            <p className="text-text-muted text-[15px] mb-8 max-md:mb-6 max-w-2xl leading-relaxed">
              Top-{kommunen.length} Städte (≥100.000 Einwohner) im Verbreitungsgebiet. Klicken Sie auf eine Stadt für lokale Pflichten, Förderungen und passende Lösungen.
            </p>

            <div className="grid grid-cols-4 max-[900px]:grid-cols-3 max-[600px]:grid-cols-2 gap-3">
              {kommunen.map((k) => (
                <Link
                  key={k.slug}
                  href={`/${k.slug}`}
                  className="bg-white border border-border rounded-xl p-4 max-md:p-3 hover:border-moss hover:shadow-card no-underline text-ink hover:text-ink hover:no-underline transition-all flex flex-col gap-1"
                >
                  <div className="text-[10.5px] uppercase tracking-wider text-clay font-semibold">
                    {k.haeufigkeit || 'Vorkommen'}
                  </div>
                  <div className="font-serif text-[1rem] max-md:text-[0.95rem] leading-tight text-ink">
                    {k.name.replace(/, (Stadt|Landeshauptstadt|Universitätsstadt|Hansestadt|Freie und Hansestadt).*$/,'')}
                  </div>
                  {k.einwohner && (
                    <div className="text-[11.5px] text-text-dim mt-auto">
                      {new Intl.NumberFormat('de-DE').format(k.einwohner)} EW
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SHOP-LÖSUNGEN — gleiche Komponente wie auf Stadtseiten */}
      <SolutionsSection kommunenName={art.name_deutsch} />
    </>
  );
}
