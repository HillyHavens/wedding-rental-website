import type { Metadata } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import { Providers } from './providers';
import './globals.css';

const display = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

const sans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Bridal Belle Boutique — Rwandan Wedding Rentals',
  description:
    'Rent every piece of your Rwandan wedding — from umushanana and modern gowns to cars, décor, and catering. Made for Gusaba, Gukwa, civil, religious, and reception.',
  openGraph: {
    title: 'Bridal Belle Boutique',
    description: 'Wedding rentals for every Rwandan ceremony.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
