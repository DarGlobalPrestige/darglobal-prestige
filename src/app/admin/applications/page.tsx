"use client";

import Link from "next/link";
import { useState } from "react";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-500/20 text-amber-400",
  approved: "bg-green-500/20 text-green-400",
  rejected: "bg-red-500/20 text-red-400",
  kyc_pending: "bg-blue-500/20 text-blue-400",
  kyc_approved: "bg-green-500/20 text-green-400",
};

const MOCK_APPS = [
  { id: "1", fullName: "Ahmed Al-Rashid", email: "ahmed@example.com", path: "full", status: "pending", kycStatus: "pending", createdAt: "2025-02-20" },
  { id: "2", fullName: "Sarah Chen", email: "sarah@example.com", path: "fractional", status: "kyc_pending", kycStatus: "kyc_pending", createdAt: "2025-02-19" },
  { id: "3", fullName: "James Wilson", email: "james@example.com", path: "full", status: "approved", kycStatus: "kyc_approved", createdAt: "2025-02-18" },
];

export default function AdminApplicationsPage() {
  const [filter, setFilter] = useState<string>("all");

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <Link href="/admin" className="text-sm text-white/70 hover:text-white transition-colors">← Admin</Link>
      <h1 className="mt-4 text-2xl font-bold">Applications</h1>
      <p className="mt-1 text-white/70">Manage investment applications, KYC, and document verification</p>

      <div className="mt-6 flex gap-2">
        {["all", "pending", "kyc_pending", "approved"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
              filter === f ? "bg-[var(--accent)] text-white" : "bg-white/5 text-white/70 hover:bg-white/10"
            }`}
          >
            {f.replace("_", " ")}
          </button>
        ))}
      </div>

      <div className="mt-10 space-y-4">
        {MOCK_APPS.map((app) => (
          <div
            key={app.id}
            className="rounded-2xl border border-white/10 bg-white/5 p-6 transition-all hover:border-white/20"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h3 className="font-semibold text-white">{app.fullName}</h3>
                <p className="mt-1 text-sm text-white/70">{app.email}</p>
                <p className="mt-2 text-xs text-white/50">Applied {app.createdAt} • {app.path}</p>
              </div>
              <div className="flex gap-2">
                <span className={`rounded-lg px-2 py-1 text-xs font-medium ${STATUS_COLORS[app.status] || "bg-white/10"}`}>
                  {app.status.replace("_", " ")}
                </span>
                <span className={`rounded-lg px-2 py-1 text-xs font-medium ${STATUS_COLORS[app.kycStatus] || "bg-white/10"}`}>
                  KYC: {app.kycStatus.replace("_", " ")}
                </span>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button type="button" className="rounded-lg border border-white/20 px-3 py-1.5 text-xs font-medium hover:bg-white/10">
                View details
              </button>
              <button type="button" className="rounded-lg border border-white/20 px-3 py-1.5 text-xs font-medium hover:bg-white/10">
                Documents
              </button>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-8 text-sm text-white/50">Placeholder data. Applications from Wix CMS will appear here.</p>
    </div>
  );
}
