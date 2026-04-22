import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-ink text-white/85 mt-12 py-12 max-md:py-8">
      <div className="max-w-[1280px] mx-auto px-8 max-md:px-4 grid grid-cols-4 max-md:grid-cols-2 max-[400px]:grid-cols-1 gap-8 max-md:gap-6">
        <div>
          <h4 className="font-serif text-[13px] uppercase tracking-wider text-white/60 mb-3">Atlas</h4>
          <Link href="/" className="block text-[14px] text-white/85 hover:text-white py-1 hover:no-underline">Startseite</Link>
          <Link href="/#arten" className="block text-[14px] text-white/85 hover:text-white py-1 hover:no-underline">Arten</Link>
          <Link href="/#kommunen" className="block text-[14px] text-white/85 hover:text-white py-1 hover:no-underline">Kommunen</Link>
        </div>
        <div>
          <h4 className="font-serif text-[13px] uppercase tracking-wider text-white/60 mb-3">Shop</h4>
          <a href="https://artgerecht-bauen.com" className="block text-[14px] text-white/85 hover:text-white py-1 hover:no-underline">artgerecht-bauen.com</a>
          <a href="https://artgerecht-bauen.com/QNG-Ready" className="block text-[14px] text-white/85 hover:text-white py-1 hover:no-underline">QNG-Ready Produkte</a>
        </div>
        <div>
          <h4 className="font-serif text-[13px] uppercase tracking-wider text-white/60 mb-3">Quellen</h4>
          <a href="https://www.bfn.de" className="block text-[14px] text-white/85 hover:text-white py-1 hover:no-underline">BfN — Bundesamt</a>
          <a href="https://www.gesetze-im-internet.de/bnatschg_2009/__44.html" className="block text-[14px] text-white/85 hover:text-white py-1 hover:no-underline">§ 44 BNatSchG</a>
        </div>
        <div>
          <h4 className="font-serif text-[13px] uppercase tracking-wider text-white/60 mb-3">Kontakt</h4>
          <p className="text-[13px] text-white/70 leading-relaxed">
            Haus und Sicherheit GmbH<br />
            Maybachstraße 6<br />
            71101 Schönaich
          </p>
          <a href="mailto:info@artgerecht-bauen.com" className="block mt-2 text-[13px] text-white/85 hover:text-white hover:no-underline">info@artgerecht-bauen.com</a>
        </div>
        <small className="block text-white/40 mt-8 pt-6 border-t border-white/10 col-span-full text-[12px]">
          © {new Date().getFullYear()} Haus und Sicherheit GmbH. Alle Daten ohne Gewähr — verbindliche Auskünfte erteilt die zuständige Untere Naturschutzbehörde.
        </small>
      </div>
    </footer>
  );
}
