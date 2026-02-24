"use client";

import { useCallback } from "react";
import { Tooltip } from "./Tooltip";

const INVESTMENT_GOALS = [
  { id: "primary", icon: "🏠", label: "Primary residence", tip: "Your main home. We'll focus on livability and location." },
  { id: "secondary", icon: "🌴", label: "Second home", tip: "Holiday or weekend retreat. Yield may be secondary to lifestyle." },
  { id: "rental", icon: "📈", label: "Rental yield", tip: "Maximise income. We'll prioritise high-yield markets and property types." },
  { id: "capital", icon: "📊", label: "Capital appreciation", tip: "Long-term growth. Emerging markets and development potential." },
  { id: "diversify", icon: "🌍", label: "Portfolio diversification", tip: "Spread risk across regions and asset classes." },
] as const;

const TIMELINES = [
  { id: "1-3", label: "1–3 years", tip: "Short-term" },
  { id: "3-5", label: "3–5 years", tip: "Medium-term" },
  { id: "5+", label: "5+ years", tip: "Long-term hold" },
] as const;

const PROPERTY_TYPES = [
  { id: "villa", label: "Villa", icon: "🏡" },
  { id: "apartment", label: "Apartment", icon: "🏢" },
  { id: "penthouse", label: "Penthouse", icon: "🏙️" },
  { id: "land", label: "Land", icon: "🏞️" },
] as const;

const RISK_LEVELS = [
  { id: "conservative", label: "Conservative", desc: "Stable markets, proven yields", icon: "🛡️" },
  { id: "moderate", label: "Moderate", desc: "Mix of established & emerging", icon: "⚖️" },
  { id: "growth", label: "Growth", desc: "Higher potential, higher risk", icon: "🚀" },
] as const;

const BUDGET_STEPS = [100, 250, 500, 750, 1000, 1500, 2000, 3000, 5000];
const BUDGET_MIN = 100;
const BUDGET_MAX = 5000;

function formatBudget(k: number) {
  if (k >= 1000) return `€${(k / 1000).toFixed(1)}M`;
  return `€${k}K`;
}

export interface InvestmentPrefs {
  investmentGoals: string[];
  timeline: string;
  propertyTypes: string[];
  riskTolerance: string;
  budgetMin: number;
  budgetMax: number;
  budgetRange: string;
  shareRange: number;
}

interface Props {
  path: "full" | "fractional";
  prefs: InvestmentPrefs;
  onChange: (prefs: InvestmentPrefs) => void;
}

export function InvestmentPreferencesStep({ path, prefs, onChange }: Props) {

  const update = useCallback(
    (partial: Partial<InvestmentPrefs>) => {
      onChange({ ...prefs, ...partial });
    },
    [prefs, onChange]
  );

  const toggleGoal = (id: string) => {
    const next = prefs.investmentGoals.includes(id)
      ? prefs.investmentGoals.filter((g) => g !== id)
      : [...prefs.investmentGoals, id];
    update({ investmentGoals: next });
  };

  const togglePropertyType = (id: string) => {
    const next = prefs.propertyTypes.includes(id)
      ? prefs.propertyTypes.filter((p) => p !== id)
      : [...prefs.propertyTypes, id];
    update({ propertyTypes: next });
  };

  const budgetRangeStr = `${formatBudget(prefs.budgetMin)} – ${formatBudget(prefs.budgetMax)}`;
  const canProceed =
    prefs.investmentGoals.length > 0 &&
    prefs.timeline &&
    prefs.riskTolerance &&
    (path === "fractional" || prefs.budgetMin < prefs.budgetMax);

  return (
    <div className="animate-slide-in space-y-8">
      {/* Confetti */}
      {showConfetti &&
        Array.from({ length: 24 }).map((_, i) => (
          <div
            key={i}
            className="confetti-piece"
            style={{
              left: `${10 + Math.random() * 80}%`,
              background: ["#c9a227", "#1a1a1a", "#059669", "#e8d48b"][i % 4],
              borderRadius: i % 3 === 0 ? "50%" : "2px",
              animationDelay: `${i * 0.05}s`,
            }}
          />
        ))}

      <div className="rounded-xl border border-[var(--accent)]/20 bg-[var(--accent-light)]/10 p-4">
        <p className="text-sm font-medium text-[var(--charcoal)]">
          {path === "full" ? "🏠 Full ownership" : "📊 Fractional"} — Tell us your goals so we can match you with the right opportunities.
        </p>
      </div>

      {/* Investment goals */}
      <div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-semibold text-[var(--charcoal)]">Investment goals</label>
          <Tooltip content="Select all that apply. This helps us tailor property recommendations and financing options.">
            <button type="button" className="flex h-5 w-5 items-center justify-center rounded-full border border-[var(--accent)]/40 bg-[var(--accent-light)]/30 text-xs text-[var(--accent)] hover:bg-[var(--accent-light)]/50">
              ?
            </button>
          </Tooltip>
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {INVESTMENT_GOALS.map((g) => (
            <button
              key={g.id}
              type="button"
              onClick={() => toggleGoal(g.id)}
              className={`group flex items-start gap-3 rounded-xl border-2 p-4 text-left transition-all duration-300 ${
                prefs.investmentGoals.includes(g.id)
                  ? "border-[var(--accent)] bg-[var(--accent-light)]/30 shadow-colored animate-card-pop"
                  : "border-[var(--accent)]/10 bg-white hover:border-[var(--accent)]/30 hover:shadow-soft"
              }`}
            >
              <span className="text-2xl">{g.icon}</span>
              <div className="min-w-0 flex-1">
                <span className="font-medium text-[var(--charcoal)]">{g.label}</span>
                <p className="mt-0.5 text-xs text-[var(--muted)]">{g.tip}</p>
              </div>
              {prefs.investmentGoals.includes(g.id) && (
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-white">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Budget range */}
      <div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-semibold text-[var(--charcoal)]">Budget range</label>
          <Tooltip content="Your total investment capacity. We'll only show properties within this range.">
            <button type="button" className="flex h-5 w-5 items-center justify-center rounded-full border border-[var(--accent)]/40 bg-[var(--accent-light)]/30 text-xs text-[var(--accent)] hover:bg-[var(--accent-light)]/50">
              ?
            </button>
          </Tooltip>
        </div>
        <div className="mt-3 space-y-4">
          <div className="rounded-xl border border-[var(--accent)]/20 bg-white p-4">
            <p className="mb-3 text-center text-2xl font-bold text-[var(--accent)]">{budgetRangeStr}</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs text-[var(--muted)]">Min</label>
                <input
                  type="range"
                  min={BUDGET_MIN}
                  max={BUDGET_MAX}
                  step={50}
                  value={prefs.budgetMin}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    const newMin = Math.min(v, prefs.budgetMax - 100);
                    update({ budgetMin: newMin, budgetRange: `${formatBudget(newMin)} – ${formatBudget(prefs.budgetMax)}` });
                  }}
                  className="prestige-slider mt-1 w-full"
                />
                <p className="text-sm font-medium">{formatBudget(prefs.budgetMin)}</p>
              </div>
              <div>
                <label className="text-xs text-[var(--muted)]">Max</label>
                <input
                  type="range"
                  min={BUDGET_MIN}
                  max={BUDGET_MAX}
                  step={50}
                  value={prefs.budgetMax}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    const newMax = Math.max(v, prefs.budgetMin + 100);
                    update({ budgetMax: newMax, budgetRange: `${formatBudget(prefs.budgetMin)} – ${formatBudget(newMax)}` });
                  }}
                  className="prestige-slider mt-1 w-full"
                />
                <p className="text-sm font-medium">{formatBudget(prefs.budgetMax)}</p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {BUDGET_STEPS.map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => {
                  const newMin = Math.max(BUDGET_MIN, Math.min(k - 200, prefs.budgetMax - 200));
                  const newMax = Math.min(BUDGET_MAX, Math.max(k + 200, prefs.budgetMin + 200));
                  update({ budgetMin: newMin, budgetMax: newMax, budgetRange: `${formatBudget(newMin)} – ${formatBudget(newMax)}` });
                }}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                  prefs.budgetMin <= k && k <= prefs.budgetMax ? "bg-[var(--accent)]/20 text-[var(--accent)]" : "bg-[var(--cream)] text-[var(--muted)] hover:bg-[var(--accent)]/10"
                }`}
              >
                {formatBudget(k)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Fractional: share % */}
      {path === "fractional" && (
        <div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-semibold text-[var(--charcoal)]">Target share per property</label>
            <Tooltip content="What % of each property do you want to own? Higher share = more control, lower = more diversification.">
              <button type="button" className="flex h-5 w-5 items-center justify-center rounded-full border border-[var(--accent)]/40 bg-[var(--accent-light)]/30 text-xs text-[var(--accent)] hover:bg-[var(--accent-light)]/50">
                ?
              </button>
            </Tooltip>
          </div>
          <div className="mt-3 flex items-center gap-4">
            <input
              type="range"
              min={5}
              max={50}
              step={5}
              value={prefs.shareRange}
              onChange={(e) => update({ shareRange: Number(e.target.value) })}
              className="prestige-slider flex-1"
            />
            <span className="min-w-[4rem] rounded-lg bg-[var(--accent)]/20 px-4 py-2 text-center font-bold text-[var(--accent)]">{prefs.shareRange}%</span>
          </div>
        </div>
      )}

      {/* Timeline */}
      <div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-semibold text-[var(--charcoal)]">Investment timeline</label>
          <Tooltip content="How long do you plan to hold? Affects financing and property recommendations.">
            <button type="button" className="flex h-5 w-5 items-center justify-center rounded-full border border-[var(--accent)]/40 bg-[var(--accent-light)]/30 text-xs text-[var(--accent)] hover:bg-[var(--accent-light)]/50">
              ?
            </button>
          </Tooltip>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {TIMELINES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => update({ timeline: t.id })}
              className={`rounded-xl border-2 px-5 py-3 text-sm font-medium transition-all ${
                prefs.timeline === t.id ? "border-[var(--accent)] bg-[var(--accent-light)]/30" : "border-[var(--accent)]/10 hover:border-[var(--accent)]/30"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Property types */}
      <div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-semibold text-[var(--charcoal)]">Property types</label>
          <Tooltip content="Select the types you're interested in. You can change this later.">
            <button type="button" className="flex h-5 w-5 items-center justify-center rounded-full border border-[var(--accent)]/40 bg-[var(--accent-light)]/30 text-xs text-[var(--accent)] hover:bg-[var(--accent-light)]/50">
              ?
            </button>
          </Tooltip>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {PROPERTY_TYPES.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => togglePropertyType(p.id)}
              className={`flex items-center gap-2 rounded-xl border-2 px-4 py-2.5 text-sm font-medium transition-all ${
                prefs.propertyTypes.includes(p.id) ? "border-[var(--accent)] bg-[var(--accent-light)]/30" : "border-[var(--accent)]/10 hover:border-[var(--accent)]/30"
              }`}
            >
              <span>{p.icon}</span>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Risk tolerance */}
      <div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-semibold text-[var(--charcoal)]">Risk tolerance</label>
          <Tooltip content="Helps us balance yield potential with market stability in our recommendations.">
            <button type="button" className="flex h-5 w-5 items-center justify-center rounded-full border border-[var(--accent)]/40 bg-[var(--accent-light)]/30 text-xs text-[var(--accent)] hover:bg-[var(--accent-light)]/50">
              ?
            </button>
          </Tooltip>
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {RISK_LEVELS.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => update({ riskTolerance: r.id })}
              className={`flex flex-col items-center rounded-xl border-2 p-4 text-center transition-all duration-300 ${
                prefs.riskTolerance === r.id ? "border-[var(--accent)] bg-[var(--accent-light)]/30 shadow-colored" : "border-[var(--accent)]/10 hover:border-[var(--accent)]/30"
              }`}
            >
              <span className="text-2xl">{r.icon}</span>
              <span className="mt-2 font-medium text-[var(--charcoal)]">{r.label}</span>
              <span className="mt-1 text-xs text-[var(--muted)]">{r.desc}</span>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}

export function canProceedStep3(path: string, prefs: InvestmentPrefs): boolean {
  return (
    prefs.investmentGoals.length > 0 &&
    prefs.timeline !== "" &&
    prefs.riskTolerance !== "" &&
    (path === "fractional" || prefs.budgetMin < prefs.budgetMax)
  );
}
