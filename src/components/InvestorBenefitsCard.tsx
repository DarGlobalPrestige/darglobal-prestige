"use client";

import Link from "next/link";

const BENEFITS = [
  {
    icon: "🏠",
    title: "Exclusive access",
    desc: "First look at off-market properties and pre-launch developments.",
  },
  {
    icon: "📊",
    title: "Transparent returns",
    desc: "Quarterly reports, yield tracking, and full visibility on your portfolio.",
  },
  {
    icon: "🌍",
    title: "Global portfolio",
    desc: "Diversify across UAE, Spain, Oman, Maldives, and more.",
  },
  {
    icon: "🤝",
    title: "Dedicated support",
    desc: "Personal relationship manager for your investment journey.",
  },
];

export function InvestorBenefitsCard() {
  return (
    <div className="rounded-2xl border border-[var(--accent)]/20 bg-gradient-to-br from-white to-[var(--accent-light)]/10 p-6 shadow-soft sm:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[var(--charcoal)]">Investor benefits</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            What you unlock as a DarGlobal Prestige investor
          </p>
        </div>
        <span className="text-3xl">✨</span>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {BENEFITS.map((b, i) => (
          <div
            key={b.title}
            className="flex gap-4 rounded-xl border border-[var(--accent)]/10 bg-white/80 p-4 transition-all hover:border-[var(--accent)]/20 hover:shadow-soft"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--accent)]/15 text-xl">
              {b.icon}
            </span>
            <div>
              <h3 className="font-semibold text-[var(--charcoal)]">{b.title}</h3>
              <p className="mt-0.5 text-sm text-[var(--muted)]">{b.desc}</p>
            </div>
          </div>
        ))}
      </div>
      <Link
        href="/investment"
        className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[var(--accent)] hover:underline"
      >
        Explore opportunities
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </Link>
    </div>
  );
}
