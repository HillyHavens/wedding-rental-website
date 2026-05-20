'use client';

import { Check, Plus, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useCart, type CartItem } from '@/lib/cart-context';

export function AddToCartButton({ item }: { item: CartItem }) {
  const { add, remove, has, items } = useCart();
  const inCart = has(item.id);

  return (
    <div className="flex flex-wrap gap-3">
      <Button
        size="lg"
        variant={inCart ? 'ghost' : 'primary'}
        onClick={() => (inCart ? remove(item.id) : add(item))}
      >
        {inCart ? (
          <>
            <Check className="h-4 w-4" />
            Added to booking — remove
          </>
        ) : (
          <>
            <Plus className="h-4 w-4" />
            Add to booking
          </>
        )}
      </Button>
      {items.length > 0 && (
        <Button asChild size="lg" variant="gold">
          <Link href="/booking">
            <ShoppingBag className="h-4 w-4" />
            Review booking ({items.length})
          </Link>
        </Button>
      )}
    </div>
  );
}
