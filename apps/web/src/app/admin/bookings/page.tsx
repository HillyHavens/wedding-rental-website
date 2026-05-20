'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Check, Loader2, X } from 'lucide-react';
import { AdminShell } from '@/components/admin/admin-shell';
import { BookingStatusBadge } from '@/components/site/booking-status-badge';
import { Button } from '@/components/ui/button';
import { apiFetch } from '@/lib/client-api';
import { EVENT_TYPE_LABEL, type Booking, type BookingStatus } from '@/lib/booking-types';
import { formatRwf, cn } from '@/lib/utils';

const FILTERS: Array<{ value: '' | BookingStatus; label: string }> = [
  { value: '', label: 'All' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'CONFIRMED', label: 'Confirmed' },
  { value: 'CANCELLED', label: 'Cancelled' },
  { value: 'COMPLETED', label: 'Completed' },
];

export default function AdminBookingsPage() {
  const params = useSearchParams();
  const initial = (params.get('status') as BookingStatus | null) ?? '';
  const [filter, setFilter] = useState<'' | BookingStatus>(initial);
  const [bookings, setBookings] = useState<Booking[] | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = (f: typeof filter) => {
    setBookings(null);
    const q = f ? `?status=${f}` : '';
    apiFetch<Booking[]>(`/bookings${q}`).then(setBookings).catch(() => setBookings([]));
  };

  useEffect(() => {
    load(filter);
  }, [filter]);

  const updateStatus = async (id: string, status: BookingStatus) => {
    setBusyId(id);
    try {
      await apiFetch(`/bookings/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      load(filter);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <AdminShell>
      <h1 className="font-display text-4xl text-emerald_deep-700">Bookings</h1>

      <div className="mt-6 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={cn(
              'inline-flex items-center rounded-full border px-4 h-9 text-sm font-medium transition-colors',
              filter === f.value
                ? 'bg-emerald_deep-600 border-emerald_deep-600 text-ivory-50'
                : 'border-emerald_deep-700/15 text-emerald_deep-700 hover:bg-ivory-100',
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {bookings === null ? (
        <div className="mt-12 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-emerald_deep-700/50" />
        </div>
      ) : bookings.length === 0 ? (
        <div className="mt-12 rounded-2xl border border-emerald_deep-700/10 bg-white p-12 text-center">
          <p className="font-display text-2xl text-emerald_deep-700/80">
            No bookings here
          </p>
        </div>
      ) : (
        <ul className="mt-6 space-y-4">
          {bookings.map((b) => (
            <li
              key={b.id}
              className="rounded-2xl border border-emerald_deep-700/10 bg-white p-6"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <BookingStatusBadge status={b.status} />
                    <span className="text-xs uppercase tracking-wider text-emerald_deep-700/50">
                      Booked{' '}
                      {new Date(b.createdAt).toLocaleDateString('en-RW', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="mt-3 font-display text-2xl text-emerald_deep-700">
                    {b.user?.name ?? '—'}
                  </div>
                  <div className="text-sm text-emerald_deep-700/60">
                    {b.user?.email}
                    {b.user?.phone ? ` · ${b.user.phone}` : ''}
                  </div>
                  <div className="mt-2 text-sm text-emerald_deep-700/70">
                    <span className="font-medium">
                      {new Date(b.eventDate).toLocaleDateString('en-RW', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>{' '}
                    · {EVENT_TYPE_LABEL[b.eventType]}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-display text-2xl text-emerald_deep-700">
                    {formatRwf(b.totalPrice)}
                  </div>
                  <div className="text-xs uppercase tracking-wider text-emerald_deep-700/50">
                    {b.items.length} items
                  </div>
                </div>
              </div>

              <ul className="mt-4 flex flex-wrap gap-2">
                {b.items.map((bi) => (
                  <li
                    key={bi.id}
                    className="inline-flex items-center rounded-full bg-ivory-100 px-3 py-1 text-xs text-emerald_deep-700"
                  >
                    <span className="text-emerald_deep-700/50 mr-1">
                      {bi.rentalItem.category.name}:
                    </span>
                    {bi.rentalItem.name}
                  </li>
                ))}
              </ul>

              {b.notes && (
                <p className="mt-3 text-sm text-emerald_deep-700/60 italic border-l-2 border-gold-300 pl-3">
                  {b.notes}
                </p>
              )}

              {b.status === 'PENDING' && (
                <div className="mt-5 flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => updateStatus(b.id, 'CONFIRMED')}
                    disabled={busyId === b.id}
                  >
                    <Check className="h-4 w-4" /> Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => updateStatus(b.id, 'CANCELLED')}
                    disabled={busyId === b.id}
                  >
                    <X className="h-4 w-4" /> Reject
                  </Button>
                </div>
              )}
              {b.status === 'CONFIRMED' && (
                <div className="mt-5 flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => updateStatus(b.id, 'COMPLETED')}
                    disabled={busyId === b.id}
                  >
                    Mark completed
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => updateStatus(b.id, 'CANCELLED')}
                    disabled={busyId === b.id}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </AdminShell>
  );
}
