import React from "react";

export default function HeroBanner() {
  return (
    <section className="relative w-full overflow-hidden">
      <div className="relative w-full" style={{ aspectRatio: "1440/480" }}>
        <img
          src="/assets/generated/hero-banner.dim_1440x480.png"
          alt="Actuality Studio — Where Architecture Meets the Living Arts"
          className="w-full h-full object-cover"
        />

        {/* Warm cream overlay for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-cream/80 via-cream/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-cream/55 via-transparent to-transparent" />

        {/* Seasonal leaf/vine motif overlay */}
        <div
          className="absolute inset-0 pointer-events-none select-none"
          style={{
            backgroundImage:
              "url('/assets/generated/seasonal-leaf-vine-motif.dim_800x400.png')",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right center",
            backgroundSize: "contain",
            opacity: 0.22,
          }}
        />

        {/* Hero Text */}
        <div className="absolute inset-0 flex flex-col justify-center px-8 sm:px-16 lg:px-24">
          <div className="max-w-2xl animate-fade-in">
            <p className="font-body text-xs font-semibold tracking-[0.3em] uppercase text-terracotta mb-4">
              Welcome to
            </p>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-light text-foreground leading-tight">
              Actuality
              <br />
              <span className="gradient-text-terracotta font-semibold">
                Studio
              </span>
            </h1>
          </div>
        </div>
      </div>
    </section>
  );
}
