import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Reveal } from '@/components/site/reveal';
import { Button } from '@/components/ui/button';

export function CtaBanner() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-emerald_deep-700">
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            'radial-gradient(ellipse at top left, #dabb3d 0%, transparent 60%), radial-gradient(ellipse at bottom right, #bd562f 0%, transparent 60%)',
        }}
      />
      <div className="container relative text-center">
        <Reveal>
          <span className="text-xs uppercase tracking-[0.3em] text-gold-200">
            Start the conversation
          </span>
          <h2 className="mt-4 font-display text-4xl sm:text-5xl md:text-6xl text-ivory-50 max-w-3xl mx-auto text-balance">
            Your wedding is months away. <br className="hidden sm:block" />
            <span className="gold-shimmer italic">Let&apos;s make it</span>{' '}
            unforgettable.
          </h2>
          <p className="mt-6 max-w-xl mx-auto text-ivory-50/70 leading-relaxed">
            Tell us your date, your ceremonies, and what matters most. We&apos;ll
            put together a package within 48 hours.
          </p>
        </Reveal>
        <Reveal delay={0.2}>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button asChild variant="gold" size="lg">
              <Link href="/booking">
                Start your booking
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="mailto:hello@bridalbelle.rw">
                Or message us
              </Link>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
