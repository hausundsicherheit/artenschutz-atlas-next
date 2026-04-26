import type { Metadata } from 'next';
import Link from 'next/link';
import { getBlogPosts } from '@/lib/queries';
import BlogCard from '@/components/BlogCard';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Atlas-Blog — Hintergründe, Förderungen, Praxis | Artenschutz-Atlas',
  description:
    'Aktuelle Beiträge aus dem Artenschutz-Atlas Deutschland: Förderprogramme, lokale Pflichten, Praxis-Beispiele und Tipps für nachhaltiges Bauen mit Artenschutz.',
};

export default async function BlogIndex() {
  const posts = await getBlogPosts(50);
  const [first, ...rest] = posts;

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-cream to-[#fdfbf6] pt-12 pb-10 max-md:pt-8 max-md:pb-7 border-b border-border">
        <div className="max-w-[1280px] mx-auto px-8 max-md:px-4">
          <div className="flex items-center gap-2 text-[13px] max-md:text-[12px] text-text-muted mb-3">
            <Link href="/" className="hover:text-ink hover:no-underline">Atlas</Link>
            <span>·</span>
            <span>Blog</span>
          </div>
          <h1 className="font-serif text-[3rem] max-md:text-[2rem] leading-[1.05] text-ink mb-3 max-md:mb-2">
            Atlas-<em className="text-moss not-italic font-serif italic">Blog</em>
          </h1>
          <p className="text-[17px] max-md:text-[15.5px] text-text-muted leading-relaxed max-w-2xl">
            Hintergründe zu Förderprogrammen, lokalen Pflichten und Praxis-Beispielen für
            nachhaltiges Bauen mit Artenschutz.
          </p>
        </div>
      </section>

      {/* Posts */}
      <section className="py-12 max-md:py-8">
        <div className="max-w-[1280px] mx-auto px-8 max-md:px-4">
          {posts.length === 0 ? (
            <div className="bg-cream/50 border border-border rounded-2xl p-10 text-center">
              <div className="font-serif text-[1.25rem] text-ink mb-2">
                Noch keine Beiträge
              </div>
              <p className="text-[14px] text-text-muted">
                Der Atlas-Blog wird bald mit Inhalten gefüllt — schau gerne in ein paar Tagen wieder vorbei.
              </p>
            </div>
          ) : (
            <>
              {/* Erster Post groß */}
              {first && (
                <div className="mb-10 max-md:mb-7">
                  <BlogCard post={first} variant="list" />
                </div>
              )}
              {/* Rest im Grid */}
              {rest.length > 0 && (
                <div className="grid grid-cols-3 max-[900px]:grid-cols-2 max-[600px]:grid-cols-1 gap-5 max-md:gap-4">
                  {rest.map((p) => (
                    <BlogCard key={p.id} post={p} variant="list" />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}
