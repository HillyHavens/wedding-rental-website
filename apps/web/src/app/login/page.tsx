'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input, Label } from '@/components/ui/input';
import { AuthCard } from '@/components/site/auth-card';
import { useAuth } from '@/lib/auth-context';
import type { ApiError } from '@/lib/client-api';

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get('next');
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const user = await login(email, password);
      const target = next ?? (user.role === 'ADMIN' ? '/admin' : '/account/bookings');
      router.push(target);
    } catch (err) {
      setError((err as ApiError).message ?? 'Login failed');
      setSubmitting(false);
    }
  };

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Sign in to manage your bookings"
      footer={
        <>
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-gold-200 hover:text-gold-100 font-medium">
            Create one
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-5">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && (
          <p className="text-sm text-terracotta-500 bg-terracotta-50 rounded-lg px-3 py-2">
            {error}
          </p>
        )}
        <Button type="submit" disabled={submitting} className="w-full" size="lg">
          {submitting ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>
    </AuthCard>
  );
}
