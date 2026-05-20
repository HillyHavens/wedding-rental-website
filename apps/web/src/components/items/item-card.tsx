'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Check, Plus } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { cn, formatRwf } from '@/lib/utils';
import type { RentalItem } from '@/lib/server-api';

export function ItemCard({ item }: { item: RentalItem }) {
  const { add, remove, has } = useCart();
  const inCart = has(item.id);

  return (
    <article className="group rounded-2xl bg-white shadow-md shadow-emerald_deep-700/5 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <Link
        href={`/items/${item.id}`}
        className="block relative aspect-[4/5] overflow-hidden"
      >
        <Image
          src={item.images[0] ?? '/legacy-assets/hero-poster.jpg'}
          alt={item.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <span className="absolute top-3 left-3 inline-flex items-center rounded-full bg-ivory-50/95 backdrop-blur-sm px-2.5 py-1 text-[11px] font-medium text-emerald_deep-700">
          {item.category.name}
        </span>
      </Link>
      <div className="p-5">
        <Link href={`/items/${item.id}`}>
          <h3 className="font-display text-lg text-emerald_deep-700 hover:text-gold-500 line-clamp-1 transition-colors">
            {item.name}
          </h3>
        </Link>
        <p className="mt-1 text-sm text-emerald_deep-700/60 line-clamp-2 min-h-[2.5rem]">
          {item.description}
        </p>
        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="font-display text-xl text-emerald_deep-700">
            {formatRwf(item.pricePerEvent)}
          </span>
          <button
            type="button"
            onClick={() =>
              inCart
                ? remove(item.id)
                : add({
                    id: item.id,
                    name: item.name,
                    pricePerEvent: item.pricePerEvent,
                    image: item.images[0],
                    categoryName: item.category.name,
                  })
            }
            className={cn(
              'inline-flex items-center gap-1 rounded-full px-3 h-9 text-sm font-medium transition-all',
              inCart
                ? 'bg-emerald_deep-600 text-ivory-50 hover:bg-emerald_deep-700'
                : 'bg-ivory-100 text-emerald_deep-700 hover:bg-gold-100',
            )}
          >
            {inCart ? (
              <>
                <Check className="h-4 w-4" /> Added
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" /> Add
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
