"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/mission", label: "Mission" },
  { href: "/investment", label: "Opportunities" },
  { href: "/cities", label: "Cities" },
  { href: "/apply", label: "Apply" },
];

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, isLoggedIn, logout } = useAuth();
  const isAdminRoute = pathname.startsWith("/admin");

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isAdminRoute ? "bg-[var(--charcoal)]" : "glass border-b border-white/10"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight text-[var(--charcoal)] sm:text-2xl">
            DarGlobal <span className="text-[var(--accent)]">Prestige</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {(isAdminRoute ? [{ href: "/admin", label: "Admin" }] : NAV).map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`text-sm font-medium transition-colors hover:text-[var(--accent)] ${
                pathname === href ? "text-[var(--accent)]" : isAdminRoute ? "text-white/90" : "text-[var(--charcoal)]"
              }`}
            >
              {label}
            </Link>
          ))}
          {!isAdminRoute && (
            <>
              {isLoggedIn ? (
                <div className="flex items-center gap-4">
                  <Link href="/dashboard" className="text-sm font-medium text-[var(--charcoal)] transition-colors hover:text-[var(--accent)]">
                    Dashboard
                  </Link>
                  {user?.isAdmin && (
                    <Link href="/admin" className="text-sm font-medium text-[var(--accent)] transition-colors hover:opacity-80">
                      Admin
                    </Link>
                  )}
                  <button type="button" onClick={logout} className="text-sm font-medium text-[var(--muted)] hover:text-[var(--charcoal)] transition-colors">
                    Logout
                  </button>
                </div>
              ) : (
                <>
                  <Link href="/login" className="text-sm font-medium text-[var(--charcoal)] transition-colors hover:text-[var(--accent)]">
                    Login
                  </Link>
                  <Link href="/apply" className="rounded-xl bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition-all hover:opacity-90">
                    Apply
                  </Link>
                </>
              )}
            </>
          )}
        </nav>

        <button
          type="button"
          aria-label="Toggle menu"
          className="rounded p-2 md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {mobileOpen && (
        <div className="glass-dark border-t border-white/10 px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-2">
            {NAV.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="rounded-lg px-4 py-2 text-[var(--charcoal)] hover:bg-white/10"
                onClick={() => setMobileOpen(false)}
              >
                {label}
              </Link>
            ))}
            <Link href="/dashboard" className="rounded-lg px-4 py-2" onClick={() => setMobileOpen(false)}>
              Dashboard
            </Link>
            <Link href="/apply" className="rounded-lg px-4 py-2 font-medium text-[var(--accent)]" onClick={() => setMobileOpen(false)}>
              Apply
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
