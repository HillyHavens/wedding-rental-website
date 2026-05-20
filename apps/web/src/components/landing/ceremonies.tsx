import { Reveal } from '@/components/site/reveal';

const ceremonies = [
  {
    name: 'Gusaba',
    subtitle: 'The asking',
    description:
      'The first formal step — families meet, intentions are made known. Traditional attire and dignified décor set the tone.',
  },
  {
    name: 'Gukwa',
    subtitle: 'The dowry',
    description:
      'The dowry ceremony, rich in symbolism. Umushanana, beaded jewelry, and ceremonial drumming take centre stage.',
  },
  {
    name: 'Civil',
    subtitle: 'The legal vow',
    description:
      'Cleaner lines, a softer palette — refined suits and gowns for the official commitment at the bureau.',
  },
  {
    name: 'Religious',
    subtitle: 'The blessing',
    description:
      'White gowns, cathedral veils, hand-tied bouquets. The day for sacred vows and timeless photography.',
  },
  {
    name: 'Reception',
    subtitle: 'The celebration',
    description:
      'Imitako décor, full catering, a fleet of cars, and a DJ that knows every Kigali anthem. Dance until dawn.',
  },
];

export function Ceremonies() {
  return (
    <section id="ceremonies" className="relative py-24 md:py-32 bg-ivory-50">
      <div className="container">
        <Reveal>
          <div className="max-w-2xl">
            <span className="text-xs uppercase tracking-[0.3em] text-gold-500">
              The Rwandan wedding
            </span>
            <h2 className="mt-3 font-display text-4xl md:text-5xl text-emerald_deep-700 text-balance">
              Five ceremonies. One seamless rental.
            </h2>
            <p className="mt-5 text-emerald_deep-700/70 leading-relaxed">
              A Rwandan wedding isn&apos;t one day — it&apos;s a story told
              across five moments. We outfit, decorate, and transport each one,
              so you can stay present where it matters.
            </p>
          </div>
        </Reveal>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {ceremonies.map((c, i) => (
            <Reveal key={c.name} delay={i * 0.08}>
              <article className="group relative h-full rounded-2xl border border-emerald_deep-700/10 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald_deep-700/10 hover:border-gold-300/50">
                <div className="font-display text-5xl text-gold-500/20 group-hover:text-gold-500/40 transition-colors">
                  0{i + 1}
                </div>
                <h3 className="mt-2 font-display text-2xl text-emerald_deep-700">
                  {c.name}
                </h3>
                <div className="text-xs uppercase tracking-[0.2em] text-terracotta-500 mt-1">
                  {c.subtitle}
                </div>
                <p className="mt-4 text-sm text-emerald_deep-700/70 leading-relaxed">
                  {c.description}
                </p>
                <div className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-gold-300/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
