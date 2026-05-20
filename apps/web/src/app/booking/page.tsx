'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CalendarCheck, CalendarX, Loader2, Trash2 } from 'lucide-react';
import { PageShell } from '@/components/site/page-shell';
import { Button } from '@/components/ui/button';
import { Input, Label, Select, Textarea } from '@/components/ui/input';
import { useAuth } from '@/lib/auth-context';
import { useCart } from '@/lib/cart-context';
import { apiFetch, type ApiError } from '@/lib/client-api';
import { formatRwf } from '@/lib/utils';

const EVENT_TYPES = [
  { value: 'GUSABA', label: 'Gusaba — the asking' },
  { value: 'GUKWA', label: 'Gukwa — the dowry' },
  { value: 'CIVIL', label: 'Civil ceremony' },
  { value: 'RELIGIOUS', label: 'Religious ceremony' },
  { value: 'RECEPTION', label: 'Reception' },
  { value: 'OTHER', label: 'Other' },
] as const;

interface AvailabilityRow {
  id: string;
  quantity: number;
  bookedCount: number;
  available: number;
}

export default function BookingPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { items, remove, clear, total } = useCart();
  const today = new Date().toISOString().slice(0, 10);

  const [date, setDate] = useState('');
  const [eventType, setEventType] = useState<(typeof EVENT_TYPES)[number]['value']>('RECEPTION');
  const [notes, setNotes] = useState('');
  const [availability, setAvailability] = useState<
    Record<string, AvailabilityRow>
  >({});
  const [checkingAvail, setCheckingAvail] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login?next=/booking');
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!date || items.length === 0) {
      setAvailability({});
      return;
    }
    let cancelled = false;
    setCheckingAvail(true);
    const ids = items.map((i) => i.id).join(',');
    apiFetch<AvailabilityRow[]>(`/items/availability?date=${date}&ids=${ids}`)
      .then((rows) => {
        if (cancelled) return;
        const map: Record<string, AvailabilityRow> = {};
        for (const r of rows) map[r.id] = r;
        setAvailability(map);
      })
      .catch(() => {
        if (!cancelled) setAvailability({});
      })
      .finally(() => !cancelled && setCheckingAvail(false));
    return () => {
      cancelled = true;
    };
  }, [date, items]);

  const allAvailable = useMemo(() => {
    if (!date || items.length === 0) return false;
    return items.every((i) => (availability[i.id]?.available ?? 0) > 0);
  }, [availability, items, date]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!date || items.length === 0) return;
    setError(null);
    setSubmitting(true);
    try {
      await apiFetch('/bookings', {
        method: 'POST',
        body: JSON.stringify({
          eventDate: date,
          eventType,
          rentalItemIds: items.map((i) => i.id),
          notes: notes || undefined,
        }),
      });
      clear();
      router.push('/account/bookings?just=created');
    } catch (err) {
      const e = err as ApiError;
      setError(e.message ?? 'Booking failed');
      setSubmitting(false);
    }
  };

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
      <div className="container py-10 md:py-14 max-w-5xl">
        <span className="text-xs uppercase tracking-[0.3em] text-gold-500">
          Booking
        </span>
        <h1 className="mt-2 font-display text-4xl md:text-5xl text-emerald_deep-700">
          Review &amp; confirm
        </h1>
        <p className="mt-2 text-emerald_deep-700/60">
          Pick your date, confirm your items, and we&apos;ll get back to you
          within 48 hours.
        </p>

        {items.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-emerald_deep-700/10 bg-white p-12 text-center">
            <p className="font-display text-2xl text-emerald_deep-700/80">
              Your booking is empty
            </p>
            <p className="mt-2 text-emerald_deep-700/60">
              Add a few rentals first.
            </p>
            <Button asChild className="mt-6">
              <Link href="/items">Browse rentals</Link>
            </Button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-10 grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <div className="rounded-2xl border border-emerald_deep-700/10 bg-white p-6">
                <h2 className="font-display text-xl text-emerald_deep-700">
                  Your wedding day
                </h2>
                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="date">Event date</Label>
                    <Input
                      id="date"
                      type="date"
                      min={today}
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="eventType">Ceremony</Label>
                    <Select
                      id="eventType"
                      value={eventType}
                      onChange={(e) =>
                        setEventType(e.target.value as typeof eventType)
                      }
                    >
                      {EVENT_TYPES.map((t) => (
                        <option key={t.value} value={t.value}>
                          {t.label}
                        </option>
                      ))}
                    </Select>
                  </div>
                </div>
                <div className="mt-5">
                  <Label htmlFor="notes">Notes (optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Anything we should know? Pickup time, fitting requests, dietary needs…"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-emerald_deep-700/10 bg-white p-6">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-xl text-emerald_deep-700">
                    Selected rentals
                  </h2>
                  {checkingAvail && (
                    <Loader2 className="h-4 w-4 animate-spin text-emerald_deep-700/40" />
                  )}
                </div>
                <ul className="mt-5 divide-y divide-emerald_deep-700/5">
                  {items.map((i) => {
                    const av = availability[i.id];
                    const unavailable = date && av && av.available <= 0;
                    return (
                      <li key={i.id} className="flex items-center gap-4 py-4">
                        <div className="relative h-16 w-16 rounded-xl overflow-hidden bg-ivory-100 shrink-0">
                          {i.image && (
                            <Image
                              src={i.image}
                              alt={i.name}
                              fill
                              sizes="64px"
                              className="object-cover"
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-emerald_deep-700/50">
                            {i.categoryName}
                          </div>
                          <div className="font-medium text-emerald_deep-700 truncate">
                            {i.name}
                          </div>
                          {date && av && (
                            <div
                              className={`mt-0.5 text-xs inline-flex items-center gap-1 ${
                                unavailable
                                  ? 'text-terracotta-500'
                                  : 'text-emerald_deep-600'
                              }`}
                            >
                              {unavailable ? (
                                <>
                                  <CalendarX className="h-3 w-3" /> Fully booked on {date}
                                </>
                              ) : (
                                <>
                                  <CalendarCheck className="h-3 w-3" />{' '}
                                  {av.available} of {av.quantity} free
                                </>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="font-display text-lg text-emerald_deep-700">
                            {formatRwf(i.pricePerEvent)}
                          </div>
                          <button
                            type="button"
                            onClick={() => remove(i.id)}
                            className="mt-1 inline-flex items-center gap-1 text-xs text-emerald_deep-700/50 hover:text-terracotta-500"
                          >
                            <Trash2 className="h-3 w-3" /> Remove
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-2xl border border-emerald_deep-700/10 bg-gradient-to-b from-white to-ivory-100 p-6">
                <h2 className="font-display text-xl text-emerald_deep-700">
                  Summary
                </h2>
                <dl className="mt-5 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-emerald_deep-700/60">Items</dt>
                    <dd className="text-emerald_deep-700">{items.length}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-emerald_deep-700/60">Date</dt>
                    <dd className="text-emerald_deep-700">{date || '—'}</dd>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-emerald_deep-700/10">
                    <dt className="font-medium text-emerald_deep-700">Total</dt>
                    <dd className="font-display text-2xl text-emerald_deep-700">
                      {formatRwf(total)}
                    </dd>
                  </div>
                </dl>
                {error && (
                  <p className="mt-4 text-sm text-terracotta-500 bg-terracotta-50 rounded-lg px-3 py-2">
                    {error}
                  </p>
                )}
                {date && !allAvailable && !checkingAvail && (
                  <p className="mt-4 text-sm text-terracotta-500 bg-terracotta-50 rounded-lg px-3 py-2">
                    Some items aren&apos;t available on {date}. Pick a different
                    date or remove those items.
                  </p>
                )}
                <Button
                  type="submit"
                  variant="gold"
                  size="lg"
                  className="w-full mt-6"
                  disabled={
                    !date || submitting || !allAvailable || items.length === 0
                  }
                >
                  {submitting ? 'Submitting…' : 'Confirm booking'}
                </Button>
                <p className="mt-3 text-xs text-emerald_deep-700/50 text-center">
                  Your booking will be reviewed and confirmed within 48 hours.
                </p>
              </div>
            </aside>
          </form>
        )}
      </div>
    </PageShell>
  );
}
