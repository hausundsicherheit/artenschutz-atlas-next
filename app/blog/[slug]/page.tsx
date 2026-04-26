import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getBlogPost, getBlogPosts } from '@/lib/queries';
import { markdownToHtml } from '@/lib/markdown';

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  const posts = await getBlogPosts(20);
  return posts.map((p) => ({ slug: p.slug }));
}

function fmtDate(iso: string | null): string | null {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return null;
  }
}

const TOPIC_LABEL: Record<string, string> = {
  foerderung: 'Förderung',
  satzung: 'Satzung',
  aad: 'Artenschutz',
  praxis: 'Praxis',
  sanierung: 'Sanierung',
  news: 'News',
  dachbegruenung: 'Dachbegrünung',
  fassadenbegruenung: 'Fassadenbegrünung',
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) return { title: 'Beitrag nicht gefunden' };

  const title = post.meta_title || `${post.title} | Atlas-Blog`;
  const description = post.meta_description || post.excerpt;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      ...(post.hero_image_url ? { images: [{ url: post.hero_image_url }] } : {}),
    },
    alternates: { canonical: `/blog/${post.slug}` },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) notFound();

  const date = fmtDate(post.published_at);
  const html = markdownToHtml(post.body_md);

  // Verwandte Posts (gleicher Topic-Tag)
  const allPosts = await getBlogPosts(20);
  const related = allPosts
    .filter((p) => p.id !== post.id)
    .filter((p) => p.topic_tags.some((t) => post.topic_tags.includes(t)))
    .slice(0, 3);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    ...(post.hero_image_url ? { image: post.hero_image_url } : {}),
    datePublished: post.published_at,
    author: { '@type': 'Organization', name: 'Artenschutz-Atlas' },
    publisher: {
      '@type': 'Organization',
      name: 'Haus und Sicherheit GmbH',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="bg-gradient-to-b from-cream to-[#fdfbf6] pt-10 pb-9 max-md:pt-7 max-md:pb-7 border-b border-border">
        <div className="max-w-[820px] mx-auto px-8 max-md:px-4">
          <div className="flex items-center gap-2 text-[12.5px] text-text-muted mb-3 flex-wrap">
            <Link href="/" className="hover:text-ink hover:no-underline">Atlas</Link>
            <span>·</span>
            <Link href="/blog" className="hover:text-ink hover:no-underline">Blog</Link>
            {post.topic_tags?.[0] && (
              <>
                <span>·</span>
                <span>{TOPIC_LABEL[post.topic_tags[0]] || post.topic_tags[0]}</span>
              </>
            )}
          </div>
          <h1 className="font-serif text-[2.5rem] max-md:text-[1.85rem] leading-[1.15] text-ink mb-3 max-md:mb-2.5">
            {post.title}
          </h1>
          {post.subtitle && (
            <div className="font-serif italic text-[1.15rem] max-md:text-[1rem] text-text-muted mb-4 max-md:mb-3">
              {post.subtitle}
            </div>
          )}
          <div className="flex items-center gap-3 text-[12.5px] text-text-dim flex-wrap">
            {date && <span>{date}</span>}
            {post.source_label && (
              <>
                <span>·</span>
                <span>Quelle: {post.source_label}</span>
              </>
            )}
            {post.ai_generated && (
              <>
                <span>·</span>
                <span className="inline-flex items-center gap-1 bg-moss/10 text-moss-dark px-2 py-0.5 rounded text-[11px] font-medium">
                  KI-zusammengefasst
                </span>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Hero Image */}
      {post.hero_image_url && (
        <div className="bg-white">
          <div className="max-w-[820px] mx-auto px-8 max-md:px-4 pt-8 max-md:pt-6">
            <div className="aspect-[16/9] bg-cream rounded-2xl overflow-hidden border border-border">
              <img
                src={post.hero_image_url}
                alt={post.hero_image_alt || ''}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      )}

      {/* Body */}
      <article className="bg-white pb-14 max-md:pb-10">
        <div className="max-w-[720px] mx-auto px-8 max-md:px-4 pt-10 max-md:pt-7">
          <div
            className="blog-body"
            dangerouslySetInnerHTML={{ __html: html }}
          />

          {/* Quelle-Footer (Transparenz) */}
          {(post.source_url || post.source_label) && (
            <div className="mt-12 max-md:mt-9 pt-6 border-t border-border">
              <div className="text-[11px] uppercase tracking-wider text-text-dim font-semibold mb-2">
                Quelle
              </div>
              <div className="text-[13.5px] text-text-muted leading-relaxed">
                {post.source_label && <span className="text-ink">{post.source_label}</span>}
                {post.source_url && (
                  <>
                    {post.source_label && ' · '}
                    <a
                      href={post.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-moss hover:text-moss-dark underline-offset-2"
                    >
                      Original lesen ↗
                    </a>
                  </>
                )}
              </div>
              {post.ai_generated && (
                <div className="text-[12px] text-text-dim mt-2 leading-relaxed">
                  Dieser Beitrag wurde redaktionell zusammengefasst{post.ai_model ? ` (Modell: ${post.ai_model})` : ''}. Verbindliche Auskünfte erteilen die genannten Stellen.
                </div>
              )}
            </div>
          )}

          {/* Tags / Verlinkung zurück zu Stadt + Art */}
          {(post.kommune_slugs.length > 0 || post.art_slugs.length > 0) && (
            <div className="mt-8 pt-6 border-t border-border">
              <div className="text-[11px] uppercase tracking-wider text-text-dim font-semibold mb-3">
                Im Atlas
              </div>
              <div className="flex flex-wrap gap-2">
                {post.kommune_slugs.map((s) => (
                  <Link
                    key={s}
                    href={`/${s}`}
                    className="inline-flex items-center gap-1 bg-moss/10 text-moss-dark hover:bg-moss/15 px-3 py-1.5 rounded-full text-[12.5px] font-medium no-underline hover:no-underline transition-colors"
                  >
                    📍 {s.replace(/-(stadt|landeshauptstadt|freie-und-hansestadt|hansestadt).*$/, '').replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                  </Link>
                ))}
                {post.art_slugs.map((s) => (
                  <Link
                    key={s}
                    href={`/arten/${s}`}
                    className="inline-flex items-center gap-1 bg-clay/10 text-clay hover:bg-clay/15 px-3 py-1.5 rounded-full text-[12.5px] font-medium no-underline hover:no-underline transition-colors"
                  >
                    🦅 {s.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>

      {/* Verwandte Beiträge */}
      {related.length > 0 && (
        <section className="bg-cream/40 border-t border-border py-12 max-md:py-9">
          <div className="max-w-[1280px] mx-auto px-8 max-md:px-4">
            <div className="text-[11px] uppercase tracking-wider text-clay font-semibold mb-2">
              Weiterlesen
            </div>
            <h2 className="font-serif text-[1.6rem] max-md:text-[1.3rem] text-ink mb-6">
              Verwandte Beiträge
            </h2>
            <div className="grid grid-cols-3 max-[900px]:grid-cols-2 max-[600px]:grid-cols-1 gap-4">
              {related.map((r) => (
                <Link
                  key={r.id}
                  href={`/blog/${r.slug}`}
                  className="bg-white border border-border rounded-xl p-4 hover:border-moss hover:shadow-card no-underline text-ink hover:text-ink hover:no-underline transition-all"
                >
                  <div className="font-serif text-[1.05rem] leading-tight text-ink mb-2">
                    {r.title}
                  </div>
                  <div className="text-[12.5px] text-text-muted leading-relaxed line-clamp-2">
                    {r.excerpt}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
