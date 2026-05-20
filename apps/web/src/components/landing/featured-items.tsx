import Link from 'next/link';
import Image from 'next/image';
import { Reveal } from '@/components/site/reveal';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { formatRwf } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

const fallbackItems = [
  {
    id: 'fb-1',
    name: 'Umushanana Royal Gold',
    description: 'Cream and gold, fully beaded sash and matching head wrap.',
    pricePerEvent: 250_000,
    images: ['/legacy-assets/umushanana-gold.jpg'],
    isFeatured: true,
    category: {
      id: 'c1',
      slug: 'traditional-wear',
      name: 'Traditional Wear',
      description: null,
      iconName: null,
    },
  },
  {
    id: 'fb-2',
    name: 'Ivory Cathedral Gown',
    description: 'A-line gown with cathedral train and detachable veil.',
    pricePerEvent: 600_000,
    images: ['/legacy-assets/gown-cathedral.jpg'],
    isFeatured: true,
    category: {
      id: 'c2',
      slug: 'modern-bridal',
      name: 'Modern Bridal',
      description: null,
      iconName: null,
    },
  },
  {
    id: 'fb-3',
    name: 'Midnight Three-Piece Suit',
    description: 'Italian wool three-piece suit with satin lapels.',
    pricePerEvent: 180_000,
    images: ['/legacy-assets/suit-navy.jpg'],
    isFeatured: true,
    category: {
      id: 'c3',
      slug: 'grooms-wear',
      name: "Groom's Wear",
      description: null,
      iconName: null,
    },
  },
  {
    id: 'fb-4',
    name: 'Mercedes S-Class Bridal Car',
    description: 'Chauffeured Mercedes with floral arrangement.',
    pricePerEvent: 350_000,
    images: ['/legacy-assets/car-mercedes.jpg'],
    isFeatured: true,
    category: {
      id: 'c4',
      slug: 'cars-transport',
      name: 'Cars & Transport',
      description: null,
      iconName: null,
    },
  },
  {
    id: 'fb-5',
    name: 'Imitako Reception Package',
    description: 'Floral arch, drapes, centrepieces for 200 guests.',
    pricePerEvent: 1_200_000,
    images: ['/legacy-assets/decor-reception.jpg'],
    isFeatured: true,
    category: {
      id: 'c5',
      slug: 'decoration',
      name: 'Decoration',
      description: null,
      iconName: null,
    },
  },
  {
    id: 'fb-6',
    name: 'Full-Day Photo + Video',
    description: 'Two photographers, drone, edited highlight reel.',
    pricePerEvent: 800_000,
    images: ['/legacy-assets/photo-video.jpg'],
    isFeatured: true,
    category: {
      id: 'c6',
      slug: 'photo-video',
      name: 'Photography & Video',
      description: null,
      iconName: null,
    },
  },
];

export async function FeaturedItems() {
  const items = await api.featuredItems(fallbackItems);

  return (
    <section
      id="featured"
      className="relative py-24 md:py-32 bg-gradient-to-b from-ivory-50 to-ivory-100"
    >
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <Reveal>
            <div className="max-w-2xl">
              <span className="text-xs uppercase tracking-[0.3em] text-gold-500">
                Hand-picked
              </span>
              <h2 className="mt-3 font-display text-4xl md:text-5xl text-emerald_deep-700 text-balance">
                Featured rentals, ready for your day.
              </h2>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <Button asChild variant="ghost">
              <Link href="/items">
                Browse all
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.slice(0, 6).map((item, i) => (
            <Reveal key={item.id} delay={(i % 3) * 0.08}>
              <Link
                href={`/items/${item.id}`}
                className="group block overflow-hidden rounded-2xl bg-white shadow-md shadow-emerald_deep-700/5 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald_deep-700/15"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={item.images[0] ?? '/legacy-assets/hero-poster.jpg'}
                    alt={item.name}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald_deep-700/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="absolute top-4 left-4 inline-flex items-center rounded-full bg-ivory-50/95 backdrop-blur-sm px-3 py-1 text-xs font-medium text-emerald_deep-700">
                    {item.category.name}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="font-display text-xl text-emerald_deep-700 group-hover:text-gold-500 transition-colors">
                    {item.name}
                  </h3>
                  <p className="mt-1 text-sm text-emerald_deep-700/60 line-clamp-2">
                    {item.description}
                  </p>
                  <div className="mt-4 flex items-baseline justify-between">
                    <span className="font-display text-2xl text-emerald_deep-700">
                      {formatRwf(item.pricePerEvent)}
                    </span>
                    <span className="text-xs uppercase tracking-wider text-emerald_deep-700/50">
                      / event
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
