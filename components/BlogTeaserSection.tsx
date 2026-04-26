import Link from 'next/link';
import BlogCard from './BlogCard';
import type { BlogPostListItem } from '@/lib/queries';

type Props = {
  posts: BlogPostListItem[];
  context: 'kommune' | 'art';
  contextName: string;
};

export default function BlogTeaserSection({ posts, context, contextName }: Props) {
  if (!posts.length) return null;

  const heading =
    context === 'kommune'
      ? `Aus dem Atlas-Blog für ${contextName}`
      : `Atlas-Beiträge zum ${contextName}`;
  const lead =
    context === 'kommune'
      ? `Aktuelle Hintergründe, Förderungen und Praxis-Beispiele rund um ${contextName}.`
      : `Hintergrund-Artikel und Praxis-Hinweise zum ${contextName}.`;

  return (
    <section className="py-12 max-md:py-9 bg-white">
      <div className="max-w-[1280px] mx-auto px-8 max-md:px-4">
        <div className="flex items-end justify-between mb-6 max-md:mb-5 gap-4">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-clay font-semibold mb-2">
              Atlas-Blog
            </div>
            <h2 className="font-serif text-[1.85rem] max-md:text-[1.5rem] leading-tight text-ink mb-1.5">
              {heading}
            </h2>
            <p className="text-[14.5px] text-text-muted max-w-2xl leading-relaxed">{lead}</p>
          </div>
          <Link
            href="/blog"
            className="text-[13px] text-moss hover:text-moss-dark hover:no-underline whitespace-nowrap font-medium max-md:hidden"
          >
            Alle Beiträge →
          </Link>
        </div>

        <div className="grid grid-cols-3 max-[900px]:grid-cols-2 max-[600px]:grid-cols-1 gap-4">
          {posts.map((p) => (
            <BlogCard key={p.id} post={p} variant="compact" />
          ))}
        </div>

        <div className="text-center mt-6 hidden max-md:block">
          <Link href="/blog" className="text-[13px] text-moss font-medium hover:no-underline">
            Alle Beiträge →
          </Link>
        </div>
      </div>
    </section>
  );
}
