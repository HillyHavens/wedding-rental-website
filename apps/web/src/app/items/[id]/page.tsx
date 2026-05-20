import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { PageShell } from '@/components/site/page-shell';
import { AvailabilityChecker } from '@/components/items/availability-checker';
import { AddToCartButton } from '@/components/items/add-to-cart-button';
import { serverApi } from '@/lib/server-api';
import { formatRwf } from '@/lib/utils';

export default async function ItemDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await serverApi.itemById(id);
  if (!item) notFound();

  return (
    <PageShell>
      <div className="container py-10 md:py-14">
        <Link
          href="/items"
          className="inline-flex items-center gap-1.5 text-sm text-emerald_deep-700/70 hover:text-emerald_deep-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to browse
        </Link>

        <div className="mt-6 grid gap-10 lg:grid-cols-2">
          <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-ivory-100">
            <Image
              src={item.images[0] ?? '/legacy-assets/hero-poster.jpg'}
              alt={item.name}
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>

          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-gold-500">
              {item.category.name}
            </span>
            <h1 className="mt-2 font-display text-4xl md:text-5xl text-emerald_deep-700 text-balance">
              {item.name}
            </h1>
            <p className="mt-4 text-emerald_deep-700/70 leading-relaxed">
              {item.description}
            </p>

            <div className="mt-8 flex items-baseline gap-3">
              <span className="font-display text-4xl text-emerald_deep-700">
                {formatRwf(item.pricePerEvent)}
              </span>
              <span className="text-sm text-emerald_deep-700/50 uppercase tracking-wider">
                per event
              </span>
            </div>

            <div className="mt-8">
              <AddToCartButton
                item={{
                  id: item.id,
                  name: item.name,
                  pricePerEvent: item.pricePerEvent,
                  image: item.images[0],
                  categoryName: item.category.name,
                }}
              />
            </div>

            <div className="mt-10">
              <AvailabilityChecker
                itemId={item.id}
                totalQuantity={item.quantity}
              />
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
