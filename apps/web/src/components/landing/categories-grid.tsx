import Link from 'next/link';
import {
  Cake,
  Camera,
  Car,
  Crown,
  Flower,
  Footprints,
  Music,
  Palette,
  Shirt,
  Sparkles,
  Tent,
  Utensils,
  type LucideIcon,
} from 'lucide-react';
import { Reveal } from '@/components/site/reveal';
import { api } from '@/lib/api';

const iconMap: Record<string, LucideIcon> = {
  crown: Crown,
  flower: Flower,
  shirt: Shirt,
  footprints: Footprints,
  sparkles: Sparkles,
  car: Car,
  tent: Tent,
  utensils: Utensils,
  cake: Cake,
  camera: Camera,
  music: Music,
  palette: Palette,
};

const fallbackCategories = [
  { slug: 'traditional-wear', name: 'Traditional Wear', iconName: 'crown', description: 'Umushanana, imyitero, igitenge' },
  { slug: 'modern-bridal', name: 'Modern Bridal', iconName: 'flower', description: 'Gowns, veils, tiaras' },
  { slug: 'grooms-wear', name: "Groom's Wear", iconName: 'shirt', description: 'Suits & traditional menswear' },
  { slug: 'footwear', name: 'Footwear', iconName: 'footprints', description: 'Shoes for the wedding party' },
  { slug: 'decoration', name: 'Decoration', iconName: 'sparkles', description: 'Imitako, arches, drapes' },
  { slug: 'cars-transport', name: 'Cars & Transport', iconName: 'car', description: 'Bridal cars & fleets' },
  { slug: 'tents-furniture', name: 'Tents & Furniture', iconName: 'tent', description: 'Igisenge, chairs, stages' },
  { slug: 'catering', name: 'Catering & Food', iconName: 'utensils', description: 'Brochette, ubugali, ibitoki' },
  { slug: 'cakes', name: 'Cakes', iconName: 'cake', description: 'Wedding & engagement cakes' },
  { slug: 'photo-video', name: 'Photography & Video', iconName: 'camera', description: 'Photographers, drone, edits' },
  { slug: 'music-sound', name: 'Music & Sound', iconName: 'music', description: 'DJs, ingoma drummers' },
  { slug: 'makeup-hair', name: 'Makeup & Hair', iconName: 'palette', description: 'Bridal makeup & styling' },
];

export async function CategoriesGrid() {
  const categories = await api.categories(
    fallbackCategories.map((c, i) => ({
      id: `fb-${i}`,
      slug: c.slug,
      name: c.name,
      description: c.description,
      iconName: c.iconName,
    })),
  );

  return (
    <section
      id="categories"
      className="relative py-24 md:py-32 bg-emerald-radial text-ivory-50 overflow-hidden"
    >
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle at 25% 30%, #f5e9b9 1px, transparent 1px), radial-gradient(circle at 75% 70%, #f5e9b9 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="container relative">
        <Reveal>
          <div className="max-w-2xl">
            <span className="text-xs uppercase tracking-[0.3em] text-gold-200">
              Everything, in one place
            </span>
            <h2 className="mt-3 font-display text-4xl md:text-5xl text-balance">
              Twelve categories.{' '}
              <span className="gold-shimmer italic">Every</span> wedding need.
            </h2>
            <p className="mt-5 text-ivory-50/70 leading-relaxed">
              Browse by what you need — or talk to us and we&apos;ll build the
              full package for every ceremony.
            </p>
          </div>
        </Reveal>

        <div className="mt-16 grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((c, i) => {
            const Icon = iconMap[c.iconName ?? ''] ?? Sparkles;
            return (
              <Reveal key={c.slug} delay={(i % 4) * 0.06} y={16}>
                <Link
                  href={`/categories/${c.slug}`}
                  className="group block h-full rounded-2xl border border-ivory-50/10 bg-ivory-50/[0.03] backdrop-blur-sm p-6 hover:bg-ivory-50/[0.08] hover:border-gold-200/30 transition-all duration-300 hover:-translate-y-0.5"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold-gradient/20 text-gold-200 group-hover:scale-110 transition-transform">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 font-display text-xl group-hover:text-gold-200 transition-colors">
                    {c.name}
                  </h3>
                  <p className="mt-1 text-sm text-ivory-50/60 line-clamp-2">
                    {c.description}
                  </p>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
