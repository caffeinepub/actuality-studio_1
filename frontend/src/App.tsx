import React from 'react';
import {
  createRouter,
  createRoute,
  createRootRoute,
  RouterProvider,
  Outlet,
} from '@tanstack/react-router';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useQueries';
import Navigation from './components/Navigation';
import LandingPage from './pages/LandingPage';
import MembershipDashboard from './pages/MembershipDashboard';
import ProfileSetupModal from './components/ProfileSetupModal';
import { useQueryClient } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';

// ─── Layout ──────────────────────────────────────────────────────────────────

function AppLayout() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const queryClient = useQueryClient();

  const {
    data: userProfile,
    isLoading: profileLoading,
    isFetched: profileFetched,
  } = useGetCallerUserProfile();

  const showProfileSetup =
    isAuthenticated && !profileLoading && profileFetched && userProfile === null;

  const handleProfileComplete = () => {
    queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      {/* Offset for fixed nav */}
      <div className="pt-16">
        <Outlet />
      </div>
      <AppFooter />
      <ProfileSetupModal open={showProfileSetup} onComplete={handleProfileComplete} />
      <Toaster theme="light" />
    </div>
  );
}

// ─── Footer ──────────────────────────────────────────────────────────────────

function AppFooter() {
  const year = new Date().getFullYear();
  const appId = encodeURIComponent(
    typeof window !== 'undefined' ? window.location.hostname : 'actuality-studio'
  );

  return (
    <footer className="border-t border-border mt-16 bg-cream-dark">
      <div className="container mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <img
              src="/assets/generated/logo-mark.dim_128x128.png"
              alt="Actuality Studio"
              className="w-5 h-5 object-contain opacity-70"
            />
            <span className="font-display text-sm text-muted-foreground">
              Actuality Studio
            </span>
          </div>

          {/* Copyright */}
          <p className="font-body text-xs text-muted-foreground text-center">
            © {year} Actuality Studio. All rights reserved.
          </p>

          {/* Attribution */}
          <p className="font-body text-xs text-muted-foreground flex items-center gap-1">
            Built with{' '}
            <span className="text-terracotta" aria-label="love">♥</span>
            {' '}using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-terracotta hover:text-warm-gold transition-colors underline underline-offset-2"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─── Routes ──────────────────────────────────────────────────────────────────

const rootRoute = createRootRoute({
  component: AppLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: LandingPage,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: MembershipDashboard,
});

const routeTree = rootRoute.addChildren([indexRoute, dashboardRoute]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

// ─── App ─────────────────────────────────────────────────────────────────────

export default function App() {
  return <RouterProvider router={router} />;
}
