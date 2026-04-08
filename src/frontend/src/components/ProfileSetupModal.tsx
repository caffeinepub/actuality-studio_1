import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, User } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { useSaveCallerUserProfile } from "../hooks/useQueries";

interface ProfileSetupModalProps {
  open: boolean;
  onComplete: () => void;
}

export default function ProfileSetupModal({
  open,
  onComplete,
}: ProfileSetupModalProps) {
  const [name, setName] = useState("");
  const {
    mutate: saveProfile,
    isPending,
    isError,
  } = useSaveCallerUserProfile();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    saveProfile(
      { name: name.trim(), displayName: name.trim(), email: "" },
      { onSuccess: onComplete },
    );
  };

  return (
    <Dialog open={open}>
      <DialogContent
        className="bg-card border-border shadow-card max-w-md"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-terracotta/10 border border-terracotta/20 flex items-center justify-center">
              <User className="w-5 h-5 text-terracotta" />
            </div>
            <DialogTitle className="font-display text-2xl text-foreground">
              Welcome to Actuality Studio
            </DialogTitle>
          </div>
          <DialogDescription className="font-body text-muted-foreground">
            You're signing in for the first time. Please enter your name to set
            up your profile.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="name" className="font-body text-sm text-foreground">
              Your Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name…"
              className="bg-input border-border font-body focus:border-terracotta focus:ring-terracotta"
              autoFocus
            />
          </div>

          {isError && (
            <p className="text-terracotta text-sm font-body">
              Failed to save profile. Please try again.
            </p>
          )}

          <Button
            type="submit"
            disabled={isPending || !name.trim()}
            className="w-full gradient-terracotta text-primary-foreground font-semibold font-body"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving…
              </>
            ) : (
              "Continue to Studio"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
