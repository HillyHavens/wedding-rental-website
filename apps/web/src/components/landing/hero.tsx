'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';

const headlineWords = ['Every', 'ceremony,', 'beautifully', 'rented.'];

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1606800052052-a08af7148866?w=1920&q=85"
          alt="Rwandan wedding celebration"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-emerald_deep-900/75 via-emerald_deep-800/55 to-emerald_deep-900/90" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(10,38,29,0.55)_100%)]" />
      </div>

      <div className="container relative z-10 pt-32 pb-20">
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 rounded-full border border-gold-200/30 bg-emerald_deep-800/30 backdrop-blur-md px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-gold-100"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-gold-300 animate-pulse" />
          Wedding rentals · Made in Rwanda
        </motion.div>

        <h1 className="mt-6 max-w-4xl font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[1.05] text-ivory-50 text-balance">
          {headlineWords.map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: reduce ? 0 : 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                delay: 0.15 + i * 0.12,
                ease: [0.21, 0.47, 0.32, 0.98],
              }}
              className="inline-block mr-3 last:mr-0"
            >
              {word === 'beautifully' ? (
                <span className="gold-shimmer italic">{word}</span>
              ) : (
                word
              )}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: reduce ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          className="mt-6 max-w-2xl text-lg sm:text-xl text-ivory-50/80 leading-relaxed"
        >
          From <em className="text-gold-200 not-italic">Gusaba</em> to the
          reception — umushanana, modern gowns, suits, décor, cars and catering.
          One place to dress every moment of your Rwandan wedding.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.85 }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <Button asChild variant="gold" size="lg">
            <Link href="/booking">
              Start your booking
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/items">
              <ShoppingBag className="h-4 w-4" />
              See what we offer
            </Link>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.4 }}
          className="mt-16 grid grid-cols-3 gap-6 max-w-xl"
        >
          {[
            { stat: '120+', label: 'Rentals available' },
            { stat: '5', label: 'Ceremony types' },
            { stat: '300+', label: 'Couples served' },
          ].map((s) => (
            <div key={s.label}>
              <div className="font-display text-3xl sm:text-4xl gold-text">
                {s.stat}
              </div>
              <div className="mt-1 text-xs sm:text-sm text-ivory-50/60 uppercase tracking-wider">
                {s.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 text-ivory-50/60"
      >
        <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <div className="h-10 w-px bg-gradient-to-b from-ivory-50/60 to-transparent" />
      </motion.div>
    </section>
  );
}
