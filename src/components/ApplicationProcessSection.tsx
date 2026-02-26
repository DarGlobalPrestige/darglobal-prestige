"use client";

import { useState } from "react";
import { DocumentationSteps } from "./DocumentationSteps";

export type ProcessPhase = "application" | "documentation" | "review" | "approved";

const PHASES: { id: ProcessPhase; title: string; desc: string; icon: string }[] = [
  { id: "application", title: "Application", desc: "Submitted", icon: "📝" },
  { id: "documentation", title: "Documentation", desc: "KYC & compliance", icon: "📁" },
  { id: "review", title: "Review", desc: "Verification", icon: "🔍" },
  { id: "approved", title: "Approved", desc: "Ready to invest", icon: "✅" },
];

interface ApplicationProcessSectionProps {
  userEmail: string;
  userName: string;
  onDocsComplete?: () => void;
}

export function ApplicationProcessSection({ userEmail, userName, onDocsComplete }: ApplicationProcessSectionProps) {
  const [phase, setPhase] = useState<ProcessPhase>("documentation");
  const [docsComplete, setDocsComplete] = useState(false);

  const currentPhaseIdx = PHASES.findIndex((p) => p.id === phase);

  return (
    <div className="rounded-2xl border border-[var(--accent)]/20 bg-white shadow-soft overflow-hidden">
      {/* Phase progress bar */}
      <div className="border-b border-[var(--accent)]/10 bg-[var(--cream)]/30 px-4 py-6 sm:px-6">
        <h2 className="text-xl font-bold text-[var(--charcoal)]">Application Process</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Complete each step to activate your investor account.
        </p>
        <div className="mt-6 flex gap-2">
          {PHASES.map((p, i) => {
            const isActive = phase === p.id;
            const isPast = currentPhaseIdx > i || (p.id === "documentation" && docsComplete);
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setPhase(p.id)}
                className={`flex flex-1 flex-col items-center gap-1 rounded-xl px-2 py-3 text-center transition-all sm:flex-row sm:gap-2 sm:px-4 ${
                  isActive
                    ? "bg-[var(--accent)] text-white shadow-colored"
                    : isPast
                    ? "bg-[var(--success)]/20 text-[var(--success)]"
                    : "bg-white/80 text-[var(--muted)] hover:bg-[var(--accent-light)]/20"
                }`}
              >
                <span className="text-lg sm:text-xl">{p.icon}</span>
                <span className="text-xs font-medium sm:text-sm">{p.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Phase content */}
      <div className="p-6 sm:p-8">
        {phase === "application" && (
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[var(--success)]/20 text-2xl">
                ✓
              </span>
              <div>
                <h3 className="font-bold text-[var(--charcoal)]">Application submitted</h3>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  Thank you, {userName}. Your investment application has been received. We&apos;re reviewing your details.
                </p>
              </div>
            </div>
            <div className="rounded-xl border border-[var(--accent)]/10 bg-[var(--cream)]/30 p-4">
              <p className="text-sm font-medium text-[var(--charcoal)]">What&apos;s next?</p>
              <p className="mt-1 text-sm text-[var(--muted)]">
                Complete the documentation step below to verify your identity and comply with regulations. This usually takes 1–2 business days to review.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setPhase("documentation")}
              className="rounded-xl bg-[var(--accent)] px-6 py-3 font-semibold text-white shadow-colored hover:opacity-90"
            >
              Continue to documentation →
            </button>
          </div>
        )}

        {phase === "documentation" && (
          <DocumentationSteps
            userEmail={userEmail}
            onComplete={() => {
              setDocsComplete(true);
              setPhase("review");
              onDocsComplete?.();
            }}
          />
        )}

        {phase === "review" && (
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[var(--accent)]/20 text-2xl">
                🔍
              </span>
              <div>
                <h3 className="font-bold text-[var(--charcoal)]">Under review</h3>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  Your documents have been submitted. Our team is verifying your identity and compliance documents.
                </p>
              </div>
            </div>
            <div className="rounded-xl border border-[var(--accent)]/10 bg-[var(--cream)]/30 p-4">
              <p className="text-sm font-medium text-[var(--charcoal)]">Typical timeline</p>
              <p className="mt-1 text-sm text-[var(--muted)]">
                Verification usually takes 1–2 business days. We&apos;ll email you as soon as your account is approved.
              </p>
            </div>
          </div>
        )}

        {phase === "approved" && (
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[var(--success)]/20 text-2xl">
                ✅
              </span>
              <div>
                <h3 className="font-bold text-[var(--charcoal)]">Account approved</h3>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  You&apos;re all set. Browse properties and start investing.
                </p>
              </div>
            </div>
            <a
              href="/investment"
              className="inline-block rounded-xl bg-[var(--accent)] px-6 py-3 font-semibold text-white shadow-colored hover:opacity-90"
            >
              Explore opportunities →
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
