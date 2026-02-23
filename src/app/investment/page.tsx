"use client";

import Image from "next/image";
import Link from "next/link";
import { BlobBackground } from "@/components/BlobBackground";
import { DraggableScroll } from "@/components/DraggableScroll";
import { CITIES, PROPERTIES } from "@/lib/data";

export default function InvestmentPage() {
  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative min-h-[45vh] flex items-end">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--charcoal)] via-[var(--charcoal)]/90 to-[var(--accent)]/30" />
        <BlobBackground className="opacity-25" />
        <div className="relative w-full px-4 pb-16 pt-32 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <p className="text-sm font-medium uppercase tracking-widest text-[var(--accent)]">Investment Opportunities</p>
            <h1 className="mt-4 font-display text-4xl font-bold text-white sm:text-5xl">
              Unlock Exceptional Returns
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-white/90">
              Full ownership or fractional. Villas, apartments, land. UAE to Maldives. Your next move starts here.
            </p>
          </div>
        </div>
      </section>

      {/* Full vs Fractional */}
      <section className="relative border-t border-[var(--accent)]/10 py-16 px-4 sm:px-6 lg:px-8">
        <BlobBackground className="opacity-15" />
        <div className="relative mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold text-[var(--charcoal)] sm:text-3xl">Two Paths to Invest</h2>
          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            <Link
              href="/apply?path=full"
              className="group relative overflow-hidden rounded-2xl border-2 border-[var(--accent)]/20 bg-white p-8 shadow-soft transition-all hover:border-[var(--accent)]/50 hover:shadow-colored"
            >
              <span className="text-4xl">🏠</span>
              <h3 className="mt-4 font-bold text-[var(--charcoal)]">Full Ownership</h3>
              <p className="mt-2 text-[var(--muted)]">Own outright. Full control. Maximum flexibility. Ideal for residents and high-net-worth investors.</p>
              <span className="mt-4 inline-block font-medium text-[var(--accent)] group-hover:underline">Start application →</span>
            </Link>
            <Link
              href="/apply?path=fractional"
              className="group relative overflow-hidden rounded-2xl border-2 border-[var(--accent)]/20 bg-white p-8 shadow-soft transition-all hover:border-[var(--accent)]/50 hover:shadow-colored"
            >
              <span className="text-4xl">📊</span>
              <h3 className="mt-4 font-bold text-[var(--charcoal)]">Fractional</h3>
              <p className="mt-2 text-[var(--muted)]">Own a share. Lower entry. Shared returns. Diversify across multiple properties.</p>
              <span className="mt-4 inline-block font-medium text-[var(--accent)] group-hover:underline">Start application →</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Property Grid */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-2xl font-bold text-[var(--charcoal)] sm:text-3xl">All Properties</h2>
          <p className="mt-2 text-[var(--muted)]">Browse by city or explore the full portfolio</p>

          {/* City filter - horizontal scroll */}
          <div className="mt-8 -mx-4 px-4">
            <DraggableScroll className="pb-2">
              {CITIES.map((city) => (
                <Link
                  key={city.id}
                  href={`/cities/${city.slug}`}
                  className="flex-shrink-0 snap-center rounded-xl border border-[var(--accent)]/20 bg-white px-5 py-3 text-sm font-medium text-[var(--charcoal)] transition-all hover:border-[var(--accent)] hover:bg-[var(--accent-light)]/30"
                >
                  {city.flag} {city.name}
                </Link>
              ))}
            </DraggableScroll>
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {PROPERTIES.map((prop) => (
              <Link key={prop.id} href={`/properties/${prop.slug}`} className="group">
                <div className="overflow-hidden rounded-2xl border border-[var(--accent)]/10 bg-white shadow-soft transition-all duration-300 group-hover:shadow-colored">
                  <div className="relative aspect-[4/3]">
                    <Image src={prop.imageUrl} alt={prop.name} fill className="object-cover transition-transform duration-300 group-hover:scale-105" sizes="(max-width: 640px) 100vw, 33vw" />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className="rounded-lg bg-white/90 px-2 py-1 text-xs font-medium text-[var(--charcoal)] backdrop-blur-sm">{prop.type}</span>
                      {prop.isFractional && (
                        <span className="rounded-lg bg-[var(--accent)]/90 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">Fractional</span>
                      )}
                    </div>
                    {prop.estimatedYield && (
                      <div className="absolute bottom-3 left-3 rounded-lg bg-[var(--charcoal)]/80 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
                        ~{prop.estimatedYield}% yield
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-[var(--charcoal)]">{prop.name}</h3>
                    <p className="mt-1 text-sm text-[var(--muted)]">{prop.tagline}</p>
                    <p className="mt-3 font-semibold text-[var(--accent)]">
                      {prop.priceLabel && `${prop.priceLabel} `}{prop.currency} {prop.price.toLocaleString()}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link href="/apply" className="inline-block rounded-xl bg-[var(--accent)] px-8 py-4 font-semibold text-white shadow-colored transition-all hover:opacity-90">
              Apply to Invest
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
