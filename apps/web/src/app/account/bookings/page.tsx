'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle2, Loader2, PlusCircle } from 'lucide-react';
import { PageShell } from '@/components/site/page-shell';
import { Button } from '@/components/ui/button';
import { BookingStatusBadge } from '@/components/site/booking-status-badge';
import { useAuth } from '@/lib/auth-context';
import { apiFetch } from '@/lib/client-api';
import { formatRwf } from '@/lib/utils';
import { EVENT_TYPE_LABEL, type Booking } from '@/lib/booking-types';

export default function MyBookingsPage() {
  const router = useRouter();
  const params = useSearchParams();
  const justCreated = params.get('just') === 'created';
  const { user, loading: authLoading } = useAuth();
  const [bookings, setBookings] = useState<Booking[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login?next=/account/bookings');
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    apiFetch<Booking[]>('/bookings/me')
      .then((b) => !cancelled && setBookings(b))
      .catch(
        (err) =>
          !cancelled && setError((err.message as string) ?? 'Could not load'),
      );
    return () => {
      cancelled = true;
    };
  }, [user]);

  if (authLoading || !user) {
    return (
      <PageShell>
        <div className="container py-20 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-emerald_deep-700/50" />
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="container py-10 md:py-14 max-w-4xl">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-gold-500">
              Welcome, {user.name.split(' ')[0]}
            </span>
            <h1 className="mt-2 font-display text-4xl md:text-5xl text-emerald_deep-700">
              My bookings
            </h1>
          </div>
          <Button asChild variant="gold">
            <Link href="/items">
              <PlusCircle className="h-4 w-4" /> New booking
            </Link>
          </Button>
        </div>

        {justCreated && (
          <div className="mt-6 flex items-start gap-3 rounded-xl bg-emerald_deep-50 text-emerald_deep-700 px-4 py-3">
            <CheckCircle2 className="h-5 w-5 mt-0.5 shrink-0" />
            <div>
              <div className="font-medium">Booking submitted</div>
              <div className="text-sm opacity-80">
                We&apos;ll get back to you within 48 hours with confirmation.
              </div>
            </div>
          </div>
        )}

        {error && (
          <p className="mt-6 text-sm text-terracotta-500 bg-terracotta-50 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        {bookings === null && !error ? (
          <div className="mt-12 flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-emerald_deep-700/50" />
          </div>
        ) : bookings && bookings.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-emerald_deep-700/10 bg-white p-12 text-center">
            <p className="font-display text-2xl text-emerald_deep-700/80">
              No bookings yet
            </p>
            <p className="mt-2 text-emerald_deep-700/60">
              Start by browsing rentals for your ceremony.
            </p>
            <Button asChild className="mt-6">
              <Link href="/items">Browse rentals</Link>
            </Button>
          </div>
        ) : (
          <ul className="mt-10 space-y-4">
            {bookings?.map((b) => (
              <li
                key={b.id}
                className="rounded-2xl border border-emerald_deep-700/10 bg-white p-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div>
                    <BookingStatusBadge status={b.status} />
                    <div className="mt-3 font-display text-2xl text-emerald_deep-700">
                      {new Date(b.eventDate).toLocaleDateString('en-RW', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </div>
                    <div className="mt-0.5 text-sm text-emerald_deep-700/60">
                      {EVENT_TYPE_LABEL[b.eventType]} · {b.items.length} item
                      {b.items.length === 1 ? '' : 's'}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-display text-2xl text-emerald_deep-700">
                      {formatRwf(b.totalPrice)}
                    </div>
                    <div className="text-xs uppercase tracking-wider text-emerald_deep-700/50">
                      Total
                    </div>
                  </div>
                </div>

                <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                  {b.items.map((bi) => (
                    <li key={bi.id} className="flex items-center gap-3">
                      <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-ivory-100 shrink-0">
                        {bi.rentalItem.images[0] && (
                          <Image
                            src={bi.rentalItem.images[0]}
                            alt={bi.rentalItem.name}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs text-emerald_deep-700/50">
                          {bi.rentalItem.category.name}
                        </div>
                        <div className="text-sm font-medium text-emerald_deep-700 truncate">
                          {bi.rentalItem.name}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                {b.notes && (
                  <p className="mt-4 text-sm text-emerald_deep-700/60 italic border-l-2 border-gold-300 pl-3">
                    {b.notes}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </PageShell>
  );
}
