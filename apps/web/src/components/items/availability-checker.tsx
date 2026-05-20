'use client';

import { useState } from 'react';
import { CalendarCheck, CalendarX, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input, Label } from '@/components/ui/input';
import { apiFetch } from '@/lib/client-api';

interface AvailabilityRow {
  id: string;
  quantity: number;
  bookedCount: number;
  available: number;
}

export function AvailabilityChecker({
  itemId,
  totalQuantity,
}: {
  itemId: string;
  totalQuantity: number;
}) {
  const [date, setDate] = useState('');
  const [status, setStatus] = useState<
    | { kind: 'idle' }
    | { kind: 'loading' }
    | { kind: 'ok'; available: number; quantity: number }
    | { kind: 'error'; message: string }
  >({ kind: 'idle' });

  const check = async () => {
    if (!date) return;
    setStatus({ kind: 'loading' });
    try {
      const rows = await apiFetch<AvailabilityRow[]>(
        `/items/availability?date=${date}&ids=${itemId}`,
      );
      const row = rows[0];
      if (!row) {
        setStatus({ kind: 'error', message: 'Item not found' });
        return;
      }
      setStatus({
        kind: 'ok',
        available: row.available,
        quantity: row.quantity,
      });
    } catch (err) {
      setStatus({
        kind: 'error',
        message: (err as { message?: string }).message ?? 'Check failed',
      });
    }
  };

  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="rounded-2xl border border-emerald_deep-700/10 bg-white p-6">
      <h3 className="font-display text-xl text-emerald_deep-700">
        Check availability
      </h3>
      <p className="mt-1 text-sm text-emerald_deep-700/60">
        Pick a date to see if this is free on the day of your ceremony.{' '}
        <span className="block mt-1">
          We have {totalQuantity} of these in stock.
        </span>
      </p>
      <div className="mt-5 flex flex-col sm:flex-row gap-3 sm:items-end">
        <div className="flex-1">
          <Label htmlFor="avail-date">Event date</Label>
          <Input
            id="avail-date"
            type="date"
            min={today}
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <Button onClick={check} disabled={!date || status.kind === 'loading'}>
          {status.kind === 'loading' ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            'Check'
          )}
        </Button>
      </div>

      {status.kind === 'ok' && (
        <div
          className={`mt-5 flex items-start gap-3 rounded-xl px-4 py-3 ${
            status.available > 0
              ? 'bg-emerald_deep-50 text-emerald_deep-700'
              : 'bg-terracotta-50 text-terracotta-500'
          }`}
        >
          {status.available > 0 ? (
            <CalendarCheck className="h-5 w-5 mt-0.5 shrink-0" />
          ) : (
            <CalendarX className="h-5 w-5 mt-0.5 shrink-0" />
          )}
          <div>
            <div className="font-medium">
              {status.available > 0
                ? `Available — ${status.available} of ${status.quantity} free on ${date}`
                : `Fully booked on ${date}`}
            </div>
            <div className="text-sm opacity-80 mt-0.5">
              {status.available > 0
                ? 'Add to your booking from above.'
                : 'Try another date, or pick a similar item.'}
            </div>
          </div>
        </div>
      )}

      {status.kind === 'error' && (
        <p className="mt-4 text-sm text-terracotta-500">{status.message}</p>
      )}
    </div>
  );
}
