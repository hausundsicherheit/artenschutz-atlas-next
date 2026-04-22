import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: {
    default: 'Artenschutz-Atlas Deutschland',
    template: '%s · Artenschutz-Atlas',
  },
  description:
    'Der Bundesweite Atlas für artenschutzrechtliche Pflichten beim Bauen. 10.953 Kommunen, 45 geschützte Arten, mit Förderprogrammen und Lösungen.',
  metadataBase: new URL('https://atlas.artgerecht-bauen.com'),
  openGraph: {
    type: 'website',
    locale: 'de_DE',
    siteName: 'Artenschutz-Atlas',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
