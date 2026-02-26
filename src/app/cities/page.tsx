"use client";

import Image from "next/image";
import Link from "next/link";
import { BlobBackground } from "@/components/BlobBackground";
import { CountUp } from "@/components/CountUp";
import { CITIES, getCityStats } from "@/lib/data";

const CITY_IMAGES: Record<string, string> = {
  oman: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=85",
  spain: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=85",
  uae: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=85",
  maldives: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=85",
  uk: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=85",
  saudi: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=800&q=85",
  qatar: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&q=85",
};

// UK and Saudi use unoptimized to avoid fetch failures in some regions
const UNOPTIMIZED_CITIES = ["uk", "saudi"];

export default function CitiesPage() {
  return (
    <div className="overflow-hidden">
      <section className="relative min-h-[40vh] flex items-end">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--charcoal)] via-[var(--charcoal)]/90 to-[var(--accent)]/20" />
        <BlobBackground className="opacity-25" />
        <div className="relative w-full px-4 pb-16 pt-32 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <p className="text-sm font-medium uppercase tracking-widest text-[var(--accent)]">Destinations</p>
            <h1 className="mt-4 font-display text-4xl font-bold text-white sm:text-5xl">
              World&apos;s Most Dynamic Destinations
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-white/90">
              UAE, UK, Saudi Arabia, Oman, Qatar, Spain, Maldives. Premium real estate in every market.
            </p>
          </div>
        </div>
      </section>

      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <BlobBackground className="opacity-15" />
        <div className="relative mx-auto max-w-6xl">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {CITIES.map((city) => {
              const stats = getCityStats(city.id);
              const portfolioM = stats.portfolioValue / 1_000_000;
              return (
                <Link key={city.id} href={`/cities/${city.slug}`} className="group block">
                  <div className="relative overflow-hidden rounded-2xl border border-[var(--accent)]/10 bg-white shadow-soft transition-all duration-300 group-hover:shadow-colored">
                    {/* Image block */}
                    <div className="relative aspect-[4/3]">
                      <Image
                        src={CITY_IMAGES[city.id] || CITY_IMAGES.oman}
                        alt={city.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        unoptimized={UNOPTIMIZED_CITIES.includes(city.id)}
                      />
                      {/* Diagonal gradient - soft feather for seamless text readability */}
                      <div
                        className="absolute inset-0"
                        style={{
                          background: "linear-gradient(135deg, transparent 0%, rgba(26,26,26,0.15) 25%, rgba(26,26,26,0.5) 55%, rgba(26,26,26,0.85) 85%, rgba(26,26,26,0.95) 100%)",
                        }}
                      />
                      {/* Flag - top center */}
                      <div className="absolute top-4 left-1/2 -translate-x-1/2">
                        <span className="inline-flex items-center justify-center rounded-full bg-white/95 px-4 py-1.5 text-2xl shadow-lg backdrop-blur-sm">
                          {city.flag}
                        </span>
                      </div>
                      {/* On-image text - city name only, over the gradient */}
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <h3 className="text-xl font-bold text-white drop-shadow-sm">{city.name}</h3>
                      </div>
                    </div>
                    {/* Attached container below */}
                    <div className="rounded-b-2xl border-t border-[var(--accent)]/5 bg-white px-5 py-4">
                      <p className="text-sm text-[var(--muted)] leading-relaxed">{city.description}</p>
                      <div className="mt-4 flex flex-wrap gap-4 text-sm">
                        <span className="text-[var(--charcoal)]">
                          <span className="font-semibold text-[var(--accent)]">
                            <CountUp end={stats.propertyCount} duration={1200} />
                          </span>{" "}
                          properties
                        </span>
                        {stats.portfolioValue > 0 && (
                          <span className="text-[var(--charcoal)]">
                            <span className="font-semibold text-[var(--accent)]">
                              <CountUp end={portfolioM} duration={1500} decimals={1} prefix="$" suffix="M" />
                            </span>{" "}
                            portfolio
                          </span>
                        )}
                        {stats.avgYield > 0 && (
                          <span className="text-[var(--charcoal)]">
                            <span className="font-semibold text-[var(--accent)]">
                              <CountUp end={stats.avgYield} duration={1400} decimals={1} suffix="%" />
                            </span>{" "}
                            avg yield
                          </span>
                        )}
                      </div>
                      <span className="mt-3 inline-block text-sm font-medium text-[var(--accent)] group-hover:underline">
                        View properties →
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
