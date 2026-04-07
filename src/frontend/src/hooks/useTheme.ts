import { useEffect, useState } from "react";

export type ThemeId = "dawn" | "twilight" | "forest";

export interface ThemeConfig {
  id: ThemeId;
  label: string;
  sublabel: string;
  tagline: string;
  htmlClass: string;
  swatches: string[];
  isDark: boolean;
}

export const THEMES: Record<ThemeId, ThemeConfig> = {
  dawn: {
    id: "dawn",
    label: "Dawn",
    sublabel: "Main Site",
    tagline: "Where light first touches the world",
    htmlClass: "theme-dawn",
    swatches: ["#e8c86e", "#e8a898", "#8aaccf", "#fdf8f0"],
    isDark: false,
  },
  twilight: {
    id: "twilight",
    label: "Twilight",
    sublabel: "App Interface",
    tagline: "Depth where spirit meets function",
    htmlClass: "theme-twilight",
    swatches: ["#e8b898", "#9890c8", "#7090b8", "#2a2845"],
    isDark: true,
  },
  forest: {
    id: "forest",
    label: "Forest-Soul",
    sublabel: "Affiliate Sites",
    tagline: "Life breathing between earth and spirit",
    htmlClass: "theme-forest",
    swatches: ["#d89880", "#78a890", "#5a8868", "#e8f0e0"],
    isDark: false,
  },
};

const ALL_THEME_CLASSES = Object.values(THEMES)
  .map((t) => t.htmlClass)
  .filter(Boolean);

export function useTheme() {
  const [themeId, setThemeId] = useState<ThemeId>(() => {
    if (typeof window === "undefined") return "twilight";
    const stored = localStorage.getItem("actuality-theme") as ThemeId;
    return stored && THEMES[stored] ? stored : "twilight";
  });

  useEffect(() => {
    const html = document.documentElement;
    html.classList.remove(...ALL_THEME_CLASSES);
    const cfg = THEMES[themeId];
    if (cfg.htmlClass) html.classList.add(cfg.htmlClass);
    if (cfg.isDark) {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
    localStorage.setItem("actuality-theme", themeId);
  }, [themeId]);

  const hasChosenTheme =
    typeof window !== "undefined" && !!localStorage.getItem("actuality-theme");

  return { themeId, setThemeId, theme: THEMES[themeId], hasChosenTheme };
}
