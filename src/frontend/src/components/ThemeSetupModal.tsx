import { Check } from "lucide-react";
import { useState } from "react";
import { THEMES, type ThemeId, useTheme } from "../hooks/useTheme";

interface ThemeSetupModalProps {
  open: boolean;
  onClose: () => void;
}

const THEME_ORDER: ThemeId[] = ["dawn", "twilight", "forest"];

export function ThemeChooser({ open, onClose }: ThemeSetupModalProps) {
  const { themeId, setThemeId } = useTheme();
  const [selected, setSelected] = useState<ThemeId>(
    THEME_ORDER.includes(themeId) ? themeId : "twilight",
  );

  if (!open) return null;

  const handleConfirm = () => {
    setThemeId(selected);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      data-ocid="theme.modal"
      style={{
        backgroundColor: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        className="relative w-full max-w-2xl rounded-2xl border border-border bg-background shadow-2xl overflow-hidden"
        style={{ maxHeight: "90vh", overflowY: "auto" }}
      >
        {/* Header */}
        <div className="px-8 pt-8 pb-4 text-center border-b border-border">
          <h2 className="font-display text-3xl font-semibold text-foreground mb-2">
            Choose Your Theme
          </h2>
          <p className="font-body text-sm text-muted-foreground">
            Select the visual language rooted in Steiner's veil-painting
            philosophy
          </p>
        </div>

        {/* Theme grid */}
        <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {THEME_ORDER.map((id) => {
            const cfg = THEMES[id];
            const isSelected = selected === id;
            return (
              <button
                key={id}
                type="button"
                data-ocid="theme.button"
                onClick={() => setSelected(id)}
                className={`relative flex flex-col rounded-xl border-2 overflow-hidden text-left transition-all hover:scale-[1.02] ${
                  isSelected
                    ? "border-primary shadow-lg"
                    : "border-border hover:border-primary/40"
                }`}
              >
                {/* Selected check */}
                {isSelected && (
                  <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center z-10">
                    <Check className="w-3.5 h-3.5 text-primary-foreground" />
                  </div>
                )}

                {/* Swatch strip */}
                <div className="flex h-12">
                  {cfg.swatches.map((color) => (
                    <div
                      key={color}
                      className="flex-1"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>

                {/* Card body */}
                <div className="p-4 flex-1">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="font-display text-xl font-semibold text-foreground leading-tight">
                      {cfg.label}
                    </span>
                  </div>
                  <span className="inline-block text-[10px] font-body uppercase tracking-widest text-muted-foreground bg-muted px-1.5 py-0.5 rounded mb-2">
                    {cfg.sublabel}
                  </span>
                  <p className="font-body text-xs text-muted-foreground leading-relaxed">
                    {cfg.tagline}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex items-center justify-end gap-3 border-t border-border pt-4">
          <button
            type="button"
            data-ocid="theme.cancel_button"
            onClick={onClose}
            className="font-body text-sm px-4 py-2 rounded-lg border border-border text-muted-foreground hover:text-foreground transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            data-ocid="theme.confirm_button"
            onClick={handleConfirm}
            className="font-body text-sm px-6 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity font-medium"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ThemeSetupModal(props: ThemeSetupModalProps) {
  return <ThemeChooser {...props} />;
}
