import React, { useState } from 'react';
import { Link, useLocation } from '@tanstack/react-router';
import LoginButton from './LoginButton';
import PrincipalDisplay from './PrincipalDisplay';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Menu, X, Leaf } from 'lucide-react';

export default function Navigation() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: 'Home', to: '/' },
    ...(isAuthenticated ? [{ label: 'Dashboard', to: '/dashboard' }] : []),
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-cream/90 backdrop-blur-md shadow-warm-sm">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src="/assets/generated/logo-mark.dim_128x128.png"
              alt="Actuality Studio"
              className="w-8 h-8 object-contain"
            />
            <span className="font-display text-xl font-semibold tracking-wide text-foreground group-hover:text-terracotta transition-colors">
              Actuality Studio
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`font-body text-sm font-medium transition-colors hover:text-terracotta ${
                  location.pathname === link.to
                    ? 'text-terracotta'
                    : 'text-muted-foreground'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Auth Controls */}
          <div className="hidden md:flex items-center gap-3">
            <PrincipalDisplay />
            <LoginButton size="sm" />
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-muted-foreground hover:text-terracotta transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border py-4 space-y-4 animate-fade-in bg-cream/95">
            <nav className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`font-body text-sm font-medium transition-colors hover:text-terracotta px-1 ${
                    location.pathname === link.to
                      ? 'text-terracotta'
                      : 'text-muted-foreground'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="flex flex-col gap-3 pt-2 border-t border-border">
              <PrincipalDisplay />
              <LoginButton size="sm" />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
