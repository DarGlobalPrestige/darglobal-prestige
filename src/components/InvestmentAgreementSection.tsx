"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { PROPERTIES } from "@/lib/data";

const AGREEMENT_STEPS = [
  { id: "terms", title: "Investor agreement", icon: "📜" },
  { id: "bank", title: "Bank details", icon: "🏦" },
  { id: "shortlist", title: "Property interest", icon: "🏠" },
  { id: "complete", title: "Complete", icon: "✅" },
] as const;

const STORAGE_KEY = "darglobal_agreement";

function loadAgreement(email: string) {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY}_${email}`);
    return raw ? JSON.parse(raw) : null;
  } catch {}
  return null;
}

function saveAgreement(email: string, data: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(`${STORAGE_KEY}_${email}`, JSON.stringify(data));
  } catch {}
}

interface InvestmentAgreementSectionProps {
  userEmail: string;
  userName: string;
}

export function InvestmentAgreementSection({ userEmail, userName }: InvestmentAgreementSectionProps) {
  const [step, setStep] = useState(1);
  const [agreed, setAgreed] = useState(false);
  const [bank, setBank] = useState({
    accountHolder: "",
    bankName: "",
    iban: "",
    swift: "",
  });
  const [shortlist, setShortlist] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [complete, setComplete] = useState(!!loadAgreement(userEmail));

  const currentStep = AGREEMENT_STEPS[step - 1];
  const totalSteps = AGREEMENT_STEPS.length;

  const toggleProperty = (id: string) => {
    setShortlist((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const canProceed =
    step === 1
      ? agreed
      : step === 2
      ? bank.accountHolder && bank.bankName && bank.iban
      : step === 3
      ? shortlist.length > 0
      : true;

  const handleNext = useCallback(async () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      setIsSubmitting(true);
      try {
        const res = await fetch("/api/agreement", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: userEmail,
            agreed,
            bank,
            shortlist,
          }),
        });
        if (!res.ok) throw new Error("Failed to submit");
        saveAgreement(userEmail, { agreed, bank, shortlist });
        setComplete(true);
      } catch {
        setIsSubmitting(false);
      } finally {
        setIsSubmitting(false);
      }
    }
  }, [step, totalSteps, userEmail, agreed, bank, shortlist]);

  const handleBack = () => step > 1 && setStep(step - 1);

  if (complete) {
    return (
      <div className="rounded-2xl border border-[var(--accent)]/20 bg-white p-6 shadow-soft sm:p-8">
        <div className="flex items-start gap-4">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[var(--success)]/20 text-2xl">
            ✅
          </span>
          <div>
            <h2 className="text-xl font-bold text-[var(--charcoal)]">Investment agreement complete</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">
              You&apos;re ready to invest. Browse properties and start your journey.
            </p>
            <Link
              href="/investment"
              className="mt-4 inline-block rounded-xl bg-[var(--accent)] px-6 py-3 font-semibold text-white shadow-colored hover:opacity-90"
            >
              Explore opportunities →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[var(--accent)]/20 bg-white shadow-soft overflow-hidden">
      <div className="border-b border-[var(--accent)]/10 bg-[var(--cream)]/30 px-4 py-6 sm:px-6">
        <h2 className="text-xl font-bold text-[var(--charcoal)]">Investment agreement & funding</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Step {step} of {totalSteps}. Required before you can invest.
        </p>
        <div className="mt-4 flex gap-2">
          {AGREEMENT_STEPS.map((s, i) => {
            const idx = i + 1;
            const isActive = step === idx;
            const isPast = step > idx;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setStep(idx)}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-all sm:text-sm ${
                  isActive
                    ? "bg-[var(--accent)] text-white"
                    : isPast
                    ? "bg-[var(--success)]/20 text-[var(--success)]"
                    : "bg-white/80 text-[var(--muted)]"
                }`}
              >
                <span>{s.icon}</span>
                <span className="hidden sm:inline">{s.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-6 sm:p-8">
        {step === 1 && (
          <div className="space-y-6">
            <div className="rounded-xl border border-[var(--accent)]/10 bg-[var(--cream)]/30 p-6">
              <h3 className="font-bold text-[var(--charcoal)]">Investor terms & conditions</h3>
              <div className="mt-4 max-h-48 overflow-y-auto text-sm text-[var(--muted)] space-y-3">
                <p>
                  By signing this agreement, you confirm that you are an accredited or qualified investor and understand the risks associated with real estate investment.
                </p>
                <p>
                  You agree to provide accurate information, comply with applicable regulations, and acknowledge that past performance does not guarantee future returns.
                </p>
                <p>
                  DarGlobal Prestige will use your bank details solely for distribution payments and will handle your data in accordance with our privacy policy.
                </p>
              </div>
            </div>
            <label className="flex cursor-pointer items-start gap-3 rounded-xl border-2 border-[var(--accent)]/20 p-4 transition-all has-[:checked]:border-[var(--accent)] has-[:checked]:bg-[var(--accent-light)]/20">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1 h-5 w-5 rounded border-[var(--accent)]/50 text-[var(--accent)]"
              />
              <span className="text-sm text-[var(--charcoal)]">
                I, {userName}, have read and accept the investor terms and conditions.
              </span>
            </label>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <p className="text-sm text-[var(--muted)]">
              Provide bank details for receiving distribution payments. All fields are required.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-[var(--charcoal)]">Account holder</label>
                <input
                  type="text"
                  value={bank.accountHolder}
                  onChange={(e) => setBank((b) => ({ ...b, accountHolder: e.target.value }))}
                  placeholder="Full name as on account"
                  className="mt-1 w-full rounded-xl border border-[var(--accent)]/20 px-4 py-3 text-[var(--charcoal)] placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--charcoal)]">Bank name</label>
                <input
                  type="text"
                  value={bank.bankName}
                  onChange={(e) => setBank((b) => ({ ...b, bankName: e.target.value }))}
                  placeholder="Name of bank"
                  className="mt-1 w-full rounded-xl border border-[var(--accent)]/20 px-4 py-3 text-[var(--charcoal)] placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:outline-none"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-[var(--charcoal)]">IBAN</label>
                <input
                  type="text"
                  value={bank.iban}
                  onChange={(e) => setBank((b) => ({ ...b, iban: e.target.value.toUpperCase() }))}
                  placeholder="e.g. GB82WEST12345698765432"
                  className="mt-1 w-full rounded-xl border border-[var(--accent)]/20 px-4 py-3 text-[var(--charcoal)] placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--charcoal)]">SWIFT / BIC (optional)</label>
                <input
                  type="text"
                  value={bank.swift}
                  onChange={(e) => setBank((b) => ({ ...b, swift: e.target.value.toUpperCase() }))}
                  placeholder="e.g. DEUTDEFF"
                  className="mt-1 w-full rounded-xl border border-[var(--accent)]/20 px-4 py-3 text-[var(--charcoal)] placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <p className="text-sm text-[var(--muted)]">
              Select properties you&apos;re interested in. We&apos;ll prioritise these when new opportunities arise.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {PROPERTIES.map((p) => {
                const selected = shortlist.includes(p.id);
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => toggleProperty(p.id)}
                    className={`flex items-start gap-4 rounded-xl border-2 p-4 text-left transition-all ${
                      selected
                        ? "border-[var(--accent)] bg-[var(--accent-light)]/20"
                        : "border-[var(--accent)]/10 hover:border-[var(--accent)]/30"
                    }`}
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--accent)]/10 text-lg">
                      {selected ? "✓" : "○"}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-[var(--charcoal)]">{p.name}</p>
                      <p className="text-xs text-[var(--muted)]">{p.tagline}</p>
                      <p className="mt-1 text-sm font-medium text-[var(--accent)]">
                        {p.priceLabel} {p.currency} {(p.price / 1000).toFixed(0)}K
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <div className="rounded-xl border border-[var(--accent)]/10 bg-[var(--cream)]/30 p-6">
              <h3 className="font-bold text-[var(--charcoal)]">Summary</h3>
              <ul className="mt-4 space-y-2 text-sm text-[var(--muted)]">
                <li>✓ Investor agreement accepted</li>
                <li>✓ Bank details provided</li>
                <li>✓ {shortlist.length} propert{shortlist.length === 1 ? "y" : "ies"} shortlisted</li>
              </ul>
            </div>
            <p className="text-sm text-[var(--muted)]">
              Click below to submit. You&apos;ll then be ready to invest.
            </p>
          </div>
        )}

        <div className="mt-8 flex items-center justify-between">
          <button
            type="button"
            onClick={handleBack}
            disabled={step === 1}
            className="rounded-xl border border-[var(--accent)]/30 px-6 py-3 font-medium text-[var(--charcoal)] transition-colors hover:bg-[var(--accent-light)]/20 disabled:opacity-40"
          >
            Back
          </button>
          <button
            type="button"
            onClick={handleNext}
            disabled={!canProceed || isSubmitting}
            className="rounded-xl bg-[var(--accent)] px-8 py-3 font-semibold text-white shadow-colored hover:opacity-90 disabled:opacity-50"
          >
            {isSubmitting ? "Submitting…" : step < totalSteps ? "Next" : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}
