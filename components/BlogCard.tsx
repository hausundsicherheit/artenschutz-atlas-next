import Link from 'next/link';
import type { BlogPostListItem } from '@/lib/queries';

function fmtDate(iso: string | null): string | null {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: 'short',
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

export default function BlogCard({
  post,
  variant = 'list',
}: {
  post: BlogPostListItem;
  variant?: 'list' | 'compact';
}) {
  const date = fmtDate(post.published_at);
  const tag = post.topic_tags?.[0];
  const label = tag ? TOPIC_LABEL[tag] || tag : null;

  if (variant === 'compact') {
    return (
      <Link
        href={`/blog/${post.slug}`}
        className="block bg-white border border-border rounded-xl p-4 max-md:p-3.5 hover:border-moss hover:shadow-card no-underline text-ink hover:text-ink hover:no-underline transition-all"
      >
        {label && (
          <div className="text-[10.5px] uppercase tracking-wider text-clay font-semibold mb-1.5">
            {label}
          </div>
        )}
        <div className="font-serif text-[1.05rem] leading-tight text-ink mb-1.5">
          {post.title}
        </div>
        <div className="text-[12.5px] text-text-muted leading-relaxed line-clamp-2">
          {post.excerpt}
        </div>
        {date && (
          <div className="text-[11px] text-text-dim mt-2 pt-2 border-t border-border">
            {date}
          </div>
        )}
      </Link>
    );
  }

  // List-Variant: größer, mit Bild
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group bg-white border border-border rounded-2xl overflow-hidden flex flex-col no-underline text-ink hover:text-ink hover:no-underline hover:shadow-card hover:border-border-strong transition-all"
    >
      {post.hero_image_url && (
        <div className="aspect-[16/9] bg-cream overflow-hidden">
          <img
            src={post.hero_image_url}
            alt={post.hero_image_alt || ''}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}
      <div className="p-5 max-md:p-4 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          {label && (
            <span className="text-[10.5px] uppercase tracking-wider text-clay font-semibold">
              {label}
            </span>
          )}
          {date && (
            <>
              <span className="text-text-dim">·</span>
              <span className="text-[12px] text-text-dim">{date}</span>
            </>
          )}
        </div>
        <h3 className="font-serif text-[1.25rem] max-md:text-[1.15rem] leading-tight text-ink mb-2 group-hover:text-moss-dark transition-colors">
          {post.title}
        </h3>
        {post.subtitle && (
          <div className="text-[13.5px] text-text-muted italic mb-2">{post.subtitle}</div>
        )}
        <p className="text-[14px] text-text-muted leading-relaxed mb-3 line-clamp-3">
          {post.excerpt}
        </p>
        <div className="mt-auto pt-3 border-t border-border flex items-center justify-between text-[12px]">
          {post.source_label && (
            <span className="text-text-dim">{post.source_label}</span>
          )}
          <span className="text-moss font-medium">Lesen →</span>
        </div>
      </div>
    </Link>
  );
}
