"use client";

import Link from "next/link";

const ADMIN_LINKS = [
  { href: "/admin/analytics", title: "Page View Analytics", desc: "Track page views and engagement", icon: "📊" },
  { href: "/admin/applications", title: "Applications", desc: "View and manage investment applications", icon: "📝" },
  { href: "/admin/properties", title: "Properties", desc: "Manage properties on the website", icon: "🏠" },
];

export default function AdminPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin</h1>
        <Link href="/" className="text-sm text-white/70 hover:text-white transition-colors">
          ← Back to site
        </Link>
      </div>
      <p className="mt-2 text-white/70">DarGlobal Prestige management</p>

      <div className="mt-12 grid gap-6 sm:grid-cols-3">
        {ADMIN_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="group rounded-2xl border border-white/10 bg-white/5 p-6 transition-all hover:bg-white/10 hover:border-[var(--accent)]/50"
          >
            <span className="text-3xl">{link.icon}</span>
            <h2 className="mt-4 font-semibold text-white">{link.title}</h2>
            <p className="mt-2 text-sm text-white/70">{link.desc}</p>
            <span className="mt-3 inline-block text-sm font-medium text-[var(--accent)] group-hover:underline">
              Open →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
