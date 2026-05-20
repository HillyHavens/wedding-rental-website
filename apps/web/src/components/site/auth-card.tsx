import Link from 'next/link';
import { type ReactNode } from 'react';

interface AuthCardProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}

export function AuthCard({ title, subtitle, children, footer }: AuthCardProps) {
  return (
    <div className="min-h-screen bg-emerald-radial flex items-center justify-center py-12 px-4 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 25% 30%, #f5e9b9 1px, transparent 1px), radial-gradient(circle at 75% 70%, #f5e9b9 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />
      <div className="relative w-full max-w-md">
        <Link
          href="/"
          className="block text-center font-display text-3xl text-ivory-50 mb-8"
        >
          Bridal <span className="gold-shimmer">Belle</span>
        </Link>
        <div className="bg-ivory-50 rounded-3xl shadow-2xl p-8 sm:p-10">
          <h1 className="font-display text-3xl text-emerald_deep-700">{title}</h1>
          <p className="mt-1 text-sm text-emerald_deep-700/60">{subtitle}</p>
          <div className="mt-7">{children}</div>
        </div>
        <p className="mt-6 text-center text-sm text-ivory-50/70">{footer}</p>
      </div>
    </div>
  );
}
