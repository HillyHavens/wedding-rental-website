import Link from 'next/link';
import { PageShell } from '@/components/site/page-shell';
import { ItemCard } from '@/components/items/item-card';
import { serverApi } from '@/lib/server-api';
import { cn } from '@/lib/utils';

interface SearchParams {
  category?: string;
}

export default async function ItemsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const activeSlug = params.category;
  const [categories, items] = await Promise.all([
    serverApi.categories(),
    activeSlug
      ? serverApi.itemsByCategory(activeSlug)
      : serverApi.allItems(),
  ]);

  const activeName =
    categories.find((c) => c.slug === activeSlug)?.name ?? 'All rentals';

  return (
    <PageShell>
      <div className="container py-10 md:py-14">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-gold-500">
              Browse
            </span>
            <h1 className="mt-2 font-display text-4xl md:text-5xl text-emerald_deep-700">
              {activeName}
            </h1>
            <p className="mt-2 text-emerald_deep-700/60">
              {items.length} rental{items.length === 1 ? '' : 's'} available
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          <Link
            href="/items"
            className={cn(
              'inline-flex items-center rounded-full border px-4 h-9 text-sm font-medium transition-colors',
              !activeSlug
                ? 'bg-emerald_deep-600 border-emerald_deep-600 text-ivory-50'
                : 'border-emerald_deep-700/15 text-emerald_deep-700 hover:bg-ivory-100',
            )}
          >
            All
          </Link>
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/items?category=${c.slug}`}
              className={cn(
                'inline-flex items-center rounded-full border px-4 h-9 text-sm font-medium transition-colors',
                activeSlug === c.slug
                  ? 'bg-emerald_deep-600 border-emerald_deep-600 text-ivory-50'
                  : 'border-emerald_deep-700/15 text-emerald_deep-700 hover:bg-ivory-100',
              )}
            >
              {c.name}
            </Link>
          ))}
        </div>

        {items.length === 0 ? (
          <div className="mt-16 text-center text-emerald_deep-700/50">
            No items yet in this category.
          </div>
        ) : (
          <div className="mt-10 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </PageShell>
  );
}
