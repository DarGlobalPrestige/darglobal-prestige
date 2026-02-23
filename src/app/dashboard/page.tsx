"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

const DASH_CARDS = [
  { key: "overview", title: "Overview", desc: "Application status, investments", href: "#", icon: "📊" },
  { key: "kyc", title: "KYC", desc: "Identity verification", href: "#", icon: "✅" },
  { key: "documents", title: "Documents", desc: "Upload passport, proof of address, tax ID", href: "#", icon: "📁" },
  { key: "investments", title: "My Investments", desc: "Properties and returns", href: "#", icon: "🏠" },
  { key: "income", title: "Income Reports", desc: "Quarterly distribution reports", href: "#", icon: "📈" },
];

const UPLOAD_TYPES = [
  { id: "passport", label: "Passport / ID", status: "pending" },
  { id: "address", label: "Proof of address", status: "pending" },
  { id: "tax", label: "Tax ID / Certificate", status: "pending" },
];

export default function DashboardPage() {
  const { user, isLoggedIn } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="mx-auto max-w-4xl px-4 py-20 text-center text-[var(--muted)]">Loading...</div>;
  }

  if (!isLoggedIn || !user) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-[var(--charcoal)]">Investor Dashboard</h1>
        <p className="mt-4 text-[var(--muted)]">Sign in or complete an application to access your dashboard.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link href="/login" className="rounded-xl bg-[var(--accent)] px-8 py-4 font-semibold text-white shadow-colored hover:opacity-90">
            Sign In
          </Link>
          <Link href="/apply" className="rounded-xl border-2 border-[var(--accent)] px-8 py-4 font-semibold text-[var(--accent)] hover:bg-[var(--accent-light)]/30">
            Apply to Invest
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--charcoal)]">Dashboard</h1>
          <p className="mt-1 text-[var(--muted)]">Welcome back, {user.fullName}</p>
        </div>
        {user?.isAdmin && (
          <Link href="/admin" className="rounded-xl border border-[var(--accent)]/30 px-4 py-2 text-sm font-medium text-[var(--charcoal)] hover:bg-[var(--cream)]">
            Admin →
          </Link>
        )}
      </div>

      {/* Application status */}
      <div className="mt-8 rounded-2xl border border-[var(--accent)]/20 bg-[var(--accent-light)]/20 p-6">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent)]/20">
            <svg className="h-5 w-5 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
          <div>
            <h2 className="font-semibold text-[var(--charcoal)]">Application pending review</h2>
            <p className="text-sm text-[var(--muted)]">We&apos;ll notify you once approved. Complete KYC & documents below.</p>
          </div>
        </div>
      </div>

      {/* KYC & Documents */}
      <div className="mt-10">
        <h2 className="text-xl font-bold text-[var(--charcoal)]">KYC & Documents</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">Required for compliance. Upload in your backoffice.</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {UPLOAD_TYPES.map((doc) => (
            <div
              key={doc.id}
              className="rounded-xl border border-[var(--accent)]/10 bg-white p-4 shadow-soft transition-all hover:shadow-soft"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-[var(--charcoal)]">{doc.label}</span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${doc.status === "pending" ? "bg-amber-100 text-amber-800" : "bg-green-100 text-green-800"}`}>
                  {doc.status}
                </span>
              </div>
              <button type="button" className="mt-3 w-full rounded-lg border border-[var(--accent)]/30 py-2 text-sm font-medium text-[var(--accent)] hover:bg-[var(--accent-light)]/30">
                Upload
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Cards */}
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {DASH_CARDS.map((card) => (
          <Link
            key={card.key}
            href={card.href}
            className="group rounded-2xl border border-[var(--accent)]/10 bg-white p-6 shadow-soft transition-all hover:shadow-colored"
          >
            <span className="text-2xl">{card.icon}</span>
            <h3 className="mt-4 font-semibold text-[var(--charcoal)]">{card.title}</h3>
            <p className="mt-2 text-sm text-[var(--muted)]">{card.desc}</p>
            <span className="mt-3 inline-block text-sm font-medium text-[var(--accent)] group-hover:underline">
              View →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
