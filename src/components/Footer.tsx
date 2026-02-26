import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[var(--accent)]/10 bg-[var(--charcoal)] text-white/80">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <p className="text-2xl font-bold text-white">
              DarGlobal <span className="text-[var(--accent)]">Prestige</span>
            </p>
            <p className="mt-3 max-w-md text-sm">
              Exceptional luxury real estate for the global citizen. Homes and investments across the UAE, UK, Saudi Arabia, Oman, Qatar, Maldives, and Spain.
            </p>
            <p className="mt-4 text-sm font-medium text-[var(--accent)]">Live All In</p>
          </div>
          <div>
            <h4 className="font-semibold text-white">Explore</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link href="/" className="hover:text-[var(--accent)] transition-colors">Home</Link></li>
              <li><Link href="/mission" className="hover:text-[var(--accent)] transition-colors">Mission</Link></li>
              <li><Link href="/investment" className="hover:text-[var(--accent)] transition-colors">Opportunities</Link></li>
              <li><Link href="/cities" className="hover:text-[var(--accent)] transition-colors">Cities</Link></li>
              <li><Link href="/apply" className="hover:text-[var(--accent)] transition-colors">Apply</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white">Account</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link href="/login" className="hover:text-[var(--accent)] transition-colors">Login</Link></li>
              <li><Link href="/dashboard" className="hover:text-[var(--accent)] transition-colors">Investor Dashboard</Link></li>
              <li><Link href="/admin" className="hover:text-[var(--accent)] transition-colors">Team Admin</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-white/10 pt-8 text-center text-sm text-white/60">
          © {new Date().getFullYear()} DarGlobal Prestige. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
