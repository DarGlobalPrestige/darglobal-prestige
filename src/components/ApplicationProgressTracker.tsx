"use client";

import { useState, useEffect, useRef } from "react";
import { getProgress, type ProgressData } from "@/lib/progress";

interface ApplicationProgressTrackerProps {
  userEmail: string;
  onMilestoneClick?: (id: string) => void;
}

function AnimatedPercent({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);
  const prevRef = useRef(0);

  useEffect(() => {
    const start = prevRef.current;
    const end = value;
    prevRef.current = end;
    const duration = 800;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 2.5);
      setDisplay(Math.round(start + (end - start) * eased));

      if (progress < 1) requestAnimationFrame(tick);
      else setDisplay(end);
    };

    requestAnimationFrame(tick);
  }, [value]);

  return <span>{display}</span>;
}

export function ApplicationProgressTracker({ userEmail, onMilestoneClick }: ApplicationProgressTrackerProps) {
  const [data, setData] = useState<ProgressData | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !userEmail) return;
    const update = () => setData(getProgress(userEmail));
    update();
    const id = setInterval(update, 400);
    return () => clearInterval(id);
  }, [mounted, userEmail]);

  if (!data) return null;

  const { percent, milestones, currentStep, nextAction } = data;
  const isComplete = percent >= 100;

  return (
    <div
      className="relative overflow-hidden rounded-2xl border-2 border-[var(--accent)]/20 bg-gradient-to-br from-white via-[var(--cream)]/50 to-[var(--accent-light)]/20 p-6 shadow-soft transition-all duration-500 sm:p-8"
      style={{ animation: "fadeInUp 0.6s ease-out" }}
    >
      {/* Decorative gradient orbs */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-[var(--accent)]/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-[var(--accent)]/5 blur-2xl" />

      <div className="relative">
        {/* Header with percentage */}
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-bold text-[var(--charcoal)] sm:text-2xl">
              Your journey to invest
            </h2>
            <p className="mt-1 text-sm text-[var(--muted)]">
              {isComplete ? "You're ready to invest." : currentStep}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative flex h-20 w-20 items-center justify-center sm:h-24 sm:w-24">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-[var(--accent)]/15"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeLinecap="round"
                  className="text-[var(--accent)]"
                  strokeDasharray={`${percent * 2.64} 264`}
                  style={{
                    filter: "drop-shadow(0 0 8px var(--accent-shadow))",
                    transition: "stroke-dasharray 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                />
              </svg>
              <span className="absolute text-2xl font-bold text-[var(--charcoal)] sm:text-3xl">
                <AnimatedPercent value={percent} />%
              </span>
            </div>
          </div>
        </div>

        {/* Animated progress bar */}
        <div className="mt-6">
          <div className="h-2 overflow-hidden rounded-full bg-[var(--accent)]/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent)]/80 transition-all duration-700 ease-out"
              style={{
                width: `${percent}%`,
                boxShadow: "0 0 20px var(--accent-shadow)",
              }}
            />
          </div>
        </div>

        {/* Milestones - interactive */}
        <div className="mt-8 flex flex-wrap justify-between gap-4">
          {milestones.map((m, i) => (
            <button
              key={m.id}
              type="button"
              onClick={() => onMilestoneClick?.(m.id)}
              style={{ animationDelay: `${i * 60}ms` }}
              className={`group flex flex-col items-center gap-2 rounded-xl px-4 py-3 transition-all duration-300 sm:flex-1 animate-fade-in-up ${
                m.done
                  ? "bg-[var(--success)]/15 text-[var(--success)]"
                  : m.inProgress
                  ? "bg-[var(--accent)]/15 text-[var(--accent)] ring-2 ring-[var(--accent)]/30"
                  : "bg-white/60 text-[var(--muted)] hover:bg-[var(--accent-light)]/20"
              }`}
            >
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-full text-lg transition-transform group-hover:scale-110 ${
                  m.done
                    ? "bg-[var(--success)] text-white"
                    : m.inProgress
                    ? "bg-[var(--accent)] text-white animate-pulse"
                    : "bg-[var(--accent)]/10"
                }`}
              >
                {m.done ? (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  m.icon
                )}
              </span>
              <span className="text-xs font-medium sm:text-sm">{m.label}</span>
            </button>
          ))}
        </div>

        {/* Next action CTA */}
        {!isComplete && (
          <div className="mt-6 flex items-center gap-3 rounded-xl border border-[var(--accent)]/20 bg-white/80 px-4 py-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--accent)]/20 text-sm">
              →
            </span>
            <p className="text-sm text-[var(--charcoal)]">
              <span className="font-medium">Next:</span> {nextAction}
            </p>
          </div>
        )}

        {isComplete && (
          <div className="mt-6 flex items-center gap-3 rounded-xl border-2 border-[var(--success)]/30 bg-[var(--success-light)]/30 px-4 py-3">
            <span className="text-2xl">🎉</span>
            <p className="text-sm font-medium text-[var(--charcoal)]">
              All steps complete. You&apos;re ready to explore opportunities.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
