import { SiteNav } from '@/components/site/nav';
import { SiteFooter } from '@/components/site/footer';
import { Hero } from '@/components/landing/hero';
import { Ceremonies } from '@/components/landing/ceremonies';
import { FeaturedItems } from '@/components/landing/featured-items';
import { CategoriesGrid } from '@/components/landing/categories-grid';
import { Testimonials } from '@/components/landing/testimonials';
import { CtaBanner } from '@/components/landing/cta-banner';

export default function HomePage() {
  return (
    <>
      <SiteNav />
      <main>
        <Hero />
        <Ceremonies />
        <FeaturedItems />
        <CategoriesGrid />
        <Testimonials />
        <CtaBanner />
      </main>
      <SiteFooter />
    </>
  );
}
