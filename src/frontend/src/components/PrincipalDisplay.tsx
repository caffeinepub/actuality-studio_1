import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Check, Copy } from "lucide-react";
import React, { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function PrincipalDisplay() {
  const { identity } = useInternetIdentity();
  const [copied, setCopied] = useState(false);

  if (!identity) return null;

  const principal = identity.getPrincipal().toString();
  const truncated = `${principal.slice(0, 5)}…${principal.slice(-4)}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(principal);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard not available
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-cream-dark border border-border hover:border-terracotta/40 transition-colors group font-body text-sm"
          >
            <span className="w-2 h-2 rounded-full bg-sage-green animate-pulse-gold flex-shrink-0" />
            <span className="text-muted-foreground group-hover:text-terracotta transition-colors font-mono text-xs">
              {truncated}
            </span>
            {copied ? (
              <Check className="w-3 h-3 text-forest-green flex-shrink-0" />
            ) : (
              <Copy className="w-3 h-3 text-muted-foreground group-hover:text-terracotta transition-colors flex-shrink-0" />
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent
          side="bottom"
          className="font-mono text-xs max-w-xs break-all"
        >
          {principal}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
