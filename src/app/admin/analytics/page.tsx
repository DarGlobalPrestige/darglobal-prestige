"use client";

import Link from "next/link";

const MOCK_PAGES = [
  { path: "/", views: 1250, unique: 890 },
  { path: "/mission", views: 420, unique: 310 },
  { path: "/investment", views: 680, unique: 450 },
  { path: "/cities", views: 340, unique: 220 },
  { path: "/properties/aida", views: 180, unique: 120 },
  { path: "/properties/tierra-viva", views: 210, unique: 145 },
  { path: "/apply", views: 95, unique: 72 },
];

export default function AdminAnalyticsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <Link href="/admin" className="text-sm text-white/70 hover:text-white transition-colors">← Admin</Link>
      <h1 className="mt-4 text-2xl font-bold">Page View Analytics</h1>
      <p className="mt-1 text-white/70">Connect Wix Analytics or custom tracking for live data</p>

      <div className="mt-10 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="px-6 py-4 text-left text-sm font-medium text-white/90">Page</th>
              <th className="px-6 py-4 text-right text-sm font-medium text-white/90">Views</th>
              <th className="px-6 py-4 text-right text-sm font-medium text-white/90">Unique</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_PAGES.map((row) => (
              <tr key={row.path} className="border-b border-white/5">
                <td className="px-6 py-4 font-mono text-sm text-white/90">{row.path}</td>
                <td className="px-6 py-4 text-right text-[var(--accent)]">{row.views.toLocaleString()}</td>
                <td className="px-6 py-4 text-right text-white/80">{row.unique.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-6 text-sm text-white/50">Placeholder data. Connect Wix Headless + analytics when ready.</p>
    </div>
  );
}
