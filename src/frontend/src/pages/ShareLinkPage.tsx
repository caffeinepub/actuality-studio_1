import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2, Clock, Lock, XCircle } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import type { ShareLinkPublic } from "../backend";
import { useActor } from "../hooks/useActor";

type Status = "loading" | "needs_password" | "valid" | "invalid" | "expired";

function formatExpiry(nanos: bigint): string {
  const ms = Number(nanos / 1_000_000n);
  return new Date(ms).toLocaleString();
}

export default function ShareLinkPage() {
  const { linkId } = useParams({ from: "/share/$linkId" });
  const { actor } = useActor();

  const [status, setStatus] = useState<Status>("loading");
  const [shareLink, setShareLink] = useState<ShareLinkPublic | null>(null);
  const [password, setPassword] = useState("");
  const [pwError, setPwError] = useState("");
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    if (!actor || !linkId) return;
    actor
      .getShareLink(linkId)
      .then((link) => {
        if (!link) {
          setStatus("invalid");
          return;
        }
        setShareLink(link);
        const now = BigInt(Date.now()) * 1_000_000n;
        if (!link.active || link.expiryTime < now) {
          setStatus("expired");
          return;
        }
        actor.validateShareLink(linkId, "").then((ok) => {
          setStatus(ok ? "valid" : "needs_password");
        });
      })
      .catch(() => setStatus("invalid"));
  }, [actor, linkId]);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor || !linkId) return;
    setPwError("");
    setChecking(true);
    try {
      const hash = btoa(encodeURIComponent(password));
      const ok = await actor.validateShareLink(linkId, hash);
      if (ok) setStatus("valid");
      else setPwError("Incorrect password. Please try again.");
    } catch {
      setPwError("An error occurred. Please try again.");
    } finally {
      setChecking(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 pt-32 pb-16">
      <div className="max-w-md w-full space-y-6 animate-fade-in">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-body text-muted-foreground hover:text-terracotta transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Actuality Studio
        </Link>

        {status === "loading" && (
          <div
            data-ocid="share.loading_state"
            className="p-8 rounded-2xl bg-card border border-border shadow-card text-center space-y-3"
          >
            <div className="w-12 h-12 rounded-full bg-terracotta/10 border border-terracotta/20 flex items-center justify-center mx-auto animate-pulse">
              <Lock className="w-6 h-6 text-terracotta" />
            </div>
            <p className="font-body text-muted-foreground">Verifying link…</p>
          </div>
        )}

        {status === "needs_password" && (
          <div
            data-ocid="share.dialog"
            className="p-8 rounded-2xl bg-card border border-border shadow-card space-y-6"
          >
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-warm-gold/10 border border-warm-gold/20 flex items-center justify-center mx-auto">
                <Lock className="w-6 h-6 text-warm-gold" />
              </div>
              <h2 className="font-display text-2xl font-semibold text-foreground">
                Password Required
              </h2>
              {shareLink && (
                <p className="font-body text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">
                    {shareLink.documentName}
                  </span>{" "}
                  is password-protected.
                </p>
              )}
            </div>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label
                  className="font-body text-sm font-medium text-foreground"
                  htmlFor="share-pw"
                >
                  Password
                </label>
                <Input
                  id="share-pw"
                  type="password"
                  data-ocid="share.input"
                  placeholder="Enter document password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoFocus
                />
                {pwError && (
                  <div data-ocid="share.error_state" className="space-y-1">
                    <p className="text-xs text-destructive">{pwError}</p>
                    <p className="text-xs text-muted-foreground">
                      Forgot the password? Contact the document owner.
                    </p>
                  </div>
                )}
              </div>
              <Button
                type="submit"
                data-ocid="share.submit_button"
                disabled={checking || !password}
                className="w-full gradient-terracotta text-primary-foreground"
              >
                {checking ? "Checking…" : "Access Document"}
              </Button>
            </form>
          </div>
        )}

        {status === "valid" && shareLink && (
          <div
            data-ocid="share.success_state"
            className="p-8 rounded-2xl bg-card border border-border shadow-card text-center space-y-4"
          >
            <div className="w-14 h-14 rounded-full bg-sage/10 border border-sage/20 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7 text-forest" />
            </div>
            <div className="space-y-2">
              <h2 className="font-display text-2xl font-semibold text-foreground">
                Document Access Granted
              </h2>
              <p className="font-body text-lg font-medium text-terracotta">
                {shareLink.documentName}
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm font-body text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>Expires: {formatExpiry(shareLink.expiryTime)}</span>
            </div>
            <p className="font-body text-sm text-muted-foreground leading-relaxed">
              Your access has been verified. The document owner will provide the
              file via a secure channel. This link remains valid until the
              expiry time shown above.
            </p>
          </div>
        )}

        {(status === "invalid" || status === "expired") && (
          <div
            data-ocid="share.error_state"
            className="p-8 rounded-2xl bg-card border border-border shadow-card text-center space-y-4"
          >
            <div className="w-14 h-14 rounded-full bg-destructive/10 border border-destructive/20 flex items-center justify-center mx-auto">
              <XCircle className="w-7 h-7 text-destructive" />
            </div>
            <div className="space-y-2">
              <h2 className="font-display text-2xl font-semibold text-foreground">
                {status === "expired" ? "Link Expired" : "Link Not Found"}
              </h2>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                {status === "expired"
                  ? "This secure link has passed its expiry time. Reach out to the document owner to request a fresh link — they'll be happy to help."
                  : "This link doesn't match any active document share. It may have been revoked or the URL may be incorrect."}
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
