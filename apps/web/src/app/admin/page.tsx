'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CalendarRange, Clock, Loader2, Package } from 'lucide-react';
import { AdminShell } from '@/components/admin/admin-shell';
import { apiFetch } from '@/lib/client-api';
import type { Booking } from '@/lib/booking-types';
import type { RentalItem } from '@/lib/server-api';
import { formatRwf } from '@/lib/utils';

export default function AdminDashboardPage() {
  const [bookings, setBookings] = useState<Booking[] | null>(null);
  const [items, setItems] = useState<RentalItem[] | null>(null);

  useEffect(() => {
    Promise.all([
      apiFetch<Booking[]>('/bookings').then(setBookings).catch(() => setBookings([])),
      apiFetch<RentalItem[]>('/items').then(setItems).catch(() => setItems([])),
    ]);
  }, []);

  if (!bookings || !items) {
    return (
      <AdminShell>
        <div className="flex justify-center pt-12">
          <Loader2 className="h-6 w-6 animate-spin text-emerald_deep-700/50" />
        </div>
      </AdminShell>
    );
  }

  const pending = bookings.filter((b) => b.status === 'PENDING');
  const confirmed = bookings.filter((b) => b.status === 'CONFIRMED');
  const revenue = confirmed.reduce((s, b) => s + b.totalPrice, 0);

  const stats = [
    {
      label: 'Pending bookings',
      value: pending.length,
      Icon: Clock,
      href: '/admin/bookings?status=PENDING',
    },
    {
      label: 'Confirmed bookings',
      value: confirmed.length,
      Icon: CalendarRange,
      href: '/admin/bookings?status=CONFIRMED',
    },
    {
      label: 'Active items',
      value: items.filter((i) => i.isActive).length,
      Icon: Package,
      href: '/admin/items',
    },
  ];

  return (
    <AdminShell>
      <h1 className="font-display text-4xl text-emerald_deep-700">
        Dashboard
      </h1>
      <p className="mt-1 text-emerald_deep-700/60">
        Confirmed revenue:{' '}
        <span className="font-medium text-emerald_deep-700">
          {formatRwf(revenue)}
        </span>
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {stats.map((s) => {
          const Icon = s.Icon;
          return (
            <Link
              key={s.label}
              href={s.href}
              className="group rounded-2xl bg-white border border-emerald_deep-700/10 p-6 hover:shadow-md transition-all hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-emerald_deep-700/60">
                  {s.label}
                </span>
                <Icon className="h-5 w-5 text-gold-500" />
              </div>
              <div className="mt-3 font-display text-4xl text-emerald_deep-700 group-hover:text-gold-500 transition-colors">
                {s.value}
              </div>
            </Link>
          );
        })}
      </div>

      {pending.length > 0 && (
        <div className="mt-10">
          <h2 className="font-display text-2xl text-emerald_deep-700">
            Waiting for your review
          </h2>
          <ul className="mt-4 space-y-2">
            {pending.slice(0, 5).map((b) => (
              <li
                key={b.id}
                className="rounded-xl bg-white border border-emerald_deep-700/10 p-4 flex items-center justify-between"
              >
                <div>
                  <div className="font-medium text-emerald_deep-700">
                    {b.user?.name ?? '—'}
                  </div>
                  <div className="text-sm text-emerald_deep-700/60">
                    {new Date(b.eventDate).toLocaleDateString('en-RW', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}{' '}
                    · {b.items.length} item{b.items.length === 1 ? '' : 's'}
                  </div>
                </div>
                <Link
                  href={`/admin/bookings?status=PENDING`}
                  className="text-sm text-gold-500 hover:text-gold-600 font-medium"
                >
                  Review →
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </AdminShell>
  );
}
