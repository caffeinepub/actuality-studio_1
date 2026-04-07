import { CheckCircle2, Circle, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const arts = [
  {
    name: "Architecture",
    description:
      "The supreme synthesis — the mother art that holds and harmonizes all others, shaping space as a vessel for the full spectrum of human creative life.",
    accent: "warm-gold",
    isLead: true,
  },
  {
    name: "Music & Sound Design",
    description:
      "The invisible architecture of time — rhythm, harmony, and resonance as the primal language through which form first becomes feeling.",
    accent: "terracotta",
    isLead: false,
  },
  {
    name: "Literature & Poetry",
    description:
      "Word as living image: the art of naming the world anew, weaving meaning from silence into the fabric of shared understanding.",
    accent: "warm-gold",
    isLead: false,
  },
  {
    name: "Movement Arts",
    description:
      "From contemporary eurythmy to performance, the body becomes a vessel for invisible forces — space, sound, and soul made visible in motion.",
    accent: "sage",
    isLead: false,
  },
  {
    name: "Sculpture & Ceramics",
    description:
      "The hand meets matter in dialogue: form drawn from the earth, shaped by intention, and returned as an offering of enduring presence.",
    accent: "terracotta",
    isLead: false,
  },
  {
    name: "Painting & Digital Rendering",
    description:
      "Colour as a living being — from pigment on canvas to luminous pixel, the painter reveals what light conceals within shadow.",
    accent: "warm-gold",
    isLead: false,
  },
  {
    name: "Drawing & Parametric Visualization",
    description:
      "The line as thought made manifest: from the first gesture of the hand to algorithmic precision, drawing bridges intuition and structure.",
    accent: "sage",
    isLead: false,
  },
  {
    name: "Allied Crafts",
    description:
      "The sacred continuum of making — weaving, metalwork, bookbinding, and all the crafts that honour material as a partner in creation.",
    accent: "terracotta",
    isLead: false,
  },
];

type AccentKey = "terracotta" | "warm-gold" | "sage";

const accentStyles: Record<
  AccentKey,
  { border: string; bg: string; dot: string; heading: string; ring: string }
> = {
  terracotta: {
    border: "border-terracotta/25",
    bg: "bg-terracotta/5",
    dot: "bg-terracotta",
    heading: "text-terracotta",
    ring: "ring-2 ring-terracotta/60 border-terracotta/40",
  },
  "warm-gold": {
    border: "border-warm-gold/25",
    bg: "bg-warm-gold/5",
    dot: "bg-warm-gold",
    heading: "text-warm-gold",
    ring: "ring-2 ring-warm-gold/60 border-warm-gold/40",
  },
  sage: {
    border: "border-sage/30",
    bg: "bg-sage/5",
    dot: "bg-sage",
    heading: "text-forest",
    ring: "ring-2 ring-sage/60 border-sage/40",
  },
};

function ArtCard({
  art,
  cardNum,
  isSelected,
  onToggle,
  isLead = false,
}: {
  art: { name: string; description: string; accent: string };
  cardNum: number;
  isSelected: boolean;
  onToggle: (name: string) => void;
  isLead?: boolean;
}) {
  const styles = accentStyles[art.accent as AccentKey];
  return (
    <div
      data-ocid={`arts.card.${cardNum}`}
      className={`group relative rounded-2xl bg-card border transition-all duration-300 shadow-card hover:shadow-card-hover ${isSelected ? styles.ring : styles.border} ${isLead ? "p-8" : "p-6"}`}
    >
      <div
        className={`absolute inset-0 rounded-2xl transition-opacity duration-300 ${styles.bg} ${isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
      />
      <button
        type="button"
        data-ocid={`arts.card.checkbox.${cardNum}`}
        onClick={() => onToggle(art.name)}
        className="absolute top-4 right-4 z-10 p-1 rounded-full transition-colors"
        aria-label={isSelected ? `Deselect ${art.name}` : `Select ${art.name}`}
        aria-pressed={isSelected}
      >
        {isSelected ? (
          <CheckCircle2 className="w-5 h-5 text-terracotta" />
        ) : (
          <Circle className="w-5 h-5 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors" />
        )}
      </button>
      <div className="relative pr-8">
        <div className="flex items-center gap-2 mb-3">
          <span
            className={`rounded-full flex-shrink-0 ${styles.dot} ${isLead ? "w-2.5 h-2.5" : "w-2 h-2"}`}
          />
          <span className="font-body text-xs font-semibold tracking-[0.25em] uppercase text-muted-foreground">
            {isLead
              ? "The Supreme Synthesis · 00"
              : String(cardNum - 1).padStart(2, "0")}
          </span>
        </div>
        <h3
          className={`font-display font-semibold mb-3 leading-snug ${styles.heading} ${isLead ? "text-3xl sm:text-4xl" : "text-xl sm:text-2xl"}`}
        >
          {art.name}
        </h3>
        <p
          className={`font-body text-muted-foreground leading-relaxed ${isLead ? "text-base max-w-3xl" : "text-sm"}`}
        >
          {art.description}
        </p>
      </div>
    </div>
  );
}

export default function SevenfoldArtsGrid() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { actor } = useActor();

  useEffect(() => {
    if (!isAuthenticated || !actor || initialized) return;
    actor
      .getSelectedArts()
      .then((savedArts) => {
        setSelected(new Set(savedArts));
        setInitialized(true);
      })
      .catch(() => setInitialized(true));
  }, [isAuthenticated, actor, initialized]);

  const toggleCard = (name: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      if (isAuthenticated && actor) {
        setSaving(true);
        actor.saveSelectedArts([...next]).finally(() => setSaving(false));
      }
      return next;
    });
  };

  return (
    <section className="bg-cream-dark border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <div className="text-center mb-6">
          <p className="font-body text-xs font-semibold tracking-[0.3em] uppercase text-terracotta mb-3">
            The Living Curriculum
          </p>
          <h2 className="font-display text-4xl sm:text-5xl font-light text-foreground leading-tight">
            The{" "}
            <span className="gradient-text-terracotta font-semibold">
              Sevenfold Arts
            </span>
          </h2>
          <p className="font-body text-base text-muted-foreground max-w-2xl mx-auto mt-4 leading-relaxed">
            In Steiner's philosophy, architecture stands as the supreme
            synthesis — the mother art from which six further disciplines
            unfold, each a distinct expression of the same creative impulse that
            builds worlds.
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 mb-10">
          <Circle className="w-4 h-4 text-muted-foreground" />
          <p className="font-body text-sm text-muted-foreground italic">
            Select cards to customize your membership content and affiliate
            website
          </p>
          {saving && (
            <span className="flex items-center gap-1 text-xs text-terracotta">
              <Loader2 className="w-3 h-3 animate-spin" /> Saving...
            </span>
          )}
        </div>

        <div className="max-w-6xl mx-auto space-y-5">
          <ArtCard
            art={arts[0]}
            cardNum={1}
            isSelected={selected.has(arts[0].name)}
            onToggle={toggleCard}
            isLead
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {arts.slice(1).map((art, i) => (
              <ArtCard
                key={art.name}
                art={art}
                cardNum={i + 2}
                isSelected={selected.has(art.name)}
                onToggle={toggleCard}
              />
            ))}
          </div>
        </div>

        {selected.size > 0 && (
          <div className="mt-8 text-center">
            <p className="font-body text-sm text-muted-foreground">
              <span className="font-semibold text-terracotta">
                {selected.size}
              </span>{" "}
              art{selected.size !== 1 ? "s" : ""} selected for your membership
            </p>
          </div>
        )}

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
