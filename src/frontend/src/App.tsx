import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/sonner";
import {
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  ExternalLink,
  Loader2,
  Moon,
  Palette,
  Sun,
  Trees,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import {
  MembershipTier,
  useGetLinkedApps,
  useGetMembershipTier,
  useGetTrialExpiryDate,
  useMintMembership,
} from "./hooks/useQueries";

// ─── Types ────────────────────────────────────────────────────────────────────

type Theme = "twilight" | "dawn" | "forest";

interface ConnectedApp {
  name: string;
  desc: string;
  url: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const CONNECTED_APPS: ConnectedApp[] = [
  {
    name: "One-Page Verbal Declaration",
    desc: "Witnesses & declarations",
    url: "https://one-page-verbal-declaration-and-witnesses-sdi.caffeine.xyz/",
  },
  {
    name: "Story of Home",
    desc: "Creative resource explorer",
    url: "https://creative-resource-app-story-of-home-u5l.caffeine.xyz/",
  },
  {
    name: "Creative Commerce Hub",
    desc: "Shopify-integrated storefront",
    url: "https://creative-commerce-hub---shopify-first-version-vzj.caffeine.xyz/",
  },
  {
    name: "Actuality Studio AppApp",
    desc: "Core studio app",
    url: "https://actuality-studio-appapp-jcx.caffeine.xyz/",
  },
  {
    name: "Theme System",
    desc: "Steiner theme explorer",
    url: "https://actuality-studio-theme-w3r.caffeine.xyz/",
  },
  {
    name: "Studio Invite",
    desc: "Invite & RSVP system",
    url: "https://actuality-studio-invite-8qr.caffeine.xyz/",
  },
  {
    name: "Doc Scan App",
    desc: "Document scanning & sharing",
    url: "https://doc-scan-app-aoo.caffeine.xyz/",
  },
];

const BRIGHTNESS_STEPS = [40, 50, 60, 70, 80, 90, 100];

const THEME_META: Record<
  Theme,
  { label: string; icon: React.ReactNode; desc: string; class: string }
> = {
  twilight: {
    label: "Twilight",
    icon: <Moon className="w-4 h-4" />,
    desc: "Deep blue-violet · App Interface",
    class: "theme-twilight",
  },
  dawn: {
    label: "Dawn",
    icon: <Sun className="w-4 h-4" />,
    desc: "Pale gold · Main Site",
    class: "theme-dawn",
  },
  forest: {
    label: "Forest-Soul",
    icon: <Trees className="w-4 h-4" />,
    desc: "Living sage · Affiliate Sites",
    class: "theme-forest",
  },
};

const DEV_TEMPLATE = `Template: Connecting a new app to Actuality Studio

Create a new app that integrates with Actuality Studio as its identity provider:

1. Do NOT implement signup or password login.
2. On load, check for an authenticated Internet Identity principal.
   If not authenticated, redirect to the Actuality Studio Membership Hub URL, then return here.
3. On startup, call the Actuality Studio membership canister:
   - linkAppPrincipal(YOUR_APP_ID, callerPrincipal) — registers the user-app link
   - getMembershipTier(callerPrincipal) — returns #free | #trial | #full
4. Conditionally enable features based on the returned tier.`;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function truncatePrincipal(p: string): string {
  if (p.length <= 20) return p;
  return `${p.slice(0, 10)}…${p.slice(-8)}`;
}

function formatTrialExpiry(ns: bigint): string {
  const ms = Number(ns / BigInt(1_000_000));
  return new Date(ms).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function TierBadge({ tier }: { tier: MembershipTier }) {
  if (tier === MembershipTier.full) {
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold font-body tracking-widest gradient-gold text-background shadow-gold-sm">
        FULL MEMBER
      </span>
    );
  }
  if (tier === MembershipTier.trial) {
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold font-body tracking-widest bg-amber-500/20 text-amber-300 border border-amber-500/30">
        TRIAL
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold font-body tracking-widest bg-muted text-muted-foreground border border-border">
      FREE
    </span>
  );
}

function PrincipalCopy({ principal }: { principal: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(principal);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [principal]);

  return (
    <button
      type="button"
      onClick={handleCopy}
      data-ocid="membership.principal_button"
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted hover:bg-muted/80 border border-border transition-colors group"
    >
      <span className="font-mono text-xs text-muted-foreground group-hover:text-foreground transition-colors">
        {truncatePrincipal(principal)}
      </span>
      <AnimatePresence mode="wait">
        {copied ? (
          <motion.span
            key="check"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
          >
            <Check className="w-3 h-3 text-green-400" />
          </motion.span>
        ) : (
          <motion.span
            key="copy"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
          >
            <Copy className="w-3 h-3 text-muted-foreground group-hover:text-foreground" />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}

function AppCard({ app, index }: { app: ConnectedApp; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4, ease: "easeOut" }}
    >
      <Card
        data-ocid={`apps.item.${index + 1}`}
        className="h-full group hover:shadow-card-hover transition-all duration-300 border-border/60 hover:border-primary/30"
      >
        <CardHeader className="pb-2">
          <CardTitle className="font-display text-base text-foreground group-hover:text-warm-gold transition-colors">
            {app.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <p className="text-sm text-muted-foreground">{app.desc}</p>
          <a
            href={app.url}
            target="_blank"
            rel="noopener noreferrer"
            data-ocid={`apps.item.${index + 1}`}
          >
            <Button
              size="sm"
              variant="outline"
              className="w-full gap-1.5 hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              Open App <ExternalLink className="w-3.5 h-3.5" />
            </Button>
          </a>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem("as-theme") as Theme) || "twilight";
  });
  const [brightness, setBrightness] = useState<number>(() => {
    return Number(localStorage.getItem("as-brightness")) || 100;
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const [devOpen, setDevOpen] = useState(false);
  const [showThemeChooser, setShowThemeChooser] = useState(() => {
    return !localStorage.getItem("as-theme");
  });

  const { identity, login, clear, isInitializing, isLoggingIn } =
    useInternetIdentity();
  const isLoggedIn = !!identity;
  const principal = identity?.getPrincipal();
  const principalStr = principal?.toString() ?? "";

  const { data: tier, isLoading: tierLoading } =
    useGetMembershipTier(principal);
  const { data: linkedApps, isLoading: appsLoading } =
    useGetLinkedApps(principal);
  const { data: trialExpiry } = useGetTrialExpiryDate();
  const mintMembership = useMintMembership();

  // Apply theme class to html element
  const themeClass = THEME_META[theme].class;
  if (typeof document !== "undefined") {
    const html = document.documentElement;
    html.className = themeClass;
    html.style.filter =
      brightness < 100 ? `brightness(${brightness / 100})` : "";
  }

  function handleThemeSelect(t: Theme) {
    setTheme(t);
    localStorage.setItem("as-theme", t);
    setShowThemeChooser(false);
  }

  function handleBrightness(val: number) {
    setBrightness(val);
    localStorage.setItem("as-brightness", String(val));
  }

  async function handleMint() {
    try {
      await mintMembership.mutateAsync();
      toast.success("Membership minted! Welcome to Actuality Studio.");
    } catch {
      toast.error("Failed to mint membership. Please try again.");
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Toaster />

      {/* ── First-use theme chooser overlay ───────────────────────────────── */}
      <AnimatePresence>
        {showThemeChooser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            data-ocid="theme.modal"
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              className="bg-card border border-border rounded-2xl p-8 max-w-md w-full shadow-warm-md"
            >
              <h2 className="font-display text-2xl text-foreground mb-1">
                Choose Your Palette
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                Select your Steiner-inspired visual theme. You can change this
                anytime from the menu.
              </p>
              <div className="flex flex-col gap-3">
                {(Object.keys(THEME_META) as Theme[]).map((t) => (
                  <button
                    type="button"
                    key={t}
                    onClick={() => handleThemeSelect(t)}
                    data-ocid="theme.toggle"
                    className={`flex items-center gap-4 p-4 rounded-xl border transition-all text-left hover:border-primary/60 hover:bg-muted/50 ${
                      t === "twilight"
                        ? "border-primary/40 bg-muted/30"
                        : "border-border"
                    }`}
                  >
                    <span className="text-primary">{THEME_META[t].icon}</span>
                    <div>
                      <div className="font-semibold text-foreground text-sm">
                        {THEME_META[t].label}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {THEME_META[t].desc}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Slide-out side menu ───────────────────────────────────────────── */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
              onClick={() => setMenuOpen(false)}
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="fixed right-0 top-0 h-full w-80 z-50 bg-card border-l border-border shadow-warm-md flex flex-col"
              data-ocid="theme.sheet"
            >
              <div className="flex items-center justify-between p-4 border-b border-border">
                <span className="font-display text-lg text-foreground">
                  Studio Settings
                </span>
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  data-ocid="theme.close_button"
                  className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6">
                {/* Theme selector */}
                <section>
                  <h3 className="text-xs font-semibold tracking-widest text-muted-foreground uppercase mb-3">
                    Visual Theme
                  </h3>
                  <div className="flex flex-col gap-2">
                    {(Object.keys(THEME_META) as Theme[]).map((t) => (
                      <button
                        type="button"
                        key={t}
                        onClick={() => handleThemeSelect(t)}
                        data-ocid="theme.toggle"
                        className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                          theme === t
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border hover:border-primary/40 hover:bg-muted/30"
                        }`}
                      >
                        {THEME_META[t].icon}
                        <div>
                          <div className="text-sm font-semibold">
                            {THEME_META[t].label}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {THEME_META[t].desc}
                          </div>
                        </div>
                        {theme === t && (
                          <Check className="w-3.5 h-3.5 ml-auto" />
                        )}
                      </button>
                    ))}
                  </div>
                </section>

                {/* Brightness dimmer */}
                <section>
                  <h3 className="text-xs font-semibold tracking-widest text-muted-foreground uppercase mb-3">
                    Brightness{" "}
                    <span className="normal-case font-normal">
                      {brightness}%
                    </span>
                  </h3>
                  <div className="flex gap-1.5">
                    {BRIGHTNESS_STEPS.map((step) => (
                      <button
                        type="button"
                        key={step}
                        onClick={() => handleBrightness(step)}
                        data-ocid="theme.toggle"
                        className={`flex-1 h-8 rounded-md text-[10px] font-semibold transition-all border ${
                          brightness === step
                            ? "bg-primary text-primary-foreground border-primary shadow-gold-sm"
                            : "bg-muted border-border text-muted-foreground hover:border-primary/40"
                        }`}
                      >
                        {step}
                      </button>
                    ))}
                  </div>
                </section>

                {/* Connected apps in menu */}
                <section>
                  <h3 className="text-xs font-semibold tracking-widest text-muted-foreground uppercase mb-3">
                    Connected Apps
                  </h3>
                  <div className="flex flex-col gap-2">
                    {CONNECTED_APPS.map((app, i) => (
                      <a
                        key={app.name}
                        href={app.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-ocid={`apps.item.${i + 1}`}
                        className="flex items-center justify-between p-3 rounded-xl border border-border hover:border-primary/40 hover:bg-muted/30 transition-all group"
                      >
                        <div>
                          <div className="text-sm font-medium text-foreground group-hover:text-warm-gold transition-colors">
                            {app.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {app.desc}
                          </div>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                      </a>
                    ))}
                  </div>
                </section>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 bg-background/90 backdrop-blur-md border-b border-border/60">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="font-display text-xl leading-tight gradient-text-gold">
              Actuality Studio
            </span>
            <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-body">
              Membership Hub
            </span>
          </div>

          <nav className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              data-ocid="nav.open_modal_button"
              className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              aria-label="Open settings"
            >
              <Palette className="w-5 h-5" />
            </button>

            {isInitializing ? (
              <Skeleton className="h-9 w-24 rounded-lg" />
            ) : isLoggedIn ? (
              <Button
                variant="outline"
                size="sm"
                onClick={clear}
                data-ocid="nav.secondary_button"
                className="gap-1.5 border-border hover:border-destructive hover:text-destructive transition-colors"
              >
                Log Out
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={login}
                disabled={isLoggingIn}
                data-ocid="nav.primary_button"
                className="gap-1.5 gradient-gold border-0 text-background font-semibold hover:opacity-90"
              >
                {isLoggingIn ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : null}
                {isLoggingIn ? "Connecting…" : "Log In"}
              </Button>
            )}
          </nav>
        </div>
      </header>

      {/* ── Main content ──────────────────────────────────────────────────── */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-10 flex flex-col gap-12">
        {/* Hero (shown when NOT logged in) */}
        <AnimatePresence>
          {!isLoggedIn && !isInitializing && (
            <motion.section
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.5 }}
              className="text-center py-12 flex flex-col items-center gap-6"
              data-ocid="hero.section"
            >
              <div className="inline-flex px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs tracking-widest uppercase font-semibold">
                Internet Computer · ICP
              </div>
              <h1 className="font-display text-4xl sm:text-5xl text-foreground leading-tight max-w-2xl">
                Your Actuality Studio Account
              </h1>
              <p className="text-muted-foreground text-lg max-w-xl leading-relaxed">
                A single identity that connects all Actuality Studio apps. Log
                in once, carry your membership across every connected
                experience.
              </p>
              <Button
                size="lg"
                onClick={login}
                disabled={isLoggingIn}
                data-ocid="hero.primary_button"
                className="gap-2 gradient-gold border-0 text-background font-semibold text-base px-8 py-5 rounded-xl hover:opacity-90 shadow-gold-md"
              >
                {isLoggingIn ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : null}
                {isLoggingIn
                  ? "Connecting to Internet Identity…"
                  : "Log In with Internet Identity"}
              </Button>
              <p className="text-xs text-muted-foreground">
                Secured by the Internet Computer blockchain
              </p>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Membership Dashboard (shown when logged in) */}
        <AnimatePresence>
          {isLoggedIn && (
            <motion.section
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              data-ocid="membership.section"
            >
              <h2 className="font-display text-2xl text-foreground mb-4">
                Your Membership
              </h2>
              <Card className="border-border/60 shadow-card">
                <CardContent className="p-6 flex flex-col gap-5">
                  {/* Principal */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-between">
                    <div>
                      <div className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
                        Principal ID
                      </div>
                      <PrincipalCopy principal={principalStr} />
                    </div>

                    {/* Tier badge */}
                    <div className="flex flex-col items-start sm:items-end gap-1">
                      <div className="text-xs text-muted-foreground uppercase tracking-widest">
                        Membership Tier
                      </div>
                      {tierLoading ? (
                        <Skeleton
                          className="h-7 w-24 rounded-full"
                          data-ocid="membership.loading_state"
                        />
                      ) : tier !== undefined ? (
                        <TierBadge tier={tier} />
                      ) : null}
                    </div>
                  </div>

                  {/* Trial expiry */}
                  {tier === MembershipTier.trial && trialExpiry && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="px-4 py-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm"
                    >
                      Trial expires:{" "}
                      <strong>{formatTrialExpiry(trialExpiry)}</strong>
                    </motion.div>
                  )}

                  {/* Mint membership button */}
                  {!tierLoading &&
                    (tier === MembershipTier.free || tier === undefined) && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <Button
                          onClick={handleMint}
                          disabled={mintMembership.isPending}
                          data-ocid="membership.primary_button"
                          className="gap-2 gradient-gold border-0 text-background font-semibold hover:opacity-90 shadow-gold-sm"
                        >
                          {mintMembership.isPending ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : null}
                          {mintMembership.isPending
                            ? "Minting…"
                            : "Mint Membership NFT"}
                        </Button>
                      </motion.div>
                    )}

                  {/* Linked apps */}
                  <div>
                    <div className="text-xs text-muted-foreground uppercase tracking-widest mb-2">
                      Linked Apps
                    </div>
                    {appsLoading ? (
                      <div
                        className="flex gap-2"
                        data-ocid="membership.loading_state"
                      >
                        <Skeleton className="h-6 w-24 rounded-full" />
                        <Skeleton className="h-6 w-20 rounded-full" />
                      </div>
                    ) : linkedApps && linkedApps.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {linkedApps.map((appId) => (
                          <Badge
                            key={appId}
                            variant="secondary"
                            className="font-body text-xs"
                          >
                            {appId}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <span
                        className="text-sm text-muted-foreground italic"
                        data-ocid="membership.empty_state"
                      >
                        No apps linked yet — open a connected app to register
                        automatically.
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Connected Apps grid */}
        <section data-ocid="apps.section">
          <h2 className="font-display text-2xl text-foreground mb-1">
            Connected Apps
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            All Actuality Studio apps, unified by your membership identity.
          </p>
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            data-ocid="apps.list"
          >
            {CONNECTED_APPS.map((app, i) => (
              <AppCard key={app.url} app={app} index={i} />
            ))}
          </div>
        </section>

        {/* Developer Reference accordion */}
        <section>
          <button
            type="button"
            onClick={() => setDevOpen((v) => !v)}
            data-ocid="dev.open_modal_button"
            className="w-full flex items-center justify-between px-5 py-4 rounded-xl border border-border hover:border-primary/30 hover:bg-muted/20 transition-all text-left"
          >
            <span className="font-display text-lg text-foreground">
              For Connected App Developers
            </span>
            {devOpen ? (
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
          <AnimatePresence>
            {devOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
                data-ocid="dev.panel"
              >
                <div className="mt-2 rounded-xl border border-border bg-muted/20 p-5">
                  <p className="text-sm text-muted-foreground mb-4">
                    Use this template prompt when creating a new app that
                    integrates with Actuality Studio as its identity and
                    membership provider.
                  </p>
                  <pre className="font-mono text-xs text-foreground/80 bg-background/50 rounded-lg p-4 border border-border/60 whitespace-pre-wrap overflow-x-auto leading-relaxed">
                    {DEV_TEMPLATE}
                  </pre>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer className="border-t border-border/40 py-6 px-4">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>
            © {new Date().getFullYear()} Actuality Studio · Rooted in Steiner's
            Vision
          </span>
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            Built with ♥ using caffeine.ai
          </a>
        </div>
      </footer>
    </div>
  );
}
