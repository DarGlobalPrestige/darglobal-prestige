"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isLoggedIn } = useAuth();

  useEffect(() => {
    if (!isLoggedIn || !user?.isAdmin) {
      router.replace("/login?redirect=/admin");
    }
  }, [isLoggedIn, user?.isAdmin, router]);

  if (!isLoggedIn || !user?.isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--charcoal)]">
        <p className="text-white/70">Redirecting to login...</p>
      </div>
    );
  }

  return <>{children}</>;
}
