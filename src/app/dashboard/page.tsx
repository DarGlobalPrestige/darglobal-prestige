"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { ApplicationProcessSection } from "@/components/ApplicationProcessSection";
import { InvestmentAgreementSection } from "@/components/InvestmentAgreementSection";
import { ApplicationProgressTracker } from "@/components/ApplicationProgressTracker";
import { InvestorBenefitsCard } from "@/components/InvestorBenefitsCard";

const DOCS_SUBMITTED_KEY = "darglobal_docs_submitted";

function hasDocsSubmitted(email: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(`${DOCS_SUBMITTED_KEY}_${email}`) === "true";
  } catch {}
  return false;
}

const DASH_CARDS = [
  { key: "overview", title: "Overview", desc: "Application status, investments", href: "#", icon: "📊" },
  { key: "investments", title: "My Investments", desc: "Properties and returns", href: "#", icon: "🏠" },
  { key: "income", title: "Income Reports", desc: "Quarterly distribution reports", href: "#", icon: "📈" },
];

export default function DashboardPage() {
  const { user, isLoggedIn } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [docsSubmitted, setDocsSubmitted] = useState(false);
  const processRef = useRef<HTMLDivElement>(null);
  const agreementRef = useRef<HTMLDivElement>(null);

  const scrollToSection = useCallback((id: string) => {
    if (id === "documentation" || id === "application") {
      processRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if ((id === "agreement" || id === "review") && docsSubmitted) {
      agreementRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      processRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [docsSubmitted]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (user?.email) setDocsSubmitted(hasDocsSubmitted(user.email));
  }, [user?.email]);

  useEffect(() => {
    if (!mounted || !user?.email) return;
    const id = setInterval(() => setDocsSubmitted(hasDocsSubmitted(user.email)), 500);
    return () => clearInterval(id);
  }, [mounted, user?.email]);

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

      {/* Main animated progress tracker */}
      <div className="mt-8">
        <ApplicationProgressTracker
          userEmail={user.email}
          onMilestoneClick={scrollToSection}
        />
      </div>

      {/* Application process - full flow */}
      <div ref={processRef} className="mt-8 scroll-mt-24">
        <ApplicationProcessSection
          userEmail={user.email}
          userName={user.fullName}
          onDocsComplete={() => setDocsSubmitted(true)}
        />
      </div>

      {/* Investment agreement - shows after documentation is submitted */}
      {docsSubmitted && (
        <div ref={agreementRef} className="mt-8 scroll-mt-24">
          <InvestmentAgreementSection userEmail={user.email} userName={user.fullName} />
        </div>
      )}

      {/* Investor benefits */}
      <div className="mt-8">
        <InvestorBenefitsCard />
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
