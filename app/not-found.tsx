import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="py-24 max-md:py-16">
      <div className="max-w-2xl mx-auto px-8 max-md:px-4 text-center">
        <div className="text-[12px] uppercase tracking-wider text-clay font-semibold mb-4">404</div>
        <h1 className="font-serif text-[2.5rem] max-md:text-[1.8rem] text-ink mb-4">Kommune nicht gefunden</h1>
        <p className="text-[16px] text-text-muted leading-relaxed mb-8">
          Diese Seite existiert leider nicht im Atlas. Vielleicht ist die Schreibweise anders?
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-moss text-white px-6 py-3 rounded-lg text-[14px] font-medium no-underline hover:bg-moss-dark hover:text-white hover:no-underline"
        >
          Zur Startseite
        </Link>
      </div>
    </section>
  );
}
