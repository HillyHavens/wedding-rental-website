'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth-context';
import { useCart } from '@/lib/cart-context';
import { ShoppingBag } from 'lucide-react';

const links = [
  { href: '/items', label: 'Browse' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/#ceremonies', label: 'Ceremonies' },
  { href: '/#categories', label: 'Categories' },
  { href: '/#story', label: 'Our Story' },
];

export function SiteNav({ alwaysSolid = false }: { alwaysSolid?: boolean } = {}) {
  const [scrolled, setScrolled] = useState(alwaysSolid);
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const { items: cart } = useCart();

  useEffect(() => {
    if (alwaysSolid) return;
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [alwaysSolid]);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-ivory-50/85 backdrop-blur-md shadow-sm'
          : 'bg-transparent',
      )}
    >
      <div className="container flex h-20 items-center justify-between">
        <Link
          href="/"
          className={cn(
            'font-display text-2xl tracking-tight transition-colors',
            scrolled ? 'text-emerald_deep-700' : 'text-ivory-50',
          )}
        >
          Bridal <span className="gold-text">Belle</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                'text-sm font-medium transition-colors',
                scrolled
                  ? 'text-emerald_deep-700 hover:text-gold-500'
                  : 'text-ivory-50/90 hover:text-gold-200',
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {cart.length > 0 && (
            <Link
              href="/booking"
              className={cn(
                'inline-flex items-center gap-1.5 text-sm font-medium px-3 h-9 rounded-full transition-colors',
                scrolled
                  ? 'text-emerald_deep-700 hover:bg-ivory-100'
                  : 'text-ivory-50 hover:bg-ivory-50/10',
              )}
            >
              <ShoppingBag className="h-4 w-4" />
              <span className="tabular-nums">{cart.length}</span>
            </Link>
          )}
          {user ? (
            <>
              <Button asChild variant={scrolled ? 'ghost' : 'outline'} size="sm">
                <Link href={user.role === 'ADMIN' ? '/admin' : '/account/bookings'}>
                  {user.role === 'ADMIN' ? 'Admin' : 'My bookings'}
                </Link>
              </Button>
              <button
                onClick={logout}
                className={cn(
                  'text-sm font-medium px-3 transition-colors',
                  scrolled
                    ? 'text-emerald_deep-700/70 hover:text-emerald_deep-700'
                    : 'text-ivory-50/70 hover:text-ivory-50',
                )}
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Button asChild variant={scrolled ? 'ghost' : 'outline'} size="sm">
                <Link href="/login">Sign in</Link>
              </Button>
              <Button asChild variant="gold" size="sm">
                <Link href="/booking">Book now</Link>
              </Button>
            </>
          )}
        </div>

        <Dialog.Root open={open} onOpenChange={setOpen}>
          <Dialog.Trigger asChild>
            <button
              className={cn(
                'md:hidden p-2 rounded-md',
                scrolled ? 'text-emerald_deep-700' : 'text-ivory-50',
              )}
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-emerald_deep-700/60 backdrop-blur-sm z-50 data-[state=open]:animate-in data-[state=open]:fade-in data-[state=closed]:animate-out data-[state=closed]:fade-out" />
            <Dialog.Content className="fixed inset-y-0 right-0 z-50 w-full max-w-xs bg-ivory-50 p-8 shadow-xl flex flex-col data-[state=open]:animate-in data-[state=open]:slide-in-from-right data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right">
              <Dialog.Title className="sr-only">Menu</Dialog.Title>
              <div className="flex items-center justify-between mb-12">
                <span className="font-display text-2xl text-emerald_deep-700">
                  Bridal <span className="gold-text">Belle</span>
                </span>
                <Dialog.Close
                  className="p-2 rounded-md text-emerald_deep-700"
                  aria-label="Close menu"
                >
                  <X className="h-6 w-6" />
                </Dialog.Close>
              </div>
              <nav className="flex flex-col gap-6">
                {links.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="font-display text-2xl text-emerald_deep-700 hover:text-gold-500 transition-colors"
                  >
                    {l.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-auto flex flex-col gap-3">
                {user ? (
                  <>
                    <Button asChild variant="ghost" size="lg">
                      <Link
                        href={user.role === 'ADMIN' ? '/admin' : '/account/bookings'}
                        onClick={() => setOpen(false)}
                      >
                        {user.role === 'ADMIN' ? 'Admin' : 'My bookings'}
                      </Link>
                    </Button>
                    <Button
                      variant="gold"
                      size="lg"
                      onClick={() => {
                        logout();
                        setOpen(false);
                      }}
                    >
                      Sign out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button asChild variant="ghost" size="lg">
                      <Link href="/login" onClick={() => setOpen(false)}>
                        Sign in
                      </Link>
                    </Button>
                    <Button asChild variant="gold" size="lg">
                      <Link href="/booking" onClick={() => setOpen(false)}>
                        Book now
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </header>
  );
}
