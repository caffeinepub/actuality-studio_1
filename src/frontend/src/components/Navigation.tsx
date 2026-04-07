import { Link, useLocation } from "@tanstack/react-router";
import {
  Check,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Globe,
  Menu,
  Palette,
  Sun,
  Video,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { THEMES, type ThemeId, useTheme } from "../hooks/useTheme";
import LoginButton from "./LoginButton";
import MeetPanel from "./MeetPanel";
import PrincipalDisplay from "./PrincipalDisplay";

const THEME_ORDER: ThemeId[] = ["dawn", "twilight", "forest"];

const THEME_DESCRIPTIONS: Record<
  ThemeId,
  { gradient: string; description: string }
> = {
  dawn: {
    gradient: "linear-gradient(135deg, #e8c86e 0%, #e8a898 50%, #8aaccf 100%)",
    description: "Pale gold, rose-peach & soft blue-grey on warm near-white",
  },
  twilight: {
    gradient: "linear-gradient(135deg, #2a2845 0%, #7090b8 50%, #e8b898 100%)",
    description: "Deep blue-violet with warm amber & peach highlights",
  },
  forest: {
    gradient: "linear-gradient(135deg, #5a8868 0%, #78a890 50%, #d89880 100%)",
    description: "Sage, living green & warm peach on earthy tones",
  },
};

const CONNECTED_APPS = [
  {
    id: "verbal-declaration",
    label: "Verbal Declaration",
    description: "One-page verbal declaration & witnesses",
    url: "https://one-page-verbal-declaration-and-witnesses-sdi.caffeine.xyz/",
  },
  {
    id: "story-of-home",
    label: "Story of Home",
    description: "Production handbook for your home story",
    url: "https://creative-resource-app-story-of-home-u5l.caffeine.xyz/",
  },
  {
    id: "commerce-hub",
    label: "Commerce Hub",
    description: "Creative commerce hub — Shopify first version",
    url: "https://creative-commerce-hub---shopify-first-version-vzj.caffeine.xyz/",
  },
  {
    id: "design-platform",
    label: "Design Platform",
    description: "Collaborative architecture & interior design",
    url: "https://actuality-studio-appapp-jcx.caffeine.xyz/",
  },
  {
    id: "theme-system",
    label: "Theme System",
    description: "Actuality Studio Steiner theme showcase & reference",
    url: "https://actuality-studio-theme-w3r.caffeine.xyz/",
  },
  {
    id: "invite",
    label: "Studio Invite",
    description: "Actuality Studio invite & RSVP portal",
    url: "https://actuality-studio-invite-8qr.caffeine.xyz/",
  },
  {
    id: "doc-scan",
    label: "Doc Scan",
    description: "Document scanning & management app",
    url: "https://doc-scan-app-aoo.caffeine.xyz/",
  },
];

// Brightness: 7 set-points from 40% to 100% in 10% increments
const BRIGHTNESS_STEPS = [40, 50, 60, 70, 80, 90, 100];
const STORAGE_KEY = "actuality-brightness";
const DEFAULT_BRIGHTNESS = 100;

function clampBrightness(val: number): number {
  const closest = BRIGHTNESS_STEPS.reduce((prev, curr) =>
    Math.abs(curr - val) < Math.abs(prev - val) ? curr : prev,
  );
  return closest;
}

export default function Navigation() {
  const { identity, login } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const [panelOpen, setPanelOpen] = useState(false);
  const [connectedPanelOpen, setConnectedPanelOpen] = useState(false);
  const [meetOpen, setMeetOpen] = useState(false);
  const [devAccordionOpen, setDevAccordionOpen] = useState(false);
  const location = useLocation();
  const { themeId, setThemeId, theme } = useTheme();
  const overlayRef = useRef<HTMLDivElement>(null);
  const connectedOverlayRef = useRef<HTMLDivElement>(null);
  const [hoveredApp, setHoveredApp] = useState<string | null>(null);

  const [brightness, setBrightnessState] = useState<number>(() => {
    if (typeof window === "undefined") return DEFAULT_BRIGHTNESS;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = Number.parseFloat(stored);
      // Handle legacy decimal values (e.g. 0.8 → 80)
      const asPercent = parsed <= 1.5 ? Math.round(parsed * 100) : parsed;
      return clampBrightness(asPercent);
    }
    return DEFAULT_BRIGHTNESS;
  });

  const setBrightness = (val: number) => {
    setBrightnessState(val);
    localStorage.setItem(STORAGE_KEY, String(val));
    // Dispatch event for ThemeBackground to pick up — brightness affects background only
    window.dispatchEvent(
      new CustomEvent("actuality-brightness-change", { detail: val }),
    );
  };

  // On mount: clear any old root filter that previous versions may have set
  useEffect(() => {
    const root = document.getElementById("root");
    if (root) root.style.filter = "";
  }, []);

  const navLinks = [
    { label: "Home", to: "/" },
    ...(isAuthenticated ? [{ label: "Dashboard", to: "/dashboard" }] : []),
  ];

  // Close panels on route change
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally track pathname
  useEffect(() => {
    setPanelOpen(false);
    setConnectedPanelOpen(false);
  }, [location.pathname]);

  // Close theme panel on Escape key
  useEffect(() => {
    if (!panelOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPanelOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [panelOpen]);

  // Close connected apps panel on Escape key
  useEffect(() => {
    if (!connectedPanelOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setConnectedPanelOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [connectedPanelOpen]);

  const activeGradient = THEME_DESCRIPTIONS[themeId].gradient;

  return (
    <>
      {/* Fixed header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/90 backdrop-blur-md">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-32">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-4 group self-stretch"
              data-ocid="nav.link"
            >
              <div className="aspect-square h-full rounded-full overflow-hidden flex-shrink-0 self-stretch">
                <img
                  src="/assets/generated/logo-mark.dim_128x128.png"
                  alt="Actuality Studio"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="font-display text-4xl font-semibold tracking-wide text-foreground group-hover:text-terracotta transition-colors">
                  Actuality Studio
                </span>
                <span className="font-body text-sm italic text-muted-foreground group-hover:text-terracotta/70 transition-colors">
                  Rooted in Steiner's Vision
                </span>
              </div>
            </Link>

            {/* Right side */}
            <div className="flex items-center gap-3">
              {/* Desktop nav links */}
              <nav className="hidden md:flex items-center gap-5 mr-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    data-ocid="nav.link"
                    className={`font-body text-sm font-medium transition-colors hover:text-terracotta ${
                      location.pathname === link.to
                        ? "text-terracotta"
                        : "text-muted-foreground"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              {/* Meet button (desktop) */}
              <button
                type="button"
                data-ocid="meet.open_modal_button"
                onClick={() => setMeetOpen(true)}
                className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-card hover:border-terracotta/40 transition-colors text-muted-foreground hover:text-terracotta text-sm font-body"
                aria-label="Open Meet panel"
              >
                <Video className="w-4 h-4" />
                <span className="hidden sm:inline">Meet</span>
              </button>

              {/* Themes button (desktop) — opens side panel */}
              <button
                type="button"
                data-ocid="nav.toggle"
                onClick={() => setPanelOpen(true)}
                className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-card hover:border-terracotta/40 transition-colors text-muted-foreground hover:text-terracotta text-sm font-body"
                aria-label="Open theme picker"
              >
                <Palette className="w-4 h-4" />
                <span className="hidden sm:inline">{theme.label}</span>
              </button>

              {/* Connected Apps button (desktop) */}
              <button
                type="button"
                data-ocid="connected_apps.open_modal_button"
                onClick={() => setConnectedPanelOpen(true)}
                className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-card hover:border-terracotta/40 transition-colors text-muted-foreground hover:text-terracotta text-sm font-body"
                aria-label="Open Connected Apps panel"
              >
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline">Connected Apps</span>
              </button>

              {/* Desktop: principal + login */}
              <div className="hidden md:flex items-center gap-2">
                <PrincipalDisplay />
                <LoginButton size="sm" />
              </div>

              {/* Mobile: Meet icon button */}
              <button
                type="button"
                className="md:hidden p-3 text-muted-foreground hover:text-terracotta transition-colors"
                onClick={() => setMeetOpen(true)}
                aria-label="Open Meet"
                data-ocid="meet.open_modal_button"
              >
                <Video className="w-6 h-6" />
              </button>

              {/* Mobile: Connected Apps icon button */}
              <button
                type="button"
                className="md:hidden p-3 text-muted-foreground hover:text-terracotta transition-colors"
                onClick={() => setConnectedPanelOpen(true)}
                aria-label="Open Connected Apps"
                data-ocid="connected_apps.open_modal_button"
              >
                <Globe className="w-6 h-6" />
              </button>

              {/* Mobile hamburger */}
              <button
                type="button"
                className="md:hidden p-3 text-muted-foreground hover:text-terracotta transition-colors"
                onClick={() => setPanelOpen(true)}
                aria-label="Open menu"
                data-ocid="nav.toggle"
              >
                <Menu className="w-10 h-10" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Dark overlay — theme panel */}
      {panelOpen && (
        <div
          ref={overlayRef}
          role="button"
          tabIndex={-1}
          className="fixed inset-0 z-[99] bg-black/50"
          style={{ backdropFilter: "blur(2px)" }}
          onClick={() => setPanelOpen(false)}
          onKeyDown={(e) => e.key === "Escape" && setPanelOpen(false)}
          aria-label="Close menu"
        />
      )}

      {/* Dark overlay — connected apps panel */}
      {connectedPanelOpen && (
        <div
          ref={connectedOverlayRef}
          role="button"
          tabIndex={-1}
          className="fixed inset-0 z-[99] bg-black/50"
          style={{ backdropFilter: "blur(2px)" }}
          onClick={() => setConnectedPanelOpen(false)}
          onKeyDown={(e) => e.key === "Escape" && setConnectedPanelOpen(false)}
          aria-label="Close Connected Apps panel"
        />
      )}

      {/* Slide-in theme panel (right side) */}
      <aside
        className="fixed top-0 right-0 h-full z-[100] flex flex-col bg-background border-l border-border shadow-2xl transition-transform duration-300 ease-in-out"
        style={{
          width: "320px",
          transform: panelOpen ? "translateX(0)" : "translateX(100%)",
        }}
        aria-label="Theme panel"
      >
        {/* Panel header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <span className="font-display text-lg font-semibold text-foreground">
            Theme
          </span>
          <button
            type="button"
            data-ocid="nav.close_button"
            onClick={() => setPanelOpen(false)}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
          {/* Nav links */}
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                data-ocid="nav.link"
                className={`font-body text-sm font-medium px-3 py-2.5 rounded-lg transition-colors ${
                  location.pathname === link.to
                    ? "bg-primary/10 text-terracotta"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Brightness Dimmer section */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sun className="w-4 h-4 text-muted-foreground" />
              <h3 className="font-body text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                Brightness
              </h3>
              <span className="ml-auto font-body text-xs tabular-nums text-muted-foreground">
                {brightness}%
              </span>
            </div>
            {/* Step buttons */}
            <div className="flex items-center justify-between gap-1">
              {BRIGHTNESS_STEPS.map((step) => (
                <button
                  key={step}
                  type="button"
                  data-ocid="dimmer.step"
                  onClick={() => setBrightness(step)}
                  aria-label={`Set brightness to ${step}%`}
                  className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-lg border transition-all text-xs font-body ${
                    brightness === step
                      ? "border-primary bg-primary/10 text-terracotta font-semibold"
                      : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  }`}
                >
                  <span
                    className="block w-3 h-3 rounded-full border border-current"
                    style={{ opacity: step / 100 }}
                  />
                  <span>{step}</span>
                </button>
              ))}
            </div>
            {/* Continuous slider */}
            <input
              type="range"
              data-ocid="dimmer.input"
              min="40"
              max="100"
              step="10"
              value={brightness}
              onChange={(e) =>
                setBrightness(Number.parseInt(e.target.value, 10))
              }
              aria-label="Screen brightness"
              className="w-full mt-3"
              style={{ accentColor: "oklch(0.58 0.12 38)" }}
            />
            <div className="flex justify-between mt-1">
              <span className="font-body text-[10px] text-muted-foreground">
                Dim
              </span>
              <span className="font-body text-[10px] text-muted-foreground">
                Bright
              </span>
            </div>
          </div>

          {/* Visual Theme section */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Palette className="w-4 h-4 text-muted-foreground" />
              <h3 className="font-body text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                Visual Theme
              </h3>
            </div>
            <div className="flex flex-col gap-3">
              {THEME_ORDER.map((id) => {
                const cfg = THEMES[id];
                const meta = THEME_DESCRIPTIONS[id];
                const isActive = themeId === id;
                return (
                  <button
                    key={id}
                    type="button"
                    data-ocid="nav.button"
                    onClick={() => setThemeId(id)}
                    className={`relative w-full rounded-xl border-2 overflow-hidden text-left transition-all hover:scale-[1.01] ${
                      isActive
                        ? "border-primary shadow-md"
                        : "border-border hover:border-primary/40"
                    }`}
                  >
                    <div
                      className="h-10 w-full"
                      style={{ background: meta.gradient }}
                    />
                    <div className="px-3 py-2.5 bg-card">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-display text-base font-semibold text-card-foreground leading-tight">
                            {cfg.label}
                          </p>
                          <span className="inline-block text-[10px] font-body uppercase tracking-widest text-muted-foreground bg-muted px-1.5 py-0.5 rounded mt-0.5">
                            {cfg.sublabel}
                          </span>
                          <p className="font-body text-[11px] text-muted-foreground mt-1 leading-relaxed">
                            {meta.description}
                          </p>
                        </div>
                        {isActive && (
                          <div className="mt-0.5 w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                            <Check className="w-3 h-3 text-primary-foreground" />
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Panel footer — auth controls */}
        <div className="px-5 py-4 border-t border-border flex flex-col gap-3">
          <PrincipalDisplay />
          <LoginButton size="sm" />
        </div>
      </aside>

      {/* Slide-in Connected Apps panel (left side) */}
      <aside
        className="fixed top-0 left-0 h-full z-[100] flex flex-col bg-background border-r border-border shadow-2xl transition-transform duration-300 ease-in-out"
        style={{
          width: "320px",
          transform: connectedPanelOpen ? "translateX(0)" : "translateX(-100%)",
        }}
        aria-label="Connected Apps panel"
      >
        {/* Panel header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <span className="font-display text-lg font-semibold text-foreground">
            Connected Apps
          </span>
          <button
            type="button"
            data-ocid="connected_apps.close_button"
            onClick={() => setConnectedPanelOpen(false)}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Close Connected Apps panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {/* App cards */}
          <div className="flex flex-col gap-3">
            {CONNECTED_APPS.map((app) => {
              const appUrl = new URL(app.url);
              appUrl.searchParams.set("theme", themeId);
              appUrl.searchParams.set("brightness", String(brightness));
              return (
                <a
                  key={app.id}
                  href={appUrl.toString()}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-ocid="nav.link"
                  onMouseEnter={() => setHoveredApp(app.id)}
                  onMouseLeave={() => setHoveredApp(null)}
                  className="relative w-full rounded-xl border-2 border-border overflow-hidden text-left transition-all hover:scale-[1.01] hover:border-primary/40 hover:shadow-md no-underline"
                >
                  {/* Theme-matched color band */}
                  <div
                    className="h-8 w-full"
                    style={{ background: activeGradient }}
                  />
                  {/* Card body */}
                  <div className="px-3 py-2.5 bg-card">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-display text-base font-bold text-card-foreground leading-tight">
                          {app.label}
                        </p>
                        <p className="font-body text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                          {app.description}
                        </p>
                      </div>
                      <ExternalLink
                        className={`w-4 h-4 flex-shrink-0 mt-0.5 transition-opacity duration-200 text-muted-foreground ${
                          hoveredApp === app.id ? "opacity-100" : "opacity-0"
                        }`}
                      />
                    </div>
                  </div>
                </a>
              );
            })}
          </div>

          {/* For Connected App Developers accordion */}
          <div className="border border-border rounded-xl overflow-hidden">
            <button
              type="button"
              data-ocid="connected_apps.toggle"
              onClick={() => setDevAccordionOpen((prev) => !prev)}
              className="w-full flex items-center justify-between px-4 py-3 bg-card hover:bg-muted transition-colors text-left"
              aria-expanded={devAccordionOpen}
            >
              <span className="font-body text-sm font-semibold text-foreground">
                For Connected App Developers
              </span>
              {devAccordionOpen ? (
                <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              ) : (
                <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              )}
            </button>
            {devAccordionOpen && (
              <div className="px-4 py-3 bg-muted/50 border-t border-border">
                <p className="font-body text-xs text-muted-foreground mb-2 leading-relaxed">
                  Use this template when creating a new app that integrates with
                  Actuality Studio:
                </p>
                <pre className="font-mono text-[11px] text-foreground bg-background border border-border rounded-lg p-3 whitespace-pre-wrap leading-relaxed overflow-x-auto">
                  {`Create a new app that assumes Actuality Studio is the identity provider.
The app should:

• Not implement its own signup or password login.
• Use Internet Identity via the shared Actuality Studio flow: if the user is not authenticated, redirect to the Actuality Studio login URL, then return here.
• On startup, call the central membership canister with the current caller principal and a constant appId to register or retrieve a link to the user's central account.
• Query the membership canister for the user's membership tier and feature flags for this app, and conditionally enable features based on those flags.

Membership Hub API methods:
getUserByPrincipal
getMembershipForUser
getMembershipTier
linkAppPrincipal(appId, principal)
getLinkedApps`}
                </pre>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Meet Panel */}
      <MeetPanel
        open={meetOpen}
        onClose={() => setMeetOpen(false)}
        onRequestLogin={() => {
          login();
        }}
      />
    </>
  );
}
