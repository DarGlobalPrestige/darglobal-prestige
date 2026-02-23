"use client";

import Link from "next/link";
import Image from "next/image";
import { PROPERTIES } from "@/lib/data";

export default function AdminPropertiesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <Link href="/admin" className="text-sm text-white/70 hover:text-white transition-colors">← Admin</Link>
      <h1 className="mt-4 text-2xl font-bold">Properties</h1>
      <p className="mt-1 text-white/70">Manage properties. Connect Wix CMS for live editing.</p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {PROPERTIES.map((prop) => (
          <div
            key={prop.id}
            className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden transition-all hover:border-white/20"
          >
            <div className="relative aspect-video">
              <Image src={prop.imageUrl} alt={prop.name} fill className="object-cover" sizes="(max-width: 640px) 100vw, 50vw" />
              <div className="absolute top-3 left-3 rounded-lg bg-[var(--charcoal)]/80 px-2 py-1 text-xs font-medium backdrop-blur-sm">
                {prop.type}
              </div>
            </div>
            <div className="p-5">
              <h3 className="font-semibold text-white">{prop.name}</h3>
              <p className="mt-1 text-sm text-white/70">{prop.tagline}</p>
              <p className="mt-2 text-[var(--accent)] font-medium">
                {prop.currency} {prop.price.toLocaleString()}
              </p>
              <div className="mt-4 flex gap-2">
                <Link
                  href={`/properties/${prop.slug}`}
                  target="_blank"
                  className="rounded-lg border border-white/20 px-3 py-1.5 text-xs font-medium hover:bg-white/10"
                >
                  View
                </Link>
                <button type="button" className="rounded-lg border border-white/20 px-3 py-1.5 text-xs font-medium hover:bg-white/10">
                  Edit (Wix)
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-8 text-sm text-white/50">Properties from src/lib/data.ts. Migrate to Wix CMS for dynamic management.</p>
    </div>
  );
}
