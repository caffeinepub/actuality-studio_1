import { Button } from "@/components/ui/button";
import { AlertCircle, Loader2, Sparkles } from "lucide-react";
import React from "react";
import { useMintMembership } from "../hooks/useQueries";

interface MintMembershipButtonProps {
  className?: string;
}

export default function MintMembershipButton({
  className,
}: MintMembershipButtonProps) {
  const {
    mutate: mintMembership,
    isPending,
    isError,
    error,
  } = useMintMembership();

  const errorMessage = isError
    ? (error as Error)?.message?.includes("already has a membership")
      ? "You already have a membership."
      : "Minting failed. Please try again."
    : null;

  return (
    <div className={`space-y-3 ${className ?? ""}`}>
      <Button
        onClick={() => mintMembership()}
        disabled={isPending}
        size="lg"
        className="w-full gradient-terracotta text-primary-foreground font-semibold font-body text-base shadow-warm-md hover:opacity-90 transition-opacity h-14 rounded-xl"
      >
        {isPending ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Minting Membership…
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5 mr-2" />
            Mint Your Membership
          </>
        )}
      </Button>

      {errorMessage && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-soft-blush/20 border border-terracotta/20 text-terracotta text-sm font-body animate-fade-in">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
}
