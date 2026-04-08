import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import LoginButton from "../components/LoginButton";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function LandingPage() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  return (
    <main className="min-h-screen flex flex-col">
      {/* Your Actuality Studio Account — hero section */}
      <section className="flex-1 flex items-center justify-center container mx-auto px-4 sm:px-6 py-20 sm:py-28">
        <div className="max-w-2xl mx-auto text-center space-y-8 animate-fade-in">
          <p className="font-body text-xs font-semibold tracking-[0.3em] uppercase text-terracotta">
            Membership Hub · Internet Computer
          </p>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-light text-foreground leading-tight">
            Your Actuality Studio{" "}
            <span className="gradient-text-terracotta font-semibold">
              Account
            </span>
          </h1>
          <p className="font-body text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-xl mx-auto">
            A single identity that connects all Actuality Studio apps. Log in
            once, carry your membership across every connected experience.
          </p>

          <div className="flex items-center justify-center gap-4 pt-2">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl gradient-terracotta text-primary-foreground font-semibold font-body text-base shadow-warm-md hover:opacity-90 transition-opacity"
                data-ocid="cta.primary_button"
              >
                Go to Dashboard <ArrowRight className="w-5 h-5" />
              </Link>
            ) : (
              <LoginButton
                size="lg"
                className="px-8 py-4 rounded-xl text-base h-auto"
              />
            )}
          </div>

          <div className="flex items-center justify-center gap-4 pt-2">
            <div className="h-px w-16 bg-terracotta/30" />
            <span className="text-terracotta text-lg">✦</span>
            <div className="h-px w-16 bg-terracotta/30" />
          </div>
        </div>
      </section>

      {/* Your Creative Membership CTA */}
      <section className="border-t border-border bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="max-w-3xl mx-auto text-center space-y-8 animate-fade-in">
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
                Step into the{" "}
                <span className="gradient-text-terracotta font-semibold">
                  Studio
                </span>
              </h2>
              <p className="font-body text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
                Actuality Studio is a members-only creative platform built on
                the Internet Computer. Authenticate with Internet Identity and
                mint your NFT membership to begin your journey into The
                Sevenfold Arts.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl gradient-terracotta text-primary-foreground font-semibold font-body text-base shadow-warm-md hover:opacity-90 transition-opacity"
                  data-ocid="cta.secondary_button"
                >
                  Go to Dashboard <ArrowRight className="w-5 h-5" />
                </Link>
              ) : (
                <LoginButton
                  size="lg"
                  className="px-8 py-4 rounded-xl text-base h-auto"
                />
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
