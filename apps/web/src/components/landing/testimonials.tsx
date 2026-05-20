import { Reveal } from '@/components/site/reveal';
import { Quote } from 'lucide-react';

const testimonials = [
  {
    quote:
      'From Gusaba in the village to the reception at Serena — Bridal Belle handled every outfit, every car, every floral arrangement. I just had to show up.',
    name: 'Aline & Patrick',
    where: 'Married in Kigali, Sept 2025',
  },
  {
    quote:
      "The umushanana for my mother was breathtaking. They listened to what we wanted and delivered something my whole family won't stop talking about.",
    name: 'Diane & Eric',
    where: 'Married in Musanze, July 2025',
  },
  {
    quote:
      "I rented suits for myself and eight groomsmen — all fitted perfectly. Stress-free, even with a week's notice.",
    name: 'Kevin & Carine',
    where: 'Married in Kigali, March 2026',
  },
];

export function Testimonials() {
  return (
    <section id="story" className="relative py-24 md:py-32 bg-ivory-100">
      <div className="container">
        <Reveal>
          <div className="max-w-2xl">
            <span className="text-xs uppercase tracking-[0.3em] text-gold-500">
              Loved by couples
            </span>
            <h2 className="mt-3 font-display text-4xl md:text-5xl text-emerald_deep-700 text-balance">
              Real weddings. Real words.
            </h2>
          </div>
        </Reveal>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.08}>
              <figure className="h-full rounded-2xl bg-white p-8 shadow-sm shadow-emerald_deep-700/5 border border-emerald_deep-700/5">
                <Quote className="h-8 w-8 text-gold-400" />
                <blockquote className="mt-5 font-display text-xl leading-snug text-emerald_deep-700/90">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-6 pt-6 border-t border-emerald_deep-700/10">
                  <div className="font-medium text-emerald_deep-700">
                    {t.name}
                  </div>
                  <div className="text-sm text-emerald_deep-700/60 mt-0.5">
                    {t.where}
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
