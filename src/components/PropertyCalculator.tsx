"use client";

import { useState, useMemo } from "react";
import type { Property } from "@/lib/data";

const FIXED_RATE = 0.065; // 6.5%
const VARIABLE_RATE = 0.075; // 7.5%
const TAX_RATE = 0.025;
const COST_RATE = 0.015;

function pmt(rate: number, nper: number, pv: number): number {
  if (rate === 0) return pv / nper;
  return (pv * (rate * Math.pow(1 + rate, nper))) / (Math.pow(1 + rate, nper) - 1);
}

interface PropertyCalculatorProps {
  property: Property;
}

export function PropertyCalculator({ property }: PropertyCalculatorProps) {
  const priceMax = Math.min(property.price * 1.5, 10_000_000);
  const priceMin = property.fractionalPricePerSlot
    ? Math.floor(property.fractionalPricePerSlot * 0.5)
    : Math.floor(property.price * 0.5);

  const [mode, setMode] = useState<"full" | "fractional">(property.isFractional ? "fractional" : "full");
  const [price, setPrice] = useState(property.price);
  const [downPct, setDownPct] = useState(25);
  const [years, setYears] = useState(15);
  const [interestType, setInterestType] = useState<"fixed" | "variable">("fixed");
  const [sharePct, setSharePct] = useState(10);

  const rate = interestType === "fixed" ? FIXED_RATE : VARIABLE_RATE;
  const downPayment = Math.round((price * downPct) / 100);
  const loanAmount = price - downPayment;
  const monthlyRate = rate / 12;
  const numPayments = years * 12;
  const monthlyPayment = loanAmount > 0 ? pmt(monthlyRate, numPayments, loanAmount) : 0;
  const totalTax = Math.round(price * TAX_RATE);
  const totalCosts = Math.round(price * COST_RATE);
  const totalUpfront = downPayment + totalTax + totalCosts;

  const fractionalAmount = property.isFractional
    ? Math.round((property.price * sharePct) / 100)
    : 0;
  const estimatedAnnualIncome = property.estimatedYield
    ? Math.round((fractionalAmount * property.estimatedYield) / 100)
    : 0;

  const progress = useMemo(() => {
    const p1 = (price - priceMin) / (priceMax - priceMin);
    const p2 = (downPct - 15) / 85;
    const p3 = (years - 5) / 25;
    return Math.min(1, (p1 + p2 + p3) / 3);
  }, [price, downPct, years, priceMin, priceMax]);

  const fillPrice = ((price - priceMin) / (priceMax - priceMin)) * 100;
  const fillDown = ((downPct - 15) / 85) * 100;
  const fillYears = ((years - 5) / 25) * 100;

  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-[var(--accent)]/20 bg-white p-6 transition-all duration-500 lg:sticky lg:top-24"
      style={{
        boxShadow: `0 25px 50px -12px rgba(201, 162, 39, ${0.15 + progress * 0.25})`,
      }}
    >
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-20 transition-opacity duration-500"
        style={{
          background: "var(--accent)",
          filter: "blur(60px)",
          opacity: 0.15 + progress * 0.35,
        }}
      />

      <div className="relative">
        <h3 className="text-lg font-bold text-[var(--charcoal)]">Investment Calculator</h3>
        <p className="mt-1 text-sm text-[var(--muted)]">Self-serve preview • Live results</p>

        {property.isFractional && (
          <div className="mt-6 flex gap-2">
            <button
              type="button"
              onClick={() => setMode("full")}
              className={`flex-1 rounded-xl py-3 text-sm font-semibold transition-all ${
                mode === "full"
                  ? "bg-[var(--accent)] text-white shadow-soft"
                  : "bg-[var(--cream)] text-[var(--muted)] hover:bg-[var(--accent-light)]/30"
              }`}
            >
              Full Ownership
            </button>
            <button
              type="button"
              onClick={() => setMode("fractional")}
              className={`flex-1 rounded-xl py-3 text-sm font-semibold transition-all ${
                mode === "fractional"
                  ? "bg-[var(--accent)] text-white shadow-soft"
                  : "bg-[var(--cream)] text-[var(--muted)] hover:bg-[var(--accent-light)]/30"
              }`}
            >
              Fractional
            </button>
          </div>
        )}

        {mode === "full" ? (
          <>
            <div className="mt-8">
              <div className="flex justify-between text-sm">
                <span className="text-[var(--muted)]">Property value</span>
                <span className="font-bold text-[var(--accent)]">
                  {property.currency} {price.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min={priceMin}
                max={priceMax}
                step={priceMax / 100}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="prestige-slider mt-2 h-6 w-full cursor-grab appearance-none bg-transparent"
              />
            </div>

            <div className="mt-8">
              <div className="flex justify-between text-sm">
                <span className="text-[var(--muted)]">Down payment</span>
                <span className="font-bold text-[var(--accent)]">
                  {downPct}% = {property.currency} {downPayment.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min={15}
                max={100}
                value={downPct}
                onChange={(e) => setDownPct(Number(e.target.value))}
                className="prestige-slider mt-2 h-6 w-full cursor-grab appearance-none bg-transparent"
              />
            </div>

            <div className="mt-8">
              <div className="flex justify-between text-sm">
                <span className="text-[var(--muted)]">Loan term</span>
                <span className="font-bold text-[var(--accent)]">{years} years</span>
              </div>
              <input
                type="range"
                min={5}
                max={30}
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                className="prestige-slider mt-2 h-6 w-full cursor-grab appearance-none bg-transparent"
              />
            </div>

            <div className="mt-8">
              <p className="text-sm font-medium text-[var(--muted)]">Interest type</p>
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setInterestType("fixed")}
                  className={`flex-1 rounded-xl py-3 text-sm font-semibold transition-all ${
                    interestType === "fixed"
                      ? "bg-[var(--accent)] text-white"
                      : "bg-[var(--cream)] text-[var(--muted)] hover:bg-[var(--accent-light)]/30"
                  }`}
                >
                  Fixed ({(FIXED_RATE * 100).toFixed(1)}%)
                </button>
                <button
                  type="button"
                  onClick={() => setInterestType("variable")}
                  className={`flex-1 rounded-xl py-3 text-sm font-semibold transition-all ${
                    interestType === "variable"
                      ? "bg-[var(--accent)] text-white"
                      : "bg-[var(--cream)] text-[var(--muted)] hover:bg-[var(--accent-light)]/30"
                  }`}
                >
                  Variable ({(VARIABLE_RATE * 100).toFixed(1)}%)
                </button>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <div className="rounded-xl bg-[var(--cream)] p-4">
                <p className="text-xs font-medium text-[var(--muted)]">Loan amount</p>
                <p className="mt-1 text-xl font-bold text-[var(--charcoal)]">
                  {property.currency} {loanAmount.toLocaleString()}
                </p>
              </div>
              <div className="rounded-xl bg-[var(--accent-light)]/50 p-4">
                <p className="text-xs font-medium text-[var(--muted)]">Monthly payment</p>
                <p className="mt-1 text-2xl font-bold text-[var(--accent)]">
                  {property.currency} {Math.round(monthlyPayment).toLocaleString()}/mo
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-[var(--accent)]/10 p-3">
                  <p className="text-xs text-[var(--muted)]">Transfer tax</p>
                  <p className="font-bold">{property.currency} {totalTax.toLocaleString()}</p>
                </div>
                <div className="rounded-xl border border-[var(--accent)]/10 p-3">
                  <p className="text-xs text-[var(--muted)]">Fees</p>
                  <p className="font-bold">{property.currency} {totalCosts.toLocaleString()}</p>
                </div>
              </div>
              <div className="rounded-xl border-2 border-[var(--accent)]/30 bg-[var(--accent-light)]/20 p-4">
                <p className="text-xs font-medium text-[var(--muted)]">Total upfront</p>
                <p className="mt-1 text-lg font-bold text-[var(--accent)]">
                  {property.currency} {totalUpfront.toLocaleString()}
                </p>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="mt-8">
              <div className="flex justify-between text-sm">
                <span className="text-[var(--muted)]">Your share</span>
                <span className="font-bold text-[var(--accent)]">{sharePct}%</span>
              </div>
              <input
                type="range"
                min={1}
                max={50}
                value={sharePct}
                onChange={(e) => setSharePct(Number(e.target.value))}
                className="prestige-slider mt-2 h-6 w-full cursor-grab appearance-none bg-transparent"
              />
            </div>

            <div className="mt-8 space-y-4">
              <div className="rounded-xl bg-[var(--cream)] p-4">
                <p className="text-xs font-medium text-[var(--muted)]">Your investment</p>
                <p className="mt-1 text-xl font-bold text-[var(--charcoal)]">
                  {property.currency} {fractionalAmount.toLocaleString()}
                </p>
              </div>
              {property.estimatedYield && (
                <div className="rounded-xl bg-[var(--accent-light)]/50 p-4">
                  <p className="text-xs font-medium text-[var(--muted)]">Est. annual income ({property.estimatedYield}% yield)</p>
                  <p className="mt-1 text-2xl font-bold text-[var(--accent)]">
                    {property.currency} {estimatedAnnualIncome.toLocaleString()}/yr
                  </p>
                </div>
              )}
              <div className="rounded-xl border-2 border-[var(--accent)]/30 bg-[var(--accent-light)]/20 p-4">
                <p className="text-xs font-medium text-[var(--muted)]">Fractional entry</p>
                <p className="mt-1 text-lg font-bold text-[var(--accent)]">
                  Lower barrier • Shared returns • Co-ownership
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
