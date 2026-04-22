'use client';

import { useEffect, useState } from 'react';

export default function MobileShopBar({ kommunenName }: { kommunenName: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      const scrolled = window.scrollY;
      const sol = document.getElementById('loesungen');
      const solTop = sol ? sol.getBoundingClientRect().top + window.scrollY : Infinity;
      const viewportBottom = scrolled + window.innerHeight;
      setVisible(scrolled > 400 && viewportBottom < solTop + 100);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 bg-white border-t border-border px-4 py-2.5 z-[100] shadow-[0_-4px_20px_rgba(30,61,40,0.08)] transition-transform duration-200 ease-out md:hidden ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="flex items-center gap-2.5 max-w-md mx-auto">
        <div className="flex-1 min-w-0">
          <div className="text-[12.5px] font-medium text-ink leading-tight">
            Lösungen für {kommunenName}
          </div>
          <div className="text-[11px] text-text-muted leading-tight mt-0.5">
            QNG-Material & Quartiere
          </div>
        </div>
        <a
          href="#loesungen"
          className="bg-clay text-white px-4 py-2.5 rounded-md text-[13px] font-medium no-underline inline-flex items-center gap-1.5 flex-shrink-0 hover:bg-[#a04638] hover:text-white hover:no-underline"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
          </svg>
          Ansehen
        </a>
      </div>
    </div>
  );
}
