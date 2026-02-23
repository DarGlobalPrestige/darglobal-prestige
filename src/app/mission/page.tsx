"use client";

import Link from "next/link";
import { BlobBackground } from "@/components/BlobBackground";

const PILLARS = [
  {
    title: "Trust",
    desc: "Every project backed by 31+ years of delivering iconic developments worldwide.",
    icon: "🛡️",
  },
  {
    title: "Transparency",
    desc: "Clear processes, honest returns, no hidden surprises.",
    icon: "✨",
  },
  {
    title: "World-Class Design",
    desc: "Co-branded residences with Lamborghini, Missoni, Aston Martin.",
    icon: "🏛️",
  },
  {
    title: "Investment Potential",
    desc: "Strategic off-plan, rental yield, capital appreciation.",
    icon: "📈",
  },
];

const VALUES = [
  "Live All In – our philosophy",
  "Global citizen – homes for the discerning",
  "Premium finishes, exceptional returns",
  "Cosmopolitan destinations – UAE to Maldives",
];

export default function MissionPage() {
  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative min-h-[50vh] flex items-end">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--charcoal)] via-[var(--charcoal)]/95 to-[var(--accent)]/20" />
        <BlobBackground className="opacity-30" />
        <div className="relative w-full px-4 pb-16 pt-32 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <p className="text-sm font-medium uppercase tracking-widest text-[var(--accent)]">Our Mission</p>
            <h1 className="mt-4 font-display text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
              Redefining Luxury Real Estate
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-white/90">
              Exceptional homes and investments for the global citizen. Trust, transparency, premium design, strong returns.
            </p>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="relative border-t border-[var(--accent)]/10 py-20 px-4 sm:px-6 lg:px-8">
        <BlobBackground className="opacity-15" />
        <div className="relative mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold text-[var(--charcoal)] sm:text-3xl">Live All In</h2>
          <p className="mt-4 text-lg text-[var(--muted)]">
            One philosophy guides everything we do: embrace life without compromise. Whether it&apos;s a villa in Marbella, 
            a penthouse in Dubai, or a slice of paradise in the Maldives, we deliver world-class living with exceptional 
            investment potential.
          </p>
        </div>
      </section>

      {/* Pillars */}
      <section className="relative border-t border-[var(--accent)]/10 bg-white/60 py-20 px-4 backdrop-blur-sm sm:px-6 lg:px-8">
        <BlobBackground className="opacity-10" />
        <div className="relative mx-auto max-w-6xl">
          <h2 className="text-2xl font-bold text-[var(--charcoal)] sm:text-3xl">Our Pillars</h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {PILLARS.map((p, i) => (
              <div
                key={p.title}
                className="animate-fade-in-up rounded-2xl border border-[var(--accent)]/10 bg-white p-6 shadow-soft transition-all hover:shadow-colored"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <span className="text-3xl">{p.icon}</span>
                <h3 className="mt-4 font-bold text-[var(--charcoal)]">{p.title}</h3>
                <p className="mt-2 text-sm text-[var(--muted)]">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold text-[var(--charcoal)] sm:text-3xl">What We Stand For</h2>
          <ul className="mt-8 space-y-4">
            {VALUES.map((v, i) => (
              <li key={i} className="flex items-center gap-3 rounded-xl border border-[var(--accent)]/10 bg-white px-5 py-4 shadow-soft">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--accent)]/15 text-[var(--accent)]">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <span className="text-[var(--charcoal)]">{v}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="relative border-t border-[var(--accent)]/10 bg-[var(--charcoal)] py-20 px-4 sm:px-6 lg:px-8">
        <BlobBackground className="opacity-15 [&_.blob]:!bg-[var(--accent)]/30" />
        <div className="relative mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">Partner with DarGlobal Prestige</h2>
          <p className="mt-4 text-white/80">Exclusive projects. Industry expertise. Iconic developments worldwide.</p>
          <Link
            href="/investment"
            className="mt-8 inline-block rounded-xl bg-[var(--accent)] px-8 py-4 font-semibold text-white shadow-colored transition-all hover:opacity-90"
          >
            Explore Opportunities
          </Link>
        </div>
      </section>
    </div>
  );
}
