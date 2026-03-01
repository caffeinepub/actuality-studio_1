import React from 'react';

const arts = [
  {
    name: 'Music & Sound Design',
    description:
      'The invisible architecture of time — rhythm, harmony, and resonance as the primal language through which form first becomes feeling.',
    accent: 'terracotta',
  },
  {
    name: 'Literature & Poetry',
    description:
      'Word as living image: the art of naming the world anew, weaving meaning from silence into the fabric of shared understanding.',
    accent: 'warm-gold',
  },
  {
    name: 'Movement Arts',
    description:
      'From contemporary eurythmy to performance, the body becomes a vessel for invisible forces — space, sound, and soul made visible in motion.',
    accent: 'sage',
  },
  {
    name: 'Sculpture & Ceramics',
    description:
      'The hand meets matter in dialogue: form drawn from the earth, shaped by intention, and returned as an offering of enduring presence.',
    accent: 'terracotta',
  },
  {
    name: 'Painting & Digital Rendering',
    description:
      'Colour as a living being — from pigment on canvas to luminous pixel, the painter reveals what light conceals within shadow.',
    accent: 'warm-gold',
  },
  {
    name: 'Drawing & Parametric Visualization',
    description:
      'The line as thought made manifest: from the first gesture of the hand to algorithmic precision, drawing bridges intuition and structure.',
    accent: 'sage',
  },
  {
    name: 'Allied Crafts',
    description:
      'The sacred continuum of making — weaving, metalwork, bookbinding, and all the crafts that honour material as a partner in creation.',
    accent: 'terracotta',
  },
];

type AccentKey = 'terracotta' | 'warm-gold' | 'sage';

const accentStyles: Record<AccentKey, { border: string; bg: string; dot: string; heading: string }> = {
  terracotta: {
    border: 'border-terracotta/25 hover:border-terracotta/55',
    bg: 'bg-terracotta/5',
    dot: 'bg-terracotta',
    heading: 'text-terracotta',
  },
  'warm-gold': {
    border: 'border-warm-gold/25 hover:border-warm-gold/55',
    bg: 'bg-warm-gold/5',
    dot: 'bg-warm-gold',
    heading: 'text-warm-gold',
  },
  sage: {
    border: 'border-sage/30 hover:border-sage/60',
    bg: 'bg-sage/5',
    dot: 'bg-sage',
    heading: 'text-forest',
  },
};

export default function SevenfoldArtsGrid() {
  return (
    <section className="bg-cream-dark border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 py-16 sm:py-24">
        {/* Section header */}
        <div className="text-center mb-14">
          <p className="font-body text-xs font-semibold tracking-[0.3em] uppercase text-terracotta mb-3">
            The Living Curriculum
          </p>
          <h2 className="font-display text-4xl sm:text-5xl font-light text-foreground leading-tight">
            The{' '}
            <span className="gradient-text-terracotta font-semibold">Sevenfold Arts</span>
          </h2>
          <p className="font-body text-base text-muted-foreground max-w-2xl mx-auto mt-4 leading-relaxed">
            In Steiner's philosophy, architecture stands as the supreme synthesis — the mother art
            from which six further disciplines unfold, each a distinct expression of the same
            creative impulse that builds worlds.
          </p>
        </div>

        {/* Arts grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
          {arts.map((art, index) => {
            const styles = accentStyles[art.accent as AccentKey];
            const isLast = index === arts.length - 1;
            return (
              <div
                key={art.name}
                className={`
                  group relative p-6 rounded-2xl bg-card border transition-all duration-300
                  shadow-card hover:shadow-card-hover
                  ${styles.border}
                  ${isLast ? 'sm:col-span-2 lg:col-span-1' : ''}
                `}
              >
                {/* Subtle tinted background on hover */}
                <div
                  className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${styles.bg}`}
                />

                <div className="relative">
                  {/* Ordinal + accent dot */}
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className={`w-2 h-2 rounded-full flex-shrink-0 ${styles.dot}`}
                    />
                    <span className="font-body text-xs font-semibold tracking-[0.25em] uppercase text-muted-foreground">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>

                  {/* Art name */}
                  <h3
                    className={`font-display text-xl sm:text-2xl font-semibold mb-3 leading-snug ${styles.heading}`}
                  >
                    {art.name}
                  </h3>

                  {/* Description */}
                  <p className="font-body text-sm text-muted-foreground leading-relaxed">
                    {art.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Decorative divider */}
        <div className="flex justify-center mt-14">
          <img
            src="/assets/generated/seasonal-leaf-vine-motif.dim_800x400.png"
            alt=""
            aria-hidden="true"
            className="w-40 h-auto opacity-15 pointer-events-none select-none"
          />
        </div>
      </div>
    </section>
  );
}
