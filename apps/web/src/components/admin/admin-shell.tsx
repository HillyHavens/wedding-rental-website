'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';
import {
  LayoutDashboard,
  CalendarRange,
  Images,
  Package,
  LogOut,
  Loader2,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { cn } from '@/lib/utils';

const links = [
  { href: '/admin', label: 'Dashboard', Icon: LayoutDashboard },
  { href: '/admin/bookings', label: 'Bookings', Icon: CalendarRange },
  { href: '/admin/items', label: 'Items', Icon: Package },
  { href: '/admin/gallery', label: 'Gallery', Icon: Images },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace('/login?next=' + (pathname ?? '/admin'));
    } else if (user.role !== 'ADMIN') {
      router.replace('/account/bookings');
    }
  }, [loading, user, router, pathname]);

  if (loading || !user || user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ivory-50">
        <Loader2 className="h-6 w-6 animate-spin text-emerald_deep-700/50" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory-50 flex">
      <aside className="hidden md:flex w-64 shrink-0 bg-emerald_deep-700 text-ivory-50 flex-col">
        <Link href="/" className="block px-6 py-6 font-display text-2xl">
          Bridal <span className="gold-shimmer">Belle</span>
        </Link>
        <nav className="flex-1 px-3 space-y-1">
          {links.map((l) => {
            const active = pathname === l.href;
            const Icon = l.Icon;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  active
                    ? 'bg-ivory-50/15 text-gold-100'
                    : 'text-ivory-50/70 hover:bg-ivory-50/5 hover:text-ivory-50',
                )}
              >
                <Icon className="h-4 w-4" />
                {l.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-ivory-50/10">
          <div className="px-3 py-2 text-xs text-ivory-50/50">
            {user.email}
          </div>
          <button
            onClick={() => {
              logout();
              router.push('/');
            }}
            className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-ivory-50/70 hover:bg-ivory-50/5 hover:text-ivory-50"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        <header className="md:hidden bg-emerald_deep-700 text-ivory-50 px-4 py-4 flex items-center justify-between">
          <Link href="/admin" className="font-display text-xl">
            Bridal <span className="gold-shimmer">Belle</span>
          </Link>
          <button
            onClick={() => {
              logout();
              router.push('/');
            }}
            className="text-sm text-ivory-50/70"
          >
            Sign out
          </button>
        </header>
        <nav className="md:hidden bg-emerald_deep-800 text-ivory-50/80 flex">
          {links.map((l) => {
            const active = pathname === l.href;
            const Icon = l.Icon;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  'flex-1 flex flex-col items-center gap-1 py-3 text-xs transition-colors',
                  active && 'text-gold-200 bg-emerald_deep-700',
                )}
              >
                <Icon className="h-4 w-4" />
                {l.label}
              </Link>
            );
          })}
        </nav>

        <main className="p-6 md:p-10">{children}</main>
      </div>
    </div>
  );
}
