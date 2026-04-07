import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  CheckCircle2,
  ClipboardCopy,
  ExternalLink,
  FileDown,
  Info,
  Link2,
  Link2Off,
  LogIn,
  Trash2,
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import type { ShareLinkPublic } from "../backend";
import LoginButton from "../components/LoginButton";
import MembershipCard from "../components/MembershipCard";
import MintMembershipButton from "../components/MintMembershipButton";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useGetMembershipForCaller,
  useGetTrialExpiryDate,
  useIsMembershipActive,
  useIsTrialActive,
} from "../hooks/useQueries";

function DashboardSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <Skeleton className="h-8 w-48 bg-soft-blush/40" />
      <Skeleton className="h-4 w-72 bg-soft-blush/40" />
      <div className="mt-8 space-y-3">
        <Skeleton className="h-64 w-full bg-soft-blush/40 rounded-2xl" />
      </div>
    </div>
  );
}

function generateMembershipPDF(docName: string) {
  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${docName} — Actuality Studio</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600&family=Inter:wght@400;500&display=swap');
    body{font-family:'Inter',sans-serif;margin:0;padding:60px;background:#F8F1E9;color:#3a2a1a;}
    .cert{max-width:680px;margin:0 auto;background:#fff;border:2px solid #C46A4E;border-radius:16px;padding:60px;text-align:center;}
    h1{font-family:'Cormorant Garamond',serif;font-size:3rem;color:#C46A4E;margin:0 0 8px;}
    h2{font-family:'Cormorant Garamond',serif;font-size:1.8rem;color:#4A7043;margin:0 0 32px;font-weight:400;}
    .divider{border:none;border-top:1px solid #C46A4E66;margin:24px 0;}
    .doc-name{font-size:1.25rem;font-weight:600;color:#2a1a0a;margin:16px 0;}
    .meta{color:#7a6050;font-size:0.85rem;}
    .footer{margin-top:48px;font-size:0.75rem;color:#a08060;}
    @media print{body{background:white;padding:0;}}
  </style>
</head>
<body>
  <div class="cert">
    <h1>Actuality Studio</h1>
    <h2>Rooted in Steiner's Vision</h2>
    <hr class="divider">
    <p class="meta">Secure Document</p>
    <p class="doc-name">${docName}</p>
    <hr class="divider">
    <p class="meta">Generated: ${new Date().toLocaleString()}</p>
    <p class="meta">The Sevenfold Arts · Architecture · Music · Literature · Movement · Sculpture · Painting · Drawing</p>
    <div class="footer">To add PDF password: open in your PDF viewer → File → Encrypt / Set Password.<br>Built with caffeine.ai</div>
  </div>
  <script>window.onload=function(){window.print();}<\/script>
</body>
</html>`;
  const w = window.open("", "_blank");
  if (w) {
    w.document.write(html);
    w.document.close();
  }
}

interface ShareLinkCreated {
  id: string;
  documentName: string;
  expiryHours: string;
  link: string;
}

function ShareLinkSection() {
  const { actor } = useActor();
  const [docName, setDocName] = useState("");
  const [expiryHours, setExpiryHours] = useState("24");
  const [sharePassword, setSharePassword] = useState("");
  const [creating, setCreating] = useState(false);
  const [createdLinks, setCreatedLinks] = useState<ShareLinkCreated[]>([]);
  const [copied, setCopied] = useState<string | null>(null);
  const [revoking, setRevoking] = useState<string | null>(null);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor || !docName) return;
    setCreating(true);
    try {
      const passwordHash = sharePassword
        ? btoa(encodeURIComponent(sharePassword))
        : "";
      const linkId = await actor.createShareLink(
        docName,
        BigInt(expiryHours),
        passwordHash,
      );
      const link = `${window.location.origin}/share/${linkId}`;
      setCreatedLinks((prev) => [
        { id: linkId, documentName: docName, expiryHours, link },
        ...prev,
      ]);
      setDocName("");
      setSharePassword("");
    } catch (err) {
      console.error("Failed to create share link", err);
    } finally {
      setCreating(false);
    }
  };

  const handleCopy = (link: string, id: string) => {
    navigator.clipboard.writeText(link);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleRevoke = async (id: string) => {
    if (!actor) return;
    setRevoking(id);
    try {
      await actor.revokeShareLink(id);
      setCreatedLinks((prev) => prev.filter((l) => l.id !== id));
    } catch (err) {
      console.error("Failed to revoke", err);
    } finally {
      setRevoking(null);
    }
  };

  const expiryLabels: Record<string, string> = {
    "1": "1 hour",
    "24": "24 hours",
    "168": "7 days",
    "720": "30 days",
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleCreate} className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label
              className="font-body text-sm font-medium text-foreground"
              htmlFor="share-doc-name"
            >
              Document Name
            </label>
            <Input
              id="share-doc-name"
              data-ocid="share.input"
              placeholder="e.g. Architecture Module 1"
              value={docName}
              onChange={(e) => setDocName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1.5">
            <label
              className="font-body text-sm font-medium text-foreground"
              htmlFor="share-expiry"
            >
              Expires After
            </label>
            <Select value={expiryHours} onValueChange={setExpiryHours}>
              <SelectTrigger id="share-expiry" data-ocid="share.select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 hour</SelectItem>
                <SelectItem value="24">24 hours</SelectItem>
                <SelectItem value="168">7 days</SelectItem>
                <SelectItem value="720">30 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-1.5">
          <label
            className="font-body text-sm font-medium text-foreground"
            htmlFor="share-pw"
          >
            Password (optional)
          </label>
          <Input
            id="share-pw"
            type="password"
            data-ocid="share.input"
            placeholder="Leave blank for open access"
            value={sharePassword}
            onChange={(e) => setSharePassword(e.target.value)}
          />
          {sharePassword && (
            <p className="text-xs text-muted-foreground mt-1">
              Password must be shared separately with the recipient.
            </p>
          )}
        </div>
        <Button
          type="submit"
          data-ocid="share.submit_button"
          disabled={creating || !docName}
          className="gradient-terracotta text-primary-foreground w-full sm:w-auto"
        >
          <Link2 className="w-4 h-4 mr-2" />
          {creating ? "Creating…" : "Create Share Link"}
        </Button>
      </form>

      <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/40 border border-border text-xs font-body text-muted-foreground">
        <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-muted-foreground/70" />
        <span>
          Share links are session-only — they won't appear here after a page
          refresh, but remain active until expiry or revocation.
        </span>
      </div>

      {createdLinks.length > 0 && (
        <div className="space-y-3 pt-2">
          <p className="font-body text-sm font-semibold text-foreground">
            Active Share Links
          </p>
          {createdLinks.map((sl, idx) => (
            <div
              key={sl.id}
              data-ocid={`share.item.${idx + 1}`}
              className="p-4 rounded-xl border border-border bg-background space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-body text-sm font-semibold text-foreground">
                    {sl.documentName}
                  </p>
                  <p className="font-body text-xs text-muted-foreground">
                    Expires in{" "}
                    {expiryLabels[sl.expiryHours] ?? `${sl.expiryHours} hours`}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  data-ocid={`share.delete_button.${idx + 1}`}
                  disabled={revoking === sl.id}
                  onClick={() => handleRevoke(sl.id)}
                  className="text-muted-foreground hover:text-destructive shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  readOnly
                  value={sl.link}
                  className="text-xs h-8 font-mono bg-muted"
                />
                <Button
                  size="sm"
                  variant="outline"
                  data-ocid={`share.secondary_button.${idx + 1}`}
                  onClick={() => handleCopy(sl.link, sl.id)}
                  className="shrink-0"
                >
                  {copied === sl.id ? (
                    <CheckCircle2 className="w-4 h-4 text-forest" />
                  ) : (
                    <ClipboardCopy className="w-4 h-4" />
                  )}
                </Button>
                <a
                  href={sl.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 p-2 rounded-md border border-border hover:border-terracotta/40 text-muted-foreground hover:text-terracotta transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {createdLinks.length === 0 && (
        <div
          data-ocid="share.empty_state"
          className="py-8 text-center flex flex-col items-center gap-2"
        >
          <Link2Off className="w-10 h-10 text-muted-foreground/25" />
          <p className="font-body text-sm text-muted-foreground">
            No share links created yet
          </p>
          <p className="font-body text-xs text-muted-foreground/60">
            Create a link above to share document access securely
          </p>
        </div>
      )}
    </div>
  );
}

function PDFSection() {
  const [docName, setDocName] = useState("");
  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (docName) generateMembershipPDF(docName);
  };
  return (
    <div className="space-y-4">
      <form onSubmit={handleGenerate} className="space-y-3">
        <div className="space-y-1.5">
          <label
            className="font-body text-sm font-medium text-foreground"
            htmlFor="pdf-doc-name"
          >
            Document Name
          </label>
          <Input
            id="pdf-doc-name"
            data-ocid="pdf.input"
            placeholder="e.g. Architecture Module 1 Certificate"
            value={docName}
            onChange={(e) => setDocName(e.target.value)}
            required
          />
        </div>
        <Button
          type="submit"
          data-ocid="pdf.submit_button"
          disabled={!docName}
          className="gradient-terracotta text-primary-foreground w-full sm:w-auto"
        >
          <FileDown className="w-4 h-4 mr-2" />
          Generate PDF
        </Button>
      </form>
      <div className="p-3 rounded-xl bg-warm-gold/5 border border-warm-gold/20">
        <p className="font-body text-xs text-muted-foreground leading-relaxed">
          <span className="font-semibold text-warm-gold">
            About password protection:
          </span>{" "}
          Your document opens as a print-ready page in a new tab. After saving
          as PDF, add password protection using your PDF viewer (e.g. Preview on
          Mac → File → Export as PDF → Security Options, or Adobe Acrobat →
          Protect → Encrypt with Password).
        </p>
      </div>
    </div>
  );
}

export default function MembershipDashboard() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const {
    data: membership,
    isLoading: membershipLoading,
    isFetched: membershipFetched,
  } = useGetMembershipForCaller();
  const { data: isTrialActive = false } = useIsTrialActive();
  const { data: isMembershipActive = false } = useIsMembershipActive();
  const { data: trialExpiryDate = null } = useGetTrialExpiryDate();
  const [shareTab, setShareTab] = useState<"pdf" | "link">("link");

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-6 animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-terracotta/10 border border-terracotta/20 flex items-center justify-center mx-auto">
            <LogIn className="w-8 h-8 text-terracotta" />
          </div>
          <div className="space-y-3">
            <h2 className="font-display text-3xl font-light text-foreground">
              Sign In Required
            </h2>
            <p className="font-body text-muted-foreground leading-relaxed">
              Please sign in with Internet Identity to access your membership
              dashboard.
            </p>
          </div>
          <LoginButton size="lg" className="w-full h-12 rounded-xl text-base" />
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-body text-muted-foreground hover:text-terracotta transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>
      </main>
    );
  }

  const isLoading = membershipLoading && !membershipFetched;

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 py-12 max-w-2xl">
        <div className="mb-10 animate-fade-in">
          <p className="font-body text-xs font-semibold tracking-[0.3em] uppercase text-terracotta mb-2">
            Member Portal
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-light text-foreground">
            Your{" "}
            <span className="gradient-text-terracotta font-semibold">
              Membership
            </span>
          </h1>
          <p className="font-body text-muted-foreground mt-3 leading-relaxed">
            Manage your Actuality Studio NFT membership and trial status.
          </p>
        </div>

        {isLoading ? (
          <DashboardSkeleton />
        ) : membership ? (
          <div className="space-y-6 animate-fade-in">
            <MembershipCard
              membership={membership}
              isTrialActive={isTrialActive}
              isMembershipActive={isMembershipActive}
              trialExpiryDate={trialExpiryDate}
            />
          </div>
        ) : (
          <div className="space-y-8 animate-fade-in">
            <div className="p-8 rounded-2xl bg-card border border-border shadow-card text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-terracotta/10 border border-terracotta/20 flex items-center justify-center mx-auto">
                <img
                  src="/assets/generated/logo-mark.dim_128x128.png"
                  alt="Actuality Studio"
                  className="w-10 h-10 object-contain opacity-80"
                />
              </div>
              <div className="space-y-2">
                <h3 className="font-display text-2xl font-semibold text-foreground">
                  No Membership Found
                </h3>
                <p className="font-body text-muted-foreground text-sm leading-relaxed max-w-sm mx-auto">
                  You don't have a membership yet. Mint your NFT membership to
                  get started with a 30-day free trial.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-4 py-4 border-t border-b border-border">
                {[
                  { label: "Trial Period", value: "30 Days" },
                  { label: "Token Type", value: "NFT" },
                  { label: "Network", value: "ICP" },
                ].map((item) => (
                  <div key={item.label} className="text-center">
                    <p className="font-display text-xl font-semibold text-terracotta">
                      {item.value}
                    </p>
                    <p className="font-body text-xs text-muted-foreground mt-0.5">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <MintMembershipButton />
          </div>
        )}

        {/* Secure Document Sharing */}
        <div className="mt-12 animate-fade-in">
          <div className="mb-6">
            <p className="font-body text-xs font-semibold tracking-[0.3em] uppercase text-terracotta mb-1">
              Tools
            </p>
            <h2 className="font-display text-3xl font-light text-foreground">
              Secure Document Sharing
            </h2>
            <p className="font-body text-sm text-muted-foreground mt-1 leading-relaxed">
              Generate a password-protected PDF or create a time-limited
              shareable link for any document.
            </p>
          </div>

          <div className="flex gap-2 mb-6">
            <button
              type="button"
              data-ocid="share.tab"
              onClick={() => setShareTab("link")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border font-body text-sm font-medium transition-colors ${shareTab === "link" ? "border-terracotta bg-terracotta/5 text-terracotta" : "border-border text-muted-foreground hover:text-foreground"}`}
            >
              <Link2 className="w-4 h-4" /> Shareable Link
            </button>
            <button
              type="button"
              data-ocid="share.tab"
              onClick={() => setShareTab("pdf")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border font-body text-sm font-medium transition-colors ${shareTab === "pdf" ? "border-terracotta bg-terracotta/5 text-terracotta" : "border-border text-muted-foreground hover:text-foreground"}`}
            >
              <FileDown className="w-4 h-4" /> PDF Download
            </button>
          </div>

          <div className="p-6 rounded-2xl bg-card border border-border shadow-card">
            {shareTab === "link" ? <ShareLinkSection /> : <PDFSection />}
          </div>
        </div>
      </div>
    </main>
  );
}
