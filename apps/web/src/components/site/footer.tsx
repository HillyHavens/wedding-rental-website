import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="bg-emerald_deep-700 text-ivory-100 mt-24">
      <div className="container py-16 grid gap-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <span className="font-display text-3xl">
            Bridal <span className="gold-shimmer">Belle</span> Boutique
          </span>
          <p className="mt-4 max-w-md text-ivory-100/70 leading-relaxed">
            Rwandan-rooted wedding rentals for every ceremony — from Gusaba to
            the reception. Curated by people who&apos;ve celebrated their own.
          </p>
        </div>

        <div>
          <h4 className="font-display text-lg text-gold-200 mb-4">Explore</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/#ceremonies" className="hover:text-gold-200">Ceremonies</Link></li>
            <li><Link href="/#categories" className="hover:text-gold-200">Categories</Link></li>
            <li><Link href="/booking" className="hover:text-gold-200">Book</Link></li>
            <li><Link href="/login" className="hover:text-gold-200">Sign in</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-lg text-gold-200 mb-4">Reach us</h4>
          <ul className="space-y-2 text-sm text-ivory-100/80">
            <li>Kigali, Rwanda</li>
            <li>+250 788 000 000</li>
            <li>hello@bridalbelle.rw</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-ivory-100/10">
        <div className="container py-6 flex flex-col md:flex-row gap-2 items-center justify-between text-xs text-ivory-100/60">
          <span>© {new Date().getFullYear()} Bridal Belle Boutique. All rights reserved.</span>
          <span>Crafted in Kigali.</span>
        </div>
      </div>
    </footer>
  );
}
