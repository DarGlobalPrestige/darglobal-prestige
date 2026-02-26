"use client";

import { useState, useCallback } from "react";
import { FileUploadZone, type UploadedFile } from "./FileUploadZone";

const DOC_STEPS = [
  {
    id: "passport",
    title: "Identity document",
    desc: "Passport or government-issued ID. Upload both sides if applicable.",
    hint: "Clear, readable copy. No glare or cropping.",
    icon: "🛂",
  },
  {
    id: "address",
    title: "Proof of address",
    desc: "Utility bill, bank statement, or official letter dated within 3 months.",
    hint: "Must show your name and full address.",
    icon: "📍",
  },
  {
    id: "tax",
    title: "Tax ID / Certificate",
    desc: "Tax identification number or certificate of tax residence.",
    hint: "Required for compliance and reporting.",
    icon: "📋",
  },
  {
    id: "source",
    title: "Source of funds",
    desc: "Bank statement or letter from your bank confirming account ownership. Last 3 months.",
    hint: "Helps us verify the origin of your investment funds.",
    icon: "🏦",
  },
] as const;

export type DocStepId = (typeof DOC_STEPS)[number]["id"];

export interface DocFiles {
  passport: UploadedFile | null;
  address: UploadedFile | null;
  tax: UploadedFile | null;
  source: UploadedFile | null;
}

const STORAGE_KEY = "darglobal_doc_status";
const SUBMITTED_KEY = "darglobal_docs_submitted";

function loadStatus(email: string): Record<DocStepId, "pending" | "uploaded"> {
  if (typeof window === "undefined") {
    return { passport: "pending", address: "pending", tax: "pending", source: "pending" };
  }
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY}_${email}`);
    if (raw) {
      const parsed = JSON.parse(raw) as Record<DocStepId, "pending" | "uploaded">;
      const defaults: Record<DocStepId, "pending" | "uploaded"> = {
        passport: "pending",
        address: "pending",
        tax: "pending",
        source: "pending",
      };
      return { ...defaults, ...parsed };
    }
  } catch {}
  return { passport: "pending", address: "pending", tax: "pending", source: "pending" };
}

function saveStatus(email: string, status: Record<DocStepId, "pending" | "uploaded">) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(`${STORAGE_KEY}_${email}`, JSON.stringify(status));
  } catch {}
}

interface DocumentationStepsProps {
  userEmail: string;
  onComplete?: () => void;
}

export function DocumentationSteps({ userEmail, onComplete }: DocumentationStepsProps) {
  const [step, setStep] = useState(1);
  const [docs, setDocs] = useState<DocFiles>({
    passport: null,
    address: null,
    tax: null,
    source: null,
  });
  const [status, setStatus] = useState<Record<DocStepId, "pending" | "uploaded">>(() =>
    loadStatus(userEmail)
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const currentStep = DOC_STEPS[step - 1];
  const totalSteps = DOC_STEPS.length;

  const updateDoc = useCallback((key: DocStepId, file: UploadedFile | null) => {
    setDocs((d) => ({ ...d, [key]: file }));
  }, []);

  const handleSubmitAll = useCallback(async () => {
    setIsSubmitting(true);
    setSubmitSuccess(false);
    setSubmitError(null);
    try {
      const formData = new FormData();
      if (docs.passport?.file) formData.append("passport", docs.passport.file);
      if (docs.address?.file) formData.append("address", docs.address.file);
      if (docs.tax?.file) formData.append("tax", docs.tax.file);
      if (docs.source?.file) formData.append("source", docs.source.file);
      formData.append("email", userEmail);

      const res = await fetch("/api/kyc/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Upload failed");
      }
      setSubmitSuccess(true);
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(`${SUBMITTED_KEY}_${userEmail}`, "true");
        } catch {}
      }
      onComplete?.();
    } catch (err) {
      console.error(err);
      setSubmitSuccess(false);
      setSubmitError(err instanceof Error ? err.message : "Upload failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }, [docs.passport, docs.address, docs.tax, docs.source, userEmail, onComplete]);

  const handleNext = useCallback(() => {
    const key = currentStep.id;
    const hasFile = docs[key] !== null;
    if (hasFile) {
      const nextStatus = { ...status, [key]: "uploaded" as const };
      setStatus(nextStatus);
      saveStatus(userEmail, nextStatus);
    }
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleSubmitAll();
    }
  }, [step, totalSteps, currentStep.id, docs, status, userEmail, handleSubmitAll]);

  const handleBack = useCallback(() => {
    if (step > 1) setStep(step - 1);
  }, [step]);

  const hasCurrentDoc = docs[currentStep.id] !== null;
  const allDocsReady =
    docs.passport && docs.address && docs.tax && docs.source;
  const canProceed = step < totalSteps ? hasCurrentDoc : allDocsReady;

  return (
    <div>
      <div className="mb-6">
        <h3 className="font-bold text-[var(--charcoal)]">Documentation</h3>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Step {step} of {totalSteps}. Upload required documents for compliance.
        </p>
      </div>

      {/* Step progress */}
      <div className="mb-6 flex items-center gap-1">
        {DOC_STEPS.map((s, i) => {
          const idx = i + 1;
          const isActive = step === idx;
          const isDone = status[s.id] === "uploaded";
          return (
            <div key={s.id} className="flex flex-1 items-center">
              <button
                type="button"
                onClick={() => setStep(idx)}
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-[var(--accent)] text-white shadow-colored"
                    : isDone
                    ? "bg-[var(--success)] text-white"
                    : "bg-[var(--accent)]/10 text-[var(--muted)]"
                }`}
              >
                {isDone && !isActive ? (
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  idx
                )}
              </button>
              {i < DOC_STEPS.length - 1 && (
                <div
                  className={`mx-0.5 h-0.5 flex-1 rounded ${
                    isDone ? "bg-[var(--success)]" : "bg-[var(--accent)]/20"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Step labels */}
      <div className="mb-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {DOC_STEPS.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setStep(i + 1)}
            className={`rounded-lg py-2 text-xs font-medium transition-colors sm:text-sm ${
              step === i + 1
                ? "bg-[var(--accent-light)]/40 text-[var(--charcoal)]"
                : "text-[var(--muted)] hover:bg-[var(--accent-light)]/20"
            }`}
          >
            {s.title}
          </button>
        ))}
      </div>

      {submitSuccess ? (
        <div className="rounded-xl border-2 border-[var(--success)] bg-[var(--success-light)]/50 p-8 text-center">
          <span className="text-5xl">✅</span>
          <h3 className="mt-4 text-lg font-bold text-[var(--charcoal)]">Documents submitted</h3>
          <p className="mt-2 text-sm text-[var(--muted)]">
            We&apos;ll review your documents and notify you once verification is complete.
          </p>
        </div>
      ) : (
        <>
          <div className="rounded-xl border border-[var(--accent)]/10 bg-[var(--cream)]/50 p-6">
            <div className="flex items-start gap-4">
              <span className="text-4xl">{currentStep.icon}</span>
              <div className="min-w-0 flex-1">
                <h4 className="font-bold text-[var(--charcoal)]">{currentStep.title}</h4>
                <p className="mt-2 text-sm text-[var(--muted)]">{currentStep.desc}</p>
              </div>
            </div>
            <div className="mt-6">
              <FileUploadZone
                label="Upload document"
                hint={currentStep.hint}
                value={docs[currentStep.id]}
                onFileSelect={(f) => updateDoc(currentStep.id, f)}
                disabled={isSubmitting}
              />
            </div>
          </div>

          {submitError && (
            <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{submitError}</p>
          )}

          <div className="mt-8 flex items-center justify-between">
            <button
              type="button"
              onClick={handleBack}
              disabled={step === 1}
              className="rounded-xl border border-[var(--accent)]/30 px-6 py-3 font-medium text-[var(--charcoal)] transition-colors hover:bg-[var(--accent-light)]/20 disabled:opacity-40 disabled:hover:bg-transparent"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={!canProceed || isSubmitting}
              className="rounded-xl bg-[var(--accent)] px-8 py-3 font-semibold text-white shadow-colored transition-all hover:opacity-90 disabled:opacity-50 disabled:shadow-none"
            >
              {isSubmitting
                ? "Submitting…"
                : step < totalSteps
                ? "Next step"
                : "Submit all documents"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
