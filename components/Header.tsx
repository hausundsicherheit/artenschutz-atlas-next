import Link from 'next/link';

export default function Header() {
  return (
    <nav className="sticky top-0 z-50 bg-[rgba(253,251,246,0.92)] backdrop-blur border-b border-border">
      <div className="max-w-[1280px] mx-auto px-8 max-md:px-4 py-4 max-md:py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 text-ink no-underline hover:no-underline">
          <span className="w-7 h-7 rounded-md bg-moss inline-flex items-center justify-center text-white">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </span>
          <span className="font-serif text-[18px] max-md:text-base text-ink">Artenschutz-Atlas</span>
        </Link>
        <div className="flex items-center gap-6 max-md:gap-3">
          <Link href="/#arten" className="text-[14px] text-text-muted hover:text-ink hover:no-underline max-md:hidden">Arten</Link>
          <Link href="/#kommunen" className="text-[14px] text-text-muted hover:text-ink hover:no-underline max-md:hidden">Kommunen</Link>
          <a
            href="https://artgerecht-bauen.com"
            className="inline-flex items-center gap-2 bg-clay text-white px-5 py-2.5 max-md:px-3.5 max-md:py-2 rounded-lg text-[14px] max-md:text-[13px] font-semibold hover:bg-[#a04638] hover:text-white hover:no-underline shadow-soft hover:shadow-card hover:-translate-y-px transition-all"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="max-md:w-3 max-md:h-3">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
            </svg>
            Zum Shop
          </a>
        </div>
      </div>
    </nav>
  );
}
