"use client";

import type { Property } from "@/lib/data";

interface FractionalInvestorsPreviewProps {
  property: Property;
}

/** Placeholder for showing other fractional investors - will connect to Wix/Members */
const MOCK_INVESTORS = [
  { name: "Investor A", share: 15, joined: "2025-01" },
  { name: "Investor B", share: 12, joined: "2025-01" },
  { name: "Investor C", share: 10, joined: "2025-02" },
  { name: "Investor D", share: 8, joined: "2025-02" },
  { name: "Investor E", share: 5, joined: "2025-03" },
];

export function FractionalInvestorsPreview({ property }: FractionalInvestorsPreviewProps) {
  if (!property.isFractional) return null;

  const totalSlots = property.fractionalSlots || 10;
  const slotsFilled = MOCK_INVESTORS.length;
  const slotsLeft = totalSlots - slotsFilled;
  const pricePerSlot = property.fractionalPricePerSlot || Math.round(property.price / totalSlots);

  return (
    <div className="rounded-2xl border border-[var(--accent)]/20 bg-white p-6 shadow-soft">
      <h3 className="font-bold text-[var(--charcoal)]">Fractional Ownership</h3>
      <p className="mt-2 text-sm text-[var(--muted)]">
        {slotsFilled} of {totalSlots} slots filled. {slotsLeft} available.
      </p>
      <p className="mt-2 text-sm font-medium text-[var(--accent)]">
        {property.currency} {pricePerSlot.toLocaleString()} per slot
      </p>

      <div className="mt-6 space-y-3">
        <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">Current investors</p>
        {MOCK_INVESTORS.map((inv, i) => (
          <div
            key={i}
            className="flex items-center justify-between rounded-xl border border-[var(--accent)]/10 bg-[var(--cream)]/50 px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent)]/20 text-sm font-bold text-[var(--accent)]">
                {inv.name.charAt(inv.name.length - 1)}
              </div>
              <span className="font-medium text-[var(--charcoal)]">{inv.name}</span>
            </div>
            <div className="text-right">
              <span className="font-bold text-[var(--accent)]">{inv.share}%</span>
              <p className="text-xs text-[var(--muted)]">Joined {inv.joined}</p>
            </div>
          </div>
        ))}
      </div>

      {property.estimatedYield && (
        <div className="mt-6 rounded-xl bg-[var(--accent-light)]/30 p-4">
          <p className="text-sm font-medium text-[var(--muted)]">Projected returns</p>
          <p className="mt-1 text-lg font-bold text-[var(--accent)]">
            ~{property.estimatedYield}% annual yield • Shared profits distributed quarterly
          </p>
        </div>
      )}
    </div>
  );
}
