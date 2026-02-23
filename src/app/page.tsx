"use client";

import Image from "next/image";
import Link from "next/link";
import { BlobBackground } from "@/components/BlobBackground";
import { DraggableScroll } from "@/components/DraggableScroll";
import { CITIES, PROPERTIES } from "@/lib/data";

export default function HomePage() {
  const featuredCities = CITIES.slice(0, 4);
  const featuredProps = PROPERTIES.slice(0, 4);

  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-end">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=90"
            alt="Luxury villa"
            fill
            className="object-cover object-center"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--charcoal)] via-[var(--charcoal)]/60 to-[var(--charcoal)]/20" />
        </div>
        <BlobBackground className="opacity-40" />
        <div className="relative w-full px-4 pb-20 pt-36 sm:px-6 sm:pb-24 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <p className="text-sm font-medium uppercase tracking-widest text-[var(--accent)]">Live All In</p>
            <h1 className="mt-4 font-display text-4xl font-bold text-white drop-shadow-lg sm:text-5xl lg:text-6xl">
              Luxury Real Estate for the Global Citizen
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-white/90">
              Exceptional homes and investments in the world&apos;s most dynamic destinations. Trust, transparency, premium design.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/investment"
                className="rounded-xl bg-[var(--accent)] px-8 py-4 text-lg font-semibold text-white shadow-colored transition-all hover:opacity-90"
              >
                Explore Opportunities
              </Link>
              <Link
                href="/apply"
                className="rounded-xl border-2 border-white/80 bg-white/10 px-8 py-4 text-lg font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20"
              >
                Start Application
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Cities - Draggable */}
      <section className="relative border-t border-[var(--accent)]/10 bg-white/50 py-20 px-4 backdrop-blur-sm sm:px-6 lg:px-8">
        <BlobBackground className="opacity-20" />
        <div className="relative mx-auto max-w-7xl">
          <h2 className="text-2xl font-bold text-[var(--charcoal)] sm:text-3xl">Destinations</h2>
          <p className="mt-2 text-[var(--muted)]">UAE, UK, Saudi Arabia, Oman, Qatar, Spain, Maldives</p>
          <div className="mt-12 -mx-4 px-4">
            <DraggableScroll className="pb-4">
              {CITIES.map((city) => (
                <Link
                  key={city.id}
                  href={`/cities/${city.slug}`}
                  className="group flex-shrink-0 snap-center"
                >
                  <div className="relative h-64 w-72 overflow-hidden rounded-2xl border border-white/80 bg-white shadow-soft transition-all duration-300 group-hover:shadow-colored group-hover:scale-[1.02]">
                    <Image
                      src={city.id === "oman" ? "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80" : city.id === "spain" ? "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80" : city.id === "uae" ? "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80" : city.id === "maldives" ? "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&q=80" : city.id === "uk" ? "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?w=600&q=80" : city.id === "saudi" ? "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=600&q=80" : city.id === "qatar" ? "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=600&q=80" : "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80"}
                      alt={city.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--charcoal)]/90 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <span className="text-2xl">{city.flag}</span>
                      <h3 className="mt-1 font-bold text-white">{city.name}</h3>
                      <p className="mt-1 text-sm text-white/80">{city.description}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </DraggableScroll>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-2xl font-bold text-[var(--charcoal)] sm:text-3xl">Featured Properties</h2>
          <p className="mt-2 text-[var(--muted)]">Handpicked opportunities across our portfolio</p>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProps.map((prop) => (
              <Link key={prop.id} href={`/properties/${prop.slug}`} className="group">
                <div className="overflow-hidden rounded-2xl border border-[var(--accent)]/10 bg-white shadow-soft transition-all duration-300 group-hover:shadow-colored">
                  <div className="relative aspect-[4/3]">
                    <Image src={prop.imageUrl} alt={prop.name} fill className="object-cover transition-transform duration-300 group-hover:scale-105" sizes="(max-width: 640px) 100vw, 25vw" />
                    <div className="absolute top-3 left-3 rounded-lg bg-white/90 px-2 py-1 text-xs font-medium text-[var(--charcoal)] backdrop-blur-sm">
                      {prop.type}
                    </div>
                    {prop.brandPartner && (
                      <div className="absolute top-3 right-3 rounded-lg bg-[var(--accent)]/90 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
                        {prop.brandPartner}
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-[var(--charcoal)]">{prop.name}</h3>
                    <p className="mt-1 text-sm text-[var(--muted)]">{prop.tagline}</p>
                    <p className="mt-3 font-semibold text-[var(--accent)]">
                      {prop.priceLabel} {prop.currency} {prop.price.toLocaleString()}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/investment" className="inline-block rounded-xl border-2 border-[var(--accent)] px-8 py-3 font-semibold text-[var(--accent)] transition-all hover:bg-[var(--accent)] hover:text-white">
              View All Properties
            </Link>
          </div>
        </div>
      </section>

      {/* Mission Teaser */}
      <section className="relative border-t border-[var(--accent)]/10 bg-[var(--charcoal)] py-20 px-4 sm:px-6 lg:px-8">
        <BlobBackground className="opacity-15 [&_.blob]:!bg-[var(--accent)]/30" />
        <div className="relative mx-auto max-w-3xl text-center">
          <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
            Built on Trust & Transparency
          </h2>
          <p className="mt-6 text-lg text-white/80">
            31+ years delivering world-class living. Artfully designed residences, co-branded with icons like Lamborghini and Missoni. Strategic investments, exceptional returns.
          </p>
          <Link
            href="/mission"
            className="mt-8 inline-block rounded-xl bg-[var(--accent)] px-8 py-4 text-lg font-semibold text-white shadow-colored transition-all hover:opacity-90"
          >
            Our Mission
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold text-[var(--charcoal)] sm:text-3xl">Ready to Invest?</h2>
          <p className="mt-4 text-[var(--muted)]">
            Full ownership or fractional. Your path to luxury real estate starts here.
          </p>
          <Link
            href="/apply"
            className="mt-8 inline-block rounded-xl bg-[var(--accent)] px-10 py-4 text-lg font-semibold text-white shadow-colored transition-all hover:opacity-90"
          >
            Start Application
          </Link>
        </div>
      </section>
    </div>
  );
}
