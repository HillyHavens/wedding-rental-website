import { SiteNav } from './nav';
import { SiteFooter } from './footer';

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteNav alwaysSolid />
      <main className="pt-20 min-h-screen bg-ivory-50">{children}</main>
      <SiteFooter />
    </>
  );
}
