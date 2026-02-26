"use client";

import { useState, useEffect, Suspense, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { BlobBackground } from "@/components/BlobBackground";
import { useAuth } from "@/contexts/AuthContext";
import { CITIES, PROPERTIES, getCityStats } from "@/lib/data";
import { CountUp } from "@/components/CountUp";
import { InvestmentPreferencesStep, canProceedStep3, type InvestmentPrefs } from "@/components/InvestmentPreferencesStep";

type Path = "" | "full" | "fractional";

function OptionCard({
  selected,
  onClick,
  icon,
  title,
  desc,
}: {
  selected: boolean;
  onClick: () => void;
  icon: string;
  title: string;
  desc: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative flex flex-col items-start rounded-2xl border-2 p-6 text-left transition-all duration-300 ${
        selected
          ? "border-[var(--accent)] bg-[var(--accent-light)]/30 shadow-colored"
          : "border-[var(--accent)]/10 bg-white hover:border-[var(--accent)]/30 hover:shadow-soft"
      }`}
    >
      {selected && (
        <span className="absolute top-4 right-4 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--accent)] text-white">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </span>
      )}
      <span className="text-3xl">{icon}</span>
      <h3 className="mt-4 font-bold text-[var(--charcoal)]">{title}</h3>
      <p className="mt-2 text-sm text-[var(--muted)]">{desc}</p>
    </button>
  );
}

function ApplyForm() {
  const searchParams = useSearchParams();
  const pathParam = searchParams.get("path");
  const propertyParam = searchParams.get("property");
  const { setUserFromApply } = useAuth();

  const [step, setStep] = useState(1);
  const [showConfirm, setShowConfirm] = useState(false);
  const [form, setForm] = useState({
    path: (pathParam === "fractional" ? "fractional" : pathParam === "full" ? "full" : "") as Path,
    properties: [] as string[],
    cities: [] as string[],
    budgetRange: "€250K – €1.5M",
    shareRange: 15,
    investmentGoals: [] as string[],
    timeline: "",
    propertyTypes: [] as string[],
    riskTolerance: "",
    budgetMin: 250,
    budgetMax: 1500,
    fullName: "",
    email: "",
    phone: "",
    country: "",
    password: "",
    confirmPassword: "",
  });

  const totalSteps = 4;
  useEffect(() => {
    const prop = searchParams.get("property");
    if (prop) {
      setForm((f) => (f.properties.includes(prop) ? f : { ...f, properties: [...f.properties, prop] }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [showConfetti, setShowConfetti] = useState(false);

  const handleNext = () => {
    if (step === 3) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 800);
    }
    if (step < totalSteps) setStep(step + 1);
  };
  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < totalSteps) {
      handleNext();
      return;
    }
    if (form.password !== form.confirmPassword || form.password.length < 8) return;
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName,
          email: form.email,
          phone: form.phone,
          country: form.country,
          password: form.password,
          path: form.path,
          properties: form.properties,
          cities: form.cities,
          budgetRange: form.budgetRange,
          shareRange: form.shareRange,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Could not submit application");
      }
      setUserFromApply(form.fullName, form.email);
      setShowConfirm(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleProperty = (slug: string) => {
    setForm((f) => ({
      ...f,
      properties: f.properties.includes(slug) ? f.properties.filter((p) => p !== slug) : [...f.properties, slug],
    }));
  };
  const toggleCity = (id: string) => {
    setForm((f) => ({
      ...f,
      cities: f.cities.includes(id) ? f.cities.filter((c) => c !== id) : [...f.cities, id],
    }));
  };

  const prefs: InvestmentPrefs = {
    investmentGoals: form.investmentGoals,
    timeline: form.timeline,
    propertyTypes: form.propertyTypes,
    riskTolerance: form.riskTolerance,
    budgetMin: form.budgetMin,
    budgetMax: form.budgetMax,
    budgetRange: form.budgetRange,
    shareRange: form.shareRange,
  };

  const updatePrefs = useCallback(
    (p: InvestmentPrefs) => {
      setForm((f) => ({
        ...f,
        investmentGoals: p.investmentGoals,
        timeline: p.timeline,
        propertyTypes: p.propertyTypes,
        riskTolerance: p.riskTolerance,
        budgetMin: p.budgetMin,
        budgetMax: p.budgetMax,
        budgetRange: p.budgetRange,
        shareRange: p.shareRange,
      }));
    },
    []
  );

  const canProceed =
    (step === 1 && form.path) ||
    (step === 2) ||
    (step === 3 && form.path && canProceedStep3(form.path, prefs)) ||
    (step === 4 && form.fullName && form.email && form.password === form.confirmPassword && form.password.length >= 8);

  if (showConfirm) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-[var(--charcoal)]/50 backdrop-blur-sm" aria-hidden />
        <div className="relative animate-modal-in rounded-3xl border-2 border-[var(--success)]/30 bg-white p-8 shadow-soft max-w-md w-full">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--success-light)]">
            <svg className="h-9 w-9 text-[var(--success)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="mt-6 text-2xl font-bold text-[var(--charcoal)] text-center">Application Received</h1>
          <p className="mt-2 text-[var(--muted)] text-center">We&apos;ll review and contact you shortly. Complete KYC in your dashboard.</p>
          <div className="mt-6 flex flex-col gap-3">
            <Link href="/dashboard" className="flex w-full items-center justify-center rounded-xl bg-[var(--accent)] px-6 py-3.5 font-semibold text-white shadow-colored hover:opacity-90">
              Go to Dashboard
            </Link>
            <Link href="/login" className="text-center text-sm text-[var(--muted)] hover:text-[var(--accent)]">
              Already have an account?
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <BlobBackground className="opacity-20" />
      <div className="relative rounded-2xl border border-[var(--accent)]/10 bg-white p-6 shadow-soft sm:p-8">
        <h1 className="text-2xl font-bold text-[var(--charcoal)]">Investment Application</h1>
        <p className="mt-1 text-[var(--muted)]">4 steps to start your journey</p>
        <div className="mt-8 flex gap-2">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`h-2 flex-1 rounded-full transition-colors ${step >= i + 1 ? "bg-[var(--accent)]" : "bg-[var(--cream)]"}`}
              aria-hidden
            />
          ))}
        </div>

        <form onSubmit={handleSubmit} className="mt-8">
          {step === 1 && (
            <div className="animate-slide-in space-y-6">
              <p className="text-sm font-medium text-[var(--muted)]">Choose your investment path</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <OptionCard
                  selected={form.path === "full"}
                  onClick={() => setForm({ ...form, path: "full" })}
                  icon="🏠"
                  title="Full Ownership"
                  desc="Own outright. Full control. Ideal for primary or second homes."
                />
                <OptionCard
                  selected={form.path === "fractional"}
                  onClick={() => setForm({ ...form, path: "fractional" })}
                  icon="📊"
                  title="Fractional"
                  desc="Own a share. Lower entry. Diversify across multiple properties."
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-slide-in space-y-6">
              <p className="text-sm font-medium text-[var(--muted)]">Where are you interested?</p>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-[var(--charcoal)]">Cities</h4>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    {CITIES.map((c) => {
                      const stats = getCityStats(c.id);
                      const portfolioM = stats.portfolioValue / 1_000_000;
                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => toggleCity(c.id)}
                          className={`rounded-xl border-2 p-4 text-left transition-all ${
                            form.cities.includes(c.id)
                              ? "border-[var(--accent)] bg-[var(--accent-light)]/30 shadow-soft"
                              : "border-[var(--accent)]/10 hover:border-[var(--accent)]/30 bg-white"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xl">{c.flag}</span>
                            <span className="font-bold text-[var(--charcoal)]">{c.name}</span>
                            {form.cities.includes(c.id) && (
                              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--accent)] text-white">
                                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                </svg>
                              </span>
                            )}
                          </div>
                          <div className="mt-3 flex flex-wrap gap-3 text-xs">
                            <span className="text-[var(--muted)]">
                              <span className="font-semibold text-[var(--accent)]"><CountUp end={stats.propertyCount} duration={1000} /></span> properties
                            </span>
                            {stats.portfolioValue > 0 && (
                              <span className="text-[var(--muted)]">
                                <span className="font-semibold text-[var(--accent)]"><CountUp end={portfolioM} duration={1200} decimals={1} prefix="$" suffix="M" /></span> portfolio
                              </span>
                            )}
                            {stats.avgYield > 0 && (
                              <span className="text-[var(--muted)]">
                                <span className="font-semibold text-[var(--accent)]"><CountUp end={stats.avgYield} duration={1100} decimals={1} suffix="%" /></span> avg yield
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-[var(--charcoal)]">Properties (optional)</h4>
                  <p className="text-xs text-[var(--muted)]">Select specific properties of interest</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {PROPERTIES.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => toggleProperty(p.slug)}
                        className={`rounded-xl border-2 px-3 py-2 text-sm font-medium transition-all ${
                          form.properties.includes(p.slug)
                            ? "border-[var(--accent)] bg-[var(--accent-light)]/30"
                            : "border-[var(--accent)]/10 hover:border-[var(--accent)]/30"
                        }`}
                      >
                        {p.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && !form.path && (
            <p className="text-[var(--muted)]">Please go back and select your investment path first.</p>
          )}
          {step === 3 && form.path && (
            <InvestmentPreferencesStep
              path={form.path}
              prefs={prefs}
              onChange={(p) => {
                setForm((f) => ({
                  ...f,
                  investmentGoals: p.investmentGoals,
                  timeline: p.timeline,
                  propertyTypes: p.propertyTypes,
                  riskTolerance: p.riskTolerance,
                  budgetMin: p.budgetMin,
                  budgetMax: p.budgetMax,
                  budgetRange: p.budgetRange,
                  shareRange: p.shareRange,
                }));
              }}
            />
          )}

          {step === 4 && (
            <div className="animate-slide-in space-y-6">
              <p className="text-sm font-medium text-[var(--muted)]">Account & verification</p>
              <div className="rounded-xl border-2 border-[var(--accent)]/20 bg-[var(--accent-light)]/20 p-5">
                <h3 className="font-bold text-[var(--charcoal)]">KYC & Documents</h3>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  After submission, you&apos;ll upload: passport, proof of address, tax ID. We&apos;ll guide you through each step in your dashboard.
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--charcoal)]">Full name</label>
                <input type="text" required value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} className="mt-2 block w-full rounded-xl border border-[var(--accent)]/20 px-4 py-3 focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--charcoal)]">Email</label>
                <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-2 block w-full rounded-xl border border-[var(--accent)]/20 px-4 py-3 focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--charcoal)]">Phone</label>
                <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="mt-2 block w-full rounded-xl border border-[var(--accent)]/20 px-4 py-3 focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--charcoal)]">Country</label>
                <input type="text" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} placeholder="e.g. UAE, UK" className="mt-2 block w-full rounded-xl border border-[var(--accent)]/20 px-4 py-3 focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--charcoal)]">Password</label>
                <input type="password" required minLength={8} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Min 8 characters" className="mt-2 block w-full rounded-xl border border-[var(--accent)]/20 px-4 py-3 focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--charcoal)]">Confirm password</label>
                <input type="password" required minLength={8} value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} className={`mt-2 block w-full rounded-xl border px-4 py-3 focus:outline-none focus:ring-1 ${form.confirmPassword && form.password !== form.confirmPassword ? "border-red-400 focus:ring-red-500" : "border-[var(--accent)]/20 focus:border-[var(--accent)] focus:ring-[var(--accent)]"}`} />
              </div>
              {form.confirmPassword && form.password !== form.confirmPassword && <p className="text-sm text-red-600">Passwords don&apos;t match</p>}
              {submitError && <p className="text-sm text-red-600">{submitError}</p>}
            </div>
          )}

          <div className="mt-8 flex gap-4">
            {step > 1 && (
              <button type="button" onClick={handleBack} className="rounded-xl border border-[var(--accent)]/30 px-6 py-2.5 font-medium text-[var(--charcoal)] hover:bg-[var(--cream)] transition-colors">
                Back
              </button>
            )}
            <button
              type="submit"
              disabled={!canProceed || isSubmitting}
              className="rounded-xl bg-[var(--accent)] px-6 py-2.5 font-semibold text-white shadow-colored hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            >
              {isSubmitting ? "..." : step < totalSteps ? "Continue" : "Submit"}
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-[var(--muted)]">
          <Link href="/login" className="text-[var(--accent)] hover:underline">Already have an account?</Link>
        </p>
      </div>
    </div>
  );
}

export default function ApplyPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-xl px-4 py-20 text-center text-[var(--muted)]">Loading...</div>}>
      <ApplyForm />
    </Suspense>
  );
}
