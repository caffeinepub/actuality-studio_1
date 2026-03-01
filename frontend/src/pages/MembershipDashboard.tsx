import React from 'react';
import { Link } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import {
  useGetMembershipForCaller,
  useIsTrialActive,
  useIsMembershipActive,
  useGetTrialExpiryDate,
} from '../hooks/useQueries';
import MembershipCard from '../components/MembershipCard';
import MintMembershipButton from '../components/MintMembershipButton';
import { Skeleton } from '@/components/ui/skeleton';
import { LogIn, ArrowLeft } from 'lucide-react';
import LoginButton from '../components/LoginButton';

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

export default function MembershipDashboard() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const { data: membership, isLoading: membershipLoading, isFetched: membershipFetched } = useGetMembershipForCaller();
  const { data: isTrialActive = false } = useIsTrialActive();
  const { data: isMembershipActive = false } = useIsMembershipActive();
  const { data: trialExpiryDate = null } = useGetTrialExpiryDate();

  // Unauthenticated state
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
              Please sign in with Internet Identity to access your membership dashboard.
            </p>
          </div>
          <LoginButton size="lg" className="w-full h-12 rounded-xl text-base" />
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-body text-muted-foreground hover:text-terracotta transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </main>
    );
  }

  const isLoading = membershipLoading && !membershipFetched;

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 py-12 max-w-2xl">
        {/* Page Header */}
        <div className="mb-10 animate-fade-in">
          <p className="font-body text-xs font-semibold tracking-[0.3em] uppercase text-terracotta mb-2">
            Member Portal
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-light text-foreground">
            Your{' '}
            <span className="gradient-text-terracotta font-semibold">Membership</span>
          </h1>
          <p className="font-body text-muted-foreground mt-3 leading-relaxed">
            Manage your Actuality Studio NFT membership and trial status.
          </p>
        </div>

        {/* Content */}
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
            {/* No Membership State */}
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
                  You don't have a membership yet. Mint your NFT membership to get started with a 30-day free trial.
                </p>
              </div>

              {/* Trial Info */}
              <div className="grid grid-cols-3 gap-4 py-4 border-t border-b border-border">
                {[
                  { label: 'Trial Period', value: '30 Days' },
                  { label: 'Token Type', value: 'NFT' },
                  { label: 'Network', value: 'ICP' },
                ].map((item) => (
                  <div key={item.label} className="text-center">
                    <p className="font-display text-xl font-semibold text-terracotta">{item.value}</p>
                    <p className="font-body text-xs text-muted-foreground mt-0.5">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <MintMembershipButton />
          </div>
        )}
      </div>
    </main>
  );
}
