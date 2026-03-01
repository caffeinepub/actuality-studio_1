import React from 'react';
import { Link } from '@tanstack/react-router';
import HeroBanner from '../components/HeroBanner';
import SevenfoldArtsGrid from '../components/SevenfoldArtsGrid';
import LoginButton from '../components/LoginButton';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { ArrowRight, Layers, Zap, Shield } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'NFT Membership',
    description: 'Mint your unique membership token on the Internet Computer. Immutable, verifiable, and truly yours.',
    iconBg: 'bg-terracotta/10 border-terracotta/20',
    iconColor: 'text-terracotta',
  },
  {
    icon: Zap,
    title: '30-Day Trial',
    description: 'Every new membership includes a full 30-day trial period to explore everything Actuality Studio has to offer.',
    iconBg: 'bg-warm-gold/10 border-warm-gold/20',
    iconColor: 'text-warm-gold',
  },
  {
    icon: Layers,
    title: 'On-Chain Identity',
    description: 'Powered by Internet Identity — no passwords, no email. Secure authentication built into the blockchain.',
    iconBg: 'bg-sage/10 border-sage/20',
    iconColor: 'text-forest',
  },
];

export default function LandingPage() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <HeroBanner />

      {/* Philosophical Introduction */}
      <section className="container mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="max-w-3xl mx-auto text-center space-y-6 animate-fade-in">
          <p className="font-body text-xs font-semibold tracking-[0.3em] uppercase text-terracotta">
            Our Foundation
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-light text-foreground leading-tight">
            Architecture as{' '}
            <span className="gradient-text-terracotta font-semibold">Supreme Synthesis</span>
          </h2>
          <div className="space-y-4 font-body text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            <p>
              Rudolf Steiner held that architecture is not merely one art among many — it is the
              primordial act of creation, the art that contains all others within its embrace.
              From the living form of a building, six further arts unfold as naturally as branches
              from a root: each discipline a distinct voice in a single, coherent song.
            </p>
            <p>
              Actuality Studio is built upon this insight. We call this unfolding{' '}
              <em className="font-semibold text-foreground not-italic">The Sevenfold Arts</em> —
              a curriculum and a community where architecture, music, poetry, movement, sculpture,
              painting, drawing, and allied crafts are understood not as separate subjects but as
              one living organism of human creative expression.
            </p>
          </div>

          {/* Decorative separator */}
          <div className="flex items-center justify-center gap-4 pt-2">
            <div className="h-px w-16 bg-terracotta/30" />
            <span className="text-terracotta text-lg">✦</span>
            <div className="h-px w-16 bg-terracotta/30" />
          </div>
        </div>
      </section>

      {/* The Sevenfold Arts Grid */}
      <SevenfoldArtsGrid />

      {/* CTA Section */}
      <section className="container mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <div className="max-w-3xl mx-auto text-center space-y-8 animate-fade-in">
          {/* Decorative leaf motif above CTA */}
          <div className="flex justify-center mb-2">
            <img
              src="/assets/generated/seasonal-leaf-vine-motif.dim_800x400.png"
              alt=""
              aria-hidden="true"
              className="w-48 h-auto opacity-20 pointer-events-none select-none"
            />
          </div>

          <div className="space-y-4">
            <p className="font-body text-xs font-semibold tracking-[0.3em] uppercase text-terracotta">
              Your Creative Membership
            </p>
            <h2 className="font-display text-4xl sm:text-5xl font-light text-foreground leading-tight">
              Step into the{' '}
              <span className="gradient-text-terracotta font-semibold">Studio</span>
            </h2>
            <p className="font-body text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Actuality Studio is a members-only creative platform built on the Internet Computer.
              Authenticate with Internet Identity and mint your NFT membership to begin your
              journey through The Sevenfold Arts.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl gradient-terracotta text-primary-foreground font-semibold font-body text-base shadow-warm-md hover:opacity-90 transition-opacity"
              >
                Go to Dashboard
                <ArrowRight className="w-5 h-5" />
              </Link>
            ) : (
              <LoginButton size="lg" className="px-8 py-4 rounded-xl text-base h-auto" />
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border bg-cream-dark">
        <div className="container mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="text-center mb-12">
            <h3 className="font-display text-3xl sm:text-4xl font-light text-foreground">
              Built for the{' '}
              <span className="gradient-text-terracotta">Future</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="group p-6 rounded-2xl bg-card border border-border hover:border-terracotta/30 transition-all duration-300 shadow-card hover:shadow-card-hover"
                >
                  <div className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-4 transition-colors ${feature.iconBg}`}>
                    <Icon className={`w-6 h-6 ${feature.iconColor}`} />
                  </div>
                  <h4 className="font-display text-xl font-semibold text-foreground mb-2">
                    {feature.title}
                  </h4>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
