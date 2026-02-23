"use client";

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlobBackground } from "@/components/BlobBackground";
import { PropertyCalculator } from "@/components/PropertyCalculator";
import { FractionalInvestorsPreview } from "@/components/FractionalInvestorsPreview";
import { getPropertyBySlug, getCityById } from "@/lib/data";

export default function PropertyPage({ params }: { params: { slug: string } }) {
  const property = getPropertyBySlug(params.slug);
  if (!property) notFound();
  const city = getCityById(property.cityId);
  const gallery = property.gallery || [property.imageUrl];

  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-end">
        <div className="absolute inset-0">
          <Image
            src={property.imageUrl}
            alt={property.name}
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--charcoal)] via-[var(--charcoal)]/40 to-transparent" />
        </div>
        <BlobBackground className="opacity-20" />
        <div className="relative w-full px-4 pb-20 pt-36 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <Link
              href={city ? `/cities/${city.slug}` : "/investment"}
              className="text-sm font-medium text-white/80 hover:text-[var(--accent)] transition-colors"
            >
              ← {city?.name || "Properties"}
            </Link>
            <div className="mt-4 flex flex-wrap gap-3">
              <span className="rounded-lg bg-white/20 px-3 py-1 text-sm font-medium backdrop-blur-sm">{property.type}</span>
              {property.brandPartner && (
                <span className="rounded-lg bg-[var(--accent)]/90 px-3 py-1 text-sm font-medium backdrop-blur-sm">
                  {property.brandPartner}
                </span>
              )}
              {property.isFractional && (
                <span className="rounded-lg bg-white/20 px-3 py-1 text-sm font-medium backdrop-blur-sm">Fractional</span>
              )}
            </div>
            <h1 className="mt-4 font-display text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
              {property.name}
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-white/90">{property.tagline}</p>
            <p className="mt-6 text-2xl font-bold text-[var(--accent)]">
              {property.priceLabel && `${property.priceLabel} `}{property.currency} {property.price.toLocaleString()}
            </p>
          </div>
        </div>
      </section>

      {/* Content + Calculator */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <BlobBackground className="opacity-15" />
        <div className="relative mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-12">
              <div>
                <h2 className="text-2xl font-bold text-[var(--charcoal)]">About</h2>
                <p className="mt-4 text-[var(--muted)] leading-relaxed">{property.description}</p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-[var(--charcoal)]">Highlights</h2>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {property.highlights.map((h, i) => (
                    <li key={i} className="flex items-center gap-3 rounded-xl border border-[var(--accent)]/10 bg-white px-4 py-3 shadow-soft">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--accent)]/15 text-[var(--accent)]">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      {h}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-[var(--charcoal)]">Details</h2>
                <div className="mt-4 flex flex-wrap gap-4">
                  {property.beds > 0 && <span className="rounded-xl bg-[var(--cream)] px-4 py-2 font-medium">{property.beds} beds</span>}
                  {property.baths > 0 && <span className="rounded-xl bg-[var(--cream)] px-4 py-2 font-medium">{property.baths} baths</span>}
                  {property.sqm && <span className="rounded-xl bg-[var(--cream)] px-4 py-2 font-medium">{property.sqm} sqm</span>}
                  {property.estimatedYield && <span className="rounded-xl bg-[var(--accent-light)]/50 px-4 py-2 font-medium">~{property.estimatedYield}% yield</span>}
                </div>
              </div>

              {property.isFractional && (
                <FractionalInvestorsPreview property={property} />
              )}
            </div>

            <div className="lg:col-span-1">
              <PropertyCalculator property={property} />
              <Link
                href={`/apply?property=${property.slug}`}
                className="mt-6 flex w-full items-center justify-center rounded-xl bg-[var(--accent)] px-6 py-4 font-semibold text-white shadow-colored transition-all hover:opacity-90"
              >
                Apply to Invest
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
