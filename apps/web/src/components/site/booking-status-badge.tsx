import { cn } from '@/lib/utils';
import { CheckCircle2, Clock, XCircle, CalendarCheck } from 'lucide-react';

const config = {
  PENDING: {
    label: 'Pending review',
    className: 'bg-gold-100 text-gold-700 border-gold-200',
    Icon: Clock,
  },
  CONFIRMED: {
    label: 'Confirmed',
    className: 'bg-emerald_deep-50 text-emerald_deep-700 border-emerald_deep-200',
    Icon: CheckCircle2,
  },
  CANCELLED: {
    label: 'Cancelled',
    className: 'bg-terracotta-50 text-terracotta-600 border-terracotta-100',
    Icon: XCircle,
  },
  COMPLETED: {
    label: 'Completed',
    className: 'bg-ivory-200 text-emerald_deep-700/70 border-ivory-300',
    Icon: CalendarCheck,
  },
} as const;

export function BookingStatusBadge({
  status,
}: {
  status: keyof typeof config;
}) {
  const c = config[status];
  const Icon = c.Icon;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium',
        c.className,
      )}
    >
      <Icon className="h-3 w-3" />
      {c.label}
    </span>
  );
}
