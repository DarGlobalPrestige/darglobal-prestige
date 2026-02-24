"use client";

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlobBackground } from "@/components/BlobBackground";
import { getCityBySlug, getPropertiesByCity } from "@/lib/data";

const CITY_IMAGES: Record<string, string> = {
  oman: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1920&q=90",
  spain: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=90",
  uae: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920&q=90",
  maldives: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1920&q=90",
  uk: "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?w=1920&q=90",
  saudi: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=1920&q=90",
  qatar: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=1920&q=90",
};

export default function CityPage({ params }: { params: { slug: string } }) {
  const city = getCityBySlug(params.slug);
  if (!city) notFound();
  const properties = getPropertiesByCity(city.id);

  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative min-h-[55vh] flex items-end">
        <div className="absolute inset-0">
          <Image
            src={CITY_IMAGES[city.id] || CITY_IMAGES.oman}
            alt={city.name}
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
            unoptimized={city.id === "uk" || city.id === "saudi"}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--charcoal)] via-[var(--charcoal)]/50 to-transparent" />
        </div>
        <BlobBackground className="opacity-20" />
        <div className="relative w-full px-4 pb-20 pt-36 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <Link href="/cities" className="text-sm font-medium text-white/80 hover:text-[var(--accent)] transition-colors">
              ← All destinations
            </Link>
            <span className="text-5xl block mt-4">{city.flag}</span>
            <h1 className="mt-4 font-display text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
              {city.name}
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-white/90">{city.description}</p>
          </div>
        </div>
      </section>

      {/* Properties */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <BlobBackground className="opacity-15" />
        <div className="relative mx-auto max-w-7xl">
          <h2 className="text-2xl font-bold text-[var(--charcoal)] sm:text-3xl">Properties in {city.name}</h2>
          {properties.length === 0 ? (
            <p className="mt-8 text-[var(--muted)]">No properties listed yet. Check back soon.</p>
          ) : (
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {properties.map((prop) => (
                <Link key={prop.id} href={`/properties/${prop.slug}`} className="group">
                  <div className="overflow-hidden rounded-2xl border border-[var(--accent)]/10 bg-white shadow-soft transition-all duration-300 group-hover:shadow-colored">
                    <div className="relative aspect-[4/3]">
                      <Image src={prop.imageUrl} alt={prop.name} fill className="object-cover transition-transform duration-300 group-hover:scale-105" sizes="33vw" />
                      <div className="absolute top-3 left-3 flex gap-2">
                        <span className="rounded-lg bg-white/90 px-2 py-1 text-xs font-medium text-[var(--charcoal)] backdrop-blur-sm">{prop.type}</span>
                        {prop.isFractional && <span className="rounded-lg bg-[var(--accent)]/90 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">Fractional</span>}
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
          )}
          <div className="mt-12">
            <Link href="/investment" className="text-sm font-medium text-[var(--accent)] hover:underline">View all properties →</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
