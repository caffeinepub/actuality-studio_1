import { Moon, Sun } from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";

const STORAGE_KEY = "actuality-brightness";
const DEFAULT_BRIGHTNESS = 1.0;

export default function DimmerControl() {
  const [brightness, setBrightness] = useState<number>(() => {
    if (typeof window === "undefined") return DEFAULT_BRIGHTNESS;
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? Number.parseFloat(stored) : DEFAULT_BRIGHTNESS;
  });
  const [expanded, setExpanded] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = document.getElementById("root");
    if (root)
      root.style.filter = brightness === 1.0 ? "" : `brightness(${brightness})`;
    localStorage.setItem(STORAGE_KEY, String(brightness));
  }, [brightness]);

  useEffect(() => {
    if (!expanded) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node))
        setExpanded(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [expanded]);

  const brightnessPercent = Math.round(brightness * 100);
  const isDark = brightness < 0.7;

  return (
    <div
      ref={panelRef}
      className="fixed right-4 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-2"
      data-ocid="dimmer.panel"
    >
      {expanded && (
        <div className="bg-card/95 backdrop-blur border border-border rounded-2xl shadow-card-hover p-3 flex flex-col items-center gap-3 animate-fade-in">
          <Moon
            className={`w-4 h-4 transition-colors ${isDark ? "text-terracotta" : "text-muted-foreground"}`}
          />
          <div className="relative h-32 flex items-center justify-center">
            <input
              type="range"
              data-ocid="dimmer.input"
              min="0.1"
              max="1.5"
              step="0.01"
              value={brightness}
              onChange={(e) => setBrightness(Number.parseFloat(e.target.value))}
              aria-label="Screen brightness"
              style={{
                writingMode:
                  "vertical-lr" as React.CSSProperties["writingMode"],
                direction: "rtl" as React.CSSProperties["direction"],
                width: "32px",
                height: "120px",
                cursor: "pointer",
                accentColor: "oklch(0.58 0.12 38)",
              }}
            />
          </div>
          <Sun
            className={`w-4 h-4 transition-colors ${brightness > 1.2 ? "text-warm-gold" : "text-muted-foreground"}`}
          />
          <span className="font-body text-xs text-muted-foreground tabular-nums">
            {brightnessPercent}%
          </span>
        </div>
      )}
      <button
        type="button"
        data-ocid="dimmer.toggle"
        onClick={() => setExpanded((o) => !o)}
        aria-label={
          expanded ? "Close brightness control" : "Open brightness control"
        }
        title="Brightness / Dimmer"
        className="w-10 h-10 rounded-full bg-card/90 backdrop-blur border border-border shadow-card hover:shadow-card-hover transition-all flex items-center justify-center hover:border-terracotta/40 hover:text-terracotta text-muted-foreground"
      >
        {isDark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
      </button>
    </div>
  );
}
