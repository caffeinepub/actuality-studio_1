import type React from "react";
import { useEffect, useState } from "react";
import { useTheme } from "../hooks/useTheme";

const BLOBS: Record<
  string,
  { id: string; gradient: string; style: React.CSSProperties }[]
> = {
  dawn: [
    {
      id: "dawn-0",
      gradient:
        "radial-gradient(ellipse 60% 50% at 20% 30%, rgba(232,200,110,0.5) 0%, transparent 70%)",
      style: {
        top: "-5%",
        left: "-10%",
        width: "70%",
        height: "80%",
        animationDelay: "0s",
        animationDuration: "10s",
      },
    },
    {
      id: "dawn-1",
      gradient:
        "radial-gradient(ellipse 50% 60% at 80% 20%, rgba(200,168,200,0.45) 0%, transparent 65%)",
      style: {
        top: "-10%",
        right: "-5%",
        width: "60%",
        height: "70%",
        animationDelay: "3s",
        animationDuration: "13s",
      },
    },
    {
      id: "dawn-2",
      gradient:
        "radial-gradient(ellipse 55% 45% at 50% 80%, rgba(138,172,207,0.4) 0%, transparent 60%)",
      style: {
        bottom: "-10%",
        left: "20%",
        width: "65%",
        height: "60%",
        animationDelay: "6s",
        animationDuration: "11s",
      },
    },
    {
      id: "dawn-3",
      gradient:
        "radial-gradient(ellipse 40% 50% at 70% 60%, rgba(232,168,152,0.38) 0%, transparent 65%)",
      style: {
        bottom: "0%",
        right: "10%",
        width: "50%",
        height: "60%",
        animationDelay: "1.5s",
        animationDuration: "15s",
      },
    },
  ],
  twilight: [
    {
      id: "twilight-0",
      gradient:
        "radial-gradient(ellipse 60% 55% at 25% 35%, rgba(152,144,200,0.45) 0%, transparent 70%)",
      style: {
        top: "-5%",
        left: "-10%",
        width: "70%",
        height: "80%",
        animationDelay: "0s",
        animationDuration: "11s",
      },
    },
    {
      id: "twilight-1",
      gradient:
        "radial-gradient(ellipse 50% 55% at 75% 25%, rgba(212,160,106,0.38) 0%, transparent 65%)",
      style: {
        top: "-10%",
        right: "-5%",
        width: "60%",
        height: "70%",
        animationDelay: "4s",
        animationDuration: "14s",
      },
    },
    {
      id: "twilight-2",
      gradient:
        "radial-gradient(ellipse 55% 45% at 50% 75%, rgba(112,144,184,0.35) 0%, transparent 60%)",
      style: {
        bottom: "-10%",
        left: "20%",
        width: "65%",
        height: "60%",
        animationDelay: "7s",
        animationDuration: "12s",
      },
    },
    {
      id: "twilight-3",
      gradient:
        "radial-gradient(ellipse 40% 50% at 65% 55%, rgba(200,136,120,0.3) 0%, transparent 65%)",
      style: {
        bottom: "5%",
        right: "5%",
        width: "50%",
        height: "55%",
        animationDelay: "2s",
        animationDuration: "16s",
      },
    },
  ],
  forest: [
    {
      id: "forest-0",
      gradient:
        "radial-gradient(ellipse 60% 50% at 20% 30%, rgba(90,136,104,0.45) 0%, transparent 70%)",
      style: {
        top: "-5%",
        left: "-10%",
        width: "70%",
        height: "80%",
        animationDelay: "0s",
        animationDuration: "12s",
      },
    },
    {
      id: "forest-1",
      gradient:
        "radial-gradient(ellipse 50% 55% at 78% 22%, rgba(144,184,152,0.4) 0%, transparent 65%)",
      style: {
        top: "-10%",
        right: "-5%",
        width: "60%",
        height: "70%",
        animationDelay: "3s",
        animationDuration: "15s",
      },
    },
    {
      id: "forest-2",
      gradient:
        "radial-gradient(ellipse 55% 45% at 48% 78%, rgba(180,152,120,0.35) 0%, transparent 60%)",
      style: {
        bottom: "-10%",
        left: "20%",
        width: "65%",
        height: "60%",
        animationDelay: "6s",
        animationDuration: "10s",
      },
    },
    {
      id: "forest-3",
      gradient:
        "radial-gradient(ellipse 40% 50% at 68% 58%, rgba(216,152,128,0.32) 0%, transparent 65%)",
      style: {
        bottom: "0%",
        right: "10%",
        width: "50%",
        height: "60%",
        animationDelay: "1.5s",
        animationDuration: "14s",
      },
    },
  ],
};

const GRADIENTS: Record<string, string> = {
  dawn: "linear-gradient(160deg, #fdf8f0 0%, #f5e6c8 40%, #f2d4c2 70%, #e8d0d8 100%)",
  twilight:
    "linear-gradient(160deg, #2a2845 0%, #3d3060 40%, #4a3858 70%, #3a3050 100%)",
  forest:
    "linear-gradient(160deg, #e8f0e0 0%, #d0e8c0 40%, #e8d8c4 70%, #f0e8d8 100%)",
};

function readInitialBrightness(): number {
  if (typeof window === "undefined") return 100;
  const stored = localStorage.getItem("actuality-brightness");
  if (!stored) return 100;
  const parsed = Number.parseFloat(stored);
  // Handle legacy decimal values (e.g. 0.8 → 80)
  const asPercent =
    parsed <= 1.5 ? Math.round(parsed * 100) : Math.round(parsed);
  return Math.min(100, Math.max(40, asPercent));
}

export default function ThemeBackground() {
  const { themeId } = useTheme();
  const [brightness, setBrightness] = useState<number>(readInitialBrightness);

  useEffect(() => {
    const handler = (e: Event) => {
      const val = (e as CustomEvent<number>).detail;
      if (typeof val === "number") setBrightness(val);
    };
    window.addEventListener("actuality-brightness-change", handler);
    return () =>
      window.removeEventListener("actuality-brightness-change", handler);
  }, []);

  const blobs = BLOBS[themeId];
  const gradient = GRADIENTS[themeId];

  if (!blobs || !gradient) return null;

  const brightnessFilter =
    brightness < 100 ? `brightness(${brightness / 100})` : undefined;

  return (
    <div
      className="fixed inset-0 -z-10 pointer-events-none overflow-hidden"
      style={{
        background: gradient,
        ...(brightnessFilter ? { filter: brightnessFilter } : {}),
      }}
      aria-hidden="true"
    >
      {blobs.map((blob) => (
        <div
          key={blob.id}
          className="absolute"
          style={{
            ...blob.style,
            background: blob.gradient,
            animation: `blob-drift ${blob.style.animationDuration} ease-in-out infinite alternate`,
            animationDelay: blob.style.animationDelay as string,
          }}
        />
      ))}
    </div>
  );
}
