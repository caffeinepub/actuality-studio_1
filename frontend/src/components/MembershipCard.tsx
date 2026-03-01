import React from 'react';
import type { Membership } from '../backend';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Shield, Calendar, Hash, Clock, CheckCircle, XCircle, Hourglass } from 'lucide-react';

interface MembershipCardProps {
  membership: Membership;
  isTrialActive: boolean;
  isMembershipActive: boolean;
  trialExpiryDate: bigint | null;
}

function formatTimestamp(nanos: bigint): string {
  const ms = Number(nanos / BigInt(1_000_000));
  return new Date(ms).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function getDaysRemaining(expiryNanos: bigint): number {
  const expiryMs = Number(expiryNanos / BigInt(1_000_000));
  const nowMs = Date.now();
  const diffMs = expiryMs - nowMs;
  return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
}

function StatusBadge({
  isTrialActive,
  isMembershipActive,
}: {
  isTrialActive: boolean;
  isMembershipActive: boolean;
}) {
  if (!isMembershipActive) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold font-body bg-soft-blush/30 text-terracotta border border-terracotta/30">
        <XCircle className="w-3.5 h-3.5" />
        Expired
      </span>
    );
  }
  if (isTrialActive) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold font-body bg-warm-gold/15 text-warm-gold border border-warm-gold/30">
        <Hourglass className="w-3.5 h-3.5" />
        Trial Active
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold font-body bg-sage-green/15 text-forest-green border border-sage-green/30">
      <CheckCircle className="w-3.5 h-3.5" />
      Active
    </span>
  );
}

export default function MembershipCard({
  membership,
  isTrialActive,
  isMembershipActive,
  trialExpiryDate,
}: MembershipCardProps) {
  const daysRemaining = trialExpiryDate ? getDaysRemaining(trialExpiryDate) : 0;

  return (
    <Card className="bg-card border-border shadow-card overflow-hidden animate-fade-in relative">
      {/* Terracotta accent top bar */}
      <div className="h-1 w-full gradient-terracotta" />

      {/* Leaf sprig corner motif */}
      <img
        src="/assets/generated/leaf-sprig-corner.dim_200x200.png"
        alt=""
        aria-hidden="true"
        className="absolute bottom-3 right-3 w-16 h-16 object-contain opacity-30 pointer-events-none select-none"
      />

      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-terracotta/10 border border-terracotta/20 flex items-center justify-center">
              <Shield className="w-5 h-5 text-terracotta" />
            </div>
            <div>
              <CardTitle className="font-display text-xl text-foreground">
                Studio Membership
              </CardTitle>
              <p className="font-body text-xs text-muted-foreground mt-0.5">
                NFT Token #{membership.tokenId.toString()}
              </p>
            </div>
          </div>
          <StatusBadge isTrialActive={isTrialActive} isMembershipActive={isMembershipActive} />
        </div>
      </CardHeader>

      <Separator className="bg-border" />

      <CardContent className="pt-6 space-y-5">
        {/* Token ID */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Hash className="w-4 h-4" />
            <span className="font-body text-sm">Token ID</span>
          </div>
          <span className="font-mono text-sm font-semibold text-foreground">
            #{membership.tokenId.toString().padStart(4, '0')}
          </span>
        </div>

        {/* Mint Date */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span className="font-body text-sm">Minted On</span>
          </div>
          <span className="font-body text-sm text-foreground">
            {formatTimestamp(membership.mintTimestamp)}
          </span>
        </div>

        {/* Trial Expiry */}
        {trialExpiryDate && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span className="font-body text-sm">Trial Expires</span>
            </div>
            <div className="text-right">
              <span className="font-body text-sm text-foreground block">
                {formatTimestamp(trialExpiryDate)}
              </span>
              {isTrialActive && (
                <span className="font-body text-xs text-warm-gold">
                  {daysRemaining} day{daysRemaining !== 1 ? 's' : ''} remaining
                </span>
              )}
            </div>
          </div>
        )}

        {/* Trial Progress Bar */}
        {trialExpiryDate && isTrialActive && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-body text-muted-foreground">
              <span>Trial Progress</span>
              <span>{30 - daysRemaining} / 30 days used</span>
            </div>
            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
              <div
                className="h-full gradient-terracotta rounded-full transition-all duration-500"
                style={{ width: `${((30 - daysRemaining) / 30) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Owner */}
        <div className="pt-2 border-t border-border">
          <p className="font-body text-xs text-muted-foreground mb-1">Owner Principal</p>
          <p className="font-mono text-xs text-muted-foreground/70 break-all">
            {membership.owner.toString()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
